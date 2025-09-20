// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null; // { token?, role, name, email, _id }
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth") {
        setAuth(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // optional: try to hydrate from server cookie (HTTP-only) on first load
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (auth) return; // already have local auth
      try {
        setLoading(true);
        const me = await api.me().catch(() => null);
        if (!ignore && me?.user) {
          const data = {
            role: me.user.role,
            name: me.user.name,
            email: me.user.email,
            _id: me.user._id,
          };
          localStorage.setItem("auth", JSON.stringify(data));
          setAuth(data);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []); // only once

  const value = useMemo(
    () => ({
      user: auth,
      isAuthed: !!auth,
      role: auth?.role ?? null,
      loading,
      setAuth: (data) => {
        if (data) localStorage.setItem("auth", JSON.stringify(data));
        else localStorage.removeItem("auth");
        setAuth(data || null);
      },
      logout: async () => {
        try {
          await api.logout();
        } catch {
          // ignore
        }
        localStorage.removeItem("auth");
        setAuth(null);
      },
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}