// src/portals/admin/Approvals.jsx
import { useEffect, useState } from "react";
import { admin } from "@/lib/api.js";

export default function Approvals() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    try {
      const d = await admin.pending(); // /admin/users?status=pending
      setRows(d.users || []);
      setErr("");
    } catch (e) {
      setErr(e.message);
      setRows([]);
    }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">Pending Approvals</h2>
      {err && <div className="mb-3 text-rose-400 text-sm">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td>{u.name}</td>
                <td className="text-white/80">{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td><span className="badge">{u.status}</span></td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="4" className="text-white/70 py-6 px-4">No pending requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}