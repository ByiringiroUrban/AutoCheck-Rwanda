const ACCESS_KEY = "ac_access_token";
const REFRESH_KEY = "ac_refresh_token";

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  return `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

function notify(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ac-toast", { detail: message }));
}

function parseError(status: number, body: unknown): ApiError {
  const data = (body || {}) as { detail?: unknown };
  const fields: Record<string, string> = {};
  if (typeof data.detail === "string" && data.detail.trim()) {
    return new ApiError(data.detail, status, fields);
  }
  if (Array.isArray(data.detail)) {
    const messages: string[] = [];
    for (const item of data.detail as { loc?: Array<string | number>; msg?: string }[]) {
      const loc = (item.loc || []).filter((part) => part !== "body").map(String).join(".");
      const msg = item.msg || "Invalid value";
      if (loc) fields[loc] = msg;
      messages.push(loc ? `${loc}: ${msg}` : msg);
    }
    return new ApiError(messages[0] || "Check the highlighted fields.", status, fields);
  }
  if (status === 404) return new ApiError("Nothing matched that request.", 404, fields);
  return new ApiError("The request could not be completed.", status, fields);
}

interface ApiOptions {
  method?: string;
  json?: unknown;
  form?: FormData;
  auth?: boolean;
  skipAuthRedirect?: boolean;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.json !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth !== false) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: options.method || "GET",
      headers,
      body: options.form ?? (options.json !== undefined ? JSON.stringify(options.json) : undefined),
    });
  } catch {
    throw new ApiError("Could not reach the AutoCheck service. Confirm the API is running.", 0);
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { detail: text };
    }
  }

  if (response.status === 401 && !options.skipAuthRedirect) {
    clearTokens();
    notify("Your session has expired. Sign in again.");
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.assign("/vehiclehistory/login");
    }
    throw new ApiError("Sign in is required.", 401);
  }

  if (response.status === 403) {
    const error = parseError(403, body);
    notify(error.message || "You do not have permission to do that.");
    throw error;
  }

  if (!response.ok) throw parseError(response.status, body);
  return body as T;
}
