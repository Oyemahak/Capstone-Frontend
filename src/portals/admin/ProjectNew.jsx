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
      try { const d = await admin.users(); setUsers(d.users || []); }
      catch (e) { setErr(e.message); }
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
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">New Project</h2>
        <div />
      </div>

      <form onSubmit={submit} className="card card-pad-lg form-wide">
        {err && <div className="text-error">{err}</div>}

        <label className="form-field">
          <div className="form-label">Title</div>
          <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} required />
        </label>

        <label className="form-field">
          <div className="form-label">Summary</div>
          <textarea className="form-input form-textarea" value={form.summary} onChange={e => set("summary", e.target.value)} />
        </label>

        <div className="form-grid-3">
          <label className="form-field">
            <div className="form-label">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="form-field">
            <div className="form-label">Client</div>
            <select className="form-input bg-transparent" value={form.client} onChange={e => set("client", e.target.value)}>
              <option value="">— Unassigned —</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
            </select>
          </label>

          <label className="form-field">
            <div className="form-label">Developer</div>
            <select className="form-input bg-transparent" value={form.developer} onChange={e => set("developer", e.target.value)}>
              <option value="">— Unassigned —</option>
              {devs.map(d => <option key={d._id} value={d._id}>{d.name} — {d.email}</option>)}
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? "Creating…" : "Create project"}</button>
        </div>
      </form>
    </div>
  );
}