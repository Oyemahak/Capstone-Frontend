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

  const [rows, setRows] = useState([]);     // unified list of admins + developers
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let live = true;

    const deriveFromProjects = async () => {
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

      // Always include a support/admin contact
      const derived = [
        {
          _id: "admin-support",
          name: "Admin Support",
          email: SUPPORT_EMAIL,
          role: "admin",
          status: "active",
        },
        ...Array.from(map.values()),
      ];

      return derived;
    };

    (async () => {
      setLoading(true);
      setErr("");
      try {
        if (user?.role === "admin") {
          // Admins can see the full team list from the admin endpoint
          const d = await admin.users(q);
          if (!live) return;
          const onlyNeeded = (d.users || []).filter((u) =>
            ["admin", "developer"].includes(u.role)
          );
          setRows(onlyNeeded);
        } else {
          // Developers don’t call the admin endpoint (avoid 403s).
          const derived = await deriveFromProjects();
          if (!live) return;
          setRows(derived);
          // NOTE: we intentionally do NOT set any “no permission” message here.
        }
      } catch (e) {
        // Hard failures only (network/server). Permission issues won’t appear here.
        if (!live) return;
        setErr(e.message || "Failed to load team");
        setRows([]);
      } finally {
        if (live) setLoading(false);
      }
    })();

    return () => {
      live = false;
    };
  }, [user?.role]);

  // Search
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return (rows || []).filter(
      (u) => !n || `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(n)
    );
  }, [rows, q]);

  // Group like the Admin Users page (but only Admins + Developers)
  const grouped = useMemo(() => {
    const base = { admin: [], developer: [] };
    for (const u of filtered) (base[u.role] || base.developer).push(u);
    return base;
  }, [filtered]);

  function Section({ title, items }) {
    return (
      <div className="card overflow-hidden">
        <div className="card-strip between">
          <div className="font-semibold">{title}</div>
          <div className="text-muted-xs">
            {items.length} member{items.length !== 1 ? "s" : ""}
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="w-34">Member</th>
              <th className="w-34">Email</th>
              <th className="w-20">Status</th>
              <th className="w-20">Role</th>
              <th className="actions-head">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={`${u.role}-${u._id}`} className="table-row-hover">
                <td className="font-medium">{u.name || "—"}</td>
                <td className="text-muted">{u.email}</td>
                <td className="capitalize">
                  <span className="badge">{u.status || "active"}</span>
                </td>
                <td className="capitalize">
                  <span className="badge">{u.role}</span>
                </td>
                <td className="actions-cell">
                  {/* Developers can message, but no create/edit/delete UI */}
                  <Link
                    to={`/dev/direct/${u._id}`}
                    state={{ peerEmail: u.email, peerName: u.name }}
                    className="icon-btn"
                    title="Direct message"
                  >
                    <MessageSquare size={16} />
                  </Link>
                </td>
              </tr>
            ))}

            {!items.length && (
              <tr>
                <td colSpan="5" className="empty-cell">
                  {loading ? "Loading…" : "No members."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="page-shell space-stack">
      <div className="page-header">
        <h2 className="page-title">Team</h2>
        <div />
      </div>

      {/* Only show actual errors (network/server). No permission banner for devs. */}
      {err && <div className="text-error">{err}</div>}

      <div className="card card-pad filters-grid">
        <input
          className="form-input"
          placeholder={`Search team member..`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="btn btn-outline"
          onClick={() => setQ((s) => s)} // no-op to keep same layout as Admin
          disabled
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="stack">
        <Section title={`Admins (${grouped.admin.length})`} items={grouped.admin} />
        <Section title={`Developers (${grouped.developer.length})`} items={grouped.developer} />
      </div>
    </div>
  );
}