// src/pages/auth/Register.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const TABS = [
  { key: "client",    label: "Client" },
  { key: "developer", label: "Developer" },
  { key: "admin",     label: "Admin" },
];

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [tab, setTab] = useState("client");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() =>
    !form.name.trim() || !form.email.trim() || form.password.length < 4 || loading
  , [form, loading]);

  const change = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setOk(""); setLoading(true);
    try {
      await register({ ...form, role: tab });
      setOk("Request submitted. Await admin approval.");
      setTimeout(() => nav("/login", { replace: true }), 900);
    } catch (ex) {
      setErr(ex?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-14">
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 backdrop-blur-md">
        <div className="px-6 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-white/60 mt-1">Choose a role. An admin will approve your request.</p>
        </div>

        <div className="px-6 pt-5">
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
                    selected ? "text-white bg-white/15" : "text-white/80 hover:text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={onSubmit} className="px-6 pt-5 pb-6 space-y-4">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Full name</div>
            <input
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-white placeholder-white/35 outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              placeholder="Jane Smith"
              value={form.name}
              onChange={change("name")}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Email</div>
            <input
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-white placeholder-white/35 outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              placeholder="you@example.com"
              value={form.email}
              onChange={change("email")}
              inputMode="email"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Password</div>
            <input
              type="password"
              className="w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-white placeholder-white/35 outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400/60"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={change("password")}
              autoComplete="new-password"
            />
          </label>

          {err && <div className="text-sm text-rose-400">{err}</div>}
          {ok && <div className="text-sm text-emerald-400">{ok}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={disabled}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium
                         bg-emerald-500 text-black shadow-sm transition
                         hover:bg-emerald-600 active:translate-y-[1px]
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/70
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting…" : "Submit Request"}
            </button>

            <Link to="/login" className="text-sm underline underline-offset-2 opacity-90 hover:opacity-100">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}