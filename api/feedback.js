// Vercel Serverless Function: /api/contact
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple 15s per-IP cooldown
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const last = hits.get(ip) || 0;
  hits.set(ip, now);
  return now - last < 15000;
}

export default async function handler(req, res) {
  const headers = {
    "Access-Control-Allow-Origin": "*", // dev: allow localhost to hit prod function
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    return res.end();
  }
  if (req.method !== "POST") {
    res.writeHead(405, headers);
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0] ||
      req.socket?.remoteAddress ||
      "unknown";
    if (rateLimited(ip)) {
      res.writeHead(429, headers);
      return res.end(JSON.stringify({ error: "Too many requests, please wait a moment." }));
    }

    const { name = "", email = "", message = "", _hp } = req.body || {};
    if (_hp) {
      res.writeHead(200, headers);
      return res.end(JSON.stringify({ ok: true }));
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      res.writeHead(400, headers);
      return res.end(JSON.stringify({ error: "Please fill out all fields." }));
    }

    const to = process.env.FORMS_TO_EMAIL;
    const from = process.env.FORMS_FROM_EMAIL || "MSPixelPulse <no-reply@mspixelpulse.com>";

    const pretty = `
New Website Inquiry

Name: ${name}
Email: ${email}

Message:
${message}
IP: ${ip}
    `.trim();

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h2 style="margin:0 0 8px">New Website Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeAttr(email)}">${escapeHTML(email)}</a></p>
        <p style="margin:12px 0 4px"><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:12px">${escapeHTML(message)}</div>
        <p style="margin-top:12px;color:#64748b;font-size:12px">IP: ${escapeHTML(ip)}</p>
      </div>
    `;

    await resend.emails.send({
      from,
      to,
      subject: `New contact: ${name}`,
      text: pretty,
      html,
      reply_to: email,
    });

    res.writeHead(201, headers);
    return res.end(JSON.stringify({ ok: true, message: "Sent" }));
  } catch (err) {
    console.error("[contact] send error:", err);
    res.writeHead(500, headers);
    return res.end(JSON.stringify({ error: "Failed to send message. Please try again later." }));
  }
}

function escapeHTML(s = "") {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function escapeAttr(s = "") {
  return escapeHTML(s).replace(/"/g, "&quot;");
}