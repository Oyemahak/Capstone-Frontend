// src/portals/admin/ProjectDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { admin, projects } from "@/lib/api.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [users, setUsers] = useState([]);

  async function load() {
    const [proj, allUsers] = await Promise.all([
      projects.get(id),
      admin.listUsers()
    ]);
    setP(proj);
    setUsers(allUsers);
  }
  useEffect(() => { load(); }, [id]);

  async function save() {
    const body = {
      title: p.title,
      summary: p.summary,
      status: p.status,        // draft | active | paused | completed
      client: p.client?._id || p.client || null,
      developer: p.developer?._id || p.developer || null,
    };
    const up = await projects.update(p._id, body);
    setP(up);
  }

  async function remove() {
    if (!confirm("Delete this project?")) return;
    await projects.remove(p._id);
    nav("/admin/projects");
  }

  const clients = users.filter(u => u.role === "client");
  const devs    = users.filter(u => u.role === "developer");

  return (
    <div className="space-y-4">
      <button className="underline" onClick={()=>nav(-1)}>← Back</button>
      {!p ? <div>Loading…</div> : (
        <>
          <h1 className="text-xl font-semibold">Project: {p.title}</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input className="border border-white/10 bg-transparent rounded p-2 w-full"
                     value={p.title || ""} onChange={e=>setP({...p, title: e.target.value})} />
            </Field>
            <Field label="Status">
              <select className="border border-white/10 bg-black rounded p-2 w-full"
                      value={p.status} onChange={e=>setP({...p, status: e.target.value})}>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
              </select>
            </Field>
            <Field label="Client">
              <select className="border border-white/10 bg-black rounded p-2 w-full"
                      value={p.client?._id || p.client || ""}
                      onChange={e=>setP({...p, client: e.target.value || null})}>
                <option value="">— none —</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name || c.email}</option>)}
              </select>
            </Field>
            <Field label="Developer">
              <select className="border border-white/10 bg-black rounded p-2 w-full"
                      value={p.developer?._id || p.developer || ""}
                      onChange={e=>setP({...p, developer: e.target.value || null})}>
                <option value="">— none —</option>
                {devs.map(d => <option key={d._id} value={d._id}>{d.name || d.email}</option>)}
              </select>
            </Field>
            <Field label="Summary" wide>
              <textarea className="border border-white/10 bg-transparent rounded p-2 w-full h-28"
                        value={p.summary || ""} onChange={e=>setP({...p, summary: e.target.value})} />
            </Field>
          </div>

          <div className="flex gap-3">
            <button className="bg-brand text-black rounded px-4 py-2" onClick={save}>Save</button>
            <button className="border border-white/20 rounded px-4 py-2" onClick={remove}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, children, wide }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <div className="text-xs text-white/60 mb-1">{label}</div>
      {children}
    </label>
  );
}