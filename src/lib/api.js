// src/lib/api.js
const API_BASE =
  (import.meta.env.VITE_API_BASE?.replace(/\/$/, '') || 'http://localhost:4000/api');

function getToken() {
  try {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

// tiny JSON fetch with auth
async function request(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include', // harmless if you don’t use cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const isJSON = res.headers.get('content-type')?.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const msg = data?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // health (useful for the /debug page)
  health: () => fetch(`${API_BASE.replace(/\/api$/, '')}/health`).then(r => r.json()),

  // Auth
  me: () => request('/auth/me'),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Users (admin)
  listUsers: (query = '') => request(`/users${query ? `?${query}` : ''}`),
  getUser: (id) => request(`/users/${id}`),
  createUser: (payload) => request('/users', { method: 'POST', body: payload }),
  updateUser: (id, payload) => request(`/users/${id}`, { method: 'PUT', body: payload }),
  approveUser: (id) => request(`/users/${id}/approve`, { method: 'POST' }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Projects
  listProjects: (query = '') => request(`/projects${query ? `?${query}` : ''}`),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (payload) => request('/projects', { method: 'POST', body: payload }),
  updateProject: (id, payload) => request(`/projects/${id}`, { method: 'PUT', body: payload }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Files (stub)
  listFiles: (projectId) => request(`/files?project=${projectId}`),
};