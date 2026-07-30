"""Utility functions for the Madagascar SDK."""

from .command import sanitized_env
from .datetime import MadagascarUUID, utc_now
from .deprecation import (
    deprecated,
    warn_deprecated,
)
from .github import sanitize_madagascar_mentions
from .paging import page_iterator
from .truncate import (
    DEFAULT_TEXT_CONTENT_LIMIT,
    DEFAULT_TRUNCATE_NOTICE,
    maybe_truncate,
)


__all__ = [
    "DEFAULT_TEXT_CONTENT_LIMIT",
    "DEFAULT_TRUNCATE_NOTICE",
    "MadagascarUUID",
    "maybe_truncate",
    "deprecated",
    "utc_now",
    "warn_deprecated",
    "sanitize_madagascar_mentions",
    "page_iterator",
    "sanitized_env",
]
