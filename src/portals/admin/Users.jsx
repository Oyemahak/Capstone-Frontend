// src/portals/admin/Users.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function Users() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    try {
      const d = await admin.users(q);
      setRows(d.users || []);
      setErr("");
    } catch (e) {
      setErr(e.message);
      setRows([]);
    }
  }
  useEffect(() => { load(); }, []); // initial

  return (
    <div className="px-4 pb-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Users</h2>
        <button onClick={() => nav("/admin/users/new")} className="btn btn-primary h-10">
          New user
        </button>
      </div>

      <div className="card-surface p-3 grid md:grid-cols-[1fr_auto] gap-2">
        <input
          className="form-input"
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline" onClick={load}>Search</button>
      </div>

      {err && <div className="text-sm text-rose-400">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u._id} className="hover:bg-white/5">
                <td>{u.name || "—"}</td>
                <td className="text-white/80">{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td className="capitalize">{u.status}</td>
                <td className="space-x-3">
                  <Link to={`/admin/users/${u._id}`} className="underline">Open</Link>
                  {u.status !== "active" && (
                    <button className="underline" onClick={async () => { await admin.approveUser(u._id); load(); }}>
                      Approve
                    </button>
                  )}
                  <button
                    className="underline text-rose-300"
                    onClick={async () => {
                      if (!confirm("Delete user?")) return;
                      await admin.deleteUser(u._id); load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="5" className="text-white/70 px-4 py-6">No users.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}