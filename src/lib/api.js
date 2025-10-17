// src/lib/api.js

// Resolve API base once:
// 1) Prefer VITE_API_BASE if provided (Render, custom URL, etc.)
// 2) Else: in dev -> http://localhost:4000/api
// 3) Else: in prod -> same-origin "/api" (works on Vercel if you ever proxy)
const IS_DEV = import.meta.env?.DEV === true;
export const API_BASE = (
  import.meta.env?.VITE_API_BASE?.replace(/\/$/, "") ||
  (IS_DEV ? "http://localhost:4000/api" : "/api")
);

/** Resolve the API root (without /api) for /health pings */
function apiRoot() {
  return API_BASE.replace(/\/api$/, "");
}

/** Read token saved by AuthContext/Login */
function getToken() {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? (JSON.parse(raw)?.token || "") : "";
  } catch {
    return "";
  }
}

/* ─────────────────────────────────────────────────────────
   WARM-UP HELPERS
   - pingApi(): fire-and-forget call to /health
   - ensureAwake(): try a few pings with backoff before real requests
   ───────────────────────────────────────────────────────── */
export async function pingApi({ timeoutMs = 4000 } = {}) {
  const url = `${apiRoot()}/health`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetch(url, { cache: "no-store", signal: ctrl.signal, credentials: "omit" });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/** Try to wake the backend (0.5s, 1s, 2s, 4s …) */
export async function ensureAwake({ attempts = 6 } = {}) {
  for (let i = 0; i < attempts; i++) {
    const ok = await pingApi({ timeoutMs: 4500 });
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 500 * Math.max(1, 2 ** i)));
  }
  return false; // even if it didn't respond, don't block the app
}

async function http(path, { method = "GET", body, headers } = {}) {
  const token = getToken();
  const h = { "Content-Type": "application/json", ...(headers || {}) };
  if (token) h.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text();

  if (!res.ok) {
    const err = new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function qs(obj = {}) {
  const s = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return s ? `?${s}` : "";
}

/* ---------- High-level helpers ---------- */
export const auth = {
  login: (email, password) =>
    http("/auth/login", { method: "POST", body: { email, password } }),
  logout: () => http("/auth/logout", { method: "POST" }),
  me: () => http("/auth/me"),
  register: async (payload) => {
    try {
      return await http("/auth/register", { method: "POST", body: payload });
    } catch (e) {
      // legacy fallback if /auth/register not mounted in some env
      if (e?.status === 404) return http("/register", { method: "POST", body: payload });
      throw e;
    }
  },
};

export const admin = {
  users: (q = "") => http(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  user: (id) => http(`/admin/users/${id}`),
  createUser: (payload) => http("/admin/users", { method: "POST", body: payload }),
  updateUser: (id, payload) => http(`/admin/users/${id}`, { method: "PATCH", body: payload }),
  deleteUser: (id) => http(`/admin/users/${id}`, { method: "DELETE" }),
  pending: () => http("/admin/users?status=pending"),
  approveUser: (id) => http(`/admin/users/${id}/approve`, { method: "PATCH" }),
  rejectUser: (id) => http(`/admin/users/${id}/reject`, { method: "PATCH" }),
  stats: () => http("/admin/stats"),
};

export const projects = {
  list: () => http("/projects"),
  one: (id) => http(`/projects/${id}`),
  create: (payload) => http("/projects", { method: "POST", body: payload }),
  update: (id, payload) => http(`/projects/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => http(`/projects/${id}`, { method: "DELETE" }),

  // Evidence: dedicated endpoint
  addEvidence: (id, entry) => http(`/projects/${id}/evidence`, { method: "POST", body: entry }),

  // Announcements: list/create/delete (index-based delete per backend)
  listAnnouncements: (id) => http(`/projects/${id}/announcements`),            // { ok, items }
  createAnnouncement: (id, payload) => http(`/projects/${id}/announcements`, { method: "POST", body: payload }),
  deleteAnnouncement: (id, idx) => http(`/projects/${id}/announcements/${idx}`, { method: "DELETE" }),
};

export const debug = {
  seedBasic: () => http("/debug/seed-basic", { method: "POST" }),
  resetBasic: () => http("/debug/reset-basic", { method: "POST" }),
};

export const directory = {
  list: () => http("/directory"),
};

export const dm = {
  open: (peerId) => http("/dm/open", { method: "POST", body: { peerId } }),
  threads: () => http("/dm/threads"),
  get: (threadId, { before, limit = 50 } = {}) =>
    http(`/dm/threads/${threadId}/messages${qs({ before, limit })}`),
  send: (threadId, { text, attachments }) =>
    http(`/dm/threads/${threadId}/messages`, {
      method: "POST",
      body: { text, attachments },
    }),
};

export const rooms = {
  get: (projectId, { before, limit = 50 } = {}) =>
    http(`/rooms/${projectId}/messages${qs({ before, limit })}`),
  send: (projectId, { text, attachments }) =>
    http(`/rooms/${projectId}/messages`, {
      method: "POST",
      body: { text, attachments },
    }),
};

/* ---------- Requirements ---------- */
export const requirements = {
  get: (projectId) => http(`/projects/${projectId}/requirements`),
  async upsert(projectId, payload) {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const fd = new FormData();
    fd.append("replace", "true");
    fd.append("pages", JSON.stringify(payload.pages || []));
    if (payload.files?.logo)  fd.append("logo",  payload.files.logo);
    if (payload.files?.brief) fd.append("brief", payload.files.brief);
    (payload.files?.supporting || []).forEach((f) => fd.append("supporting", f));
    if (payload.files?.pageFiles) {
      for (const [name, list] of Object.entries(payload.files.pageFiles)) {
        (list || []).forEach((f) => fd.append(`pageFiles[${name}]`, f));
      }
    }
    const res = await fetch(`${API_BASE}/projects/${projectId}/requirements`, {
      method: "PUT",
      credentials: "include",
      headers,
      body: fd,
    });
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json().catch(() => ({})) : await res.text();
    if (!res.ok) {
      const err = new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
      err.status = res.status; err.data = data; throw err;
    }
    return data;
  },
  setReview: (projectId, reviewed) =>
    http(`/projects/${projectId}/requirements/review`, { method: "PATCH", body: { reviewed } }),
  remove: (projectId) => http(`/projects/${projectId}/requirements`, { method: "DELETE" }),
};

/* ---------- Files: Supabase uploader endpoint ---------- */
export const files = {
  upload: async (file) => {
    const token = getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/files/upload`, {
      method: "POST",
      credentials: "include",
      headers,
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.error || `HTTP ${res.status}`);
      err.status = res.status; err.data = data; throw err;
    }
    // { file: { name,type,size,path,url } }
    return data;
  },
};

/* ---------- Invoices (billing) ---------- */
export const invoices = {
  list: (projectId) => http(`/projects/${projectId}/invoices`), // { invoices: [...] }
  create: (projectId, payload) =>
    http(`/projects/${projectId}/invoices`, { method: "POST", body: payload }), // { ok, invoice }
  updateStatus: (projectId, invoiceId, status) =>
    http(`/projects/${projectId}/invoices/${invoiceId}`, { method: "PATCH", body: { status } }),
  remove: (projectId, invoiceId) =>
    http(`/projects/${projectId}/invoices/${invoiceId}`, { method: "DELETE" }),
};