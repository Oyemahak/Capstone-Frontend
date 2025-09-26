// src/portals/admin/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "@/lib/api.js";

async function apiGet(path){ const r=await fetch(`${API_BASE}${path}`,{credentials:"include"}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}

export default function Projects() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    try { const d = await apiGet("/projects"); setList(d.projects || []); setErr(""); }
    catch(e){ setErr(e.message); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return list.filter(p => {
      const m1 = !q || `${p.title} ${p.summary}`.toLowerCase().includes(q.toLowerCase());
      const m2 = !status || p.status === status;
      return m1 && m2;
    });
  }, [list, q, status]);

  return (
    <div className="px-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold">Projects</h2>
        <button className="btn btn-primary opacity-60 cursor-not-allowed" title="Add later">New (coming soon)</button>
      </div>

      <div className="card-surface p-4 mb-4 grid md:grid-cols-[1fr_200px] gap-3">
        <input className="form-input" placeholder="Search title/summary…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="form-input bg-transparent" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {err && <div className="mb-3 text-rose-400 text-sm">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Client</th><th>Developer</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-white/5">
                <td><Link to={`/admin/projects/${p._id}`} className="underline">{p.title}</Link></td>
                <td className="text-white/80">{p.client?.name || "—"}</td>
                <td className="text-white/80">{p.developer?.name || "—"}</td>
                <td><span className="badge">{p.status}</span></td>
              </tr>
            ))}
            {filtered.length===0 && (
              <tr><td colSpan="4" className="text-white/70 py-6 px-4">No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}