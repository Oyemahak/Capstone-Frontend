// src/pages/auth/Login.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { API_BASE } from "@/lib/api.js";
import { useTheme } from "@/lib/theme.js";

const TABS = [
  {
    key: "client",
    label: "Client",
    email: "client@mspixel.pulse",
    password: "client",
  },
  {
    key: "developer",
    label: "Developer",
    email: "dev@mspixel.pulse",
    password: "developer",
  },
  {
    key: "admin",
    label: "Admin",
    email: "admin@mspixel.pulse",
    password: "admin",
  },
];

export default function Login() {
  const { isAuthed, role, login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const nav = useNavigate();

  const [tab, setTab] = useState("client");
  const active = useMemo(() => TABS.find((t) => t.key === tab), [tab]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false); // UI hint for cold-starts

  // Already authed? bounce to portal
  useEffect(() => {
    if (!isAuthed) return;
    if (role === "admin") nav("/admin", { replace: true });
    else if (role === "developer") nav("/dev", { replace: true });
    else nav("/client", { replace: true });
  }, [isAuthed, role, nav]);

  // Extra gentle nudge to wake backend when reaching the login page
  useEffect(() => {
    const url = `${API_BASE}/health`;
    setWaking(true);
    fetch(url, { method: "GET", credentials: "include" })
      .catch(() => {})
      .finally(() => setTimeout(() => setWaking(false), 1200));
  }, []);

  function fillDemo() {
    if (!active) return;
    setEmail(active.email);
    setPassword(active.password);
  }

  function friendlyColdStart(e) {
    const code = e?.status;
    const msg = (e?.message || "").toLowerCase();
    const looksCold =
      !code ||
      (code >= 500 && code < 600) ||
      msg.includes("fetch") ||
      msg.includes("failed") ||
      msg.includes("network") ||
      msg.includes("timeout");
    return looksCold;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const u = await login(email, password);
      if (!u) throw new Error("Login failed");
      const r = u.role;
      if (r === "admin") nav("/admin", { replace: true });
      else if (r === "developer") nav("/dev", { replace: true });
      else nav("/client", { replace: true });
    } catch (ex) {
      if (friendlyColdStart(ex)) {
        setErr(
          "Warming up the backend… give it a moment and try again. (First visit after a while can be a little sleepy!)"
        );
      } else {
        setErr(ex?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`px-4 md:px-6 lg:px-8 py-14 ${
        isDark ? "bg-[rgba(8,9,12,0.15)]" : "bg-slate-50"
      }`}
    >
      <div
        className={`max-w-md mx-auto rounded-2xl shadow-2xl backdrop-blur-md border ${
          isDark
            ? "bg-white/5 border-white/10 shadow-black/30"
            : "bg-white border-slate-200 shadow-slate-200/70"
        }`}
      >
        {/* Header */}
        <div className="px-6 pt-6">
          <h1
            className={`text-2xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Welcome Back 👋
          </h1>
          <p className={isDark ? "text-sm text-white/60 mt-1" : "text-sm text-slate-500 mt-1"}>
            Choose your role, then enter your credentials.
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-5">
          <div
            className={`inline-flex items-center gap-1 p-1 rounded-xl border ${
              isDark ? "bg-white/10 border-white/10" : "bg-slate-100 border-slate-100"
            }`}
          >
            {TABS.map((t) => {
              const selected = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    "px-3 py-1.5 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400/70",
                    selected
                      ? isDark
                        ? "text-white bg-white/15"
                        : "text-slate-900 bg-white"
                      : isDark
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-6 pt-5 pb-6 space-y-4">
          {waking && (
            <div className={isDark ? "text-xs text-amber-300" : "text-xs text-amber-700"}>
              Getting things ready… waking the server now.
            </div>
          )}

          <label className="block">
            <div className={isDark ? "text-xs text-white/65 mb-1" : "text-xs text-slate-600 mb-1"}>
              Email
            </div>
            <input
              className={`w-full rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/70 ${
                isDark
                  ? "bg-black/30 border border-white/15 text-white placeholder-white/35 focus:border-emerald-400/60"
                  : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-400/60"
              }`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              inputMode="email"
            />
          </label>

          <label className="block">
            <div className={isDark ? "text-xs text-white/65 mb-1" : "text-xs text-slate-600 mb-1"}>
              Password
            </div>
            <input
              type="password"
              className={`w-full rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/70 ${
                isDark
                  ? "bg-black/30 border border-white/15 text-white placeholder-white/35 focus:border-emerald-400/60"
                  : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-400/60"
              }`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {err && (
            <div className={isDark ? "text-sm text-rose-300" : "text-sm text-rose-600"}>
              {err}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 disabled:opacity-60 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {loading ? "Logging in…" : "Login"}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              className={
                isDark
                  ? "text-sm underline underline-offset-2 opacity-90 hover:opacity-100"
                  : "text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
              }
            >
              Use test creds
            </button>
          </div>

          {/* Helper */}
          <div
            className={`pt-3 text-xs space-y-1 ${
              isDark ? "text-white/60" : "text-slate-500"
            }`}
          >
            <p>
              <b>Tip:</b> The role toggle is a UI hint. Your access is decided by your
              account’s role on the server.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}