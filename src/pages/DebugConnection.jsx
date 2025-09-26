// src/pages/DebugConnection.jsx
import { useEffect, useState } from "react";
import { API_BASE, debug } from "@/lib/api.js";

export default function DebugConnection() {
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
    <div className="px-4 md:px-6 lg:px-8 py-12 space-y-6">
      <div className="text-xl font-semibold">Debug / Connection</div>
      <div className="text-sm">API Base: <code>{API_BASE}</code></div>
      <div className="text-sm">{ok}</div>

      <div className="border rounded-2xl p-4 max-w-lg space-y-3 bg-black/20">
        <div className="font-medium">One-time Seed (test users)</div>
        <div className="text-xs text-white/60">
          Creates if missing:
          <br />Admin: admin@mspixel.pulse / admin
          <br />Client: client@mspixel.pulse / client
          <br />Developer: dev@mspixel.pulse / developer
        </div>
        <button className="bg-brand text-black rounded px-4 py-2" onClick={seed}>Seed users</button>
        {seedMsg && <div className="text-xs">{seedMsg}</div>}
      </div>
    </div>
  );
}