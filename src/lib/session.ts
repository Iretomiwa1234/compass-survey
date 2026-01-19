export type AuthSession = {
  token: string;
  /** Unix seconds */
  expiresAt?: number;
};

const STORAGE_KEY = "compass.auth.session";

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const token = (parsed as Record<string, unknown>).token;
    const expiresAt = (parsed as Record<string, unknown>).expiresAt;

    if (typeof token !== "string" || token.length === 0) return null;

    const normalized: AuthSession = {
      token,
      expiresAt: typeof expiresAt === "number" ? expiresAt : undefined,
    };

    if (isSessionExpired(normalized)) {
      clearAuthSession();
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getAuthToken(): string | null {
  return getAuthSession()?.token ?? null;
}

export function isSessionExpired(session: AuthSession): boolean {
  if (!session.expiresAt) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds >= session.expiresAt;
}
