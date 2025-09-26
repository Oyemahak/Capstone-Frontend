// src/portals/dev/index.jsx
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import DevDashboard from "./DevDashboard.jsx";
import Profile from "./Profile.jsx";

export default function DevPortal() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 space-y-6">
      <nav className="flex gap-3 text-sm">
        <NavLink to="/dev" end className={({isActive})=>`px-3 py-1 rounded ${isActive?"bg-brand text-black":"bg-white/10"}`}>Dashboard</NavLink>
        <NavLink to="/dev/profile" className={({isActive})=>`px-3 py-1 rounded ${isActive?"bg-brand text-black":"bg-white/10"}`}>Profile</NavLink>
      </nav>
      <Routes>
        <Route index element={<DevDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dev" replace />} />
      </Routes>
    </div>
  );
}