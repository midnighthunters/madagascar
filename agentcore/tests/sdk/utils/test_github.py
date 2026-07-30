"""Tests for GitHub utility functions."""

from madagascar.sdk.utils.github import ZWJ, sanitize_madagascar_mentions


def test_sanitize_basic_mention():
    """Test basic @Madagascar mention is sanitized."""
    text = "Thanks @Madagascar for the help!"
    expected = f"Thanks @{ZWJ}Madagascar for the help!"
    assert sanitize_madagascar_mentions(text) == expected


def test_sanitize_case_insensitive():
    """Test that mentions are sanitized regardless of case."""
    test_cases = [
        ("Check @Madagascar here", f"Check @{ZWJ}Madagascar here"),
        ("Check @madagascar here", f"Check @{ZWJ}madagascar here"),
        ("Check @MADAGASCAR here", f"Check @{ZWJ}MADAGASCAR here"),
        ("Check @mAdAgAsCaR here", f"Check @{ZWJ}mAdAgAsCaR here"),
    ]
    for input_text, expected in test_cases:
        assert sanitize_madagascar_mentions(input_text) == expected


def test_sanitize_multiple_mentions():
    """Test multiple mentions in the same text."""
    text = "Both @Madagascar and @madagascar should be sanitized"
    expected = f"Both @{ZWJ}Madagascar and @{ZWJ}madagascar should be sanitized"
    assert sanitize_madagascar_mentions(text) == expected


def test_sanitize_with_punctuation():
    """Test mentions followed by punctuation."""
    test_cases = [
        ("Thanks @Madagascar!", f"Thanks @{ZWJ}Madagascar!"),
        ("Hello @Madagascar.", f"Hello @{ZWJ}Madagascar."),
        ("See @Madagascar,", f"See @{ZWJ}Madagascar,"),
        ("By @Madagascar:", f"By @{ZWJ}Madagascar:"),
        ("From @Madagascar;", f"From @{ZWJ}Madagascar;"),
        ("Hi @Madagascar?", f"Hi @{ZWJ}Madagascar?"),
        ("Use @Madagascar)", f"Use @{ZWJ}Madagascar)"),
        ("Try (@Madagascar)", f"Try (@{ZWJ}Madagascar)"),
    ]
    for input_text, expected in test_cases:
        assert sanitize_madagascar_mentions(input_text) == expected


def test_no_sanitize_partial_words():
    """Test that partial word matches are NOT sanitized."""
    test_cases = [
        "MadagascarTeam",
        "MyMadagascar",
        "MadagascarBot",
        "#Madagascar",
    ]
    for text in test_cases:
        # Partial words without @ should remain unchanged
        assert sanitize_madagascar_mentions(text) == text


def test_no_op_cases():
    """Test cases where no sanitization should occur."""
    test_cases = [
        "",
        "No mentions here",
        "Just some text",
        "@GitHub",
        "@Other",
        "Madagascar without @",
    ]
    for text in test_cases:
        assert sanitize_madagascar_mentions(text) == text


def test_sanitize_at_line_boundaries():
    """Test mentions at the start and end of lines."""
    test_cases = [
        ("@Madagascar at start", f"@{ZWJ}Madagascar at start"),
        ("at end @Madagascar", f"at end @{ZWJ}Madagascar"),
        ("@Madagascar", f"@{ZWJ}Madagascar"),
    ]
    for input_text, expected in test_cases:
        assert sanitize_madagascar_mentions(input_text) == expected


def test_sanitize_multiline_text():
    """Test sanitization in multiline text."""
    text = """Hello @Madagascar!

This is a test with @madagascar mentioned.

Thanks @MADAGASCAR for everything!"""

    expected = f"""Hello @{ZWJ}Madagascar!

This is a test with @{ZWJ}madagascar mentioned.

Thanks @{ZWJ}MADAGASCAR for everything!"""

    assert sanitize_madagascar_mentions(text) == expected


def test_sanitize_with_urls():
    """Test that URLs containing Madagascar are handled correctly."""
    test_cases = [
        # URL should not be sanitized
        ("Visit https://github.com/Madagascar", "Visit https://github.com/Madagascar"),
        # But mention should be sanitized
        (
            "See @Madagascar at https://github.com/Madagascar",
            f"See @{ZWJ}Madagascar at https://github.com/Madagascar",
        ),
    ]
    for input_text, expected in test_cases:
        assert sanitize_madagascar_mentions(input_text) == expected


def test_sanitize_preserves_whitespace():
    """Test that whitespace is preserved correctly."""
    text = "  @Madagascar  \n  @madagascar  "
    expected = f"  @{ZWJ}Madagascar  \n  @{ZWJ}madagascar  "
    assert sanitize_madagascar_mentions(text) == expected


def test_zwj_constant():
    """Test that ZWJ constant is correctly defined."""
    assert ZWJ == "\u200d"
    assert len(ZWJ) == 1
    assert ord(ZWJ) == 0x200D
