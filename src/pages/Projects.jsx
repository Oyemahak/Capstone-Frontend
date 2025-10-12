// src/pages/Projects.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Badge from "../components/ui/Badge.jsx";
import Meta from "../components/Meta.jsx";
import { projects } from "../data/projects.js";

export default function Projects() {
  return (
    <section className="section">
      <Meta
        title="Projects — MSPixelPulse"
        description="A few recent projects across React, WordPress, and Wix. We keep performance and clarity front and center."
      />
      <Container>
        <SectionTitle eyebrow="Projects" title="Explore our work" centered />
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a key={p.id} href={p.live || "#"} target="_blank" rel="noreferrer" className="group">
              <div className="overflow-hidden rounded-2xl border border-white/5">
                <img
                  className="h-48 w-full object-cover transition scale-100 group-hover:scale-105"
                  src={p.thumb}
                  alt={p.title}
                />
              </div>
              <div className="card-surface px-5 py-4 -mt-5 relative">
                <div className="flex gap-2 flex-wrap mb-2">
                  {p.stack.slice(0, 3).map((s) => <Badge key={s}>{s}</Badge>)}
                </div>
                <div className="font-extrabold">{p.title}</div>
                <div className="text-textSub text-desc">{p.summary}</div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}