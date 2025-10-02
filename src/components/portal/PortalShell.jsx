// src/components/portal/PortalShell.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function PortalShell({ children }) {
  const { role } = useAuth();

  const navs = {
    admin: [
      { to: "/admin", label: "Dashboard", end: true },
      { to: "/admin/approvals", label: "Approvals" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/projects", label: "Projects" },
      { to: "/admin/billing", label: "Billing" },
      { to: "/admin/discussions", label: "Discussions" },
      { to: "/admin/direct", label: "Direct" },
      { to: "/admin/settings", label: "Settings" },
    ],
    developer: [
      { to: "/dev", label: "Dashboard", end: true },
      { to: "/dev/projects", label: "Projects" },
      { to: "/dev/discussions", label: "Discussions" },
      { to: "/dev/direct", label: "Direct" },          // ← NEW
      { to: "/dev/team", label: "Team" },
      { to: "/dev/settings", label: "Settings" },
    ],
    client: [
      { to: "/client", label: "Dashboard", end: true },
      { to: "/client/projects", label: "Projects" },
      { to: "/client/discussions", label: "Discussions" },
      { to: "/client/billing", label: "Billing" },
      { to: "/client/support", label: "Support" },
      { to: "/client/my-account", label: "My account" },
    ],
  };

  const links = navs[role] || [];
  const itemClass = ({ isActive }) =>
    ["block px-4 py-2 rounded-lg font-semibold", isActive ? "bg-white/10" : "hover:bg-white/5"].join(" ");

  return (
    <div className="container-edge grid grid-cols-12 gap-6 py-6">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2">
        <div className="card-surface p-4">
          <div className="font-black text-lg">MSPixelPlus</div>
          <div className="text-xs text-white/50 mt-1 capitalize">{role} Portal</div>
        </div>
        <nav className="mt-3 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={itemClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="col-span-12 md:col-span-9 lg:col-span-10">
        {children}
      </section>
    </div>
  );
}