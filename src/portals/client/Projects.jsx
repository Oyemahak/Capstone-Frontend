// src/portals/client/Projects.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

export default function Projects() {
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
      const mine = (d.projects || []).filter((p) => p.client?._id === user?._id);
      setRows(mine);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await api.list();
        const mine = (d.projects || []).filter((p) => p.client?._id === user?._id);
        if (alive) setRows(mine);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load");
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?._id]);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter(
      (p) =>
        !n ||
        `${p.title} ${p.summary} ${p.status} ${p.developer?.name || ""}`.toLowerCase().includes(n)
    );
  }, [rows, q]);

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">My Projects</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface card-pad filters-grid">
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

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-20">Status</th>
              <th className="w-24">Developer</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="table-row-hover">
                <td>
                  <div className="font-semibold">{p.title}</div>
                  {p.summary && (
                    <div className="row-sub line-clamp-1">{p.summary}</div>
                  )}
                </td>
                <td>
                  <span className="badge capitalize">{p.status}</span>
                </td>
                <td className="text-white/80">{p.developer?.name || "—"}</td>
                <td className="actions-cell">
                  <Link
                    to={`/client/projects/${p._id}`}
                    className="btn btn-outline btn-sm"
                    title="Open project"
                  >
                    Open
                  </Link>
                  <Link
                    to={`/client/discussions/${p._id}`}
                    className="btn btn-primary btn-sm ml-2"
                    title="Go to discussions"
                  >
                    Discuss
                  </Link>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="4" className="empty-cell">
                  No projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}