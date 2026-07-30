import platform

from madagascar.tools.terminal.terminal.factory import create_terminal_session
from madagascar.tools.terminal.terminal.interface import (
    SUPPORTED_SPECIAL_KEYS,
    TerminalInterface,
    TerminalSessionBase,
    parse_ctrl_key,
)
from madagascar.tools.terminal.terminal.terminal_session import (
    TerminalCommandStatus,
    TerminalSession,
)


if platform.system() == "Windows":
    from madagascar.tools.terminal.terminal.windows_terminal import WindowsTerminal

    __all__ = [
        "SUPPORTED_SPECIAL_KEYS",
        "TerminalInterface",
        "TerminalSessionBase",
        "TerminalSession",
        "TerminalCommandStatus",
        "WindowsTerminal",
        "create_terminal_session",
        "parse_ctrl_key",
    ]
else:
    from madagascar.tools.terminal.terminal.subprocess_terminal import (
        SubprocessTerminal,
    )
    from madagascar.tools.terminal.terminal.tmux_terminal import TmuxTerminal

    __all__ = [
        "SUPPORTED_SPECIAL_KEYS",
        "TerminalInterface",
        "TerminalSessionBase",
        "TerminalSession",
        "TerminalCommandStatus",
        "TmuxTerminal",
        "SubprocessTerminal",
        "create_terminal_session",
        "parse_ctrl_key",
    ]
