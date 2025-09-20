import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";

/**
 * Small helper to surface clearer messages for common network/CORS issues.
 */
function prettyError(err) {
  const msg = (err?.message || "").toLowerCase();

  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Couldn’t reach the server. If you’re on localhost, make sure the backend URL in .env is correct and running.";
  }
  if (msg.includes("cors")) {
    return "Blocked by CORS. Check CORS_ORIGIN on the backend matches this site’s URL.";
  }
  if (msg.includes("account not approved")) {
    return "Your account is pending approval. An admin needs to activate it first.";
  }
  if (msg.includes("invalid credentials")) {
    return "Email or password is incorrect.";
  }
  return err?.message || "Login failed. Please try again.";
}

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const backTo = location.state?.from || "/";

  // purely UI; the server decides the real role after login
  const [uiRole, setUiRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill email domain for convenience when switching roles (optional nicety)
  useEffect(() => {
    if (!email) return;
    // no-op, keep user input; this hook is mainly placeholder if later you want smart defaults
  }, [uiRole]); // eslint-disable-line

  // compute where to go based on the **actual** role returned by server
  const redirectFor = useMemo(
    () => ({
      admin: "/admin",       // your admin dashboard route (when you add it)
      developer: "/client",  // placeholder: dev portal can later be /dev
      client: "/client"
    }),
    []
  );

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { token, user } = await api.login(email.trim(), password);
      // Persist auth
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token,
          role: user.role,
          name: user.name,
          email: user.email,
          id: user._id,
        })
      );

      // Decide destination:
      // if they were kicked to /login from a protected route, go back there;
      // otherwise, go to the default dashboard for their actual role.
      const defaultPath = redirectFor[user.role] || "/client";
      const target = backTo === "/login" ? defaultPath : backTo;
      nav(target, { replace: true });
    } catch (e2) {
      setErr(prettyError(e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[72vh] grid place-items-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur"
      >
        <h1 className="text-2xl font-extrabold tracking-tight">Sign in</h1>
        <p className="text-sm text-white/60 mt-1">
          Choose your role, then enter your credentials.
        </p>

        {/* UI-only Role Toggle */}
        <div className="mt-5 inline-flex rounded-xl border border-white/10 overflow-hidden">
          {["client", "developer", "admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setUiRole(r)}
              className={[
                "px-4 py-2 text-sm capitalize",
                uiRole === r ? "bg-emerald-500/20 text-emerald-200" : "bg-transparent text-white/80 hover:bg-white/5"
              ].join(" ")}
            >
              {r}
            </button>
          ))}
        </div>

        {err && (
          <div className="mt-4 rounded-lg bg-rose-500/15 border border-rose-500/30 px-3 py-2 text-sm text-rose-200">
            {err}
          </div>
        )}

        <label className="block text-sm mt-5 mb-1">Email</label>
        <input
          type="email"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={uiRole === "admin" ? "admin@mspixel.plus" : "you@example.com"}
          required
          autoComplete="username"
        />

        <label className="block text-sm mt-4 mb-1">Password</label>
        <input
          type="password"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors px-4 py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login"}
        </button>

        <p className="text-xs text-white/50 mt-4">
          The role toggle is just a UI hint. Your access is determined by your account’s actual role on the server.
        </p>
      </form>
    </div>
  );
}