// frontend/src/portals/client/ClientDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

/* read client's per-project requirements (same key used in ProjectDetail) */
const LSK = (pid) => `client:req:${pid}`;
const readReq = (pid) => {
  try {
    return JSON.parse(localStorage.getItem(LSK(pid)) || "{}");
  } catch {
    return {};
  }
};

export default function ClientDashboard() {
  const { user } = useAuth();

  const [rows, setRows] = useState([]);
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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  /* KPIs (simplified: no local requirements/file counts) */
  const kpis = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((p) => p.status === "active").length;
    const completed = rows.filter((p) => p.status === "completed").length;
    return { total, active, completed };
  }, [rows]);

  /* recent projects decorated with local requirement info (for "last saved") */
  const recent = useMemo(() => {
    return [...rows]
      .map((p) => {
        const r = readReq(p._id) || {};
        const savedAt = r.savedAt ? new Date(r.savedAt) : null;
        return { ...p, _savedAt: savedAt };
      })
      .sort((a, b) => (b._savedAt?.getTime() || 0) - (a._savedAt?.getTime() || 0))
      .slice(0, 6);
  }, [rows]);

  const hasAnyLocalReqSave = useMemo(
    () => recent.some((r) => !!r._savedAt),
    [recent]
  );

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">Client Dashboard</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      {/* Primary KPIs */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">My projects</div>
          <div className="kpi-value">{kpis.total}</div>
        </div>
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">Active</div>
          <div className="kpi-value">{kpis.active}</div>
        </div>
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">Completed</div>
          <div className="kpi-value">{kpis.completed}</div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card-surface overflow-hidden">
        <div className="card-strip between">
          <div className="font-semibold">Recent activity</div>
          <Link className="subtle-link" to="/client/projects">
            View all
          </Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-20">Status</th>
              <th className="w-28">Last saved</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p._id} className="table-row-hover">
                <td>
                  <Link to={`/client/projects/${p._id}`} className="row-link">
                    {p.title}
                  </Link>
                  {p.summary && (
                    <div className="row-sub line-clamp-1">{p.summary}</div>
                  )}
                </td>
                <td>
                  <span className="badge capitalize">{p.status}</span>
                </td>
                <td className="text-white/80">
                  {p._savedAt ? p._savedAt.toLocaleString() : "—"}
                </td>
                <td className="actions-cell">
                  <Link
                    to={`/client/projects/${p._id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Open
                  </Link>
                  <Link
                    to={`/client/discussions/${p._id}`}
                    className="btn btn-primary btn-sm ml-2"
                  >
                    Discuss
                  </Link>
                </td>
              </tr>
            ))}
            {!recent.length && (
              <tr>
                <td colSpan="6" className="empty-cell">
                  {rows.length
                    ? "No recent updates. Open a project to add requirements."
                    : "No projects yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Gentle nudge to add requirements (shows only when user has projects but no local saves yet) */}
      {!!rows.length && !hasAnyLocalReqSave && (
        <div className="card-surface card-pad">
          <div className="card-title mb-2">Get started with Requirements</div>
          <div className="text-white/80 mb-3">
            Add pages and upload your logo / brief to help your developer move
            faster.
          </div>
          <div className="flex flex-wrap gap-2">
            {rows.slice(0, 3).map((p) => (
              <Link
                key={p._id}
                to={`/client/projects/${p._id}`}
                className="btn btn-outline btn-sm"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}