// src/App.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader.jsx";
import AppFooter from "./components/layout/AppFooter.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { ensureAwake } from "@/lib/api.js";

/** Public pages */
const Home          = lazy(() => import("./pages/Home.jsx"));
const Projects      = lazy(() => import("./pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const Services      = lazy(() => import("./pages/Services.jsx"));
const Pricing       = lazy(() => import("./pages/Pricing.jsx"));
const Contact       = lazy(() => import("./pages/Contact.jsx"));
const Login         = lazy(() => import("./pages/auth/Login.jsx"));
const Register      = lazy(() => import("./pages/auth/Register.jsx"));

/** Portals */
const AdminPortal  = lazy(() => import("@/portals/admin/index.jsx"));
const ClientPortal = lazy(() => import("@/portals/client/index.jsx"));
const DevPortal    = lazy(() => import("@/portals/dev/index.jsx"));

/** Optional */
const DebugConnection = lazy(() => import("./pages/DebugConnection.jsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [pathname]);
  return null;
}

function RequireRole({ allow, children }) {
  const { isAuthed, role } = useAuth();
  const location = useLocation();
  const allowed = Array.isArray(allow) ? allow : [allow];

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!allowed.includes(role)) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "developer") return <Navigate to="/dev" replace />;
    return <Navigate to="/client" replace />;
  }
  return children;
}

function PageFallback() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-white/10" />
        <div className="h-5 w-2/3 rounded bg-white/10" />
        <div className="h-64 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  );
}

function ProtectedLayout() {
  return <Outlet />;
}

export default function App() {
  // NEW: wake the backend once on first visit and show a tiny banner
  const [warming, setWarming] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { await ensureAwake(); } catch {}
      if (alive) setWarming(false);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-textMain">
      <AppHeader />

      <main className="flex-1 pt-16">
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/debug" element={<DebugConnection />} />

            {/* Admin */}
            <Route
              element={
                <RequireRole allow="admin">
                  <ProtectedLayout />
                </RequireRole>
              }
            >
              <Route path="/admin/*" element={<AdminPortal />} />
            </Route>

            {/* Developer */}
            <Route
              element={
                <RequireRole allow="developer">
                  <ProtectedLayout />
                </RequireRole>
              }
            >
              <Route path="/dev/*" element={<DevPortal />} />
            </Route>

            {/* Client */}
            <Route
              element={
                <RequireRole allow="client">
                  <ProtectedLayout />
                </RequireRole>
              }
            >
              <Route path="/client/*" element={<ClientPortal />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <AppFooter />
    </div>
  );
}