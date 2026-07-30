# DEPRECATED: This module is deprecated and will be removed in a future release.
# Please use madagascar.app_server.app instead.
#
# For backward compatibility, this module re-exports the app from madagascar.app_server.app.

from madagascar.app_server.app import app

__all__ = ['app']
