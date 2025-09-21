import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const ClientDashboard   = lazy(() => import("./ClientDashboard.jsx"));
const Files             = lazy(() => import("./Files.jsx"));
const Profile           = lazy(() => import("./Profile.jsx"));
// const ProjectDetailPage = lazy(() => import("./ProjectDetail.jsx"));

export default function ClientPortal() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<ClientDashboard />} />
        <Route path="files" element={<Files />} />
        <Route path="profile" element={<Profile />} />
        {/* <Route path="projects/:id" element={<ProjectDetailPage />} /> */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}