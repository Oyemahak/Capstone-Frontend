import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext.jsx";

function prettyError(err) {
  const msg = (err?.message || "").toLowerCase();
  if (msg.includes("failed to fetch") || msg.includes("networkerror")) {
    return "Couldn’t reach the server. Check VITE_API_BASE and that the backend is running.";
  }
  if (msg.includes("cors")) return "Blocked by CORS. Check CORS_ORIGIN on the backend.";
  if (msg.includes("account not approved")) return "Your account is pending approval by an admin.";
  if (msg.includes("invalid credentials")) return "Email or password is incorrect.";
  return err?.message || "Login failed. Please try again.";
}

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const [uiRole, setUiRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectFor = useMemo(
    () => ({ admin: "/admin", developer: "/dev", client: "/client" }),
    []
  );

  function resolveTarget(afterRoleRoute) {
    const from = location.state?.from;
    // If we came here directly (no from) or from auth pages, ignore and go to the role default.
    if (!from || from.startsWith("/login") || from.startsWith("/register")) {
      return afterRoleRoute;
    }
    // If “from” exists and is not an auth page, honor it.
    return from;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { token, user } = await api.login(email.trim(), password);

      const payload = {
        token,
        role: user.role,
        name: user.name,
        email: user.email,
        _id: user._id,
      };
      localStorage.setItem("auth", JSON.stringify(payload));
      setAuth(payload);

      const defaultPath = redirectFor[user.role] || "/client";
      nav(resolveTarget(defaultPath), { replace: true });
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
        <p className="text-sm text-white/60 mt-1">Choose your role, then enter your credentials.</p>

        <div className="mt-5 inline-flex rounded-xl border border-white/10 overflow-hidden">
          {["client", "developer", "admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setUiRole(r)}
              className={[
                "px-4 py-2 text-sm capitalize",
                uiRole === r ? "bg-emerald-500/20 text-emerald-200" : "bg-transparent text-white/80 hover:bg-white/5",
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
          The role toggle is a UI hint. Your access is decided by your account’s role on the server.
        </p>
      </form>
    </div>
  );
}