// src/portals/admin/ProjectDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "@/lib/api.js";

async function apiGet(path){ const r=await fetch(`${API_BASE}${path}`,{credentials:"include"}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}
async function apiJson(path, method, body){ const r=await fetch(`${API_BASE}${path}`,{method,credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [ok, setOk] = useState(""); const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [p, u] = await Promise.all([ apiGet(`/projects/${projectId}`), apiGet("/admin/users") ]);
        if (!live) return;
        setProject(p.project); setUsers(u.users||[]);
      } catch (e){ if (live) setErr(e.message); }
    })();
    return () => (live=false);
  }, [projectId]);

  const clients = useMemo(() => users.filter(u=>u.role==="client"), [users]);
  const devs    = useMemo(() => users.filter(u=>u.role==="developer"), [users]);

  async function patch(body){
    try { const d = await apiJson(`/projects/${projectId}`, "PATCH", body); setProject(d.project); setOk("Saved"); setTimeout(()=>setOk(""), 1200);}
    catch(e){ setErr(e.message); }
  }

  if (!project) return <div className="px-4 pb-10">{err ? <div className="text-rose-400">{err}</div> : "Loading…"}</div>;

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">Project</h2>

      {ok && <div className="text-emerald-400 text-sm mb-3">{ok}</div>}
      {err && <div className="text-rose-400 text-sm mb-3">{err}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-surface p-6 space-y-4">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Title</div>
            <input className="form-input"
              value={project.title || ""}
              onChange={(e)=>setProject(p=>({ ...p, title: e.target.value }))}
              onBlur={()=>patch({ title: project.title })}
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Summary</div>
            <textarea rows={4} className="form-input"
              value={project.summary || ""}
              onChange={(e)=>setProject(p=>({ ...p, summary: e.target.value }))}
              onBlur={()=>patch({ summary: project.summary })}
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select className="form-input bg-transparent"
              value={project.status || "draft"}
              onChange={(e)=>patch({ status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        <div className="card-surface p-6 space-y-4">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Client</div>
            <select className="form-input bg-transparent"
              value={project.client?._id || ""}
              onChange={(e)=>patch({ client: e.target.value || null })}
            >
              <option value="">— Unassigned —</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Developer</div>
            <select className="form-input bg-transparent"
              value={project.developer?._id || ""}
              onChange={(e)=>patch({ developer: e.target.value || null })}
            >
              <option value="">— Unassigned —</option>
              {devs.map(d => <option key={d._id} value={d._id}>{d.name} — {d.email}</option>)}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}