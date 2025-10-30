// src/pages/Projects.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Badge from "../components/ui/Badge.jsx";
import Meta from "../components/Meta.jsx";
import { projects } from "../data/projects.js";
import { LuExternalLink } from "react-icons/lu";

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
          {projects.map((p) => {
            const href = p.live || "#";
            const isExternal = Boolean(p.live);

            return (
              <a
                key={p.id}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl"
                aria-label={isExternal ? `${p.title} (opens in new tab)` : p.title}
              >
                {/* Thumb */}
                <div className="overflow-hidden rounded-2xl border border-white/5 glass-hover">
                  <img
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={p.thumb}
                    alt={p.title}
                    loading="lazy"
                  />
                </div>

                {/* Card */}
                <div className="card-surface px-5 py-4 -mt-5 relative">
                  {/* badges */}
                  <div className="flex gap-2 flex-wrap mb-2">
                    {p.stack.slice(0, 3).map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  {/* title + small external hint */}
                  <div className="flex items-center gap-2 font-extrabold">
                    <span className="truncate">{p.title}</span>
                    {isExternal && (
                      <LuExternalLink
                        className="h-4 w-4 text-white/70 group-hover:text-white/90 transition-colors"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* summary */}
                  <div className="text-textSub text-desc mt-1">{p.summary}</div>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}