import { useEffect, useState } from 'react';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function Approvals() {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState('');

  async function load() {
    const users = await api.listUsers('status=pending');
    setRows(users);
  }
  useEffect(() => { load(); }, []);

  async function approve(id) {
    setBusy(id);
    try {
      await api.approveUser(id);
      await load();
    } finally {
      setBusy('');
    }
  }

  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Pending Approvals</h1>
      <div className="card-surface p-4 overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead>
            <tr className="text-left text-textSub">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u._id} className="border-t border-white/10">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td className="text-right">
                  <button
                    onClick={() => approve(u._id)}
                    className="btn btn-primary disabled:opacity-50"
                    disabled={busy === u._id}
                  >
                    {busy === u._id ? 'Approving…' : 'Approve'}
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="5" className="py-6 text-center text-textSub">No pending requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}