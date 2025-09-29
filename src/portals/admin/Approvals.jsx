// src/portals/admin/Approvals.jsx
import { useEffect, useState } from "react";
import { admin } from "@/lib/api.js";
import { Check, Trash2 } from "lucide-react";

export default function Approvals() {
  const [pending, setPending] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const d = await admin.users();
      setPending((d.users || []).filter((u) => u.status === "pending"));
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    try {
      await admin.approveUser(id);
      await load();
    } catch (e) {
      alert(e.message || "Approve failed");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await admin.deleteUser(id);
      await load();
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <div className="page-shell space-y-5">
      {/* Page title */}
      <div className="page-header">
        <h2 className="page-title">Pending Approvals</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th className="w-34">Name</th>
              <th className="w-34">Email</th>
              <th className="w-20">Role</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((u) => (
              <tr key={u._id} className="table-row-hover">
                <td className="font-medium">{u.name || "—"}</td>
                <td className="text-muted">{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => approve(u._id)}
                    className="icon-btn text-emerald-400 hover:text-emerald-300 mr-1"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => remove(u._id)}
                    className="icon-btn text-rose-400 hover:text-rose-300"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!pending.length && (
              <tr>
                <td colSpan="4" className="empty-cell">
                  {loading ? "Loading…" : "No pending approvals."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}