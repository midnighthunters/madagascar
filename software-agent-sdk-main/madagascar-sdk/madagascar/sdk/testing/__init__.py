"""Testing utilities for Madagascar SDK.

This module provides test utilities that make it easy to write tests for
code that uses the Madagascar SDK, without needing to mock LiteLLM internals.
"""

from madagascar.sdk.testing.test_llm import TestLLM, TestLLMExhaustedError


__all__ = ["TestLLM", "TestLLMExhaustedError"]
