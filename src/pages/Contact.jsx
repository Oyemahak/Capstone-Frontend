// src/pages/Contact.jsx
import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { FORMS_BASE } from "@/lib/forms.js";

/* Icons */
import { SiWhatsapp } from "react-icons/si";
import { LuCalendar, LuSend } from "react-icons/lu";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");

  // Pre-filled WhatsApp CTA
  const waHref =
    "https://wa.me/13658830338?text=" +
    encodeURIComponent("Hi MSPixelPulse! I'm interested in a website. Can we chat?");

  async function submit(e) {
    e.preventDefault();
    setNote("");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setNote("Please fill out all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${FORMS_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to send");

      setNote("Thanks! Your message was sent. Please check your inbox.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setNote(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <Container>
        <SectionTitle eyebrow="Contact" title="Tell us about your project" align="left" />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form className="space-y-3" onSubmit={submit}>
            <input
              type="text"
              autoComplete="name"
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              aria-label="Your name"
              required
            />
            <input
              type="email"
              autoComplete="email"
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              aria-label="Email"
              required
            />
            <textarea
              rows={6}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              aria-label="Your message"
              required
            />

            <div className="flex flex-wrap items-center gap-3">
              <button className="btn btn-primary" disabled={submitting} type="submit">
                <LuSend className="mr-2 h-5 w-5" aria-hidden="true" />
                {submitting ? "Sending…" : "Send message"}
              </button>

              {note && <div className="text-sm text-white/70 min-w-full">{note}</div>}
            </div>
          </form>

          {/* Side card */}
          <div className="card-surface p-5">
            <div className="font-black">How we’ll respond</div>
            <ul className="text-textSub mt-3 space-y-2 text-sm">
              <li>• You’ll get a reply within 1 business day.</li>
              <li>• We’ll invite you to the client portal if it’s a fit.</li>
              <li>• You can track progress, files, and discussions in one place.</li>
            </ul>
          </div>
        </div>

        {/* Inline CTA */}
        <div className="mt-12 card-surface p-6 md:p-8 rounded-2xl grid md:grid-cols-[1fr_auto_auto] gap-4 items-center glass-hover">
          <div>
            <h3 className="text-2xl font-black">Have a project in mind?</h3>
            <p className="text-textSub mt-1 text-[16px] md:text-[18px] leading-relaxed">
              Tell us your goals — we’ll propose the simplest path to launch.
            </p>
          </div>

          <a
            className="btn btn-outline btn-shiny"
            href={waHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Text me on WhatsApp"
          >
            <SiWhatsapp className="mr-2 h-5 w-5" aria-hidden="true" />
            Text me on WhatsApp
          </a>

          <a
            className="btn btn-outline"
            href="https://calendly.com/mspixelpulse/30min"
            target="_blank"
            rel="noreferrer"
          >
            <LuCalendar className="mr-2 h-5 w-5" aria-hidden="true" />
            Book appointment
          </a>
        </div>
      </Container>
    </section>
  );
}