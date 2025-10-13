// src/lib/forms.js
// When running locally, POST to your deployed Vercel Functions.
// In production (on Vercel), POST to same-origin /api.
const VERCEL_PROD_BASE = "https://mspixelpulse.vercel.app/api";

export const FORMS_BASE =
  window.location.hostname === "localhost"
    ? VERCEL_PROD_BASE
    : "/api";