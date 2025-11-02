// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Feedback from "@/components/Feedback.jsx";
import { useTheme } from "@/lib/theme.js";
import { projects } from "../data/projects.js";

/* Icons */
import { SiWhatsapp } from "react-icons/si";
import { LuTag, LuCalendar, LuRocket } from "react-icons/lu";

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Pre-filled WhatsApp message
  const waHref =
    "https://wa.me/13658830338?text=" +
    encodeURIComponent("Hi MSPixelPulse! I'm interested in a website. Can we chat?");

  return (
    <div className="relative">
      {/* LIGHT THEME BG ONLY */}
      {!isDark && (
        <div
          className="absolute inset-0 -z-10"
          // soft studio background for public/light
          style={{
            background:
              "radial-gradient(circle at top, #fcfdff 0%, #eef2f7 45%, #e0e5ed 85%)",
          }}
        />
      )}

      {/* HERO */}
      <section className="relative pt-28 md:pt-32">
        <Container className="pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT copy */}
            <div>
              <p
                className={
                  isDark
                    ? "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-semibold tracking-wide uppercase mb-4"
                    : "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-4"
                }
              >
                MSPixelPulse · Toronto
              </p>

              <h1
                className={
                  isDark
                    ? "text-4xl md:text-6xl font-black leading-tight"
                    : "text-4xl md:text-6xl font-black leading-tight text-slate-900"
                }
              >
                Pixel-perfect
                <br /> websites
              </h1>

              <p
                className={
                  isDark
                    ? "mt-5 text-textSub text-desc max-w-xl"
                    : "mt-5 text-slate-600 text-desc max-w-xl"
                }
              >
                We design &amp; build delightful sites with a client portal that keeps
                everything in one place — projects, files, discussions, and delivery.
              </p>

              {/* Hero buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className={
                    isDark
                      ? "btn btn-primary"
                      : "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#2563ff] hover:bg-[#2056da] text-white font-semibold shadow-sm"
                  }
                  to="/pricing"
                >
                  <LuTag className="mr-1 h-5 w-5" aria-hidden="true" />
                  See Pricing
                </Link>

                <Link
                  className={
                    isDark
                      ? "btn btn-outline"
                      : "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm"
                  }
                  to="/contact"
                >
                  <LuRocket className="mr-1 h-5 w-5" aria-hidden="true" />
                  Start Project
                </Link>
              </div>
            </div>

            {/* RIGHT: Includes card */}
            <div>
              {isDark ? (
                // your existing glassy one (unchanged)
                <div className="include-panel animate-fade-up">
                  <div className="include-title">Includes</div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Managed hosting",
                      "SSL & Security",
                      "Client Portal",
                      "SEO & Analytics",
                    ].map((label) => (
                      <li
                        key={label}
                        className="include-pill text-desc flex items-center gap-2"
                      >
                        <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
                        {label}
                      </li>
                    ))}
                  </ul>
                  <div className="include-ring" />
                </div>
              ) : (
                // light version so it doesn't look washed out
                <div className="animate-fade-up rounded-2xl bg-white/90 border border-slate-200/70 shadow-[0_12px_35px_rgba(12,23,44,0.04)] p-6 md:p-7">
                  <div className="text-slate-900 font-semibold text-lg mb-4">
                    Includes
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Managed hosting",
                      "SSL & Security",
                      "Client Portal",
                      "SEO & Analytics",
                    ].map((label) => (
                      <li
                        key={label}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-sm text-slate-800"
                      >
                        <span className="h-2 w-2 rounded-full bg-[#2563ff]" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA STRIP (after hero) */}
      <section className="section pt-0">
        <Container>
          {isDark ? (
            <div className="card-surface p-6 md:p-8 glass-hover">
              <div className="grid md:grid-cols-[1fr_auto_auto] items-center gap-4">
                <div>
                  <h3 className="text-2xl font-black">
                    Ready to boost your online presence?
                  </h3>
                  <p className="text-textSub mt-1 text-desc">
                    Start a project today and get your custom site live fast.
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
            </div>
          ) : (
            <div className="rounded-2xl bg-white/90 border border-slate-200/70 shadow-sm p-6 md:p-8">
              <div className="grid md:grid-cols-[1fr_auto_auto] items-center gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Ready to boost your online presence?
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Start a project today and get your custom site live fast.
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
            </div>
          )}
        </Container>
      </section>

      {/* RECENT WORK */}
      <section className="section pt-6">
        <Container>
          <SectionTitle
            eyebrow="Projects"
            title={isDark ? "Recent work" : "Explore our work"}
            centered
          />

          <div className="grid md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((p) => (
              <a key={p.id} href={`/projects/${p.id}`} className="group">
                {/* image */}
                <div
                  className={
                    isDark
                      ? "overflow-hidden rounded-2xl border border-white/10"
                      : "overflow-hidden rounded-2xl border border-slate-200/60 bg-white"
                  }
                >
                  <img
                    className="h-48 w-full object-cover transition scale-100 group-hover:scale-105"
                    src={p.thumb}
                    alt={p.title}
                  />
                </div>

                {/* text */}
                <div
                  className={
                    isDark
                      ? "card-surface px-5 py-4 -mt-5 relative"
                      : "px-5 py-4 -mt-5 relative rounded-2xl bg-white border border-slate-200/70 shadow-sm"
                  }
                >
                  <div className="flex gap-2 flex-wrap mb-2">
                    {p.stack.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className={
                          isDark
                            ? "badge"
                            : "inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1"
                        }
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div
                    className={
                      isDark
                        ? "font-extrabold"
                        : "font-extrabold text-slate-900"
                    }
                  >
                    {p.title}
                  </div>
                  <div
                    className={
                      isDark
                        ? "text-textSub text-sm md:text-base"
                        : "text-slate-500 text-sm md:text-base"
                    }
                  >
                    {p.summary}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* FEEDBACK — leave exactly as your dark CSS handles it */}
      <Feedback />
    </div>
  );
}