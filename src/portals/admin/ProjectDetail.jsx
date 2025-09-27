import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { admin, projects as api } from "@/lib/api.js";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const nav = useNavigate();

  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [p, u] = await Promise.all([ api.one(projectId), admin.users() ]);
        if (!live) return;
        setProject(p.project || p);
        setUsers(u.users || []);
      } catch (e) { if (live) setErr(e.message); }
    })();
    return () => { live = false; };
  }, [projectId]);

  const clients = useMemo(() => users.filter(u => u.role === "client"), [users]);
  const devs    = useMemo(() => users.filter(u => u.role === "developer"), [users]);

  async function patch(body){
    try {
      const d = await api.update(projectId, body);
      setProject(d.project || d);
      setOk("Saved");
      setTimeout(()=>setOk(""), 1200);
    } catch(e){ setErr(e.message); }
  }

  async function remove(){
    if (!confirm("Delete this project?")) return;
    try {
      await api.remove(projectId);
      nav("/admin/projects", { replace:true });
    } catch(e){ setErr(e.message); }
  }

  if (!project) {
    return <div className="px-4 pb-10">{err ? <div className="text-rose-400">{err}</div> : "Loading…"}</div>;
  }

  return (
    <div className="px-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold">Project</h2>
        <button onClick={remove} className="btn btn-outline">Delete</button>
      </div>

      {ok && <div className="text-emerald-400 text-sm mb-3">{ok}</div>}
      {err && <div className="text-rose-400 text-sm mb-3">{err}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-surface p-6 space-y-4">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Title</div>
            <input
              className="form-input"
              value={project.title || ""}
              onChange={(e)=>setProject(p=>({ ...p, title: e.target.value }))}
              onBlur={()=>patch({ title: (project.title || "").trim() })}
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Summary</div>
            <textarea
              className="form-input" rows={4}
              value={project.summary || ""}
              onChange={(e)=>setProject(p=>({ ...p, summary: e.target.value }))}
              onBlur={()=>patch({ summary: (project.summary || "").trim() })}
            />
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select
              className="form-input bg-transparent"
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
            <select
              className="form-input bg-transparent"
              value={project.client?._id || ""}
              onChange={(e)=>patch({ client: e.target.value || null })}
            >
              <option value="">— Unassigned —</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Developer</div>
            <select
              className="form-input bg-transparent"
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