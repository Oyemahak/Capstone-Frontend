// src/portals/dev/Team.jsx
import { useEffect, useMemo, useState } from "react";
import { admin, projects as api } from "@/lib/api.js";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { MessageSquare } from "lucide-react";

const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "admin@mspixel.pulse";

export default function Team() {
  const { user } = useAuth();
  const [all, setAll] = useState([]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const d = await admin.users();
        setAll((d.users || []).filter((u) => ["developer", "admin"].includes(u.role)));
      } catch (e) {
        try {
          const p = await api.list();
          const map = new Map();
          (p.projects || []).forEach((pr) => {
            const dev = pr.developer;
            if (dev?._id && dev?.email) {
              map.set(dev._id, {
                _id: dev._id,
                name: dev.name || "Developer",
                email: dev.email,
                role: "developer",
                status: dev.status || "active",
              });
            }
          });
          const derived = Array.from(map.values());
          // Ensure at least one admin contact
          derived.unshift({
            _id: "admin-support",
            name: "Admin Support",
            email: SUPPORT_EMAIL,
            role: "admin",
            status: "active",
          });
          setAll(derived);
          if (String(e?.message || "").toLowerCase().includes("forbidden")) {
            setErr("You don't have permission to view the full team yet.");
          }
        } catch (e2) {
          setAll([]);
          setErr(e2.message || "Failed to load");
        }
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return all.filter(
      (u) => !n || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(n)
    );
  }, [all, q]);

  const admins = filtered.filter((u) => u.role === "admin");
  const devs = filtered.filter((u) => u.role === "developer");

  function Section({ title, rows }) {
    return (
      <div className="card-surface overflow-hidden">
        <div className="card-strip">
          <div className="font-semibold">{title}</div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="w-34">Member</th>
              <th className="w-24">Email</th>
              <th className="w-20">Status</th>
              <th className="w-20">Role</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={`${u.role}-${u._id}`} className="table-row-hover">
                <td className="font-medium">{u.name || "—"}</td>
                <td className="text-white/80">{u.email}</td>
                <td>
                  <span className="badge capitalize">
                    {u.status || "active"}
                  </span>
                </td>
                <td>
                  <span className="badge capitalize">{u.role}</span>
                </td>
                <td className="actions-cell">
                  {u._id !== user?._id && (
                    <Link
                      className="btn btn-outline btn-sm inline-flex items-center gap-1"
                      to={`/dev/direct/${u._id}`}
                      state={{ peerEmail: u.email, peerName: u.name }}
                      title="Direct message"
                    >
                      <MessageSquare size={14} />
                      Message
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No members.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-5">
      <div className="page-header">
        <h2 className="page-title">Team</h2>
        <div />
      </div>

      {err && <div className="text-error">{err}</div>}

      <div className="card-surface p-4">
        <input
          className="form-input"
          placeholder={`Search team… (${filtered.length} members)`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Section title={`Admins (${admins.length})`} rows={admins} />
      <Section title={`Developers (${devs.length})`} rows={devs} />
    </div>
  );
}