import { Routes, Route, Navigate } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader.jsx";
import AppFooter from "./components/layout/AppFooter.jsx";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Services from "./pages/Services.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";

import Login from "./pages/auth/Login.jsx";

import Dashboard from "./pages/client/Dashboard.jsx";
import ProjectOverview from "./pages/client/ProjectOverview.jsx";
import ProjectFiles from "./pages/client/ProjectFiles.jsx";
import ProjectDiscussion from "./pages/client/ProjectDiscussion.jsx";
import Profile from "./pages/client/Profile.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-textMain">
      <AppHeader />

      <main className="flex-1 pt-16">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Client portal */}
          <Route path="/client" element={<Dashboard />} />
          <Route path="/client/overview" element={<ProjectOverview />} />
          <Route path="/client/files" element={<ProjectFiles />} />
          <Route path="/client/discussion" element={<ProjectDiscussion />} />
          <Route path="/client/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AppFooter />
    </div>
  );
}