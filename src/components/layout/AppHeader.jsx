import { NavLink, useLocation } from "react-router-dom";
import Container from "./Container.jsx";

const nav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export default function AppHeader() {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* subtle gradient behind header */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="backdrop-blur supports-[backdrop-filter]:bg-surface/40 border-b border-white/10">
        <Container className="h-16 flex items-center justify-between">
          <div className="font-black tracking-tight">MSPixelPulse</div>

          <nav className="hidden md:flex gap-2">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-textSub hover:bg-white/5"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <NavLink to="/login" className="btn btn-outline h-9 px-4">
              Login
            </NavLink>
            <NavLink to="/contact" className="btn btn-primary h-9 px-4">
              Start Project
            </NavLink>
          </div>
        </Container>
      </div>

      {/* active route underline shimmer */}
      <div className="absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {pathname !== "/" && (
        <div className="absolute inset-x-0 -z-10 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
      )}
    </header>
  );
}