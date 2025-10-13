// Vercel Serverless Function: /api/feedback
// Emails feedback to you (same reliability as contact). No database.

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const hits = new Map();
function rateLimited(ip) { const n = Date.now(), last = hits.get(ip) || 0; hits.set(ip, n); return n - last < 15000; }

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress || 'unknown';
        if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests, please wait a moment.' });

        const { name = '', email = '', message = '', _hp } = req.body || {};
        if (_hp) return res.status(200).json({ ok: true });

        if (!name.trim() || !email.trim() || !message.trim()) {
            return res.status(400).json({ error: 'Please fill in all fields.' });
        }

        const to = process.env.FORMS_TO_EMAIL;
        const from = process.env.FORMS_FROM_EMAIL || 'MSPixelPulse <no-reply@mspixelpulse.com>';

        const pretty = `
New Feedback

Name: ${name}
Email: ${email}

Feedback:
${message}
IP: ${ip}
    `.trim();

        const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h2 style="margin:0 0 8px">New Feedback</h2>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeAttr(email)}">${escapeHTML(email)}</a></p>
        <p style="margin:12px 0 4px"><strong>Feedback:</strong></p>
        <div style="white-space:pre-wrap;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;padding:12px">${escapeHTML(message)}</div>
        <p style="margin-top:12px;color:#64748b;font-size:12px">IP: ${escapeHTML(ip)}</p>
      </div>
    `;

        await resend.emails.send({
            from,
            to,
            subject: `New feedback: ${name}`,
            text: pretty,
            html,
            reply_to: email,
        });

        return res.status(201).json({ ok: true, message: 'Sent' });
    } catch (err) {
        console.error('[feedback] send error:', err);
        return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
}

function escapeHTML(s = '') { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function escapeAttr(s = '') { return escapeHTML(s).replace(/"/g, '&quot;'); }