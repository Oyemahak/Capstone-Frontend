// src/main.jsx
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { API_BASE } from "@/lib/api.js";

function WarmBackendOnce() {
  useEffect(() => {
    // Fire and forget: this will warm your Render dyno
    const url = `${API_BASE}/health`;
    fetch(url, { method: "GET", credentials: "include" })
      .then(() => console.log("✅ Backend wake ping sent:", url))
      .catch(() => console.log("⚠️ Backend wake ping failed (will not block UI)"));
  }, []);
  return null;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WarmBackendOnce />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);