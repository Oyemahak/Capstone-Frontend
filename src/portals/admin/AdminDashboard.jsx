import { useEffect, useState } from 'react';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [users, projects] = await Promise.all([
          api.listUsers(),
          api.listProjects(),
        ]);
        const pending = users.filter(u => u.status === 'pending').length;
        setStats({
          users: users.length,
          pending,
          projects: projects.length,
        });
      } catch (e) {
        // Silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Overview</h1>
      {loading ? (
        <div className="card-surface p-6">Loading…</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-surface p-5">
            <div className="text-textSub text-sm">Total Users</div>
            <div className="text-3xl font-black mt-1">{stats?.users ?? 0}</div>
          </div>
          <div className="card-surface p-5">
            <div className="text-textSub text-sm">Pending Approvals</div>
            <div className="text-3xl font-black mt-1">{stats?.pending ?? 0}</div>
          </div>
          <div className="card-surface p-5">
            <div className="text-textSub text-sm">Projects</div>
            <div className="text-3xl font-black mt-1">{stats?.projects ?? 0}</div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}