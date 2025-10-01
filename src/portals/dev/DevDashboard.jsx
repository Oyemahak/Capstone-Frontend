// src/portals/dev/DevDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

/** Local-only helpers so we can show "latest update" until real endpoints exist */
const LSK = (id) => `dev:project:${id}`;
const readLocal = (id) => {
  try { return JSON.parse(localStorage.getItem(LSK(id)) || "{}"); }
  catch { return {}; }
};

export default function DevDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const d = await api.list();
        const mine = (d.projects || []).filter(
          (p) => String(p.developer?._id) === String(user?._id)
        );
        if (alive) {
          setRows(mine);
          setErr("");
        }
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user?._id]);

  const counts = useMemo(() => {
    const total = rows.length;
    const by = (s) => rows.filter((p) => p.status === s).length;
    return { total, active: by("active"), draft: by("draft"), completed: by("completed") };
  }, [rows]);

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">Developer Dashboard</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      {/* KPIs */}
      <div className="grid-3">
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">My projects</div>
          <div className="kpi-value">{counts.total}</div>
        </div>
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">Active</div>
          <div className="kpi-value">{counts.active}</div>
        </div>
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">Completed</div>
          <div className="kpi-value">{counts.completed}</div>
        </div>
      </div>

      {/* Recent projects table */}
      <div className="card-surface overflow-hidden">
        <div className="card-strip between">
          <div className="font-semibold">Recent activity</div>
          <Link className="subtle-link" to="/dev/projects">View all</Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-24">Client</th>
              <th className="w-20">Status</th>
              <th className="w-20">Latest update</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const loc = readLocal(p._id);
              const last =
                (loc.announcements || [])[0]?.title ||
                (loc.progress || [])[0]?.title ||
                "—";
              return (
                <tr key={p._id} className="table-row-hover">
                  <td>
                    {/* Clicking the title goes to the project details page */}
                    <Link to={`/dev/projects/${p._id}`} className="row-link">
                      {p.title}
                    </Link>
                    {p.summary && (
                      <div className="row-sub line-clamp-1">{p.summary}</div>
                    )}
                  </td>
                  <td className="text-white/80">{p.client?.name || "—"}</td>
                  <td>
                    <span className="badge capitalize">{p.status}</span>
                  </td>
                  <td className="text-white/80">{last}</td>
                </tr>
              );
            })}

            {!rows.length && (
              <tr>
                <td colSpan="4" className="empty-cell">
                  {loading ? "Loading…" : "No projects assigned yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}