// src/portals/client/ClientDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { projects as api } from "@/lib/api.js";
import { useAuth } from "@/context/AuthContext.jsx";

/** local helper so you can mock "latest update" until backend endpoints are ready */
const LSK = (id) => `client:project:${id}`;
const readLocal = (id) => {
  try {
    return JSON.parse(localStorage.getItem(LSK(id)) || "{}");
  } catch {
    return {};
  }
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const d = await api.list();
        // client sees only their projects
        const mine = (d.projects || []).filter(
          (p) => p.client?._id === user?._id
        );
        if (alive) setRows(mine);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load");
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?._id]);

  // KPI counts
  const counts = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((p) => p.status === "active").length;
    const completed = rows.filter((p) => p.status === "completed").length;
    return { total, active, completed };
  }, [rows]);

  return (
    <div className="page-shell space-y-6">
      <div className="page-header">
        <h2 className="page-title">Client Dashboard</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      {/* KPI cards */}
      <div className="grid-3">
        <div className="card-surface card-pad kpi-card">
          <div className="kpi-label">My Projects</div>
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

      {/* Recent projects */}
      <div className="card-surface overflow-hidden">
        <div className="card-strip between">
          <div className="font-semibold">Recent Projects</div>
          <Link className="subtle-link" to="/client/projects">
            View all
          </Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-42">Project</th>
              <th className="w-24">Developer</th>
              <th className="w-20">Status</th>
              <th className="w-20">Latest update</th>
              <th className="actions-head">Actions</th>
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
                    <Link
                      to={`/client/projects/${p._id}`}
                      className="row-link font-semibold"
                    >
                      {p.title}
                    </Link>
                    {p.summary && (
                      <div className="row-sub line-clamp-1">{p.summary}</div>
                    )}
                  </td>
                  <td className="text-white/80">
                    {p.developer?.name || "—"}
                  </td>
                  <td>
                    <span className="badge capitalize">{p.status}</span>
                  </td>
                  <td className="text-white/80">{last}</td>
                  <td className="actions-cell">
                    <Link
                      to={`/client/projects/${p._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Details
                    </Link>
                    <Link
                      to={`/client/discussions/${p._id}`}
                      className="btn btn-primary btn-sm ml-2"
                    >
                      Discuss
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No projects assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}