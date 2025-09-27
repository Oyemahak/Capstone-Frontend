// src/portals/admin/Approvals.jsx
import { useEffect, useState } from "react";
import { admin } from "@/lib/api.js";

export default function Approvals() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      const d = await admin.pending();
      setRows(d.users || []);
      setErr("");
    } catch (e) {
      setErr(e.message);
      setRows([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id) {
    setBusyId(id);
    try {
      await admin.approveUser(id); // PATCH
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyId("");
    }
  }

  async function reject(id) {
    if (!confirm("Reject this request? The account will be removed.")) return;
    setBusyId(id);
    try {
      await admin.rejectUser(id); // PATCH (/reject) – see backend
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Pending Approvals</h2>
        <div />
      </div>
      {err && <div className="mb-3 text-rose-400 text-sm">{err}</div>}

      <div className="card-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-sm text-white/70">
          {rows.length ? `${rows.length} request${rows.length > 1 ? "s" : ""}` : "No pending requests"}
        </div>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td>{u.name || "—"}</td>
                <td className="text-white/80">{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td><span className="badge">{u.status}</span></td>
                <td className="space-x-3">
                  <button
                    className="btn btn-primary h-8 px-3"
                    disabled={busyId === u._id}
                    onClick={() => approve(u._id)}
                  >
                    {busyId === u._id ? "…" : "Approve"}
                  </button>
                  <button
                    className="btn btn-outline h-8 px-3"
                    disabled={busyId === u._id}
                    onClick={() => reject(u._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="5" className="text-white/70 py-6 px-4">Nothing to approve right now.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}