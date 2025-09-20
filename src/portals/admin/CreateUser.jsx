import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalShell from '../../components/portal/PortalShell';
import { api } from '../../lib/api';

export default function CreateUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'client', password: '' });
  const [err, setErr] = useState('');
  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.createUser(form);
      nav('/admin/users');
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <PortalShell>
      <h1 className="text-2xl font-black mb-4">Create User</h1>
      <form onSubmit={submit} className="card-surface p-6 max-w-xl">
        <label className="block text-sm mb-1">Full name</label>
        <input value={form.name} onChange={change('name')} placeholder="Jane Smith" />

        <label className="block text-sm mt-4 mb-1">Email</label>
        <input value={form.email} onChange={change('email')} type="email" placeholder="user@example.com" />

        <label className="block text-sm mt-4 mb-1">Role</label>
        <select value={form.role} onChange={change('role')}>
          <option value="client">client</option>
          <option value="developer">developer</option>
          <option value="admin">admin</option>
        </select>

        <label className="block text-sm mt-4 mb-1">Temp Password</label>
        <input value={form.password} onChange={change('password')} type="password" placeholder="Strong temp password" />

        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}

        <button className="btn btn-primary mt-6">Create</button>
      </form>
    </PortalShell>
  );
}