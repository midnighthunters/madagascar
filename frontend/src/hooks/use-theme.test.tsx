import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  resetThemeStoreForTests,
  setAppTheme,
  THEME_STORAGE_KEY,
  useTheme,
} from "./use-theme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.colorScheme = "";
    resetThemeStoreForTests();
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: false }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the pre-paint document theme", () => {
    document.documentElement.dataset.theme = "dark";
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("persists and applies an explicit selection", () => {
    const { result } = renderHook(() => useTheme());

    act(() => setAppTheme("dark"));

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("toggles between the two explicit modes", () => {
    document.documentElement.dataset.theme = "light";
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("dark");
  });
});
