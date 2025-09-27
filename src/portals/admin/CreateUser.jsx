// src/portals/admin/CreateUser.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function CreateUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "client", status: "active",
  });
  const [err, setErr] = useState(""); const [ok, setOk] = useState("");

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      const d = await admin.createUser(form); // expects {user}
      setOk("User created");
      nav(`/admin/users/${d.user._id}`, { replace: true });
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="px-4 pb-10">
      <h2 className="text-xl font-extrabold mb-4">Create user</h2>
      <form onSubmit={submit} className="card-surface p-6 max-w-xl space-y-4">
        {err && <div className="text-sm text-rose-400">{err}</div>}
        {ok && <div className="text-sm text-emerald-400">{ok}</div>}

        <label className="block">
          <div className="text-xs text-white/65 mb-1">Full name</div>
          <input className="form-input" value={form.name} onChange={set("name")} />
        </label>
        <label className="block">
          <div className="text-xs text-white/65 mb-1">Email</div>
          <input className="form-input" type="email" value={form.email} onChange={set("email")} />
        </label>
        <label className="block">
          <div className="text-xs text-white/65 mb-1">Password</div>
          <input className="form-input" type="password" value={form.password} onChange={set("password")} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Role</div>
            <select className="form-input bg-transparent" value={form.role} onChange={set("role")}>
              <option value="client">Client</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="block">
            <div className="text-xs text-white/65 mb-1">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={set("status")}>
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