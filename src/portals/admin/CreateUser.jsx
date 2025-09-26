// src/portals/admin/CreateUser.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/api.js";

async function apiJson(path, method, body){ const r=await fetch(`${API_BASE}${path}`,{method,credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d?.message||`HTTP ${r.status}`); return d;}

export default function CreateUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"client", status:"active" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function set(k, v){ setForm(s => ({...s, [k]: v})); }

  async function submit(e){
    e.preventDefault();
    setErr(""); setOk("");
    try {
      const res = await apiJson("/admin/users", "POST", form);
      setOk("User created");
      nav(`/admin/users/${res.user._id}`, { replace:true });
    } catch (e2){ setErr(e2.message); }
  }

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">Create user</h2>

      <form onSubmit={submit} className="card-surface p-6 max-w-xl space-y-4">
        {err && <div className="text-rose-400 text-sm">{err}</div>}
        {ok && <div className="text-emerald-400 text-sm">{ok}</div>}

        <label className="block">
          <div className="text-xs text-white/65 mb-1">Name</div>
          <input className="form-input" value={form.name} onChange={e=>set("name", e.target.value)} />
        </label>

        <label className="block">
          <div className="text-xs text-white/65 mb-1">Email</div>
          <input className="form-input" value={form.email} onChange={e=>set("email", e.target.value)} />
        </label>

        <label className="block">
          <div className="text-xs text-white/65 mb-1">Password</div>
          <input type="password" className="form-input" value={form.password} onChange={e=>set("password", e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Role</div>
            <select className="form-input bg-transparent" value={form.role} onChange={e=>set("role", e.target.value)}>
              <option value="client">Client</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={e=>set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
        </div>

        <div className="pt-1">
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
}