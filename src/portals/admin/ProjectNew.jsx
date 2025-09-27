import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { admin, projects as apiProjects } from "@/lib/api.js";

export default function ProjectNew() {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    status: "active",
    client: "",
    developer: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const d = await admin.users();
        setUsers(d.users || []);
      } catch (e) { setErr(e.message); }
    })();
  }, []);

  const clients = useMemo(() => users.filter(u => u.role === "client"), [users]);
  const devs = useMemo(() => users.filter(u => u.role === "developer"), [users]);
  function set(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        status: form.status,
        client: form.client || null,
        developer: form.developer || null,
      };
      const res = await apiProjects.create(payload);
      const pr = res.project || res;
      nav(`/admin/projects/${pr._id}`, { replace: true });
    } catch (e2) { setErr(e2.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">New project</h2>

      <form onSubmit={submit} className="card-surface p-6 max-w-2xl space-y-4">
        {err && <div className="text-rose-400 text-sm">{err}</div>}

        <label className="block">
          <div className="text-xs text-white/65 mb-1">Title</div>
          <input className="form-input" value={form.title} onChange={e=>set("title", e.target.value)} required />
        </label>
        <label className="block">
          <div className="text-xs text-white/65 mb-1">Summary</div>
          <textarea className="form-input" rows={4} value={form.summary} onChange={e=>set("summary", e.target.value)} />
        </label>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={e=>set("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Client</div>
            <select className="form-input bg-transparent" value={form.client} onChange={e=>set("client", e.target.value)}>
              <option value="">— Unassigned —</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
            </select>
          </label>
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Developer</div>
            <select className="form-input bg-transparent" value={form.developer} onChange={e=>set("developer", e.target.value)}>
              <option value="">— Unassigned —</option>
              {devs.map(d => <option key={d._id} value={d._id}>{d.name} — {d.email}</option>)}
            </select>
          </label>
        </div>

        <div className="pt-1">
          <button className="btn btn-primary" disabled={busy}>{busy ? "Creating…" : "Create project"}</button>
        </div>
      </form>
    </div>
  );
}