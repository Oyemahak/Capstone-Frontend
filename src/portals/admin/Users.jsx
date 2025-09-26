// src/portals/admin/Users.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  async function load() {
    const data = await admin.listUsers(q ? `q=${encodeURIComponent(q)}` : "");
    setRows(Array.isArray(data) ? data : data?.users || []);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="flex gap-2">
        <input className="border border-white/10 bg-transparent rounded p-2 flex-1"
               placeholder="Search name or email" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-3 py-2 rounded bg-brand text-black" onClick={load}>Search</button>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
          {rows.map(u=>(
            <tr key={u._id} className="border-t border-white/10">
              <Td>{u.name || "—"}</Td>
              <Td>{u.email}</Td>
              <Td className="capitalize">{u.role}</Td>
              <Td className="capitalize">{u.status}</Td>
              <Td>
                <Link to={`/admin/users/${u._id}`} className="underline mr-3">Open</Link>
                {u.status !== "active" && (
                  <button className="underline mr-3" onClick={async()=>{ await admin.approveUser(u._id); load(); }}>Approve</button>
                )}
                <button className="underline mr-3" onClick={async()=>{ 
                  const next = u.role === "developer" ? "client" : "developer";
                  await admin.updateRole(u._id, next); load();
                }}>Toggle role</button>
                <button className="underline text-rose-300" onClick={async()=>{ await admin.deleteUser(u._id); load(); }}>Delete</button>
              </Td>
            </tr>
          ))}
          {!rows.length && <tr><Td colSpan="5" className="text-center text-white/60 py-6">No users</Td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) { return <th className="text-left p-3">{children}</th>; }
function Td({ children, colSpan }) { return <td colSpan={colSpan} className="p-3 align-top">{children}</td>; }