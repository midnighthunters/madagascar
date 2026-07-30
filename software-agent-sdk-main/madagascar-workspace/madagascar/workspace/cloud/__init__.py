"""Madagascar Cloud workspace implementation."""

# Re-export repo models and utilities from SDK for backward compatibility.
# The original implementations have been moved to madagascar.sdk.workspace.repo.
from madagascar.sdk.workspace.repo import (
    CloneResult,
    GitProvider,
    RepoMapping,
    RepoSource,
    clone_repos,
    get_repos_context,
)

from .workspace import MadagascarCloudWorkspace


__all__ = [
    "CloneResult",
    "GitProvider",
    "MadagascarCloudWorkspace",
    "RepoMapping",
    "RepoSource",
    "clone_repos",
    "get_repos_context",
]
