# DEPRECATED: This module is deprecated and will be removed in a future release.
# Please use madagascar.app_server.middleware instead.
#
# For backward compatibility, this module re-exports from madagascar.app_server.middleware.

from madagascar.app_server.middleware import (
    CacheControlMiddleware,
    InMemoryRateLimiter,
    LocalhostCORSMiddleware,
    RateLimitMiddleware,
)

__all__ = [
    'LocalhostCORSMiddleware',
    'CacheControlMiddleware',
    'InMemoryRateLimiter',
    'RateLimitMiddleware',
]
