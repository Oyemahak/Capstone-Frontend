// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import LiquidEther from "../components/effects/LiquidEther.jsx";
import Badge from "../components/ui/Badge.jsx";
import { projects } from "../data/projects.js";
import Feedback from "@/components/Feedback.jsx";

/* Icons (you already have these) */
import { SiWhatsapp } from "react-icons/si";
import { LuTag, LuCalendar, LuRocket } from "react-icons/lu";

export default function Home() {
  // Pre-filled WhatsApp message
  const waHref =
    "https://wa.me/13658830338?text=" +
    encodeURIComponent("Hi MSPixelPulse! I'm interested in a website. Can we chat?");

  return (
    <div className="relative">
      {/* ambient bg */}
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

              {/* Hero buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="btn btn-primary" to="/pricing">
                  <LuTag className="mr-2 h-5 w-5" aria-hidden="true" />
                  See Pricing
                </Link>
                <Link className="btn btn-outline" to="/contact">
                  <LuRocket className="mr-2 h-5 w-5" aria-hidden="true" />
                  Start Project
                </Link>
              </div>
            </div>

            {/* Includes card */}
            <div className="include-panel animate-fade-up">
              <div className="include-title">Includes</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Managed hosting", "SSL & Security", "Client Portal", "SEO & Analytics"].map(
                  (label) => (
                    <li key={label} className="include-pill text-desc flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary"></span>
                      {label}
                    </li>
                  )
                )}
              </ul>
              <div className="include-ring" />
            </div>
          </div>
        </Container>
      </section>

      {/* NEW CTA SECTION (after Hero, before Recent Work) */}
      <section className="section pt-0">
        <Container>
          <div className="card-surface p-6 md:p-8 glass-hover">
            <div className="grid md:grid-cols-[1fr_auto_auto] items-center gap-4">
              <div>
                <h3 className="text-2xl font-black">Ready to boost your online presence?</h3>
                <p className="text-textSub mt-1 text-desc">
                  Start a project today and get your custom site live fast.
                </p>
              </div>

              {/* WhatsApp button */}
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

              {/* Book appointment */}
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
        </Container>
      </section>

      {/* RECENT WORK */}
      <section className="section pt-6">
        <Container>
          <SectionTitle eyebrow="Projects" title="Recent work" centered />
          <div className="grid md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((p) => (
              <a key={p.id} href={`/projects/${p.id}`} className="group">
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
                      <span key={s} className="badge">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="font-extrabold">{p.title}</div>
                  <div className="text-textSub text-sm md:text-base">{p.summary}</div>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* FEEDBACK */}
      <Feedback />
    </div>
  );
}