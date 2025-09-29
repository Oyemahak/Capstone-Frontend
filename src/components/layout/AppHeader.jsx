// src/components/layout/AppHeader.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function AppHeader() {
  const { isAuthed, role, user, logout } = useAuth();
  const nav = useNavigate();

  function portalPath() {
    if (role === "admin") return "/admin";
    if (role === "developer") return "/dev";
    return "/client";
  }

  async function doLogout() {
    await logout();
    nav("/", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    ["px-3 py-2 rounded-lg text-sm font-semibold", isActive ? "bg-white/10" : "hover:bg-white/5"].join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="container-edge h-16 flex items-center justify-between">
        <Link to="/" className="font-black">MSPixelPulse</Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthed ? (
            <>
              {/* Removed Register */}
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  ["px-4 h-10 rounded-xl font-bold inline-flex items-center",
                   isActive ? "bg-white/10" : "bg-transparent hover:bg-white/5"].join(" ")
                }
              >
                Login
              </NavLink>

              <Link to="/contact" className="btn btn-primary h-10">Start Project</Link>
            </>
          ) : (
            <>
              <span className="hidden sm:block text-xs text-white/60">
                {user?.name} · {user?.email}
              </span>
              <Link to={portalPath()} className="btn btn-outline h-10">Portal</Link>
              <button onClick={doLogout} className="btn btn-primary h-10">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}