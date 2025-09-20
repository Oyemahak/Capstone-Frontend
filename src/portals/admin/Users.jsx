import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function Users() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');

  async function load() {
    const users = await api.listUsers(q ? `q=${encodeURIComponent(q)}` : '');
    setRows(users);
  }
  useEffect(() => { load(); }, []); // initial

  return (
    <PortalShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black">Users</h1>
        <Link to="/admin/users/new" className="btn btn-primary">Create User</Link>
      </div>

      <div className="card-surface p-4 mb-3 flex items-center gap-2">
        <input className="flex-1" placeholder="Search name/email…" value={q} onChange={e => setQ(e.target.value)} />
        <button onClick={load} className="btn btn-outline">Search</button>
      </div>

      <div className="card-surface p-4 overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="text-left text-textSub">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u._id} className="border-t border-white/10">
                <td className="py-3">
                  <Link className="underline" to={`/admin/users/${u._id}`}>{u.name}</Link>
                </td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="5" className="py-6 text-center text-textSub">No users.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}