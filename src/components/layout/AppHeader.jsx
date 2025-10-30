// src/components/layout/AppHeader.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

/* Lucide icons (react-icons/lu) */
import {
  LuLayoutGrid,      // Home
  LuFolderOpen,      // Projects
  LuWrench,          // Services
  LuTags,            // Pricing
  LuMail,            // Contact
  LuLogIn,           // Login
  LuRocket,          // Start project
  LuLayoutDashboard, // Portal
  LuMenu,            // Mobile open
  LuX,               // Mobile close
  LuUser,            // My account
  LuLifeBuoy,        // Support
  LuLogOut,          // Logout
} from "react-icons/lu";

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

  const avatarUrl = user?.avatarUrl || ""; // Supabase URL saved on the user

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
      "px-3 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2",
      isActive ? "bg-white/10" : "hover:bg-white/5",
    ].join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(10,10,12,0.55)] backdrop-blur-lg">
      <div className="container-edge h-16 flex items-center justify-between">
        {/* Brand (logo + name) */}
        <Link to="/" className="flex items-center gap-2 font-black tracking-tight" onClick={closeMobile}>
          <img
            src="/logo.svg"
            alt=""
            className="h-6 w-6 object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span>MSPixelPulse</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            <LuLayoutGrid className="h-4 w-4" /> Home
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            <LuFolderOpen className="h-4 w-4" /> Projects
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            <LuWrench className="h-4 w-4" /> Services
          </NavLink>
          <NavLink to="/pricing" className={linkClass}>
            <LuTags className="h-4 w-4" /> Pricing
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            <LuMail className="h-4 w-4" /> Contact
          </NavLink>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthed ? (
            <>
              {/* Login styled like a primary CTA */}
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    "px-4 h-10 rounded-xl font-bold inline-flex items-center gap-2 transition-colors",
                    "btn btn-primary",
                    isActive ? "opacity-90" : "",
                  ].join(" ")
                }
              >
                <LuLogIn className="h-4 w-4" /> Login
              </NavLink>

              <Link to="/contact" className="btn btn-outline h-10 inline-flex items-center gap-2">
                <LuRocket className="h-4 w-4" /> Start Project
              </Link>
            </>
          ) : (
            <>
              <Link to={portalPath} className="btn btn-outline h-10 inline-flex items-center gap-2">
                <LuLayoutDashboard className="h-4 w-4" /> Portal
              </Link>

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

                  <MenuLink to={myAccountPath} onClick={() => setMenuOpen(false)}>
                    <LuUser className="h-4 w-4" /> <span>My account</span>
                  </MenuLink>

                  {role === "client" && (
                    <MenuLink to={supportPath} onClick={() => setMenuOpen(false)}>
                      <LuLifeBuoy className="h-4 w-4" /> <span>Support</span>
                    </MenuLink>
                  )}

                  <button className="menu-item danger" onClick={doLogout} role="menuitem">
                    <LuLogOut className="h-4 w-4" /> <span>Logout</span>
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
          title={open ? "Close menu" : "Open menu"}
        >
          {open ? <LuX className="h-5 w-5 text-white/90" /> : <LuMenu className="h-5 w-5 text-white/90" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div className={["md:hidden overflow-hidden transition-[max-height,opacity] duration-300", open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"].join(" ")}>
        <div className="container-edge pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <nav className="p-2">
              <MobileLink to="/" onClick={closeMobile} end>
                <LuLayoutGrid className="h-4 w-4 mr-2" /> Home
              </MobileLink>
              <MobileLink to="/projects" onClick={closeMobile}>
                <LuFolderOpen className="h-4 w-4 mr-2" /> Projects
              </MobileLink>
              <MobileLink to="/services" onClick={closeMobile}>
                <LuWrench className="h-4 w-4 mr-2" /> Services
              </MobileLink>
              <MobileLink to="/pricing" onClick={closeMobile}>
                <LuTags className="h-4 w-4 mr-2" /> Pricing
              </MobileLink>
              <MobileLink to="/contact" onClick={closeMobile}>
                <LuMail className="h-4 w-4 mr-2" /> Contact
              </MobileLink>

              <div className="h-px my-2 bg-white/10" />

              {!isAuthed ? (
                <>
                  <MobileCTA to="/login" onClick={closeMobile} variant="primary">
                    <LuLogIn className="h-4 w-4 mr-2" /> Login
                  </MobileCTA>
                  <MobileCTA to="/contact" onClick={closeMobile} variant="outline">
                    <LuRocket className="h-4 w-4 mr-2" /> Start Project
                  </MobileCTA>
                </>
              ) : (
                <>
                  <MobileCTA to={portalPath} onClick={closeMobile} variant="outline">
                    <LuLayoutDashboard className="h-4 w-4 mr-2" /> Portal
                  </MobileCTA>
                  <MobileCTA to={myAccountPath} onClick={closeMobile} variant="outline">
                    <LuUser className="h-4 w-4 mr-2" /> My account
                  </MobileCTA>
                  {role === "client" && (
                    <MobileCTA to={supportPath} onClick={closeMobile} variant="outline">
                      <LuLifeBuoy className="h-4 w-4 mr-2" /> Support
                    </MobileCTA>
                  )}
                  <button
                    onClick={async () => { await doLogout(); closeMobile(); }}
                    className="w-full mt-2 h-11 rounded-xl font-bold bg-primary hover:bg-primaryAccent text-white inline-flex items-center justify-center gap-2"
                  >
                    <LuLogOut className="h-4 w-4" /> Logout
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

/* Re-usable dropdown item (keeps your .menu-item styles) */
function MenuLink({ to, onClick, children }) {
  return (
    <Link to={to} onClick={onClick} className="menu-item" role="menuitem">
      {children}
    </Link>
  );
}

/* ----- Mobile helpers (previously missing) ----- */
function MobileLink({ to, end, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block w-full px-3 py-3 rounded-xl font-semibold transition-colors inline-flex items-center",
          isActive ? "bg-white/10" : "hover:bg-white/5",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function MobileCTA({ to, variant = "primary", onClick, children }) {
  const base = "w-full mt-2 h-11 rounded-xl font-bold inline-flex items-center justify-center gap-2 transition-colors";
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