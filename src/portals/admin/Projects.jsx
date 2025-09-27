// src/portals/admin/Projects.jsx
import { useEffect, useMemo, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { admin, projects as api } from "@/lib/api.js";
import { Pencil, Trash2, X, Plus, Wand2 } from "lucide-react";

export default function Projects() {
  // data
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [openEditId, setOpenEditId] = useState(null);
  const [busyId, setBusyId] = useState(""); // disable row while saving

  // create form
  const [form, setForm] = useState({
    title: "",
    summary: "",
    status: "draft",
    client: "",
    developer: "",
  });
  const setF = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  // load from API
  async function load() {
    setLoading(true);
    setErr("");
    try {
      const [p, u] = await Promise.all([api.list(), admin.users()]);
      setProjects(p.projects || []);
      setUsers(u.users || []);
    } catch (e) {
      setErr(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  // helpers
  const clients = useMemo(() => users.filter((u) => u.role === "client"), [users]);
  const devs = useMemo(() => users.filter((u) => u.role === "developer"), [users]);

  // search + status filter
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (projects || []).filter((p) => {
      const m1 = !needle || `${p.title} ${p.summary}`.toLowerCase().includes(needle);
      const m2 = !status || p.status === status;
      return m1 && m2;
    });
  }, [projects, q, status]);

  /* ---------------- Create ---------------- */
  async function onCreate(e) {
    e.preventDefault();
    setErr("");
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
    } catch (e2) {
      setErr(e2.message);
    }
  }

  /* ---------------- Update (inline editor) ---------------- */
  function EditorRow({ p }) {
    const [local, setLocal] = useState({
      title: p.title || "",
      summary: p.summary || "",
      status: p.status || "draft",
      client: p.client?._id || "",
      developer: p.developer?._id || "",
    });
    const setL = (k, v) => setLocal((s) => ({ ...s, [k]: v }));

    async function save() {
      setBusyId(p._id);
      setErr("");
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
      } catch (e) {
        setErr(e.message);
      } finally {
        setBusyId("");
      }
    }

    return (
      <tr className="bg-white/5">
        <td colSpan={4} className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-xs text-white/65 mb-1">Title</div>
              <input
                className="form-input"
                value={local.title}
                onChange={(e) => setL("title", e.target.value)}
              />
            </label>

            <label className="block">
              <div className="text-xs text-white/65 mb-1">Status</div>
              <select
                className="form-input bg-transparent"
                value={local.status}
                onChange={(e) => setL("status", e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <div className="text-xs text-white/65 mb-1">Summary</div>
              <textarea
                className="form-input"
                rows={3}
                value={local.summary}
                onChange={(e) => setL("summary", e.target.value)}
              />
            </label>

            <label className="block">
              <div className="text-xs text-white/65 mb-1">Client</div>
              <select
                className="form-input bg-transparent"
                value={local.client}
                onChange={(e) => setL("client", e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.email}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="text-xs text-white/65 mb-1">Developer</div>
              <select
                className="form-input bg-transparent"
                value={local.developer}
                onChange={(e) => setL("developer", e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {devs.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — {d.email}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={busyId === p._id}
            >
              {busyId === p._id ? "Saving…" : "Save changes"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setOpenEditId(null)}
              disabled={busyId === p._id}
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  /* ---------------- Delete ---------------- */
  async function onDelete(id) {
    if (!confirm("Delete this project?")) return;
    setBusyId(id);
    setErr("");
    try {
      await api.remove(id);
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyId("");
    }
  }

  /* ---------------- Seed demo ---------------- */
  async function seedDemo() {
    setErr("");
    try {
      const c = users.find(
        (x) => x.role === "client" && /sukhdeep/i.test(x.name || "")
      );

      const demo = [
        { title: "CanSTEM Education (Private School)", summary: "WordPress site for a private STEM school.", status: "completed" },
        { title: "Aimze Studio — Salon & Spa", summary: "WordPress salon site with services & bookings.", status: "completed", client: c?._id || null },
        { title: "MahakPatel.com", summary: "Personal portfolio built in React.", status: "completed" },
        { title: "Portfolio (Wix)", summary: "Alternate portfolio built using Wix.", status: "completed" },
      ];

      for (const d of demo) await api.create(d);
      await load();
      alert("Demo projects added.");
    } catch (e) {
      setErr(e.message);
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="page-shell space-y-5">
      {/* Page title */}
      <div className="page-header">
        <h2 className="page-title">Projects</h2>
        <div />
      </div>

      {/* Create form (collapsible) */}
      {showNew && (
        <form onSubmit={onCreate} className="card-surface p-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block">
              <div className="text-xs text-white/65 mb-1">Title</div>
              <input className="form-input" value={form.title} onChange={(e) => setF("title", e.target.value)} required />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block">
              <div className="text-xs text-white/65 mb-1">Summary</div>
              <textarea className="form-input" rows={3} value={form.summary} onChange={(e) => setF("summary", e.target.value)} />
            </label>
          </div>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={(e) => setF("status", e.target.value)}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Client</div>
            <select className="form-input bg-transparent" value={form.client} onChange={(e) => setF("client", e.target.value)}>
              <option value="">— Unassigned —</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name} — {c.email}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Developer</div>
            <select className="form-input bg-transparent" value={form.developer} onChange={(e) => setF("developer", e.target.value)}>
              <option value="">— Unassigned —</option>
              {devs.map((d) => (
                <option key={d._id} value={d._id}>{d.name} — {d.email}</option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <button className="btn btn-primary">Create</button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="card-surface p-4 grid md:grid-cols-[1fr_200px] gap-3">
        <input
          className="form-input"
          placeholder="Search title/summary…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="form-input bg-transparent"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {err && <div className="text-rose-400 text-sm">{err}</div>}

      {/* List */}
      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-[42%]">Name</th>
              <th className="w-[24%]">Client</th>
              <th className="w-[24%]">Developer</th>
              <th className="w-[10%] text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <Fragment key={p._id}>
                <tr className="table-row-hover">
                  <td>
                    {/* clean title, no underline; still clickable */}
                    <Link to={`/admin/projects/${p._id}`} className="font-medium hover:text-primary">
                      {p.title}
                    </Link>
                    {p.summary && (
                      <div className="text-xs text-white/60 mt-0.5 leading-5 line-clamp-1">
                        {p.summary}
                      </div>
                    )}
                  </td>
                  <td className="text-white/80">{p.client?.name || "—"}</td>
                  <td className="text-white/80">{p.developer?.name || "—"}</td>
                  <td className="whitespace-nowrap pr-4">
                    <span className="badge mr-2 capitalize">{p.status}</span>
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
              <tr>
                <td colSpan="4" className="text-white/70 py-6 px-5">
                  {loading ? "Loading…" : "No projects yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button className="btn btn-outline" onClick={seedDemo} title="Seed demo projects">
          <Wand2 className="mr-2" size={16} /> Seed demo
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setShowNew((v) => !v)}
          title="Create a new project"
        >
          <Plus className="mr-2" size={16} /> {showNew ? "Close form" : "New project"}
        </button>
      </div>
    </div>
  );
}