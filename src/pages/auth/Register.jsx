import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await register(form);
      setMsg(res.message || 'Request submitted. Await admin approval.');
      setTimeout(() => nav('/login', { replace: true }), 1200);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center">
      <form onSubmit={onSubmit} className="card-surface p-6 md:p-8 w-full max-w-md">
        <h1 className="text-2xl font-black">Request Client Access</h1>
        <p className="text-textSub text-sm mt-1">We’ll notify you when approved.</p>

        <label className="block mt-5 text-sm">Full name</label>
        <input value={form.name} onChange={change('name')} placeholder="Jane Smith" />

        <label className="block mt-4 text-sm">Email</label>
        <input value={form.email} onChange={change('email')} type="email" placeholder="you@example.com" />

        <label className="block mt-4 text-sm">Password</label>
        <input value={form.password} onChange={change('password')} type="password" placeholder="Choose a strong password" />

        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}
        {msg && <div className="mt-3 text-sm text-emerald-400">{msg}</div>}

        <button className="btn btn-primary w-full mt-6">Submit Request</button>
      </form>
    </div>
  );
}