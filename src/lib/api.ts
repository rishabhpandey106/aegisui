const API_BASE_URL = "http://localhost:8081/api/v1"; // local control-plane URL
// const API_TOKEN = "super-secret-aegis-token";

const MAX_RETRIES = 1;
const TIMEOUT_MS = 10000;

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request(endpoint: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function sanitizeErrorBody(body: string): string {
  if (!body) return "";
  const trimmed = body.slice(0, 200);
  const isHtml = /^\s*</.test(trimmed);
  return isHtml ? "" : trimmed;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}, token?: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await request(endpoint, { ...options, headers });

      if (!response.ok) {
        let errMsg = `${response.status} ${response.statusText}`;
        try {
          const errBody = sanitizeErrorBody(await response.text());
          if (errBody) errMsg = errBody;
        } catch {
          // ignore
        }
        throw new ApiError(response.status, errMsg);
      }

      const text = await response.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status < 500 || attempt === MAX_RETRIES) throw err;
        lastError = err;
      } else if (err instanceof DOMException && err.name === "AbortError") {
        throw new ApiError(0, "Request timed out");
      } else {
        throw err;
      }
    }
  }

  throw lastError;
}
