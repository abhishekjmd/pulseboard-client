const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

type ApiErrorPayload = {
  message?: string;
};

type ApiError = Error & {
  status?: number;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const method = (options.method ?? "GET").toString().toUpperCase();
  const authlessPaths = ["/api/auth/login", "/api/auth/signup"];
  const isAuthlessEndpoint = authlessPaths.includes(path) && method === "POST";

  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !isAuthlessEndpoint) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      cache: "no-store",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (networkError) {
    const error = new Error(
      networkError instanceof Error
        ? `Network error: ${networkError.message}`
        : "Network error occurred"
    ) as ApiError;
    error.status = 0;
    throw error;
  }

  let payload: unknown = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    payload = await response.json();
  }

  if (!response.ok) {
    const serverMessage = (payload as ApiErrorPayload | null)?.message;
    const message = serverMessage
      ? `${serverMessage} (${response.status})`
      : `Request failed with status ${response.status}`;
    const error = new Error(message) as ApiError;
    error.status = response.status;
    throw error;
  }

  return payload as T;
}
