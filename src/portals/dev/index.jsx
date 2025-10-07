// src/portals/dev/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";

import DevDashboard from "./DevDashboard.jsx";
import Projects from "./Projects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import Team from "./Team.jsx";
import Settings from "./Settings.jsx";
import Discussions from "./Discussions.jsx";
import Direct from "./Direct.jsx";
// NEW
import Requirements from "./Requirements.jsx";

export default function DevPortal() {
  return (
    <PortalShell>
      <Routes>
        <Route index element={<DevDashboard />} />
        <Route path="dashboard" element={<DevDashboard />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        {/* NEW: Requirements page for this project */}
        <Route path="projects/:projectId/requirements" element={<Requirements />} />

        {/* Project rooms */}
        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />

        {/* Direct messages */}
        <Route path="direct" element={<Direct />} />
        <Route path="direct/:peerId" element={<Direct />} />

        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </PortalShell>
  );
}