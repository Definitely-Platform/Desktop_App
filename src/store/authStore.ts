import { useState, useEffect } from 'react';
import { openUrl } from '@tauri-apps/plugin-opener';
import type { UserProfile, AuthTokens, AuthState } from '../types/auth';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'done_access_token',
  REFRESH_TOKEN: 'done_refresh_token',
  USER: 'done_auth_user',
};

// In Vite, `import.meta.env.DEV` is statically replaced with `false` in production bundle builds
// and `true` in local dev server (`npm run dev` / `tauri dev`).
// Never inspect `window.location.hostname === 'localhost'` because Tauri serves native bundle assets
// from 'tauri://localhost' on macOS and 'http://tauri.localhost' on Windows even in production.
export const AUTH_CONFIG = {
  ACCOUNTS_URL:
    (import.meta.env.VITE_ACCOUNTS_URL as string) ||
    (import.meta.env.DEV ? 'http://localhost:5174' : 'https://accounts.definitely.live'),
  API_URL:
    (import.meta.env.VITE_AUTH_API_URL as string) ||
    (import.meta.env.DEV ? 'http://localhost:8081' : 'https://api.accounts.definitely.live'),
  REDIRECT_URI:
    (import.meta.env.VITE_REDIRECT_URI as string) ||
    (import.meta.env.DEV ? 'http://localhost:1420/auth/callback' : 'done://auth/callback'),
};

// Global in-memory state & listeners for zero-dependency reactive auth
let globalState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function updateState(partial: Partial<AuthState>) {
  globalState = { ...globalState, ...partial };
  notify();
}

/**
 * Fetch user profile from the central auth-service API
 */
export async function fetchUserProfile(token: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${AUTH_CONFIG.API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.success && data.user) {
      return {
        id: data.user.id || data.user._id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        role: data.user.role || 'user',
        avatarUrl: data.user.avatarUrl,
        status: data.user.status,
        tokenVersion: data.user.tokenVersion,
      };
    }
    return null;
  } catch (err) {
    console.warn('[authStore] Failed to fetch user profile:', err);
    return null;
  }
}

/**
 * Perform Refresh Token Rotation with auth-service
 */
export async function refreshAuthSession(): Promise<boolean> {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) {
    await logout();
    return false;
  }

  try {
    const res = await fetch(`${AUTH_CONFIG.API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await logout();
      return false;
    }

    const data = await res.json();
    if (data.success && data.token) {
      const newTokens: AuthTokens = {
        accessToken: data.token,
        refreshToken: data.refreshToken || refreshToken,
      };

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
      if (newTokens.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
      }

      const user = await fetchUserProfile(newTokens.accessToken);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        updateState({
          tokens: newTokens,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }
    }
    await logout();
    return false;
  } catch {
    return false;
  }
}

/**
 * Complete login using exchanged tokens
 */
export async function loginWithTokens(accessToken: string, refreshToken?: string): Promise<boolean> {
  updateState({ isLoading: true, error: null });

  try {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    const user = await fetchUserProfile(accessToken);
    if (!user) {
      throw new Error('Unable to resolve user profile with provided access token');
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    updateState({
      tokens: { accessToken, refreshToken },
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    await focusAppWindow();

    return true;
  } catch (err: any) {
    updateState({
      isLoading: false,
      error: err.message || 'Login failed',
      isAuthenticated: false,
    });
    return false;
  }
}

/**
 * Log out and clear stored session
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  try {
    if (token) {
      await fetch(`${AUTH_CONFIG.API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } finally {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    updateState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
}

/**
 * Restore persisted session on app launch
 */
export async function restoreSession(): Promise<boolean> {
  updateState({ isLoading: true });

  const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const storedUserRaw = localStorage.getItem(STORAGE_KEYS.USER);

  if (!storedToken) {
    updateState({ isLoading: false, isAuthenticated: false });
    return false;
  }

  // Optimistically set cached user to eliminate render flickers
  if (storedUserRaw) {
    try {
      const cachedUser = JSON.parse(storedUserRaw);
      updateState({
        user: cachedUser,
        tokens: { accessToken: storedToken, refreshToken: storedRefreshToken || undefined },
        isAuthenticated: true,
      });
    } catch {
      // Ignore parse error
    }
  }

  // Validate token freshness in background
  const liveUser = await fetchUserProfile(storedToken);
  if (liveUser) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(liveUser));
    updateState({
      user: liveUser,
      tokens: { accessToken: storedToken, refreshToken: storedRefreshToken || undefined },
      isAuthenticated: true,
      isLoading: false,
    });
    return true;
  }

  // If access token expired, attempt Refresh Token Rotation
  if (storedRefreshToken) {
    return await refreshAuthSession();
  }

  await logout();
  return false;
}

let pollInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Bring desktop application window to the foreground over the browser
 */
export async function focusAppWindow(): Promise<void> {
  // 1. Try Tauri v2 Window API
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const appWindow = getCurrentWindow();
    await appWindow.unminimize();
    await appWindow.show();
    await appWindow.setFocus();
  } catch {
    // Not running in Tauri window
  }

  // 2. Try Tauri Rust invoke handler
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('focus_window');
  } catch {
    // ignore
  }

  // 3. Fallback browser window focus
  try {
    if (typeof window !== 'undefined') {
      window.focus();
    }
  } catch {
    // ignore
  }
}

export function stopSsoPolling(): void {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

export function startSsoPolling(code: string): void {
  stopSsoPolling();

  pollInterval = setInterval(async () => {
    try {
      const res = await fetch(
        `${AUTH_CONFIG.API_URL}/api/auth/sso/poll?code=${encodeURIComponent(code)}`,
        {
          headers: { Accept: 'application/json' },
        },
      );
      if (!res.ok) return;

      const data = await res.json();
      if (data.success && data.token) {
        stopSsoPolling();
        await loginWithTokens(data.token, data.refreshToken);
        await focusAppWindow();
      }
    } catch {
      // ignore network errors during background polling
    }
  }, 1000);

  // Auto-stop polling after 5 minutes
  setTimeout(() => {
    stopSsoPolling();
  }, 5 * 60 * 1000);
}

/**
 * Build the SSO Login URL pointing to accounts.definitely.live
 */
export function getSsoLoginUrl(code?: string): string {
  const redirectTarget = encodeURIComponent(AUTH_CONFIG.REDIRECT_URI);
  const codeParam = code ? `&sso_code=${encodeURIComponent(code)}` : '';
  return `${AUTH_CONFIG.ACCOUNTS_URL}/login?redirect=${redirectTarget}&platform=desktop${codeParam}`;
}

/**
 * Launch SSO Login in system browser with real-time loopback polling
 */
export async function openSsoLogin(): Promise<void> {
  const ssoCode = crypto.randomUUID();
  startSsoPolling(ssoCode);

  const url = getSsoLoginUrl(ssoCode);
  try {
    await openUrl(url);
  } catch {
    window.open(url, '_blank');
  }
}

/**
 * React hook to consume Auth State across Desktop components
 */
export function useAuth(): AuthState & {
  loginWithTokens: typeof loginWithTokens;
  logout: typeof logout;
  openSsoLogin: typeof openSsoLogin;
  refreshSession: typeof refreshAuthSession;
} {
  const [state, setState] = useState<AuthState>(globalState);

  useEffect(() => {
    const handleUpdate = () => setState(globalState);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    ...state,
    loginWithTokens,
    logout,
    openSsoLogin,
    refreshSession: refreshAuthSession,
  };
}
