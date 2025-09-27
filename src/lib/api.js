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
    const err = new Error((data && data.message) || `HTTP ${res.status}`);
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

  // Try /auth/register then fall back to /register if old backend
  register: async (payload) => {
    try {
      return await http("/auth/register", { method: "POST", body: payload });
    } catch (e) {
      if (e?.status === 404) {
        return http("/register", { method: "POST", body: payload });
      }
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

  // IMPORTANT: backend expects PATCH
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
};

export const debug = {
  seedBasic: () => http("/debug/seed-basic", { method: "POST" }),
  resetBasic: () => http("/debug/reset-basic", { method: "POST" }),
};