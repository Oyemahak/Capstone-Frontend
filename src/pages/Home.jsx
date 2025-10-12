// src/pages/Home.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import LiquidEther from "../components/effects/LiquidEther.jsx";
import Badge from "../components/ui/Badge.jsx";
import { projects } from "../data/projects.js";
import { API_BASE } from "@/lib/api.js";

/** Local fallback testimonials (shown until API returns) */
const FALLBACK_TESTIMONIALS = [
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
];

export default function Home() {
  /** Testimonials state */
  const [items, setItems] = useState(FALLBACK_TESTIMONIALS);
  const [loadingT, setLoadingT] = useState(true);
  const [errT, setErrT] = useState("");

  /** Carousel state */
  const [idx, setIdx] = useState(0);
  const autoTimer = useRef(null);

  /** Modal (Leave a review) */
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", business: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");

  // Fetch approved testimonials from backend
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingT(true);
      setErrT("");
      try {
        const res = await fetch(`${API_BASE}/feedback?status=approved`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load testimonials");
        const data = await res.json();
        const list = Array.isArray(data?.feedback) ? data.feedback : data;
        if (alive && list?.length) {
          // Normalize objects to {name,business,message}
          setItems(
            list.map((t) => ({
              name: t.name || t.author || "Client",
              business: t.business || t.company || "",
              message: t.message || t.text || "",
            }))
          );
        }
      } catch (e) {
        if (alive) setErrT(e.message || "Could not load reviews.");
      } finally {
        if (alive) setLoadingT(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Auto-play every 6s
  useEffect(() => {
    stopAuto();
    autoTimer.current = setInterval(() => {
      setIdx((i) => (i + 1) % Math.max(1, items.length));
    }, 6000);
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function stopAuto() {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = null;
  }

  function goPrev() {
    stopAuto();
    setIdx((i) => (i - 1 + items.length) % items.length);
  }

  function goNext() {
    stopAuto();
    setIdx((i) => (i + 1) % items.length);
  }

  async function submitReview(e) {
    e.preventDefault();
    setNote("");
    if (!form.name.trim() || !form.business.trim() || !form.message.trim()) {
      setNote("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          business: form.business.trim(),
          message: form.message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to submit review");
      setNote("Thanks! Your review was sent to the admin for approval.");
      setForm({ name: "", business: "", message: "" });
      setTimeout(() => setOpen(false), 1200);
    } catch (ex) {
      setNote(ex?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /** Window of 3 cards like Google reviews */
  const trio = useMemo(() => {
    if (!items.length) return [];
    const a = items[(idx + 0) % items.length];
    const b = items[(idx + 1) % items.length];
    const c = items[(idx + 2) % items.length];
    return [a, b, c];
  }, [items, idx]);

  return (
    <div className="relative">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          className="h-full w-full"
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          resolution={0.6}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={0}
          autoRampDuration={0}
          listenOnWindow
        />
      </div>

      {/* HERO */}
      <section className="relative pt-28 md:pt-32">
        <Container className="pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">
                Pixel-perfect
                <br /> websites
              </h1>

              <p className="mt-5 text-textSub text-desc max-w-xl">
                We design & build delightful sites with a client portal that keeps
                everything in one place — projects, files, discussions, and delivery.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="btn btn-primary" to="/pricing">See Pricing</Link>
                <Link className="btn btn-outline" to="/projects">View Projects</Link>
                <a
                  className="btn btn-outline"
                  href="https://calendly.com/mspixelpulse/30min"
                  target="_blank"
                  rel="noreferrer"
                >
                  Book appointment
                </a>
              </div>
            </div>

            {/* Includes card with animated gradient border */}
            <div className="include-panel animate-fade-up">
              <div className="include-title">Includes</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Managed hosting", "SSL & Security", "Client Portal", "SEO & Analytics"].map(
                  (label) => (
                    <li key={label} className="include-pill text-desc">{label}</li>
                  )
                )}
              </ul>
              <div className="include-ring" />
            </div>
          </div>
        </Container>
      </section>

      {/* RECENT WORK */}
      <section className="section pt-6">
        <Container>
          <SectionTitle eyebrow="Projects" title="Recent work" centered />
          <div className="grid md:grid-cols-3 gap-6">
            {projects
              .map((p) => ({
                ...p,
                title:
                  p.id === "mahak-portfolio-wix"
                    ? "Dazzling Smile Dental Clinic"
                    : p.title,
                summary:
                  p.id === "mahak-portfolio-wix"
                    ? "Dental clinic website with clear services & contact."
                    : p.summary,
                live:
                  p.id === "mahak-portfolio-wix"
                    ? "https://dazzlingsmile.ca/"
                    : p.live,
              }))
              .slice(0, 3)
              .map((p) => (
                <Link key={p.id} to={`/projects/${p.id}`} className="group">
                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <img
                      className="h-48 w-full object-cover transition scale-100 group-hover:scale-105"
                      src={p.thumb}
                      alt=""
                    />
                  </div>
                  <div className="card-surface px-5 py-4 -mt-5 relative">
                    <div className="flex gap-2 flex-wrap mb-2">
                      {p.stack.slice(0, 3).map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                    <div className="font-extrabold">{p.title}</div>
                    <div className="text-textSub text-sm md:text-base">{p.summary}</div>
                  </div>
                </Link>
              ))}
          </div>

          {/* CTA */}
          <div className="mt-12 card-surface p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_auto_auto] items-center gap-4">
              <div>
                <h3 className="text-2xl font-black">Ready to boost your online presence?</h3>
                <p className="text-textSub mt-1 text-desc">
                  Start a project today and get your custom site live fast.
                </p>
              </div>
              <Link to="/contact" className="btn btn-primary">
                Start Project
              </Link>
              <a
                className="btn btn-outline"
                href="https://calendly.com/mspixelpulse/30min"
                target="_blank"
                rel="noreferrer"
              >
                Book appointment
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIALS — 3-up “Google-style” row + centered arrows + submit */}
      <section className="section pt-6">
        <Container>
          <SectionTitle eyebrow="Feedback" title="What clients say" centered />

          <div className="relative">
            {/* Arrow buttons (centered vertically across the row) */}
            <button
              aria-label="Previous reviews"
              onClick={goPrev}
              className="review-arrow-outer left-0"
            >
              ‹
            </button>
            <button
              aria-label="Next reviews"
              onClick={goNext}
              className="review-arrow-outer right-0"
            >
              ›
            </button>

            {/* Three cards, same width as other grids */}
            <div className="grid md:grid-cols-3 gap-6">
              {trio.map((t, i) => (
                <figure key={`${t.name}-${i}`} className="review-card glass-tint">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar-pill" aria-hidden>
                      {String(t.name || "C").trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="leading-tight">
                      <div className="font-semibold flex items-center gap-1">
                        {t.name}
                      </div>
                      <div className="text-white/60 text-xs">{t.business}</div>
                    </div>
                  </div>

                  <div className="stars" aria-hidden>
                    ★★★★★
                  </div>

                  <blockquote className="review-quote mt-2">
                    “{t.message}”
                  </blockquote>
                </figure>
              ))}
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    stopAuto();
                    setIdx(i);
                  }}
                  className={[
                    "h-2.5 w-2.5 rounded-full transition",
                    i === idx ? "bg-white/90" : "bg-white/30 hover:bg-white/50",
                  ].join(" ")}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Leave a review */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setNote("");
                  setOpen(true);
                }}
                className="btn btn-outline"
              >
                Leave a review
              </button>
            </div>

            {/* Loading / Error hints (non-blocking) */}
            {loadingT && (
              <div className="text-muted-xs text-center mt-3">
                Loading reviews…
              </div>
            )}
            {errT && (
              <div className="text-error text-center mt-3">{errT}</div>
            )}
          </div>
        </Container>
      </section>

      {/* REVIEW MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm animate-fade-up"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-black text-lg">Share your feedback</div>

            <form className="mt-4 space-y-3" onSubmit={submitReview}>
              <input
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
              <input
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4"
                placeholder="Business / Organization"
                value={form.business}
                onChange={(e) => setForm((s) => ({ ...s, business: e.target.value }))}
              />
              <textarea
                rows={5}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                placeholder="Your feedback"
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
              />
              {note && <div className="text-sm text-white/80">{note}</div>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}