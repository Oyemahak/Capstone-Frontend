// src/pages/Projects.jsx
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Badge from "../components/ui/Badge.jsx";
import Meta from "../components/Meta.jsx";
import { projects } from "../data/projects.js";
import { LuExternalLink } from "react-icons/lu";
import { useTheme } from "@/lib/theme.js";

export default function Projects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="section">
      <Meta
        title="Projects — MSPixelPulse"
        description="A few recent projects across React, WordPress, and Wix. We keep performance and clarity front and center."
      />

      <Container>
        <SectionTitle
          eyebrow="Projects"
          title={isDark ? "Explore our work" : "Explore our work"}
          centered
        />

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
                <div
                  className={
                    isDark
                      ? "overflow-hidden rounded-2xl border border-white/5 glass-hover"
                      : "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  }
                >
                  <img
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={p.thumb}
                    alt={p.title}
                    loading="lazy"
                  />
                </div>

                {/* Card */}
                <div
                  className={
                    isDark
                      ? "card-surface px-5 py-4 -mt-5 relative"
                      : "px-5 py-4 -mt-5 relative rounded-2xl bg-white border border-slate-200 shadow-sm"
                  }
                >
                  {/* badges */}
                  <div className="flex gap-2 flex-wrap mb-2">
                    {p.stack.slice(0, 3).map((s) =>
                      isDark ? (
                        <Badge key={s}>{s}</Badge>
                      ) : (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1"
                        >
                          {s}
                        </span>
                      )
                    )}
                  </div>

                  {/* title + external hint */}
                  <div
                    className={
                      isDark
                        ? "flex items-center gap-2 font-extrabold"
                        : "flex items-center gap-2 font-extrabold text-slate-900"
                    }
                  >
                    <span className="truncate">{p.title}</span>
                    {isExternal && (
                      <LuExternalLink
                        className={
                          isDark
                            ? "h-4 w-4 text-white/70 group-hover:text-white/90 transition-colors"
                            : "h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors"
                        }
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* summary */}
                  <div
                    className={
                      isDark
                        ? "text-textSub text-desc mt-1"
                        : "text-slate-500 text-sm mt-1 leading-relaxed"
                    }
                  >
                    {p.summary}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}