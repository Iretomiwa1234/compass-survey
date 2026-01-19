import { fetchJson, ApiError } from "./api";
import { getAuthToken } from "./session";

export type CurrentUser = {
  id: number;
  fname: string;
  sname: string;
  email: string;
  business_id: number | null;
  type: string | null;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CurrentUserResponse = {
  status?: string;
  data?: {
    user?: CurrentUser;
  };
};

export type RegisterPayload = {
  fname: string;
  sname: string;
  email: string;
  phone: string;
  password: string;
  user_type: "customer" | "admin" | "business";
};

export type RegisterResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    fname?: string;
    sname?: string;
    email?: string;
    status?: string;
    verification_code?: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status?: string;
  data?: {
    token?: string;
    expires_at?: number;
  };
};

export type VerifyResponse = {
  status?: string;
  message?: string;
  code?: string;
  data?: {
    fname?: string;
    sname?: string;
    email?: string;
  };
};

function getBaseUrl() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing BASE_URL.");
  }
  return baseUrl;
}

export async function registerUser(payload: RegisterPayload) {
  return fetchJson<RegisterResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/register",
    method: "POST",
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload) {
  return fetchJson<LoginResponse>({
    baseUrl: getBaseUrl(),
    path: "/v1/login",
    method: "POST",
    body: payload,
  });
}

export async function verifyUser(code: string) {
  const trimmed = code.trim();
  return fetchJson<VerifyResponse>({
    baseUrl: getBaseUrl(),
    path: `/v1/verify/${encodeURIComponent(trimmed)}`,
    method: "GET",
  });
}
export async function getCurrentUser(): Promise<CurrentUser> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  try {
    const response = await fetchJson<CurrentUserResponse>({
      baseUrl: getBaseUrl(),
      path: "/v1/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = response?.data?.user;
    if (!user) {
      throw new Error("No user data returned");
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Token expired or invalid, clear session
      localStorage.removeItem("compass.auth.session");
      throw new Error("Session expired. Please log in again.");
    }
    throw error;
  }
}
