# This is a namespace package - extend the path to include installed packages
# (We need to do this to support dependencies madagascar-sdk, madagascar-tools and madagascar-agent-server
# which all have a top level `madagascar`` package.)
__path__ = __import__('pkgutil').extend_path(__path__, __name__)

# Import version information for backward compatibility
from madagascar.app_server.version import __version__, get_version

__all__ = ['__version__', 'get_version']
