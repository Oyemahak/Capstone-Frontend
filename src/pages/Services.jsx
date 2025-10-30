// src/pages/Services.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

/* ✅ Icons (all valid Lucide exports you already have) */
import {
  LuPenTool,
  LuCode,
  LuShieldCheck,
  LuGauge,
  LuSearch,
  LuGraduationCap,
  LuCalendar,
} from "react-icons/lu";
import { SiWhatsapp } from "react-icons/si";

const items = [
  {
    t: "Design",
    icon: LuPenTool,
    b: [
      "Wireframes & high-fidelity mockups",
      "Branding & visual system",
      "Accessibility AA",
      "Content structure & UX flows",
    ],
  },
  {
    t: "Development",
    icon: LuCode,
    b: [
      "React / Node",
      "WordPress / Wix (as needed)",
      "Integrations & APIs",
      "Client portal for collaboration",
    ],
  },
  {
    t: "Care",
    icon: LuShieldCheck,
    b: [
      "Hosting & SSL",
      "Security updates",
      "Backups & uptime checks",
      "Incident response",
    ],
  },
  {
    t: "Performance",
    icon: LuGauge,
    b: [
      "Core Web Vitals basics",
      "Image optimization",
      "Lazy loading",
      "Edge/CDN setup",
    ],
  },
  {
    t: "Analytics & SEO",
    icon: LuSearch,
    b: [
      "SEO best practices",
      "Sitemaps & metadata",
      "Analytics dashboards",
      "Search Console setup",
    ],
  },
  {
    t: "Support & Training",
    icon: LuGraduationCap,
    b: [
      "Admin handover session",
      "Editable content areas",
      "Short Loom tutorials",
      "Priority email support",
    ],
  },
];

export default function Services() {
  const waHref =
    "https://wa.me/13658830338?text=" +
    encodeURIComponent("Hi MSPixelPulse! I'm interested in a website. Can we chat?");

  return (
    <section className="section">
      <Container>
        <SectionTitle eyebrow="Services" title="What we deliver" centered />

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ t, b, icon: Icon }) => (
            <div
              key={t}
              className="relative card-surface p-6 rounded-2xl hover:bg-white/[0.09] transition-colors"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
                <h3 className="font-extrabold">{t}</h3>
              </div>
              <ul className="mt-3 space-y-2 text-textSub text-[16px] md:text-[18px] leading-relaxed">
                {b.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/90" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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