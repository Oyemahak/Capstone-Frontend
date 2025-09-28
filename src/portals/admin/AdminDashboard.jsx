import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { admin, projects } from "@/lib/api.js";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(0);
  const [projs, setProjs] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [u, pend, p] = await Promise.all([
          admin.users(),
          admin.pending().catch(() => ({ users: [] })),
          projects.list(),
        ]);
        if (!live) return;
        setUsers(u.users || []);
        setPending((pend.users || []).length);
        setProjs(p.projects || []);
        setErr("");
      } catch (e) {
        if (live) setErr(e.message);
      }
    })();
    return () => (live = false);
  }, []);

  const cards = [
    { label: "Total Users", value: users.length, to: "/admin/users" },
    { label: "Pending Approvals", value: pending, to: "/admin/approvals" },
    { label: "Projects", value: projs.length, to: "/admin/projects" },
  ];

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Overview</h2>
        <div />
      </div>

      {err && <div className="text-error mb-4">{err}</div>}

      <div className="grid-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card card-pad kpi-card">
            <div className="kpi-label">{c.label}</div>
            <div className="kpi-value">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid-2 mt-section">
        <div className="card card-pad">
          <div className="card-head">
            <h3 className="card-title">Recent users</h3>
            <Link to="/admin/users" className="subtle-link">View all</Link>
          </div>

          <div className="list">
            {(users || []).slice(0, 6).map((u) => (
              <Link key={u._id} to={`/admin/users/${u._id}`} className="list-row">
                <div>
                  <div className="font-medium">{u.name || "—"}</div>
                  <div className="text-muted-xs">{u.email}</div>
                </div>
                <div className="badge">{u.role}</div>
              </Link>
            ))}
            {!users.length && <div className="empty-note">No users yet.</div>}
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <h3 className="card-title">Recent projects</h3>
            <Link to="/admin/projects" className="subtle-link">View all</Link>
          </div>

          <div className="list">
            {(projs || []).slice(0, 6).map((p) => (
              <Link key={p._id} to={`/admin/projects/${p._id}`} className="list-row">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-muted-xs">{p.summary}</div>
                </div>
                <div className="badge">{p.status}</div>
              </Link>
            ))}
            {!projs.length && <div className="empty-note">No projects yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}