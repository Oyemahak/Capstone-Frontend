// src/portals/admin/Projects.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/lib/api.js";

export default function Projects() {
  const [rows, setRows] = useState([]);

  async function load() {
    const list = await projects.list();
    setRows(Array.isArray(list) ? list : list?.projects || []);
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Projects</h1>
        <button className="bg-brand text-black rounded px-3 py-1"
                onClick={async()=>{ 
                  const p = await projects.create({ title: "New Project", summary: "", status: "draft" });
                  window.location.href = `/admin/projects/${p._id}`;
                }}>
          + New
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5"><tr><Th>Title</Th><Th>Status</Th><Th>Client</Th><Th>Developer</Th><Th></Th></tr></thead>
          <tbody>
            {rows.map(p=>(
              <tr key={p._id} className="border-t border-white/10">
                <Td>{p.title}</Td>
                <Td className="capitalize">{p.status}</Td>
                <Td>{p.client?.name || p.client?.email || "—"}</Td>
                <Td>{p.developer?.name || p.developer?.email || "—"}</Td>
                <Td className="text-right"><Link className="underline" to={`/admin/projects/${p._id}`}>Open</Link></Td>
              </tr>
            ))}
            {!rows.length && <tr><Td colSpan="5" className="text-center text-white/60 py-6">No projects</Td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) { return <th className="text-left p-3">{children}</th>; }
function Td({ children, colSpan }) { return <td colSpan={colSpan} className="p-3 align-top">{children}</td>; }