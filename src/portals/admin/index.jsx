import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const AdminDashboard = lazy(() => import("./AdminDashboard.jsx"));
const Approvals      = lazy(() => import("./Approvals.jsx"));
const Users          = lazy(() => import("./Users.jsx"));
const UserDetail     = lazy(() => import("./UserDetail.jsx"));
const CreateUser     = lazy(() => import("./CreateUser.jsx"));
const Projects       = lazy(() => import("./Projects.jsx"));
const ProjectDetail  = lazy(() => import("./ProjectDetail.jsx"));
const Settings       = lazy(() => import("./Settings.jsx"));

export default function AdminPortal() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="users" element={<Users />} />
        <Route path="users/new" element={<CreateUser />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}