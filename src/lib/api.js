// src/lib/api.js
export const API_BASE =
  (import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:4000/api");

/** Read token saved by AuthContext/Login */
function getToken() {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? (JSON.parse(raw)?.token || "") : "";
  } catch {
    return "";
  }
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

// src/lib/api.js  (showing the whole file is noisy; replace the projects block with this:)
export const projects = {
  list: () => http("/projects"),
  one: (id) => http(`/projects/${id}`),
  create: (payload) => http("/projects", { method: "POST", body: payload }),
  update: (id, payload) => http(`/projects/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => http(`/projects/${id}`, { method: "DELETE" }),

  // NEW: add evidence entry; body = { title, links, images, ts }
  addEvidence: (id, entry) => http(`/projects/${id}/evidence`, { method: "POST", body: entry }),
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

/* ---------- Requirements (unchanged from your working version) ---------- */
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
    (payload.files?.supporting || []).forEach((f) => fd.append("supporting[]", f));
    if (payload.files?.pageFiles) {
      for (const [name, list] of Object.entries(payload.files.pageFiles)) {
        (list || []).forEach((f) => fd.append(`pageFiles[${name}][]`, f));
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

function qs(obj = {}) {
  const s = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return s ? `?${s}` : "";
}