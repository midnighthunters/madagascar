interface MadagascarTauriBridge {
  core?: {
    invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
  };
}

declare global {
  interface Window {
    __TAURI__?: MadagascarTauriBridge;
  }
}

export function canUseMadagascarDesktopBridge(): boolean {
  return (
    typeof window !== "undefined" && Boolean(window.__TAURI__?.core?.invoke)
  );
}

export function invokeMadagascarDesktop<T>(
  command: string,
  args?: Record<string, unknown>,
): Promise<T> | null {
  return window.__TAURI__?.core?.invoke<T>(command, args) ?? null;
}
