// src/portals/admin/Approvals.jsx
import { useEffect, useState } from "react";
import { admin } from "@/lib/api.js";

export default function Approvals() {
  const [rows, setRows] = useState([]);

  async function load() {
    const list = await admin.listPending();
    setRows(Array.isArray(list) ? list : list?.users || []);
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Pending Users</h1>
      <ul className="space-y-2">
        {rows.map(u=>(
          <li key={u._id} className="flex items-center justify-between rounded-2xl border border-white/10 p-3">
            <div>
              <b>{u.name || "(no name)"}</b> — {u.email}
              <span className="ml-2 text-xs text-white/60">(role: {u.role})</span>
            </div>
            <div className="space-x-2 text-sm">
              <button className="bg-brand text-black rounded px-3 py-1"
                      onClick={async()=>{ await admin.approveUser(u._id); load(); }}>
                Approve
              </button>
              <button className="rounded px-3 py-1 border border-white/20"
                      onClick={async()=>{ await admin.deleteUser(u._id); load(); }}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {!rows.length && <li className="text-white/60">Nothing pending.</li>}
      </ul>
    </div>
  );
}