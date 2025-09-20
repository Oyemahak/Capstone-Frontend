import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navByRole = {
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/approvals', label: 'Approvals' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/projects', label: 'Projects' },
    { to: '/admin/settings', label: 'Settings' },
  ],
  developer: [
    { to: '/dev', label: 'Dashboard' },
    { to: '/dev/projects', label: 'My Projects' },
    { to: '/dev/profile', label: 'Profile' },
  ],
  client: [
    { to: '/client', label: 'Dashboard' },
    { to: '/client/projects', label: 'Projects' },
    { to: '/client/files', label: 'Files' },
    { to: '/client/profile', label: 'Profile' },
  ],
};

export default function PortalShell({ children }) {
  const { user, logout } = useAuth();
  const items = navByRole[user?.role] || [];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block border-r border-white/10 p-5 bg-surface/40 backdrop-blur">
        <Link to="/" className="block text-xl font-black mb-8">MSPixelPlus</Link>
        <nav className="space-y-1">
          {items.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl hover:bg-white/5 ${isActive ? 'bg-white/10 font-bold' : ''}`
              }>
              {i.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-col">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/60 backdrop-blur">
          <div className="flex items-center justify-between p-4">
            <div className="font-extrabold">{user?.role?.toUpperCase()} Portal</div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-textSub hidden sm:block">
                {user?.name} · {user?.email}
              </span>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}