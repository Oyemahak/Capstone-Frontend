// src/portals/admin/UserDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function UserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [u, setU] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await admin.getUser(id);
    setU(data?.user || data);
  }
  useEffect(() => { load(); }, [id]);

  async function save() {
    setSaving(true);
    await admin.updateUser(id, { name: u.name, role: u.role, status: u.status });
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <button className="underline" onClick={() => nav(-1)}>← Back</button>
      <h1 className="text-xl font-semibold">User Detail</h1>

      {!u ? <div>Loading…</div> : (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name">
            <input className="border border-white/10 bg-transparent rounded p-2 w-full"
                   value={u.name || ""} onChange={e=>setU({...u, name: e.target.value})} />
          </Field>
          <Field label="Email"><div>{u.email}</div></Field>
          <Field label="Role">
            <select className="border border-white/10 bg-black rounded p-2 w-full"
                    value={u.role} onChange={e=>setU({...u, role: e.target.value})}>
              <option value="admin">admin</option>
              <option value="developer">developer</option>
              <option value="client">client</option>
            </select>
          </Field>
          <Field label="Status">
            <select className="border border-white/10 bg-black rounded p-2 w-full"
                    value={u.status} onChange={e=>setU({...u, status: e.target.value})}>
              <option value="pending">pending</option>
              <option value="active">active</option>
              <option value="disabled">disabled</option>
            </select>
          </Field>
        </div>
      )}

      <div className="flex gap-3">
        <button className="bg-brand text-black rounded px-4 py-2" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button className="border border-white/20 rounded px-4 py-2"
                onClick={async()=>{ await admin.deleteUser(id); nav("/admin/users"); }}>
          Delete
        </button>
      </div>
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