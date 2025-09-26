// src/context/AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/api.js";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  // Check cookie session once on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await auth.me();
        if (alive) setUser(r?.user || null);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setChecked(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await auth.login(email, password);
    setUser(r?.user || null);
    return r?.user || null;
  }, []);

  const logout = useCallback(async () => {
    try { await auth.logout(); } catch {}
    setUser(null);
  }, []);

  const value = useMemo(() => {
    const role = user?.role || null;
    return {
      user,
      role,
      isAuthed: !!user,
      checked,
      login,
      logout,
    };
  }, [user, checked, login, logout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}