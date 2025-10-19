// frontend/src/portals/admin/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import PortalShell from "@/components/portal/PortalShell.jsx";

import AdminDashboard from "./AdminDashboard.jsx";
import Users from "./Users.jsx";
import UserDetail from "./UserDetail.jsx";
import CreateUser from "./CreateUser.jsx";
import Projects from "./Projects.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import ProjectNew from "./ProjectNew.jsx";
import Approvals from "./Approvals.jsx";
import Billings from "./Billings.jsx";

import Discussions from "./Discussions.jsx";
import DirectIndex from "./DirectIndex.jsx";
import Direct from "./Direct.jsx";

import Requirements from "./Requirements.jsx";
import MyAccount from "./MyAccount.jsx";

export default function AdminPortal() {
  return (
    <PortalShell>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="approvals" element={<Approvals />} />

        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<CreateUser />} />
        <Route path="users/:userId" element={<UserDetail />} />

        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={<ProjectNew />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="projects/:projectId/requirements" element={<Requirements />} />

        <Route path="billing" element={<Billings />} />

        <Route path="discussions" element={<Discussions />} />
        <Route path="discussions/:projectId" element={<Discussions />} />

        <Route path="direct" element={<DirectIndex />} />
        <Route path="direct/:peerId" element={<Direct />} />

        <Route path="my-account" element={<MyAccount />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </PortalShell>
  );
}