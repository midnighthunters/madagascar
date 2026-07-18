import os
import shutil
from pathlib import Path
from typing import Any

from pydantic import PrivateAttr

from openhands.sdk.git.git_changes import get_git_changes
from openhands.sdk.git.git_diff import get_git_diff
from openhands.sdk.git.models import GitChange, GitDiff
from openhands.sdk.logger import get_logger
from openhands.sdk.utils.command import execute_command
from openhands.sdk.workspace.base import BaseWorkspace
from openhands.sdk.workspace.models import CommandResult, FileOperationResult


logger = get_logger(__name__)


class LocalWorkspace(BaseWorkspace):
    """Local workspace implementation that operates on the host filesystem.

    When the Madagascar runtime sets ``MADAGASCAR_WORKSPACE_ROOT``, paths are
    canonicalized before use and must remain below that root unless the user
    explicitly chose unrestricted access. This is a host-process guardrail,
    not a replacement for OS-level sandboxing.

    Example:
        >>> workspace = LocalWorkspace(working_dir="/path/to/project")
        >>> with workspace:
        ...     result = workspace.execute_command("ls -la")
        ...     content = workspace.read_file("README.md")
    """

    _project_root: Path | None = PrivateAttr(default=None)
    _permission: str = PrivateAttr(default="unrestricted")

    def __init__(
        self,
        *,
        working_dir: str | Path,
        workspace_root: str | Path | None = None,
        permission: str | None = None,
        **kwargs: Any,
    ):
        project_root_value = workspace_root or os.getenv("MADAGASCAR_WORKSPACE_ROOT")
        resolved_root = (
            Path(project_root_value).expanduser().resolve()
            if project_root_value is not None
            else None
        )
        if resolved_root is not None and not resolved_root.is_dir():
            raise ValueError(
                f"Madagascar workspace root must be an existing directory: "
                f"{resolved_root}"
            )

        resolved_permission = permission or os.getenv(
            "MADAGASCAR_PERMISSION", "unrestricted"
        )
        if resolved_permission not in {
            "read",
            "edit",
            "execute",
            "network",
            "unrestricted",
        }:
            raise ValueError(
                f"Unsupported Madagascar permission: {resolved_permission}"
            )

        resolved_working_dir = self._resolve_path(
            Path(working_dir), resolved_root, resolved_permission
        )
        # Accept Path in signature for ergonomics and type checkers,
        # but normalize to str for the underlying model field.
        super().__init__(working_dir=str(resolved_working_dir), **kwargs)
        self._project_root = resolved_root
        self._permission = resolved_permission

    @staticmethod
    def _resolve_path(
        path: Path,
        project_root: Path | None,
        permission: str,
    ) -> Path:
        if project_root is None:
            return path

        candidate = path if path.is_absolute() else project_root / path
        resolved = candidate.expanduser().resolve()
        if permission != "unrestricted" and (
            resolved != project_root and not resolved.is_relative_to(project_root)
        ):
            raise PermissionError(
                f"Path is outside the Madagascar workspace root: {resolved}"
            )
        return resolved

    def _require_permission(self, operation: str, allowed: set[str]) -> None:
        if self._permission not in allowed:
            raise PermissionError(
                f"Madagascar permission '{self._permission}' does not allow {operation}"
            )

    def _workspace_path(self, path: str | Path) -> Path:
        return self._resolve_path(Path(path), self._project_root, self._permission)

    def execute_command(
        self,
        command: str,
        cwd: str | Path | None = None,
        timeout: float = 30.0,
    ) -> CommandResult:
        """Execute a bash command locally.

        Uses the shared shell execution utility to run commands with proper
        timeout handling, output streaming, and error management.

        Args:
            command: The bash command to execute
            cwd: Working directory (optional)
            timeout: Timeout in seconds

        Returns:
            CommandResult: Result with stdout, stderr, exit_code, command, and
                timeout_occurred
        """
        self._require_permission(
            "command execution", {"execute", "network", "unrestricted"}
        )
        resolved_cwd = self._workspace_path(cwd or self.working_dir)
        logger.debug(f"Executing local bash command: {command} in {resolved_cwd}")
        result = execute_command(
            command,
            cwd=str(resolved_cwd),
            timeout=timeout,
            print_output=True,
        )
        return CommandResult(
            command=command,
            exit_code=result.returncode,
            stdout=result.stdout,
            stderr=result.stderr,
            timeout_occurred=result.returncode == -1,
        )

    def file_upload(
        self,
        source_path: str | Path,
        destination_path: str | Path,
    ) -> FileOperationResult:
        """Upload (copy) a file locally.

        For local systems, file upload is implemented as a file copy operation
        using shutil.copy2 to preserve metadata.

        Args:
            source_path: Path to the source file
            destination_path: Path where the file should be copied

        Returns:
            FileOperationResult: Result with success status and file information
        """
        self._require_permission(
            "file writes", {"edit", "execute", "network", "unrestricted"}
        )
        source = self._workspace_path(source_path)
        destination = self._workspace_path(destination_path)

        logger.debug(f"Local file upload: {source} -> {destination}")

        try:
            # Ensure destination directory exists
            destination.parent.mkdir(parents=True, exist_ok=True)

            # Copy the file with metadata preservation
            shutil.copy2(source, destination)

            return FileOperationResult(
                success=True,
                source_path=str(source),
                destination_path=str(destination),
                file_size=destination.stat().st_size,
            )

        except Exception as e:
            logger.error(f"Local file upload failed: {e}")
            return FileOperationResult(
                success=False,
                source_path=str(source),
                destination_path=str(destination),
                error=str(e),
            )

    def file_download(
        self,
        source_path: str | Path,
        destination_path: str | Path,
    ) -> FileOperationResult:
        """Download (copy) a file locally.

        For local systems, file download is implemented as a file copy operation
        using shutil.copy2 to preserve metadata.

        Args:
            source_path: Path to the source file
            destination_path: Path where the file should be copied

        Returns:
            FileOperationResult: Result with success status and file information
        """
        self._require_permission(
            "file writes", {"edit", "execute", "network", "unrestricted"}
        )
        source = self._workspace_path(source_path)
        destination = self._workspace_path(destination_path)

        logger.debug(f"Local file download: {source} -> {destination}")

        try:
            # Ensure destination directory exists
            destination.parent.mkdir(parents=True, exist_ok=True)

            # Copy the file with metadata preservation
            shutil.copy2(source, destination)

            return FileOperationResult(
                success=True,
                source_path=str(source),
                destination_path=str(destination),
                file_size=destination.stat().st_size,
            )

        except Exception as e:
            logger.error(f"Local file download failed: {e}")
            return FileOperationResult(
                success=False,
                source_path=str(source),
                destination_path=str(destination),
                error=str(e),
            )

    def git_changes(self, path: str | Path) -> list[GitChange]:
        """Get the git changes for the repository at the path given.

        Args:
            path: Path to the git repository

        Returns:
            list[GitChange]: List of changes

        Raises:
            Exception: If path is not a git repository or getting changes failed
        """
        path = self._workspace_path(Path(self.working_dir) / path)
        return get_git_changes(path)

    def git_diff(self, path: str | Path) -> GitDiff:
        """Get the git diff for the file at the path given.

        Args:
            path: Path to the file

        Returns:
            GitDiff: Git diff

        Raises:
            Exception: If path is not a git repository or getting diff failed
        """
        path = self._workspace_path(Path(self.working_dir) / path)
        return get_git_diff(path)

    def pause(self) -> None:
        """Pause the workspace (no-op for local workspaces).

        Local workspaces have nothing to pause since they operate directly
        on the host filesystem.
        """
        logger.debug("pause() called on LocalWorkspace - nothing to do")

    def resume(self) -> None:
        """Resume the workspace (no-op for local workspaces).

        Local workspaces have nothing to resume since they operate directly
        on the host filesystem.
        """
        logger.debug("resume() called on LocalWorkspace - nothing to do")
