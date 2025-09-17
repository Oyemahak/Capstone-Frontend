import { Routes, Route, useParams } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader.jsx";
import AppFooter from "./components/layout/AppFooter.jsx";

import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Services from "./pages/Services.jsx";
import Pricing from "./pages/Pricing.jsx";
import Contact from "./pages/Contact.jsx";

import Login from "./pages/auth/Login.jsx";
import Apply from "./pages/applicant/Apply.jsx";
import Requirements from "./pages/applicant/Requirements.jsx";

import Dashboard from "./pages/client/Dashboard.jsx";
import ProjectOverview from "./pages/client/ProjectOverview.jsx";
import ProjectFiles from "./pages/client/ProjectFiles.jsx";
import ProjectDiscussion from "./pages/client/ProjectDiscussion.jsx";
import Profile from "./pages/client/Profile.jsx";

function ProjectDetailByParam() {
  const { id } = useParams();
  return <ProjectDetail id={id} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-textMain">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetailByParam />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/requirements" element={<Requirements />} />

        <Route path="/client" element={<Dashboard />} />
        <Route path="/client/project/:id" element={<ProjectOverview />} />
        <Route path="/client/project/:id/files" element={<ProjectFiles />} />
        <Route path="/client/project/:id/discussion" element={<ProjectDiscussion />} />
        <Route path="/client/profile" element={<Profile />} />
      </Routes>
      <AppFooter />
    </div>
  );
}