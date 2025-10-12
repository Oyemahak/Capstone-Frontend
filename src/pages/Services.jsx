// src/pages/Services.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const items = [
  {
    t: "Design",
    b: [
      "Wireframes & high-fidelity mockups",
      "Branding & visual system",
      "Accessibility AA",
      "Content structure & UX flows",
    ],
  },
  {
    t: "Development",
    b: [
      "React / Node",
      "WordPress / Wix (as needed)",
      "Integrations & APIs",
      "Client portal for collaboration",
    ],
  },
  {
    t: "Care",
    b: ["Hosting & SSL", "Security updates", "Backups & uptime checks", "Incident response"],
  },
  {
    t: "Performance",
    b: ["Core Web Vitals basics", "Image optimization", "Lazy loading", "Edge/CDN setup"],
  },
  {
    t: "Analytics & SEO",
    b: ["SEO best practices", "Sitemaps & metadata", "Analytics dashboards", "Search Console setup"],
  },
  {
    t: "Support & Training",
    b: ["Admin handover session", "Editable content areas", "Short Loom tutorials", "Priority email support"],
  },
];

export default function Services() {
  return (
    <section className="section">
      <Container>
        <SectionTitle eyebrow="Services" title="What we deliver" centered />

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((c) => (
            <div
              key={c.t}
              className="relative card-surface p-6 rounded-2xl hover:bg-white/[0.09] transition-colors"
            >
              {/* soft top highlight */}
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h3 className="font-extrabold">{c.t}</h3>
              <ul className="mt-3 space-y-2 text-textSub text-[16px] md:text-[18px] leading-relaxed">
                {c.b.map((x) => (
                  <li key={x}>• {x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Inline CTA */}
        <div className="mt-12 card-surface p-6 md:p-8 rounded-2xl grid md:grid-cols-[1fr_auto] gap-4 items-center">
          <div>
            <h3 className="text-2xl font-black">Have a project in mind?</h3>
            <p className="text-textSub mt-1 text-[16px] md:text-[18px] leading-relaxed">
              Tell us your goals — we’ll propose the simplest path to launch.
            </p>
          </div>
          <a
            className="btn btn-primary"
            href="https://calendly.com/mspixelpulse/30min"
            target="_blank"
            rel="noreferrer"
          >
            Book appointment
          </a>
        </div>
      </Container>
    </section>
  );
}