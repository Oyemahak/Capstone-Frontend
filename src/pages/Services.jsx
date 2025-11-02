// src/pages/Services.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useTheme } from "@/lib/theme.js";

/* Icons */
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const waHref =
    "https://wa.me/13658830338?text=" +
    encodeURIComponent("Hi MSPixelPulse! I'm interested in a website. Can we chat?");

  return (
    <section className="section">
      <Container>
        <SectionTitle
          eyebrow="Services"
          title={isDark ? "What we deliver" : "What we deliver"}
          centered
        />

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ t, b, icon: Icon }) => (
            <div
              key={t}
              className={
                isDark
                  ? "relative card-surface p-6 rounded-2xl hover:bg-white/[0.09] transition-colors"
                  : "relative rounded-2xl bg-white border border-slate-200 shadow-sm p-6 hover:border-slate-300 transition-colors"
              }
            >
              {/* glow/top line */}
              <div
                className={
                  isDark
                    ? "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    : "pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                }
              />
              <div className="flex items-center gap-2">
                {Icon && (
                  <Icon
                    className={
                      isDark ? "h-5 w-5 text-primary" : "h-5 w-5 text-[#2563ff]"
                    }
                    aria-hidden="true"
                  />
                )}
                <h3 className={isDark ? "font-extrabold" : "font-extrabold text-slate-900"}>
                  {t}
                </h3>
              </div>
              <ul
                className={
                  isDark
                    ? "mt-3 space-y-2 text-textSub text-[16px] md:text-[18px] leading-relaxed"
                    : "mt-3 space-y-2 text-slate-500 text-[15px] leading-relaxed"
                }
              >
                {b.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span
                      className={
                        isDark
                          ? "mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/90"
                          : "mt-2 inline-block h-1.5 w-1.5 rounded-full bg-[#2563ff]"
                      }
                    />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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