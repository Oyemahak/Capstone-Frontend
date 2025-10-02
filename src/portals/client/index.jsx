// src/portals/client/index.jsx  (a.k.a. ClientPortal)
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";

import ClientDashboard from "./ClientDashboard.jsx";
import Projects from "./Projects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Discussions from "./Discussions.jsx";
import Billings from "./Billings.jsx";
import Support from "./Support.jsx";
import MyAccount from "./MyAccount.jsx";

export default function ClientPortal() {
  return (
    <PortalShell>
      <Routes>
        {/* Dashboard should render the dashboard, not Projects */}
        <Route index element={<ClientDashboard />} />
        <Route path="dashboard" element={<ClientDashboard />} />

        {/* Projects */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />

        {/* Discussions */}
        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />

        {/* Utilities */}
        <Route path="billing" element={<Billings />} />
        <Route path="support" element={<Support />} />
        <Route path="my-account" element={<MyAccount />} />

        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </PortalShell>
  );
}