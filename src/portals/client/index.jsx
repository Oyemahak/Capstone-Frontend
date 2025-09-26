// src/portals/client/index.jsx
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import ClientDashboard from "./ClientDashboard.jsx";
import Profile from "./Profile.jsx";
import Files from "./Files.jsx";

export default function ClientPortal() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 space-y-6">
      <nav className="flex gap-3 text-sm">
        <NavLink to="/client" end className={({isActive})=>`px-3 py-1 rounded ${isActive?"bg-brand text-black":"bg-white/10"}`}>Dashboard</NavLink>
        <NavLink to="/client/files" className={({isActive})=>`px-3 py-1 rounded ${isActive?"bg-brand text-black":"bg-white/10"}`}>Files</NavLink>
        <NavLink to="/client/profile" className={({isActive})=>`px-3 py-1 rounded ${isActive?"bg-brand text-black":"bg-white/10"}`}>Profile</NavLink>
      </nav>
      <Routes>
        <Route index element={<ClientDashboard />} />
        <Route path="files" element={<Files />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Routes>
    </div>
  );
}