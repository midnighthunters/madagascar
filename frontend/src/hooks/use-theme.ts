import React from "react";

export type AppTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "madagascar.appearance-theme";

const themeListeners = new Set<() => void>();
let currentTheme: AppTheme | undefined;

const isAppTheme = (value: string | null): value is AppTheme =>
  value === "light" || value === "dark";

const getSystemTheme = (): AppTheme => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const readTheme = (): AppTheme => {
  if (currentTheme) return currentTheme;
  if (typeof document !== "undefined") {
    const documentTheme = document.documentElement.dataset.theme ?? null;
    if (isAppTheme(documentTheme)) {
      currentTheme = documentTheme;
      return currentTheme;
    }
  }
  if (typeof window !== "undefined") {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isAppTheme(savedTheme)) {
        currentTheme = savedTheme;
        return currentTheme;
      }
    } catch {
      // A privacy-restricted browser may deny local storage access.
    }
  }
  currentTheme = getSystemTheme();
  return currentTheme;
};

const applyTheme = (theme: AppTheme) => {
  currentTheme = theme;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }
};

export const setAppTheme = (theme: AppTheme) => {
  applyTheme(theme);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The selected theme still applies for this session.
    }
  }
  themeListeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
};

export const useTheme = () => {
  const theme = React.useSyncExternalStore(subscribe, readTheme, () => "light");
  const toggleTheme = React.useCallback(
    () => setAppTheme(theme === "light" ? "dark" : "light"),
    [theme],
  );

  return { theme, setTheme: setAppTheme, toggleTheme };
};

export const resetThemeStoreForTests = () => {
  currentTheme = undefined;
  themeListeners.clear();
};
