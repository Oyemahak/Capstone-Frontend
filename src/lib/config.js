// src/lib/config.js
export const API_BASE =
  import.meta.env.VITE_API_BASE
  || (window.location.hostname === "localhost"
        ? "http://localhost:4000/api"
        : "/api");