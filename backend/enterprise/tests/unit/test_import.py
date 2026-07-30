from server.auth.sheets_client import GoogleSheetsClient

from madagascar.app_server.utils.logger import madagascar_logger


def test_import():
    assert madagascar_logger is not None
    assert GoogleSheetsClient is not None
