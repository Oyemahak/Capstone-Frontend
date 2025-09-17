import { Link, NavLink } from "react-router-dom";
import Container from "./Container.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur">
      <Container>
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="font-black text-xl">MSPixelPulse</Link>
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-semibold ${isActive ? "text-white" : "text-textSub"} hover:text-white`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/apply" className="btn btn-primary">Start Project</Link>
          </div>
        </div>
      </Container>
    </header>
  );
}