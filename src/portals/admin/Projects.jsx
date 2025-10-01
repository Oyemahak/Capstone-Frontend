// src/portals/admin/Projects.jsx
import { useEffect, useMemo, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { admin, projects as api } from "@/lib/api.js";
import { Pencil, Trash2, X, Plus, Wand2, MessageSquare } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [openEditId, setOpenEditId] = useState(null);
  const [busyId, setBusyId] = useState("");

  const [form, setForm] = useState({
    title: "", summary: "", status: "draft", client: "", developer: "",
  });
  const setF = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  async function load() {
    setLoading(true); setErr("");
    try { const [p, u] = await Promise.all([api.list(), admin.users()]); setProjects(p.projects || []); setUsers(u.users || []); }
    catch (e) { setErr(e.message || "Failed to fetch"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const clients = useMemo(() => users.filter((u) => u.role === "client"), [users]);
  const devs = useMemo(() => users.filter((u) => u.role === "developer"), [users]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (projects || []).filter((p) => {
      const m1 = !needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle);
      const m2 = !status || p.status === status;
      return m1 && m2;
    });
  }, [projects, q, status]);

  async function onCreate(e) {
    e.preventDefault(); setErr("");
    try {
      const payload = {
        title: form.title.trim(),
        summary: (form.summary || "").trim(),
        status: form.status,
        client: form.client || null,
        developer: form.developer || null,
      };
      await api.create(payload);
      setShowNew(false);
      setForm({ title: "", summary: "", status: "draft", client: "", developer: "" });
      await load();
    } catch (e2) { setErr(e2.message); }
  }

  function EditorRow({ p }) {
    const [local, setLocal] = useState({
      title: p.title || "", summary: p.summary || "", status: p.status || "draft",
      client: p.client?._id || "", developer: p.developer?._id || "",
    });
    const setL = (k, v) => setLocal((s) => ({ ...s, [k]: v }));

    async function save() {
      setBusyId(p._id); setErr("");
      try {
        const patch = {
          title: local.title.trim(),
          summary: (local.summary || "").trim(),
          status: local.status,
          client: local.client || null,
          developer: local.developer || null,
        };
        await api.update(p._id, patch);
        setOpenEditId(null);
        await load();
      } catch (e) { setErr(e.message); }
      finally { setBusyId(""); }
    }

    return (
      <tr className="row-edit">
        <td colSpan={4}>
          <div className="form-grid-2">
            <label className="form-field">
              <div className="form-label">Title</div>
              <input className="form-input" value={local.title} onChange={(e) => setL("title", e.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Status</div>
              <select className="form-input bg-transparent" value={local.status} onChange={(e) => setL("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="form-field form-span-2">
              <div className="form-label">Summary</div>
              <textarea className="form-input form-textarea-sm" value={local.summary} onChange={(e) => setL("summary", e.target.value)} />
            </label>

            <label className="form-field">
              <div className="form-label">Client</div>
              <select className="form-input bg-transparent" value={local.client} onChange={(e) => setL("client", e.target.value)}>
                <option value="">— Unassigned —</option>
                {clients.map((c) => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
              </select>
            </label>

            <label className="form-field">
              <div className="form-label">Developer</div>
              <select className="form-input bg-transparent" value={local.developer} onChange={(e) => setL("developer", e.target.value)}>
                <option value="">— Unassigned —</option>
                {devs.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.email}</option>)}
              </select>
            </label>
          </div>

          <div className="form-actions mt-tight">
            <button className="btn btn-primary" onClick={save} disabled={busyId === p._id}>
              {busyId === p._id ? "Saving…" : "Save changes"}
            </button>
            <button className="btn btn-outline" onClick={() => setOpenEditId(null)} disabled={busyId === p._id}>
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  async function onDelete(id) {
    if (!confirm("Delete this project?")) return;
    setBusyId(id); setErr("");
    try { await api.remove(id); await load(); }
    catch (e) { setErr(e.message); }
    finally { setBusyId(""); }
  }

  async function seedDemo() {
    setErr("");
    try {
      const c = users.find((x) => x.role === "client" && /sukhdeep/i.test(x.name || ""));
      const demo = [
        { title: "CanSTEM Education (Private School)", summary: "WordPress site for a private STEM school.", status: "completed" },
        { title: "Aimze Studio — Salon & Spa", summary: "WordPress salon site with services & bookings.", status: "completed", client: c?._id || null },
        { title: "MahakPatel.com", summary: "Personal portfolio built in React.", status: "completed" },
        { title: "Portfolio (Wix)", summary: "Alternate portfolio built using Wix.", status: "completed" },
      ];
      for (const d of demo) await api.create(d);
      await load();
      alert("Demo projects added.");
    } catch (e) { setErr(e.message); }
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <h2 className="page-title">Projects</h2>
        <div />
      </div>

      {/* Create form (optional) */}
      {showNew && (
        <form onSubmit={onCreate} className="card card-pad form-grid-2">
          <label className="form-field form-span-2">
            <div className="form-label">Title</div>
            <input className="form-input" value={form.title} onChange={(e) => setF("title", e.target.value)} required />
          </label>

          <label className="form-field form-span-2">
            <div className="form-label">Summary</div>
            <textarea className="form-input form-textarea-sm" value={form.summary} onChange={(e) => setF("summary", e.target.value)} />
          </label>

          <label className="form-field">
            <div className="form-label">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={(e) => setF("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="form-field">
            <div className="form-label">Client</div>
            <select className="form-input bg-transparent" value={form.client} onChange={(e) => setF("client", e.target.value)}>
              <option value="">— Unassigned —</option>
              {clients.map((c) => <option key={c._id} value={c._id}>{c.name} — {c.email}</option>)}
            </select>
          </label>

          <label className="form-field">
            <div className="form-label">Developer</div>
            <select className="form-input bg-transparent" value={form.developer} onChange={(e) => setF("developer", e.target.value)}>
              <option value="">— Unassigned —</option>
              {devs.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.email}</option>)}
            </select>
          </label>

          <div className="form-actions form-span-2">
            <button className="btn btn-primary">Create</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="card card-pad filters-grid">
        <input className="form-input" placeholder="Search title/summary…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="form-input bg-transparent" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {err && <div className="text-error">{err}</div>}

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Name</th>
              <th className="w-24">Client</th>
              <th className="w-24">Developer</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <Fragment key={p._id}>
                <tr className="table-row-hover">
                  <td>
                    <Link to={`/admin/projects/${p._id}`} className="row-link">{p.title}</Link>
                    {p.summary && <div className="row-sub">{p.summary}</div>}
                  </td>
                  <td className="text-muted">{p.client?.name || "—"}</td>
                  <td className="text-muted">{p.developer?.name || "—"}</td>
                  <td className="actions-cell">
                    <span className="badge mr-2 capitalize">{p.status}</span>

                    {/* NEW: open chat for this project */}
                    <Link className="icon-btn mr-1" title="Open discussion" to={`/admin/discussions/${p._id}`}>
                      <MessageSquare size={16} />
                    </Link>

                    <button
                      className="icon-btn mr-1"
                      title={openEditId === p._id ? "Close editor" : "Edit inline"}
                      onClick={() => setOpenEditId((v) => (v === p._id ? null : p._id))}
                    >
                      {openEditId === p._id ? <X size={16} /> : <Pencil size={16} />}
                    </button>

                    <button
                      className="icon-btn text-rose-300"
                      title="Delete"
                      disabled={busyId === p._id}
                      onClick={() => onDelete(p._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>

                {openEditId === p._id && <EditorRow p={p} />}
              </Fragment>
            ))}

            {!filtered.length && (
              <tr><td colSpan="4" className="empty-cell">{loading ? "Loading…" : "No projects yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="toolbar-bottom">
        <button className="btn btn-outline" onClick={seedDemo} title="Seed demo projects">
          <Wand2 className="mr-2" size={16} /> Seed demo
        </button>
        <button className="btn btn-primary" onClick={() => setShowNew((v) => !v)} title="Create a new project">
          <Plus className="mr-2" size={16} /> {showNew ? "Close form" : "New project"}
        </button>
      </div>
    </div>
  );
}