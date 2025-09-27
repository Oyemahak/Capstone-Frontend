// src/portals/admin/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { admin, projects as api } from "@/lib/api.js";

export default function Projects() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // create form toggle + form data
  const [showNew, setShowNew] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    status: "draft",
    client: "",
    developer: "",
  });

  function setF(k, v) { setForm((s) => ({ ...s, [k]: v })); }

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [p, u] = await Promise.all([api.list(), admin.list()]);
      setList(p.projects || []);
      const allUsers = Array.isArray(u) ? u : u?.users || [];
      setUsers(allUsers);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const clients = useMemo(() => users.filter(u => u.role === "client"), [users]);
  const devs = useMemo(() => users.filter(u => u.role === "developer"), [users]);

  const filtered = useMemo(() => {
    return (list || []).filter(p => {
      const m1 = !q || `${p.title} ${p.summary}`.toLowerCase().includes(q.toLowerCase());
      const m2 = !status || p.status === status;
      return m1 && m2;
    });
  }, [list, q, status]);

  async function createProject(e) {
    e.preventDefault();
    setErr("");
    try {
      // Create bare project
      const created = await api.create({
        title: form.title.trim(),
        summary: form.summary.trim(),
        status: form.status,
      });
      const p = created.project || created;

      // Assign client/dev if chosen
      const updates = {};
      if (form.client) updates.client = form.client;
      if (form.developer) updates.developer = form.developer;
      if (Object.keys(updates).length) {
        await api.update(p._id, updates);
      }

      setShowNew(false);
      setForm({ title: "", summary: "", status: "draft", client: "", developer: "" });
      await load();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function seedDemo() {
    setErr("");
    try {
      // Try to find Sukhdeep (client)
      const u = await admin.list("?q=sukhdeep");
      const all = Array.isArray(u) ? u : u?.users || [];
      const sukh = all.find(x => x.role === "client" && /sukhdeep/i.test(x.name || ""));

      // Four completed projects
      const completed = [
        {
          title: "CanSTEM Education (Private School)",
          summary: "WordPress site for a private STEM school.",
          status: "completed",
        },
        {
          title: "Aimze Studio — Salon & Spa",
          summary: "WordPress salon site with services & bookings.",
          status: "active", // in progress
        },
        {
          title: "MahakPatel.com",
          summary: "Personal portfolio built in React.",
          status: "completed",
        },
        {
          title: "Portfolio (Wix)",
          summary: "Alternate portfolio built using Wix.",
          status: "completed",
        },
      ];

      // Create each; assign Sukhdeep to Aimze when present
      for (const item of completed) {
        const created = await api.create(item);
        const p = created.project || created;

        if (/Aimze Studio/i.test(item.title) && sukh) {
          await api.update(p._id, { client: sukh._id });
        }
      }

      await load();
      alert("Demo projects added.");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="px-4 pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold">Projects</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={seedDemo}>Seed demo</button>
          <button className="btn btn-primary" onClick={() => setShowNew(v => !v)}>
            {showNew ? "Close" : "New project"}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showNew && (
        <form onSubmit={createProject} className="card-surface p-6 mb-5 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block">
              <div className="text-xs text-white/65 mb-1">Title</div>
              <input className="form-input" value={form.title} onChange={e=>setF("title", e.target.value)} required />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block">
              <div className="text-xs text-white/65 mb-1">Summary</div>
              <textarea className="form-input" rows={3} value={form.summary} onChange={e=>setF("summary", e.target.value)} />
            </label>
          </div>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={e=>setF("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Client</div>
            <select className="form-input bg-transparent" value={form.client} onChange={e=>setF("client", e.target.value)}>
              <option value="">— Unassigned —</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Developer</div>
            <select className="form-input bg-transparent" value={form.developer} onChange={e=>setF("developer", e.target.value)}>
              <option value="">— Unassigned —</option>
              {devs.map(d => <option key={d._id} value={d._id}>{d.name} — {d.email}</option>)}
            </select>
          </label>

          <div className="md:col-span-2">
            <button className="btn btn-primary">Create</button>
          </div>
        </form>
      )}

      {/* Filters */}
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

      {/* List */}
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
            {filtered.length === 0 && (
              <tr><td colSpan="4" className="text-white/70 py-6 px-4">No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}