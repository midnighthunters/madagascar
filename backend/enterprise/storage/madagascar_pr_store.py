from __future__ import annotations

from datetime import datetime

from sqlalchemy import and_, desc, select
from storage.database import a_session_maker
from storage.madagascar_pr import MadagascarPR

from madagascar.app_server.integrations.service_types import ProviderType
from madagascar.app_server.utils.logger import madagascar_logger as logger


class MadagascarPRStore:
    async def insert_pr(self, pr: MadagascarPR) -> None:
        """
        Insert a new PR or delete and recreate if repo_id and pr_number already exist.
        """
        async with a_session_maker() as session:
            # Check if PR already exists
            result = await session.execute(
                select(MadagascarPR).filter(
                    MadagascarPR.repo_id == pr.repo_id,
                    MadagascarPR.pr_number == pr.pr_number,
                    MadagascarPR.provider == pr.provider,
                )
            )
            existing_pr = result.scalars().first()

            if existing_pr:
                # Delete existing PR
                await session.delete(existing_pr)
                await session.flush()

            session.add(pr)
            await session.commit()

    async def increment_process_attempts(self, repo_id: str, pr_number: int) -> bool:
        """
        Increment the process attempts counter for a PR.

        Args:
            repo_id: Repository identifier
            pr_number: Pull request number

        Returns:
            True if PR was found and updated, False otherwise
        """
        async with a_session_maker() as session:
            result = await session.execute(
                select(MadagascarPR).filter(
                    MadagascarPR.repo_id == repo_id, MadagascarPR.pr_number == pr_number
                )
            )
            pr = result.scalars().first()

            if pr:
                pr.process_attempts += 1
                await session.merge(pr)
                await session.commit()
                return True
            return False

    async def update_pr_madagascar_stats(
        self,
        repo_id: str,
        pr_number: int,
        original_updated_at: datetime,
        madagascar_helped_author: bool,
        num_madagascar_commits: int,
        num_madagascar_review_comments: int,
        num_madagascar_general_comments: int,
    ) -> bool:
        """
        Update Madagascar statistics for a PR with row-level locking and timestamp validation.

        Args:
            repo_id: Repository identifier
            pr_number: Pull request number
            original_updated_at: Original updated_at timestamp to check for concurrent modifications
            madagascar_helped_author: Whether Madagascar helped the author (1+ commits)
            num_madagascar_commits: Number of commits by Madagascar
            num_madagascar_review_comments: Number of review comments by Madagascar
            num_madagascar_general_comments: Number of PR comments (not review comments) by Madagascar

        Returns:
            True if PR was found and updated, False if not found or timestamp changed
        """
        async with a_session_maker() as session:
            # Use row-level locking to prevent concurrent modifications
            result = await session.execute(
                select(MadagascarPR)
                .filter(
                    MadagascarPR.repo_id == repo_id, MadagascarPR.pr_number == pr_number
                )
                .with_for_update()
            )
            pr: MadagascarPR | None = result.scalars().first()

            if not pr:
                # Current PR snapshot is stale
                logger.warning('Did not find PR {pr_number} for repo {repo_id}')
                return False

            # Check if the updated_at timestamp has changed (indicating concurrent modification)
            if pr.updated_at != original_updated_at:
                # Abort transaction - the PR was modified by another process
                await session.rollback()
                return False

            # Update the Madagascar statistics
            pr.madagascar_helped_author = madagascar_helped_author
            pr.num_madagascar_commits = num_madagascar_commits
            pr.num_madagascar_review_comments = num_madagascar_review_comments
            pr.num_madagascar_general_comments = num_madagascar_general_comments
            pr.processed = True

            await session.merge(pr)
            await session.commit()
            return True

    async def get_unprocessed_prs(
        self, limit: int = 50, max_retries: int = 3
    ) -> list[MadagascarPR]:
        """
        Get unprocessed PR entries from the MadagascarPR table.

        Args:
            limit: Maximum number of PRs to retrieve (default: 50)

        Returns:
            List of MadagascarPR objects that need processing
        """
        async with a_session_maker() as session:
            result = await session.execute(
                select(MadagascarPR)
                .filter(
                    and_(
                        ~MadagascarPR.processed,
                        MadagascarPR.process_attempts < max_retries,
                        MadagascarPR.provider == ProviderType.GITHUB.value,
                    )
                )
                .order_by(desc(MadagascarPR.updated_at))
                .limit(limit)
            )
            unprocessed_prs = list(result.scalars().all())

            return unprocessed_prs

    @classmethod
    def get_instance(cls) -> MadagascarPRStore:
        """Get an instance of the MadagascarPRStore."""
        return MadagascarPRStore()
