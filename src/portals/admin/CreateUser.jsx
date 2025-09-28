import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { admin } from "@/lib/api.js";

export default function CreateUser() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "client", status: "active",
  });
  const [err, setErr] = useState(""); 
  const [ok, setOk] = useState("");

  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      const d = await admin.createUser(form);
      setOk("User created");
      nav(`/admin/users/${d.user._id}`, { replace: true });
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <h2 className="page-title">Create User</h2>
        <div />
      </div>

      <form onSubmit={submit} className="card card-pad-lg form-narrow">
        {err && <div className="text-error">{err}</div>}
        {ok && <div className="text-success">{ok}</div>}

        <label className="form-field">
          <div className="form-label">Full name</div>
          <input className="form-input" value={form.name} onChange={set("name")} />
        </label>

        <label className="form-field">
          <div className="form-label">Email</div>
          <input className="form-input" type="email" value={form.email} onChange={set("email")} />
        </label>

        <label className="form-field">
          <div className="form-label">Password</div>
          <input className="form-input" type="password" value={form.password} onChange={set("password")} />
        </label>

        <div className="form-grid-2">
          <label className="form-field">
            <div className="form-label">Role</div>
            <select className="form-input bg-transparent" value={form.role} onChange={set("role")}>
              <option value="client">Client</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className="form-field">
            <div className="form-label">Status</div>
            <select className="form-input bg-transparent" value={form.status} onChange={set("status")}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
}