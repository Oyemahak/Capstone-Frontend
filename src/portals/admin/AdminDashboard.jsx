// src/portals/admin/AdminDashboard.jsx
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
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">Overview</h2>
      {err && <div className="text-sm text-rose-400 mb-4">{err}</div>}

      <div className="grid md:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card-surface p-5 hover:bg-white/5 transition">
            <div className="text-textSub text-sm">{c.label}</div>
            <div className="text-3xl font-black mt-1">{c.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold">Recent users</h3>
            <Link to="/admin/users" className="text-sm underline opacity-80 hover:opacity-100">View all</Link>
          </div>
          <div className="divide-y divide-white/10">
            {(users || []).slice(0, 6).map((u) => (
              <Link key={u._id} to={`/admin/users/${u._id}`}
                className="flex items-center justify-between py-3 hover:bg-white/5 px-2 rounded-lg">
                <div>
                  <div className="font-medium">{u.name || "—"}</div>
                  <div className="text-xs text-white/60">{u.email}</div>
                </div>
                <div className="badge">{u.role}</div>
              </Link>
            ))}
            {!users.length && <div className="text-white/70 text-sm py-2">No users yet.</div>}
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold">Recent projects</h3>
            <Link to="/admin/projects" className="text-sm underline opacity-80 hover:opacity-100">View all</Link>
          </div>
          <div className="divide-y divide-white/10">
            {(projs || []).slice(0, 6).map((p) => (
              <Link key={p._id} to={`/admin/projects/${p._id}`}
                className="flex items-center justify-between py-3 hover:bg-white/5 px-2 rounded-lg">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-white/60">{p.summary}</div>
                </div>
                <div className="badge">{p.status}</div>
              </Link>
            ))}
            {!projs.length && <div className="text-white/70 text-sm py-2">No projects yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}