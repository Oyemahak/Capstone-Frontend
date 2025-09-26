// src/portals/client/ClientDashboard.jsx
import { useEffect, useState } from "react";
import { projects } from "@/lib/api.js";

export default function ClientDashboard() {
  const [list, setList] = useState([]);
  useEffect(() => { (async()=>{ const l = await projects.list(); setList(Array.isArray(l)?l:(l?.projects||[])); })(); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My Projects</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {list.map(p=>(
          <li key={p._id} className="border border-white/10 rounded-2xl p-4 bg-black/20">
            <div className="font-semibold">{p.title}</div>
            <div className="text-xs text-white/60 capitalize">Status: {p.status}</div>
            <div className="text-sm mt-2">{p.summary || "—"}</div>
          </li>
        ))}
        {!list.length && <div className="text-white/60">No projects yet.</div>}
      </ul>
    </div>
  );
}