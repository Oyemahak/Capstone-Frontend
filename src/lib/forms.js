// src/lib/forms.js
// FINAL — supports both new helpers and legacy FORMS_BASE import

const IS_LOCAL =
  typeof window !== "undefined" && window.location.hostname === "localhost";

// In dev, we proxy to Vercel via /vercel-api (vite proxy). In prod, same-origin /api.
const BASE = IS_LOCAL ? "/vercel-api" : "/api";

// 🔁 Back-compat for older components that import { FORMS_BASE }
export const FORMS_BASE = BASE;

// Helper: send URL-encoded (simple CORS => no preflight during local dev)
async function postFormEncoded(path, payload = {}) {
  const body = new URLSearchParams();

  Object.entries(payload).forEach(([k, v]) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      // flatten one level: meta.page -> meta.page
      Object.entries(v).forEach(([kk, vv]) =>
        body.append(`${k}.${kk}`, String(vv ?? ""))
      );
    } else if (Array.isArray(v)) {
      v.forEach((item) => body.append(`${k}[]`, String(item ?? "")));
    } else {
      body.append(k, String(v ?? ""));
    }
  });

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
  });

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

/** Public site “Contact” */
export function contact({ name, email, subject, message, meta = {} }) {
  return postFormEncoded("/contact", {
    name,
    email,
    subject,
    message,
    ...meta,
  });
}

/** Client Portal “Support” (uses same /api/contact function) */
export function support({ subject, message, meta = {} }) {
  const extra = {
    source: "client-portal",
    ts: Date.now(),
    href: typeof window !== "undefined" ? window.location.href : "",
    ...meta,
  };

  return postFormEncoded("/contact", {
    name: extra.userEmail || "Client User",
    email: extra.userEmail || "noreply@mspixelpulse.com",
    subject,
    message,
    ...extra,
  });
}

// Optional alias if you have a Feedback form component
export const feedback = contact;