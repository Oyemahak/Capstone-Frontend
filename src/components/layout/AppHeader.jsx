// src/components/layout/AppHeader.jsx
import { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function AppHeader() {
  const { isAuthed, role, user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const portalPath = () => (role === "admin" ? "/admin" : role === "developer" ? "/dev" : "/client");

  async function doLogout() {
    await logout();
    nav("/", { replace: true });
    setOpen(false);
  }

  // Close on route change (when any link is clicked)
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
  }, []);

  const linkClass = ({ isActive }) =>
    [
      "px-3 py-2 rounded-lg text-sm font-semibold",
      isActive ? "bg-white/10" : "hover:bg-white/5",
    ].join(" ");

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="container-edge h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-black" onClick={close}>
          MSPixelPulse
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>
          <NavLink to="/pricing" className={linkClass}>
            Pricing
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {!isAuthed ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    "px-4 h-10 rounded-xl font-bold inline-flex items-center",
                    isActive ? "bg-white/10" : "bg-transparent hover:bg-white/5",
                  ].join(" ")
                }
              >
                Login
              </NavLink>
              <Link to="/contact" className="btn btn-primary h-10">
                Start Project
              </Link>
            </>
          ) : (
            <>
              <span className="text-xs text-white/60">
                {user?.name} · {user?.email}
              </span>
              <Link to={portalPath()} className="btn btn-outline h-10">
                Portal
              </Link>
              <button onClick={doLogout} className="btn btn-primary h-10">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile: hamburger (replaces Start Project button) */}
        <button
          className="md:hidden inline-grid place-items-center h-10 w-10 rounded-xl hover:bg-white/10"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="text-white/90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        className={[
          "md:hidden overflow-hidden transition-[max-height,opacity] duration-300",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <div className="container-edge pb-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <nav className="p-2">
              <MobileLink to="/" onClick={close} end>
                Home
              </MobileLink>
              <MobileLink to="/projects" onClick={close}>
                Projects
              </MobileLink>
              <MobileLink to="/services" onClick={close}>
                Services
              </MobileLink>
              <MobileLink to="/pricing" onClick={close}>
                Pricing
              </MobileLink>
              <MobileLink to="/contact" onClick={close}>
                Contact
              </MobileLink>

              <div className="h-px my-2 bg-white/10" />

              {!isAuthed ? (
                <>
                  <MobileCTA to="/login" onClick={close} variant="outline">
                    Login
                  </MobileCTA>
                  <MobileCTA to="/contact" onClick={close} variant="primary">
                    Start Project
                  </MobileCTA>
                </>
              ) : (
                <>
                  <MobileCTA to={portalPath()} onClick={close} variant="outline">
                    Portal
                  </MobileCTA>
                  <button
                    onClick={doLogout}
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

/* ---------- Small helpers for mobile sheet ---------- */

function MobileLink({ to, end, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block w-full px-3 py-3 rounded-xl font-semibold",
          isActive ? "bg-white/10" : "hover:bg-white/5",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

function MobileCTA({ to, variant = "primary", onClick, children }) {
  const base = "w-full mt-2 h-11 rounded-xl font-bold";
  const styles =
    variant === "primary"
      ? "bg-primary hover:bg-primaryAccent text-white"
      : "border border-white/10 bg-transparent text-textMain hover:bg-white/5";
  return (
    <Link to={to} onClick={onClick} className={[base, styles, "inline-flex items-center justify-center"].join(" ")}>
      {children}
    </Link>
  );
}