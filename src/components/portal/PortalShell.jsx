import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function PortalShell({ children }) {
  const { role, user, logout } = useAuth();

  const navs = {
    admin: [
      { to: "/admin", label: "Dashboard", end: true },
      { to: "/admin/approvals", label: "Approvals" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/projects", label: "Projects" },
      { to: "/admin/settings", label: "Settings" },
    ],
    developer: [
      { to: "/dev", label: "Dashboard", end: true },
      { to: "/dev/profile", label: "Profile" },
    ],
    client: [
      { to: "/client", label: "Dashboard", end: true },
      { to: "/client/files", label: "Files" },
      { to: "/client/profile", label: "Profile" },
    ],
  };

  const links = navs[role] || [];

  const itemClass = ({ isActive }) =>
    [
      "block px-4 py-2 rounded-lg font-semibold",
      isActive ? "bg-white/10" : "hover:bg-white/5",
    ].join(" ");

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
        <div className="card-surface p-4 mb-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-white/70">{user?.name}</span>{" "}
            <span className="text-white/40">· {user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn btn-outline h-9">Public Site</Link>
            <button onClick={logout} className="btn btn-primary h-9">Logout</button>
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}