// src/lib/api.js
export const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:4000/api";

async function http(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    credentials: "include",              // <- send/receive cookie
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJSON = res.headers.get("content-type")?.includes("application/json");
  const data = isJSON ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg = (isJSON && data?.message) || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const auth = {
  login: (email, password) => http("/auth/login", { method: "POST", body: { email, password } }),
  logout: () => http("/auth/logout", { method: "POST" }),
  me: () => http("/auth/me"),
};

export const admin = {
  users: () => http("/admin/users"),
  createUser: (payload) => http("/admin/users", { method: "POST", body: payload }),
};

export const projects = {
  list: () => http("/projects"),
  create: (payload) => http("/projects", { method: "POST", body: payload }),
  update: (id, payload) => http(`/projects/${id}`, { method: "PATCH", body: payload }),
};

export const debug = {
  seedBasic: () => http("/debug/seed-basic", { method: "POST" }),
  resetBasic: () => http("/debug/reset-basic", { method: "POST" }),
};