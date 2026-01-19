export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getErrorMessageFromData(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  if (!("message" in data)) return null;
  const message = (data as Record<string, unknown>).message;
  return typeof message === "string" ? message : null;
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as Record<string, unknown>).name;
  return name === "AbortError";
}

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

async function readJsonSafe(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text().catch(() => "");
    return text || null;
  }
  return response.json().catch(() => null);
}

export type FetchJsonOptions = {
  baseUrl: string;
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  credentials?: RequestCredentials;
};

export async function fetchJson<T>(options: FetchJsonOptions): Promise<T> {
  const {
    baseUrl,
    path,
    method = "GET",
    headers,
    body,
    timeoutMs = 15000,
    credentials = "include",
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(joinUrl(baseUrl, path), {
      method,
      credentials,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(headers ?? {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await readJsonSafe(response);

    if (!response.ok) {
      const message =
        getErrorMessageFromData(data) ?? `Request failed (${response.status})`;
      throw new ApiError(message, response.status, data);
    }

    return data as T;
  } catch (error: unknown) {
    if (isAbortError(error)) {
      throw new ApiError("Request timed out", 408, null);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
