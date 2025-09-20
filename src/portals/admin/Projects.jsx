import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function Projects() {
  const [rows, setRows] = useState([]);

  async function load() {
    setRows(await api.listProjects());
  }
  useEffect(() => { load(); }, []);

  return (
    <PortalShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black">Projects</h1>
        <Link to="/admin/projects/new" className="btn btn-primary">New Project</Link>
      </div>
      <div className="card-surface p-4 overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="text-left text-textSub">
              <th className="py-2">Title</th>
              <th>Client</th>
              <th>Developer</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p._id} className="border-t border-white/10">
                <td className="py-3">
                  <Link className="underline" to={`/admin/projects/${p._id}`}>{p.title}</Link>
                </td>
                <td>{p.client?.name || '-'}</td>
                <td>{p.developer?.name || '-'}</td>
                <td>{p.status}</td>
                <td>{new Date(p.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="5" className="py-6 text-center text-textSub">No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}