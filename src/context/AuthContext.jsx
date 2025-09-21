// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null; // { token?, role, name, email, _id }
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth") {
        setAuthState(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Optional hydration: only try /me if we already have a token
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!authState?.token) return; // don’t hit /me anonymously (avoids 401 in console)
      try {
        setLoading(true);
        const me = await api.me().catch(() => null);
        if (!ignore && me?.user) {
          const data = {
            token: authState.token,
            role: me.user.role,
            name: me.user.name,
            email: me.user.email,
            _id: me.user._id,
          };
          localStorage.setItem("auth", JSON.stringify(data));
          setAuthState(data);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [authState?.token]);

  const value = useMemo(
    () => ({
      user: authState,
      isAuthed: !!authState?.token,
      role: authState?.role ?? null,
      loading,
      setAuth: (data) => {
        if (data) localStorage.setItem("auth", JSON.stringify(data));
        else localStorage.removeItem("auth");
        setAuthState(data || null);
      },
      logout: async () => {
        try {
          await api.logout();
        } catch {
          // ignore
        }
        localStorage.removeItem("auth");
        setAuthState(null);
      },
    }),
    [authState, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}