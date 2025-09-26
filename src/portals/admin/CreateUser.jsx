// src/portals/admin/CreateUser.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function CreateUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const u = await admin.createUser({ ...form, status: "active" });
      setMsg("Created!");
      nav(`/admin/users/${u._id}`);
    } catch (e2) {
      setMsg(e2.message || "Failed");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Create User</h1>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        <Field label="Name">
          <input className="border border-white/10 bg-transparent rounded p-2 w-full"
                 value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
        </Field>
        <Field label="Email">
          <input className="border border-white/10 bg-transparent rounded p-2 w-full"
                 value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        </Field>
        <Field label="Password">
          <input type="password" className="border border-white/10 bg-transparent rounded p-2 w-full"
                 value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
        </Field>
        <Field label="Role">
          <select className="border border-white/10 bg-black rounded p-2 w-full"
                  value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
            <option value="client">client</option>
            <option value="developer">developer</option>
            <option value="admin">admin</option>
          </select>
        </Field>
        <div className="sm:col-span-2 flex gap-3">
          <button className="bg-brand text-black rounded px-4 py-2">Create</button>
          {msg && <div className="text-sm">{msg}</div>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs text-white/60 mb-1">{label}</div>
      {children}
    </label>
  );
}