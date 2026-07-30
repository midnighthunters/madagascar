from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
SERVER_WORKFLOW = REPO_ROOT / ".github" / "workflows" / "server.yml"
AGENT_SERVER_SPEC = (
    REPO_ROOT
    / "madagascar-agent-server"
    / "madagascar"
    / "agent_server"
    / "agent-server.spec"
)


def test_server_workflow_passes_git_metadata_build_args() -> None:
    """The published agent-server images should embed git metadata."""
    workflow_text = SERVER_WORKFLOW.read_text(encoding="utf-8")

    assert "MADAGASCAR_BUILD_GIT_SHA=${{ env.SDK_SHA }}" in workflow_text
    assert "MADAGASCAR_BUILD_GIT_REF=${{ env.SDK_REF }}" in workflow_text


def test_agent_server_binary_copies_madagascar_distribution_metadata() -> None:
    """The frozen binary should preserve Madagascar package metadata."""
    spec_text = AGENT_SERVER_SPEC.read_text(encoding="utf-8")

    for distribution in (
        "madagascar-agent-server",
        "madagascar-sdk",
        "madagascar-tools",
        "madagascar-workspace",
    ):
        assert f'*copy_metadata("{distribution}")' in spec_text
