// src/portals/admin/index.jsx
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import Users from "./Users.jsx";
import UserDetail from "./UserDetail.jsx";
import Approvals from "./Approvals.jsx";
import Projects from "./Projects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Settings from "./Settings.jsx";
import CreateUser from "./CreateUser.jsx";

export default function AdminPortal() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 space-y-6">
      <nav className="flex gap-3 text-sm">
        {[
          ["Dashboard", "/admin"],
          ["Users", "/admin/users"],
          ["Approvals", "/admin/approvals"],
          ["Projects", "/admin/projects"],
          ["Create User", "/admin/create-user"],
          ["Settings", "/admin/settings"],
        ].map(([label, href]) => (
          <NavLink key={href} to={href} className={({isActive}) =>
            `px-3 py-1 rounded ${isActive ? "bg-brand text-black" : "bg-white/10"}`
          }>{label}</NavLink>
        ))}
      </nav>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
}