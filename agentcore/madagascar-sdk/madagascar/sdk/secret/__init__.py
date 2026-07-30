"""Secret management module for handling sensitive data.

This module provides classes and types for managing secrets in Madagascar.
"""

from madagascar.sdk.secret.secrets import (
    LookupSecret,
    SecretSource,
    SecretValue,
    StaticSecret,
)


__all__ = [
    "SecretSource",
    "StaticSecret",
    "LookupSecret",
    "SecretValue",
]
