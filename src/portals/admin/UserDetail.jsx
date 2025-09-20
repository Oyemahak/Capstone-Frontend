import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function UserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [u, setU] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => setU(await api.getUser(id)))();
  }, [id]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateUser(id, { name: u.name, role: u.role, status: u.status });
      nav('/admin/users');
    } finally { setSaving(false); }
  }

  if (!u) return <PortalShell><div className="card-surface p-6">Loading…</div></PortalShell>;

  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Edit User</h1>
      <form onSubmit={save} className="card-surface p-6 max-w-xl">
        <label className="block text-sm mb-1">Name</label>
        <input value={u.name} onChange={(e) => setU({ ...u, name: e.target.value })} />

        <label className="block text-sm mt-4 mb-1">Email</label>
        <input disabled value={u.email} />

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select value={u.role} onChange={(e) => setU({ ...u, role: e.target.value })}>
              <option value="client">client</option>
              <option value="developer">developer</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select value={u.status} onChange={(e) => setU({ ...u, status: e.target.value })}>
              <option value="active">active</option>
              <option value="pending">pending</option>
              <option value="suspended">suspended</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button disabled={saving} className="btn btn-primary">Save</button>
          <button type="button" onClick={() => nav(-1)} className="btn btn-outline">Cancel</button>
        </div>
      </form>
    </PortalShell>
  );
}