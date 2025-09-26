// src/portals/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { admin, projects } from "@/lib/api.js";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ users: 0, pending: 0, projects: 0 });

  useEffect(() => {
    (async () => {
      const [all, pend, pro] = await Promise.all([
        admin.listUsers(),
        admin.listPending(),
        projects.list(),
      ]);
      setCounts({
        users: all?.length || 0,
        pending: pend?.length || 0,
        projects: pro?.length || 0,
      });
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card label="Users" value={counts.users} />
        <Card label="Pending" value={counts.pending} />
        <Card label="Projects" value={counts.projects} />
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
      <div className="text-sm text-white/60">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}