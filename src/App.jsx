import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";

import AppHeader from "./components/layout/AppHeader.jsx";
import AppFooter from "./components/layout/AppFooter.jsx";

/** Public pages (lazy) */
const Home = lazy(() => import("./pages/Home.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

/** Auth */
const Login = lazy(() => import("./pages/auth/Login.jsx"));

/** Client/Developer portal */
const Dashboard = lazy(() => import("./pages/client/Dashboard.jsx"));
const ProjectOverview = lazy(() => import("./pages/client/ProjectOverview.jsx"));
const ProjectFiles = lazy(() => import("./pages/client/ProjectFiles.jsx"));
const ProjectDiscussion = lazy(() => import("./pages/client/ProjectDiscussion.jsx"));
const Profile = lazy(() => import("./pages/client/Profile.jsx"));

/** Debug utility (optional, but very helpful) */
const DebugConnection = lazy(() => import("./pages/DebugConnection.jsx"));

/* ------------------------------
   Small in-file utilities
--------------------------------*/

/** Smoothly scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

/** Minimal localStorage-backed auth snapshot */
function useAuthState() {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "auth") {
        setAuth(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return useMemo(
    () => ({
      user: auth, // { token, role, name, email, id }
      isAuthed: !!auth?.token,
      role: auth?.role || null,
      setAuth,
      logout: () => {
        localStorage.removeItem("auth");
        setAuth(null);
      },
    }),
    [auth]
  );
}

/** Route guard: requires login */
function RequireAuth({ children }) {
  const { isAuthed } = useAuthState();
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

/** Route guard: requires specific role(s) */
function RequireRole({ allow, children }) {
  const { isAuthed, role } = useAuthState();
  const location = useLocation();
  const allowed = Array.isArray(allow) ? allow : [allow];

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!allowed.includes(role)) {
    // If logged in but not permitted, send to client dashboard
    return <Navigate to="/client" replace />;
  }
  return children;
}

/** Simple skeleton while lazy chunks load */
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

/** Wrapper for protected areas (keeps header/footer consistent) */
function ProtectedLayout() {
  return <Outlet />;
}

/* ------------------------------
   App
--------------------------------*/
export default function App() {
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

            {/* Debug utilities (remove in prod if you like) */}
            <Route path="/debug" element={<DebugConnection />} />

            {/* Client/Developer shared area (requires auth) */}
            <Route
              element={
                <RequireAuth>
                  <ProtectedLayout />
                </RequireAuth>
              }
            >
              <Route path="/client" element={<Dashboard />} />
              <Route path="/client/overview" element={<ProjectOverview />} />
              <Route path="/client/files" element={<ProjectFiles />} />
              <Route path="/client/discussion" element={<ProjectDiscussion />} />
              <Route path="/client/profile" element={<Profile />} />
            </Route>

            {/* Future examples:
            <Route element={<RequireRole allow="admin"><ProtectedLayout /></RequireRole>}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route element={<RequireRole allow="developer"><ProtectedLayout /></RequireRole>}>
              <Route path="/dev" element={<DeveloperDashboard />} />
            </Route>
            */}

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <AppFooter />
    </div>
  );
}