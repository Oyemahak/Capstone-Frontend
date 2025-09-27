// src/portals/admin/Users.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function Users() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const d = await admin.users(q);
      setRows(d.users || []);
      setErr("");
    } catch (e) {
      setErr(e.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []); // initial

  const grouped = useMemo(() => {
    const base = { admin: [], developer: [], client: [] };
    for (const u of rows) (base[u.role] || base.client).push(u);
    return base;
  }, [rows]);

  function Section({ title, items }) {
    return (
      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-white/60">{items.length} user{items.length !== 1 ? "s" : ""}</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Status</th><th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="hover:bg-white/5">
                <td>{u.name || "—"}</td>
                <td className="text-white/80">{u.email}</td>
                <td className="capitalize">{u.status}</td>
                <td className="text-right whitespace-nowrap pr-6 space-x-3">
                  <Link to={`/admin/users/${u._id}`} className="underline">Open</Link>
                  {u.status !== "active" && (
                    <button
                      className="underline"
                      onClick={async () => { await admin.approveUser(u._id); load(); }}
                      title="Approve (sets status to active)"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    className="underline text-rose-300"
                    onClick={async () => {
                      if (!confirm("Delete user?")) return;
                      await admin.deleteUser(u._id);
                      load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan="4" className="text-white/70 px-4 py-6">No users in this group.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="px-4 pb-14 space-y-5">
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
        <button className="btn btn-outline" onClick={load} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {err && <div className="text-sm text-rose-400">{err}</div>}

      <div className="grid gap-5">
        <Section title="Admins" items={grouped.admin} />
        <Section title="Developers" items={grouped.developer} />
        <Section title="Clients" items={grouped.client} />
      </div>
    </div>
  );
}