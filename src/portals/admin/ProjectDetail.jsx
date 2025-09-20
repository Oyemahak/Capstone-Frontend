import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const [project, allUsers] = await Promise.all([
        api.getProject(id),
        api.listUsers(),
      ]);
      setP(project);
      setUsers(allUsers);
    })();
  }, [id]);

  async function save(e) {
    e.preventDefault();
    const payload = {
      title: p.title,
      summary: p.summary,
      status: p.status,
      client: p.client?._id || p.client || null,
      developer: p.developer?._id || p.developer || null,
    };
    await api.updateProject(id, payload);
    nav('/admin/projects');
  }

  if (!p) return <PortalShell><div className="card-surface p-6">Loading…</div></PortalShell>;

  const developers = users.filter(u => u.role === 'developer' && u.status === 'active');
  const clients = users.filter(u => u.role === 'client' && u.status !== 'suspended');

  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Edit Project</h1>
      <form onSubmit={save} className="card-surface p-6 max-w-2xl">
        <label className="block text-sm mb-1">Title</label>
        <input value={p.title} onChange={e => setP({ ...p, title: e.target.value })} />

        <label className="block text-sm mt-4 mb-1">Summary</label>
        <textarea value={p.summary || ''} onChange={e => setP({ ...p, summary: e.target.value })} />

        <div className="grid md:grid-cols-3 gap-3 mt-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select value={p.status} onChange={e => setP({ ...p, status: e.target.value })}>
              <option>draft</option>
              <option>active</option>
              <option>paused</option>
              <option>completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Client</label>
            <select
              value={p.client?._id || p.client || ''}
              onChange={e => setP({ ...p, client: e.target.value || null })}
            >
              <option value="">—</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Developer</label>
            <select
              value={p.developer?._id || p.developer || ''}
              onChange={e => setP({ ...p, developer: e.target.value || null })}
            >
              <option value="">—</option>
              {developers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="btn btn-primary">Save</button>
          <button type="button" onClick={() => nav(-1)} className="btn btn-outline">Cancel</button>
        </div>
      </form>
    </PortalShell>
  );
}