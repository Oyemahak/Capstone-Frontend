import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const DevDashboard = lazy(() => import("./DevDashboard.jsx"));
const Profile      = lazy(() => import("./Profile.jsx"));

export default function DevPortal() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route index element={<DevDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Suspense>
  );
}