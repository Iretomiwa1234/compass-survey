import type { LoginPayload } from "./auth";

let pendingLogin: LoginPayload | null = null;

export function setPendingVerificationLogin(payload: LoginPayload) {
  pendingLogin = { ...payload };
}

export function getPendingVerificationLogin(email?: string) {
  if (!pendingLogin) return null;
  if (email && pendingLogin.email !== email) return null;
  return { ...pendingLogin };
}

export function clearPendingVerificationLogin(email?: string) {
  if (!email || pendingLogin?.email === email) {
    pendingLogin = null;
  }
}
