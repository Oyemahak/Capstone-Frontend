// src/components/layout/AppHeader.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

/* Helpers */
function initials(name = "", email = "") {
  const base = (name || email || "").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export default function AppHeader() {
  const { isAuthed, role, user, logout } = useAuth();
  const nav = useNavigate();

  const [open, setOpen] = useState(false);         // mobile nav
  const [menuOpen, setMenuOpen] = useState(false); // profile dropdown
  const menuRef = useRef(null);

  const avatarUrl = user?.avatarUrl || ""; // ← Supabase URL saved on the user

  const portalPath =
    role === "admin" ? "/admin" : role === "developer" ? "/dev" : "/client";

  const myAccountPath =
    role === "admin" ? "/admin/my-account" :
    role === "developer" ? "/dev/my-account" :
    "/client/my-account";

  const supportPath = "/client/support";

  async function doLogout() {
    try { await logout(); } finally {
      nav("/", { replace: true });
      setOpen(false);
      setMenuOpen(false);
    }
  }

  // Close profile menu on outside click / ESC
  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    function onEsc(e) { if (e.key === "Escape") setMenuOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const closeMobile = useCallback(() => setOpen(false), []);
  const linkClass = ({ isActive }) =>
    [
      "px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
      isActive ? "bg-white/10" : "hover:bg-white/5",
    ].join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(10,10,12,0.55)] backdrop-blur-lg">
      <div className="container-edge h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="font-black tracking-tight" onClick={closeMobile}>
          MSPixelPulse
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          <NavLink to="/services" className={linkClass}>Services</NavLink>
          <NavLink to="/pricing" className={linkClass}>Pricing</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthed ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    "px-4 h-10 rounded-xl font-bold inline-flex items-center transition-colors",
                    isActive ? "bg-white/10" : "hover:bg-white/5",
                  ].join(" ")
                }
              >
                Login
              </NavLink>
              <Link to="/contact" className="btn btn-primary h-10">Start Project</Link>
            </>
          ) : (
            <>
              <Link to={portalPath} className="btn btn-outline h-10">Portal</Link>

              {/* Profile */}
              <div className="relative" ref={menuRef}>
                <button
                  className="profile-chip"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                  title={user?.email || "Account"}
                >
                  {avatarUrl
                    ? <img src={avatarUrl} alt="profile" className="h-9 w-9 rounded-full object-cover" />
                    : <span className="avatar-fallback h-9 w-9 rounded-full">{initials(user?.name, user?.email)}</span>}
                </button>

                {/* Glassy dropdown */}
                <div
                  className={[
                    "user-menu",
                    menuOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none",
                  ].join(" ")}
                  role="menu"
                >
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div className="shrink-0">
                      {avatarUrl
                        ? <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                        : <span className="avatar-fallback h-9 w-9 rounded-full">{initials(user?.name, user?.email)}</span>}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{user?.name || "User"}</div>
                      <div className="text-xs text-white/60 truncate">{user?.email}</div>
                    </div>
                  </div>

                  <MenuLink to={myAccountPath} icon="user" onClick={() => setMenuOpen(false)}>
                    My account
                  </MenuLink>

                  {role === "client" && (
                    <MenuLink to={supportPath} icon="life-buoy" onClick={() => setMenuOpen(false)}>
                      Support
                    </MenuLink>
                  )}

                  <button className="menu-item danger" onClick={doLogout} role="menuitem">
                    {Icon("logout")} <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-grid place-items-center h-10 w-10 rounded-xl hover:bg-white/10"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : (<><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>)}
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      <div className={["md:hidden overflow-hidden transition-[max-height,opacity] duration-300", open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"].join(" ")}>
        <div className="container-edge pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <nav className="p-2">
              <MobileLink to="/" onClick={closeMobile} end>Home</MobileLink>
              <MobileLink to="/projects" onClick={closeMobile}>Projects</MobileLink>
              <MobileLink to="/services" onClick={closeMobile}>Services</MobileLink>
              <MobileLink to="/pricing" onClick={closeMobile}>Pricing</MobileLink>
              <MobileLink to="/contact" onClick={closeMobile}>Contact</MobileLink>

              <div className="h-px my-2 bg-white/10" />

              {!isAuthed ? (
                <>
                  <MobileCTA to="/login" onClick={closeMobile} variant="outline">Login</MobileCTA>
                  <MobileCTA to="/contact" onClick={closeMobile} variant="primary">Start Project</MobileCTA>
                </>
              ) : (
                <>
                  <MobileCTA to={portalPath} onClick={closeMobile} variant="outline">Portal</MobileCTA>
                  <MobileCTA to={myAccountPath} onClick={closeMobile} variant="outline">My account</MobileCTA>
                  {role === "client" && <MobileCTA to={supportPath} onClick={closeMobile} variant="outline">Support</MobileCTA>}
                  <button
                    onClick={async () => { await doLogout(); closeMobile(); }}
                    className="w-full mt-2 h-11 rounded-xl font-bold bg-primary hover:bg-primaryAccent text-white"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ----- Menu link + icons (no extra deps) ----- */

function MenuLink({ to, onClick, icon, children }) {
  return (
    <Link to={to} onClick={onClick} className="menu-item" role="menuitem">
      {Icon(icon)}
      <span>{children}</span>
    </Link>
  );
}

function Icon(name) {
  const base = "h-4 w-4 shrink-0";
  switch (name) {
    case "user":
      return (<svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21a8 8 0 10-16 0" /><circle cx="12" cy="7" r="4" /></svg>);
    case "life-buoy":
      return (<svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M19.07 4.93l-4.24 4.24M9.17 14.83l-4.24 4.24"/></svg>);
    case "logout":
      return (<svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>);
    default:
      return null;
  }
}

/* ----- Mobile helpers ----- */

function MobileLink({ to, end, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block w-full px-3 py-3 rounded-xl font-semibold transition-colors",
          isActive ? "bg-white/10" : "hover:bg-white/5",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function MobileCTA({ to, variant = "primary", onClick, children }) {
  const base = "w-full mt-2 h-11 rounded-xl font-bold inline-flex items-center justify-center transition-colors";
  const styles =
    variant === "primary"
      ? "bg-primary hover:bg-primaryAccent text-white"
      : "border border-white/10 bg-transparent text-textMain hover:bg-white/5";
  return (
    <Link to={to} onClick={onClick} className={[base, styles].join(" ")}>
      {children}
    </Link>
  );
}