// src/lib/api.js

// API base points at the /api namespace on your backend (Render in prod)
const API_BASE =
  (import.meta.env.VITE_API_BASE || "http://localhost:4000/api").replace(/\/$/, "");

// For hitting non-/api endpoints like /health
const API_HOST = API_BASE.replace(/\/api$/, "");

// Read bearer token from localStorage (set by Login.jsx)
function authHeader() {
  try {
    const raw = localStorage.getItem("auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request(path, { method = "GET", body, headers = {}, ...rest } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const isJSON = res.headers.get("content-type")?.includes("application/json");
  const data = isJSON ? await res.json().catch(() => ({})) : null;

  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // ---- Misc
  // FIX: /health lives on the host root, not under /api
  health: async () => {
    const r = await fetch(`${API_HOST}/health`, { credentials: "include" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.message || `Health failed: ${r.status}`);
    return j;
  },

  // ---- Auth
  me: () => request("/auth/me"),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  logout: () => request("/auth/logout", { method: "POST" }),

  // ---- Users (admin)
  listUsers: (query = "") => request(`/users${query ? `?${query}` : ""}`),
  getUser: (id) => request(`/users/${id}`),
  createUser: (payload) => request("/users", { method: "POST", body: payload }),
  updateUser: (id, payload) => request(`/users/${id}`, { method: "PUT", body: payload }),
  approveUser: (id) => request(`/users/${id}/approve`, { method: "POST" }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),

  // ---- Projects
  listProjects: (query = "") => request(`/projects${query ? `?${query}` : ""}`),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (payload) => request("/projects", { method: "POST", body: payload }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: "PUT", body: payload }),
  deleteProject: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  // ---- Files (stub)
  listFiles: (projectId) => request(`/files?project=${projectId}`),
};