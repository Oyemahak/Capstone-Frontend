// src/context/AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/api.js";

const Ctx = createContext(null);

/* ---------- tiny token helpers ---------- */
function readToken() {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? (JSON.parse(raw)?.token || "") : "";
  } catch {
    return "";
  }
}
function writeToken(token) {
  try { localStorage.setItem("auth", JSON.stringify({ token: token || "" })); } catch {}
}
function clearToken() {
  try { localStorage.removeItem("auth"); } catch {}
}

/* ---------- provider ---------- */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false); // when initial probe finished

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = readToken();

        // ✅ Skip /auth/me entirely if there is no token
        if (!token) {
          if (alive) {
            setUser(null);
            setChecked(true);
          }
          return;
        }

        // Token exists -> verify it
        const r = await auth.me(); // { user }
        if (alive) setUser(r?.user || null);
      } catch {
        // Ignore 401/expired token; treat as logged out
        if (alive) setUser(null);
      } finally {
        if (alive) setChecked(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await auth.login(email, password); // { token, user }
    if (r?.token) writeToken(r.token);
    setUser(r?.user || null);
    return r?.user || null;
  }, []);

  const logout = useCallback(async () => {
    try { await auth.logout(); } catch {}
    clearToken();
    setUser(null);
  }, []);

  const register = useCallback(async (payload) => auth.register(payload), []);

  // NEW: allow in-app updates (e.g., avatarUrl) without reloading
  const updateUser = useCallback((partial) => {
    setUser((prev) => prev ? { ...prev, ...partial } : prev);
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthed: !!user,
    checked,        // consumers can wait for initial auth check
    login,
    logout,
    register,
    updateUser,     // NEW
  }), [user, checked, login, logout, register, updateUser]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/* ---------- hook ---------- */
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}