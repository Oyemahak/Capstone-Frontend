// src/portals/client/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";

import Projects from "./Projects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Discussions from "./Discussions.jsx";
import MyAccount from "./MyAccount.jsx";   // ← renamed import
import Billings from "./Billings.jsx";
import Support from "./Support.jsx";

export default function ClientPortal() {
  return (
    <PortalShell>
      <Routes>
        {/* Dashboard lands on Projects for clients */}
        <Route index element={<Projects />} />

        {/* Projects */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />

        {/* Discussions */}
        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />

        {/* Billing & Support */}
        <Route path="billing" element={<Billings />} />
        <Route path="support" element={<Support />} />

        {/* My account (renamed from Profile) */}
        <Route path="my-account" element={<MyAccount />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </PortalShell>
  );
}