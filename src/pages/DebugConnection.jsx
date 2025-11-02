// src/pages/DebugConnection.jsx
import { useEffect, useState } from "react";
import { API_BASE, debug } from "@/lib/api.js";
import { useTheme } from "@/lib/theme.js";

export default function DebugConnection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [ok, setOk] = useState("");
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/health`);
        setOk(r.ok ? "API reachable ✅" : `API error ${r.status}`);
      } catch (e) {
        setOk(`Fetch failed: ${e.message}`);
      }
    })();
  }, []);

  async function seed() {
    setSeedMsg("Seeding...");
    try {
      const res = await debug.seedBasic();
      setSeedMsg(res?.message || "Seed completed");
    } catch (e) {
      setSeedMsg(`Seed failed: ${e.message}`);
    }
  }

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] px-4 md:px-6 lg:px-8 py-12 ${
        isDark ? "bg-[rgba(8,9,12,0.15)]" : "bg-slate-50"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Debug / Connection
          </h1>
          <p className={isDark ? "text-white/60" : "text-slate-500"}>
            Quick page to check API health and seed test users.
          </p>
        </div>

        <div
          className={`rounded-2xl border ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
          } p-5 space-y-3 max-w-2xl shadow-sm`}
        >
          <div className={isDark ? "text-sm text-white/70" : "text-sm text-slate-600"}>
            API Base: <code className="font-mono">{API_BASE}</code>
          </div>
          <div
            className={`text-sm font-medium ${
              isDark ? "text-emerald-300" : "text-emerald-600"
            }`}
          >
            {ok}
          </div>
        </div>

        <div
          className={`rounded-2xl max-w-lg p-5 space-y-4 ${
            isDark
              ? "bg-white/3 border border-white/10"
              : "bg-white border border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2
                className={`text-base font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                One-time Seed (test users)
              </h2>
              <p className={isDark ? "text-xs text-white/55" : "text-xs text-slate-500"}>
                Creates admin / client / developer if missing.
              </p>
            </div>
            <button
              onClick={seed}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                isDark
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  : "bg-slate-900 text-white hover:bg-slate-700"
              }`}
            >
              Seed users
            </button>
          </div>

          <div
            className={`text-xs leading-relaxed rounded-lg p-3 ${
              isDark ? "bg-black/20 text-white/70" : "bg-slate-50 text-slate-600"
            }`}
          >
            <div>Admin: <b>admin@mspixel.pulse</b> / <b>admin</b></div>
            <div>Client: <b>client@mspixel.pulse</b> / <b>client</b></div>
            <div>Developer: <b>dev@mspixel.pulse</b> / <b>developer</b></div>
          </div>

          {seedMsg && (
            <div
              className={`text-xs font-medium ${
                isDark ? "text-amber-200" : "text-amber-600"
              }`}
            >
              {seedMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}