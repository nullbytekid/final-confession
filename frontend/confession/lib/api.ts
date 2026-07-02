/** Same-origin in production (Django serves frontend). Override for local dev. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const fetchOpts: RequestInit = {
  credentials: "include",
};

function parseApiError(
  data: unknown,
  status: number,
  fallback: string
): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === "string") return record.detail;
    if (Array.isArray(record.message) && record.message[0]) {
      return String(record.message[0]);
    }
    if (typeof record.message === "string") return record.message;
  }
  return `${fallback} (error ${status})`;
}

export interface SiteStatus {
  password_set: boolean;
  authenticated: boolean;
  said_yes: boolean;
  said_yes_at: string | null;
  stop_courting: boolean;
}

export async function getSiteStatus(): Promise<SiteStatus | null> {
  try {
    const res = await fetch(`${API_URL}/api/status/`, fetchOpts);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function verifyPassword(
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/verify-password/`, {
      ...fetchOpts,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.detail || "Incorrect password" };
  } catch {
    return { ok: false, error: "Could not reach server" };
  }
}

export async function setPassword(
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/set-password/`, {
      ...fetchOpts,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.detail || "Could not set password" };
  } catch {
    return { ok: false, error: "Could not reach server" };
  }
}

export async function notifyOpened(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/opened/`, { ...fetchOpts, method: "POST" });
  } catch {
    // Non-blocking
  }
}

export async function sendYes(): Promise<{
  ok: boolean;
  needs_password?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/api/respond/`, {
      ...fetchOpts,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: "yes" }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, needs_password: data.needs_password };
    return { ok: false, error: data.detail || "Could not send response" };
  } catch {
    return { ok: false, error: "Could not reach server" };
  }
}

export async function submitWheresaWellness(
  message: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/wheresa/wellness/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      error: parseApiError(data, res.status, "Could not send message"),
    };
  } catch {
    return { ok: false, error: "Could not reach server" };
  }
}

export async function submitWheresaDateConfirm(
  message: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/wheresa/date-confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return {
      ok: false,
      error: parseApiError(data, res.status, "Could not send response"),
    };
  } catch {
    return { ok: false, error: "Could not reach server" };
  }
}

export async function stopCourting(
  reason: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/stop-courting/`, {
      ...fetchOpts,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.detail || "Could not send" };
  } catch {
    return { ok: false, error: "Could not reach server" };
  }
}
