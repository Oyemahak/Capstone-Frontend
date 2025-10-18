// src/lib/forms.js
// Where to send forms:
// - Local dev (http://localhost:5173): proxy to your Vercel functions via /vercel-api/*
//   (vite.config.js already rewrites /vercel-api -> https://mspixelpulse.vercel.app/api)
// - Production (on Vercel): same-origin /api/*
const IS_LOCAL = typeof window !== "undefined" && window.location.hostname === "localhost";

// Compose the base URL used by all form posts
const BASE = IS_LOCAL ? "/vercel-api" : "/api";

// Helper: POST as URL-encoded to avoid CORS preflight (simple request)
async function postFormEncoded(path, payload = {}) {
  const body = new URLSearchParams();
  // Flatten simple JSON into key=value pairs
  Object.entries(payload).forEach(([k, v]) => {
    // Allow nested meta.* keys (meta.page -> meta.page)
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.entries(v).forEach(([kk, vv]) => {
        body.append(`${k}.${kk}`, String(vv ?? ""));
      });
    } else if (Array.isArray(v)) {
      v.forEach((item) => body.append(`${k}[]`, String(item ?? "")));
    } else {
      body.append(k, String(v ?? ""));
    }
  });

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    // Only simple headers -> no preflight
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });

  // Best-effort: some functions return JSON, others may just 200 text
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (typeof data === "object" ? data?.message || data?.error : data) ||
      `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/**
 * Public contact form (already on your public site)
 * You likely already use /api/contact there. Keeping for completeness.
 */
export function contact({ name, email, subject, message, meta = {} }) {
  return postFormEncoded("/contact", {
    name,
    email,
    subject,
    message,
    ...meta, // optional extra fields
  });
}

/**
 * Client Portal Support form
 * Uses the same Vercel function as contact by default (/api/contact),
 * so you don’t need a new backend route.
 * If you later add a dedicated /api/leads/support function, simply
 * change the path below to "/leads/support".
 */
export function support({ subject, message, meta = {} }) {
  // Enrich meta a bit so your inbox sees context
  const extra = {
    source: "client-portal",
    ts: Date.now(),
    href: typeof window !== "undefined" ? window.location.href : "",
    ...meta,
  };

  // Use your account email as the recipient; subject/body as provided
  // If your /api/contact requires a name/email, pass safe defaults.
  return postFormEncoded("/contact", {
    name: extra.userEmail || "Client User",
    email: extra.userEmail || "noreply@mspixelpulse.com",
    subject,
    message,
    ...extra,
  });
}