// src/components/Feedback.jsx
import { useMemo, useState } from "react";
import Container from "@/components/layout/Container.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { FORMS_BASE } from "@/lib/forms.js";
import { useTheme } from "@/lib/theme.js";

/** Testimonials (you already had these) */
const FALLBACK = [
  {
    name: "Sukhdeep Brar",
    business: "Owner, Aimze Studio (Salon & Spa)",
    message:
      "Loved the clean booking experience and modern look — the site feels fast and easy for our clients.",
  },
  {
    name: "Sajjala Sankhe",
    business: "Admin, CanSTEM Education",
    message:
      "The site is clear, accessible, and simple for parents to navigate. Project delivery was smooth and on time.",
  },
  {
    name: "Dazzling Smile Team",
    business: "Dental Clinic",
    message:
      "Professional and friendly from day one. Patients can find services quickly and contact us without friction.",
  },
  {
    name: "Avery Thompson",
    business: "Owner, Maple & Pine Studio (Canada)",
    message:
      "A polished build with great attention to detail. Performance and accessibility were genuinely impressive.",
  },
  {
    name: "Rohit Sharma",
    business: "Founder, PixelForge India",
    message:
      "Clear communication, quick iterations, and a premium UI. Exactly what our brand needed to stand out.",
  },
  {
    name: "Ananya Iyer",
    business: "Marketing Lead, Trident Tech",
    message:
      "From kickoff to launch, everything was smooth. The CMS handoff made it simple for our team to manage.",
  },
];

export default function Feedback() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [items] = useState(FALLBACK);
  const [idx, setIdx] = useState(0);

  // manual prev/next only (no autoplay)
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);

  // 3-up window
  const trio = useMemo(() => {
    if (!items.length) return [];
    return [
      items[(idx + 0) % items.length],
      items[(idx + 1) % items.length],
      items[(idx + 2) % items.length],
    ];
  }, [items, idx]);

  // modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");

  async function submit(e) {
    e.preventDefault();
    setNote("");

    const { name, email, business, subject, message } = form;
    if (!name.trim() || !email.trim() || !business.trim() || !message.trim()) {
      setNote("Please fill out all fields.");
      return;
    }

    // Fold business + subject into message so API stays the same
    const payloadMessage =
      `New Feedback\n\n` +
      `From: ${name.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Business: ${business.trim()}\n` +
      (subject.trim() ? `Subject: ${subject.trim()}\n` : "") +
      `\nMessage:\n${message.trim()}`;

    try {
      setSending(true);
      const res = await fetch(`${FORMS_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: payloadMessage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to send");
      setNote("Thanks! Your feedback was emailed to us.");
      setForm({ name: "", email: "", business: "", subject: "", message: "" });
      setTimeout(() => setOpen(false), 900);
    } catch (err) {
      setNote(err.message || "Could not send right now. Please email us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section pt-6">
      <Container>
        <SectionTitle
          eyebrow="Feedback"
          title={isDark ? "What clients say" : "What clients say"}
          centered
        />

        {/* FRAME */}
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            className={
              isDark
                ? "review-arrow review-arrow--left hidden md:grid"
                : "review-arrow review-arrow--left hidden md:grid bg-slate-900/70 border-slate-100/20 text-white"
            }
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            className={
              isDark
                ? "review-arrow review-arrow--right hidden md:grid"
                : "review-arrow review-arrow--right hidden md:grid bg-slate-900/70 border-slate-100/20 text-white"
            }
          >
            ›
          </button>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {trio.map((t, i) => (
              <figure
                key={`${t.name}-${i}`}
                className={
                  isDark
                    ? "review-card glass-tint"
                    : "rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col min-h-[210px]"
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  {isDark ? (
                    <div className="avatar-pill" aria-hidden>
                      {String(t.name || "C").trim().charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-900/5 text-slate-900 font-bold grid place-items-center">
                      {String(t.name || "C").trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="leading-tight">
                    <div
                      className={
                        isDark
                          ? "font-semibold flex items-center gap-1"
                          : "font-semibold flex items-center gap-1 text-slate-900"
                      }
                    >
                      {t.name}
                    </div>
                    <div
                      className={
                        isDark ? "text-white/60 text-xs" : "text-slate-500 text-xs"
                      }
                    >
                      {t.business}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                {isDark ? (
                  <div className="stars" aria-hidden>
                    ★★★★★
                  </div>
                ) : (
                  <div className="flex gap-1 text-amber-400 text-sm" aria-hidden>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                )}

                <blockquote
                  className={
                    isDark
                      ? "review-quote mt-2"
                      : "mt-3 text-slate-600 text-sm leading-relaxed"
                  }
                >
                  “{t.message}”
                </blockquote>
              </figure>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={
                    isDark
                      ? [
                          "h-2.5 w-2.5 rounded-full transition",
                          isActive ? "bg-white/90" : "bg-white/30 hover:bg-white/50",
                        ].join(" ")
                      : [
                          "h-2.5 w-2.5 rounded-full transition",
                          isActive ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400",
                        ].join(" ")
                  }
                  aria-label={`Go to slide ${i + 1}`}
                />
              );
            })}
          </div>

          {/* Leave a review */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setNote("");
                setOpen(true);
              }}
              className={
                isDark
                  ? "btn btn-outline"
                  : "inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm hover:bg-slate-50"
              }
              type="button"
            >
              Leave a review
            </button>
          </div>
        </div>
      </Container>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className={
              isDark
                ? "modal-panel"
                : "w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={
                isDark ? "font-black text-lg" : "font-bold text-lg text-slate-900"
              }
            >
              Share your feedback
            </div>
            <p className={isDark ? "text-textSub text-sm mt-1" : "text-slate-500 text-sm mt-1"}>
              Your message will be emailed to us.
            </p>

            <form className="mt-4 space-y-3" onSubmit={submit}>
              <input
                className={
                  isDark
                    ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                    : "w-full h-11 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
                }
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
              <input
                className={
                  isDark
                    ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                    : "w-full h-11 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
                }
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              />
              <input
                className={
                  isDark
                    ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                    : "w-full h-11 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
                }
                placeholder="Business / Organization"
                value={form.business}
                onChange={(e) => setForm((s) => ({ ...s, business: e.target.value }))}
              />
              <input
                className={
                  isDark
                    ? "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                    : "w-full h-11 rounded-xl bg-white border border-slate-200 px-4 text-slate-900"
                }
                placeholder="Subject (optional)"
                value={form.subject}
                onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
              />
              <textarea
                rows={5}
                className={
                  isDark
                    ? "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                    : "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-slate-900"
                }
                placeholder="Your feedback"
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              />
              {note && (
                <div className={isDark ? "text-sm text-white/80" : "text-sm text-slate-500"}>
                  {note}
                </div>
              )}

              <div className="form-actions justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={
                    isDark
                      ? "btn btn-outline"
                      : "inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50"
                  }
                >
                  Cancel
                </button>
                <button
                  className={
                    isDark
                      ? "btn btn-primary"
                      : "inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-slate-900 text-white font-semibold"
                  }
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}