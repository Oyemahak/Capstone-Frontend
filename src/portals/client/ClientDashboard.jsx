import { useEffect, useState } from 'react';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.listProjects('mine=client').then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Welcome</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p._id} className="card-surface p-5">
            <div className="font-bold">{p.title}</div>
            <div className="text-textSub text-sm">{p.summary || '—'}</div>
            <div className="text-xs mt-2">Status: <span className="font-semibold">{p.status}</span></div>
          </div>
        ))}
        {!projects.length && <div className="card-surface p-6">No projects yet.</div>}
      </div>
    </PortalShell>
  );
}