const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEFAULT_ORG = process.env.NEXT_PUBLIC_DEFAULT_ORG_SLUG || "bear-creek";

export async function apiGet(path: string, options: RequestInit = {}) {
  const url = new URL(`${API_URL}${path}`);
  
  // Auto-append org if not present in path or headers
  const headers = new Headers(options.headers);
  if (!headers.has("X-Organization-Slug")) {
    headers.set("X-Organization-Slug", DEFAULT_ORG);
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers,
    // credentials: "include", // Enable if using cookies
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `API error: ${res.status}` }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

export async function apiPost(path: string, body: any, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("X-Organization-Slug")) {
    headers.set("X-Organization-Slug", DEFAULT_ORG);
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: `API error: ${res.status}` }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}
