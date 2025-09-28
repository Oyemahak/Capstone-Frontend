import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { admin } from "@/lib/api.js";
import { Pencil, Trash2, Check, Plus } from "lucide-react";

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
  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const base = { admin: [], developer: [], client: [] };
    for (const u of rows) (base[u.role] || base.client).push(u);
    return base;
  }, [rows]);

  function Section({ title, items }) {
    return (
      <div className="card overflow-hidden">
        <div className="card-strip between">
          <div className="font-semibold">{title}</div>
          <div className="text-muted-xs">{items.length} user{items.length !== 1 ? "s" : ""}</div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-34">Name</th>
              <th className="w-34">Email</th>
              <th className="w-20">Status</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="table-row-hover">
                <td className="font-medium">{u.name || "—"}</td>
                <td className="text-muted">{u.email}</td>
                <td className="capitalize"><span className="badge">{u.status}</span></td>
                <td className="actions-cell">
                  <Link to={`/admin/users/${u._id}`} className="icon-btn mr-1" title="Open / Edit">
                    <Pencil size={16} />
                  </Link>

                  {u.status !== "active" && (
                    <button
                      className="icon-btn mr-1"
                      onClick={async () => { await admin.approveUser(u._id); load(); }}
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                  )}

                  <button
                    className="icon-btn text-rose-300"
                    onClick={async () => {
                      if (!confirm("Delete user?")) return;
                      await admin.deleteUser(u._id);
                      load();
                    }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr><td colSpan="4" className="empty-cell">No users in this group.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <h2 className="page-title">Users</h2>
        <div />
      </div>

      <div className="card card-pad filters-grid">
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

      {err && <div className="text-error">{err}</div>}

      <div className="stack">
        <Section title="Admins" items={grouped.admin} />
        <Section title="Developers" items={grouped.developer} />
        <Section title="Clients" items={grouped.client} />
      </div>

      <div className="toolbar-bottom">
        <button onClick={() => nav("/admin/users/new")} className="btn btn-primary" title="Create a new user">
          <Plus className="mr-2" size={16} /> New user
        </button>
      </div>
    </div>
  );
}