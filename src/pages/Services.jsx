import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const items = [
  { t: "Design", b: ["Wireframes & Hi-Fi", "Branding & Visual System", "Accessibility AA"] },
  { t: "Development", b: ["React / Node", "WordPress / Wix", "Integrations & APIs"] },
  { t: "Care", b: ["Hosting & SSL", "Updates", "Analytics & SEO"] },
];

export default function Services() {
  return (
    <section className="section">
      <Container>
        <SectionTitle eyebrow="Services" title="What we deliver" centered />
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((c) => (
            <div key={c.t} className="card-surface p-6">
              <h3 className="font-extrabold">{c.t}</h3>
              <ul className="mt-3 space-y-2 text-textSub text-sm">
                {c.b.map((x) => <li key={x}>• {x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}