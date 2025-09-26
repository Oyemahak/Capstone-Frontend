// src/portals/admin/Approvals.jsx
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api.js";

async function apiGet(path){ const r=await fetch(`${API_BASE}${path}`,{credentials:"include"}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}

export default function Approvals() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  async function load(){
    try { const d = await apiGet("/admin/pending"); setList(d.users||[]); setErr(""); }
    catch(e){ setErr(e.message); }
  }
  useEffect(()=>{ load(); }, []);

  async function approve(id){
    await fetch(`${API_BASE}/admin/users/${id}/approve`, { method:"POST", credentials:"include" });
    load();
  }

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">Pending Approvals</h2>
      {err && <div className="mb-3 text-rose-400 text-sm">{err}</div>}

      <div className="card-surface overflow-hidden">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {list.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td>{u.name}</td>
                <td className="text-white/80">{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td><span className="badge">{u.status}</span></td>
                <td><button onClick={()=>approve(u._id)} className="btn btn-primary">Approve</button></td>
              </tr>
            ))}
            {list.length===0 && (
              <tr><td colSpan="5" className="text-white/70 py-6 px-4">No pending requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}