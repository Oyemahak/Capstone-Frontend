// src/portals/dev/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { MessageSquare } from "lucide-react";

export default function DevProjects() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const d = await api.list();
      setRows((d.projects || []).filter(p => p.developer?._id === user?._id));
    } catch (e) { setErr(e.message || "Failed to fetch"); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [user?._id]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter(p => !n || `${p.title} ${p.summary}`.toLowerCase().includes(n));
  }, [rows, q]);

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Projects</h2>
        <div />
      </div>

      <div className="card-surface p-4 grid md:grid-cols-[1fr_auto] gap-3">
        <input
          className="form-input"
          placeholder="Search projects…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-24">Client</th>
              <th className="w-20">Status</th>
              <th className="w-20 actions-head">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id} className="table-row-hover">
                <td>
                  <Link to={`/dev/projects/${p._id}`} className="row-link">{p.title}</Link>
                  {p.summary && <div className="row-sub line-clamp-1">{p.summary}</div>}
                </td>
                <td className="text-white/80">{p.client?.name || "—"}</td>
                <td><span className="badge capitalize">{p.status}</span></td>
                <td className="actions-cell">
                  <Link className="icon-btn mr-1" title="Open discussion" to={`/dev/discussions/${p._id}`}>
                    <MessageSquare size={16} />
                  </Link>
                  <Link className="btn btn-outline" to={`/dev/projects/${p._id}`}>Open</Link>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan="4" className="empty-cell">{loading ? "Loading…" : "No projects."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}