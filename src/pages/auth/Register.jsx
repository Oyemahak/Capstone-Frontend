// src/pages/auth/Register.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { useTheme } from "@/lib/theme.js";

const TABS = [
  { key: "client", label: "Client" },
  { key: "developer", label: "Developer" },
  { key: "admin", label: "Admin" },
];

export default function Register() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const nav = useNavigate();

  const [tab, setTab] = useState("client");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(
    () =>
      !form.name.trim() ||
      !form.email.trim() ||
      form.password.length < 4 ||
      loading,
    [form, loading]
  );

  const change = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
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
        <div className="px-6 pt-6">
          <h1
            className={`text-2xl font-semibold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Create an account
          </h1>
          <p className={isDark ? "text-sm text-white/60 mt-1" : "text-sm text-slate-500 mt-1"}>
            Choose a role. An admin will approve your request.
          </p>
        </div>

        {/* Role tabs */}
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
          <label className="block">
            <div className={isDark ? "text-xs text-white/65 mb-1" : "text-xs text-slate-600 mb-1"}>
              Full name
            </div>
            <input
              className={`w-full rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400/70 ${
                isDark
                  ? "bg-black/30 border border-white/15 text-white placeholder-white/35 focus:border-emerald-400/60"
                  : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-400/60"
              }`}
              placeholder="First Last"
              value={form.name}
              onChange={change("name")}
              autoComplete="name"
            />
          </label>

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
              value={form.email}
              onChange={change("email")}
              inputMode="email"
              autoComplete="email"
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
              placeholder="Choose a strong password"
              value={form.password}
              onChange={change("password")}
              autoComplete="new-password"
            />
          </label>

          {err && (
            <div className={isDark ? "text-sm text-rose-300" : "text-sm text-rose-600"}>
              {err}
            </div>
          )}
          {ok && (
            <div className={isDark ? "text-sm text-emerald-300" : "text-sm text-emerald-600"}>
              {ok}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={disabled}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 disabled:opacity-60 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-emerald-500 text-black hover:bg-emerald-400"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {loading ? "Submitting…" : "Submit Request"}
            </button>

            <Link
              to="/login"
              className={
                isDark
                  ? "text-sm underline underline-offset-2 opacity-90 hover:opacity-100"
                  : "text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
              }
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}