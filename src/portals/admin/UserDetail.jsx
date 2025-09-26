// src/portals/admin/UserDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "@/lib/api.js";

async function apiGet(path){ const r=await fetch(`${API_BASE}${path}`,{credentials:"include"}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}
async function apiJson(path, method, body){ const r=await fetch(`${API_BASE}${path}`,{method,credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}

const SUPER_EMAIL = "admin@mspixel.plus"; // UI safety; backend should also protect

export default function UserDetail() {
  const nav = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function load(){
    try { const d = await apiGet(`/admin/users/${userId}`); setUser(d.user); setErr(""); }
    catch(e){ setErr(e.message); }
  }
  useEffect(() => { load(); }, [userId]);

  async function patch(next){
    try {
      const d = await apiJson(`/admin/users/${userId}`, "PATCH", next);
      setUser(d.user); setOk("Saved"); setTimeout(()=>setOk(""), 1200);
    } catch(e){ setErr(e.message); }
  }

  async function remove(){
    if (!confirm("Delete this user?")) return;
    try {
      await fetch(`${API_BASE}/admin/users/${userId}`, { method:"DELETE", credentials:"include" });
      nav("/admin/users", { replace:true });
    } catch(e){ setErr(e.message); }
  }

  if (!user) {
    return <div className="px-4 pb-10">{err ? <div className="text-rose-400">{err}</div> : "Loading…"}</div>;
  }

  const protectDelete = user.email === SUPER_EMAIL || user.isSuperAdmin;

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">User detail</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-surface p-6 space-y-4">
          {ok && <div className="text-emerald-400 text-sm">{ok}</div>}
          {err && <div className="text-rose-400 text-sm">{err}</div>}

          <div>
            <div className="text-xs text-white/65 mb-1">Name</div>
            <div className="font-medium">{user.name}</div>
          </div>

          <div>
            <div className="text-xs text-white/65 mb-1">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-xs text-white/65 mb-1">Role</div>
              <select className="form-input bg-transparent" value={user.role}
                onChange={(e)=>patch({ role: e.target.value })}>
                <option value="client">Client</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="block">
              <div className="text-xs text-white/65 mb-1">Status</div>
              <select className="form-input bg-transparent" value={user.status}
                onChange={(e)=>patch({ status: e.target.value })}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </div>

          <div className="pt-2">
            <button
              onClick={remove}
              disabled={protectDelete}
              className="btn btn-outline disabled:opacity-50"
              title={protectDelete ? "Super admin cannot be deleted" : ""}
            >
              Delete user
            </button>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="text-textSub text-sm mb-2">Meta</div>
          <div className="space-y-1 text-xs">
            <div>ID: <code>{user._id}</code></div>
            <div>Role: <code>{user.role}</code></div>
            <div>Status: <code>{user.status}</code></div>
            <div>Created: <code>{new Date(user.createdAt).toLocaleString()}</code></div>
            <div>Updated: <code>{new Date(user.updatedAt).toLocaleString()}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}