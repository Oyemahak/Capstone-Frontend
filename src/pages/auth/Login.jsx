// src/pages/auth/Login.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const TABS = [
  { key: "client",    label: "Client",    email: "client@mspixel.pulse",    password: "client" },
  { key: "developer", label: "Developer", email: "dev@mspixel.pulse",       password: "developer" },
  { key: "admin",     label: "Admin",     email: "admin@mspixel.pulse",     password: "admin" },
];

export default function Login() {
  const { isAuthed, role, login } = useAuth();
  const nav = useNavigate();

  const [tab, setTab] = useState("client");
  const active = useMemo(() => TABS.find((t) => t.key === tab), [tab]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Already authed? bounce to portal
  useEffect(() => {
    if (!isAuthed) return;
    if (role === "admin") nav("/admin", { replace: true });
    else if (role === "developer") nav("/dev", { replace: true });
    else nav("/client", { replace: true });
  }, [isAuthed, role, nav]);

  function fillDemo() {
    if (!active) return;
    setEmail(active.email);
    setPassword(active.password);
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
      setErr(ex?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-14">
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-md">
        {/* Header */}
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-white/60 mt-1">
            Choose your role, then enter your credentials.
          </p>
        </div>

        <div className="px-6 pt-5">
          {/* Segmented Tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/10 border border-white/10">
            {TABS.map((t) => {
              const selected = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={[
                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-emerald-400/70",
                    selected
                      // selected = white text + subtle filled bg (same vibe as hover)
                      ? "text-white bg-white/15"
                      // unselected = white/80 -> white on hover; subtle hover bg
                      : "text-white/80 hover:text-white hover:bg-white/10",
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
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Email</div>
            <input
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-white placeholder-white/35 outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              inputMode="email"
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Password</div>
            <input
              type="password"
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-white placeholder-white/35 outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {err && <div className="text-sm text-rose-400">{err}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium
                         bg-emerald-500 text-black shadow-sm transition
                         hover:bg-emerald-600 active:translate-y-[1px]
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/70
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in…" : "Login"}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              className="text-sm underline underline-offset-2 opacity-90 hover:opacity-100"
            >
              Use test creds
            </button>
          </div>

          {/* Helper */}
          <div className="pt-3 text-xs text-white/60 space-y-1">
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