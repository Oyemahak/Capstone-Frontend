// src/portals/admin/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";

import AdminDashboard from "./AdminDashboard.jsx";
import Users from "./Users.jsx";
import UserDetail from "./UserDetail.jsx";
import CreateUser from "./CreateUser.jsx";
import Projects from "./Projects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Approvals from "./Approvals.jsx";
import Settings from "./Settings.jsx";

export default function AdminPortal() {
  return (
    <PortalShell title="Admin Portal" items={[
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/approvals", label: "Approvals" },
      { to: "/admin/users",     label: "Users" },
      { to: "/admin/projects",  label: "Projects" },
      { to: "/admin/settings",  label: "Settings" },
    ]}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="approvals" element={<Approvals />} />

        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<CreateUser />} />
        <Route path="users/:userId" element={<UserDetail />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />

        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </PortalShell>
  );
}