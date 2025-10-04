// frontend/src/pages/Contact.jsx
import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "");

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");

  async function submit(e) {
    e.preventDefault();
    setNote("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setNote("Please fill out all fields.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
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
          title="Tell us about your project"
          align="left"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <form className="space-y-3" onSubmit={submit}>
            <input
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
            <input
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />
            <textarea
              rows={6}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
            />
            <div className="flex items-center gap-3">
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </button>
              {note && (
                <div className="text-sm text-white/70">{note}</div>
              )}
            </div>
          </form>

          <div className="card-surface p-5">
            <div className="font-black">How we’ll respond</div>
            <ul className="text-textSub mt-3 space-y-2 text-sm">
              <li>• You’ll get a reply within 1 business day.</li>
              <li>• We’ll invite you to the client portal if it’s a fit.</li>
              <li>• You can track progress, files, and discussions in one place.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}