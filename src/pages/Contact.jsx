// src/pages/Contact.jsx
import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { FORMS_BASE } from "@/lib/forms.js";
import { useTheme } from "@/lib/theme.js";

/* Icons */
import { SiWhatsapp } from "react-icons/si";
import { LuCalendar, LuSend } from "react-icons/lu";

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        <SectionTitle
          eyebrow="Contact"
          title={isDark ? "Tell us about your project" : "Tell us about your project"}
          align="left"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <form className="space-y-3" onSubmit={submit}>
            <input
              type="text"
              autoComplete="name"
              className={
                isDark
                  ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                  : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
              }
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              aria-label="Your name"
              required
            />
            <input
              type="email"
              autoComplete="email"
              className={
                isDark
                  ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                  : "w-full h-12 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
              }
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              aria-label="Email"
              required
            />
            <textarea
              rows={6}
              className={
                isDark
                  ? "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                  : "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900"
              }
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              aria-label="Your message"
              required
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                className={
                  isDark
                    ? "btn btn-primary"
                    : "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#2563ff] hover:bg-[#2056da] text-white font-semibold"
                }
                disabled={submitting}
                type="submit"
              >
                <LuSend className="mr-1 h-5 w-5" aria-hidden="true" />
                {submitting ? "Sending…" : "Send message"}
              </button>

              {note && (
                <div
                  className={
                    isDark
                      ? "text-sm text-white/70 min-w-full"
                      : "text-sm text-slate-600 min-w-full"
                  }
                >
                  {note}
                </div>
              )}
            </div>
          </form>

          {/* Side card */}
          {isDark ? (
            <div className="card-surface p-5 rounded-2xl">
              <div className="font-black">How we’ll respond</div>
              <ul className="text-textSub mt-3 space-y-2 text-sm">
                <li>• You’ll get a reply within 1 business day.</li>
                <li>• We’ll invite you to the client portal if it’s a fit.</li>
                <li>• You can track progress, files, and discussions in one place.</li>
              </ul>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
              <div className="font-semibold text-slate-900">How we’ll respond</div>
              <ul className="text-slate-600 mt-3 space-y-2 text-sm">
                <li>• You’ll get a reply within 1 business day.</li>
                <li>• We’ll invite you to the client portal if it’s a fit.</li>
                <li>• You can track progress, files, and discussions in one place.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Inline CTA */}
        {isDark ? (
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
        ) : (
          <div className="mt-12 rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8 grid md:grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Have a project in mind?
              </h3>
              <p className="text-slate-500 mt-1">
                Tell us your goals — we’ll propose the simplest path to launch.
              </p>
            </div>

            <a
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-slate-900 text-white font-semibold shadow-sm"
              href={waHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Text me on WhatsApp"
            >
              <SiWhatsapp className="h-5 w-5" aria-hidden="true" />
              Text me on WhatsApp
            </a>

            <a
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm"
              href="https://calendly.com/mspixelpulse/30min"
              target="_blank"
              rel="noreferrer"
            >
              <LuCalendar className="h-5 w-5" aria-hidden="true" />
              Book appointment
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}