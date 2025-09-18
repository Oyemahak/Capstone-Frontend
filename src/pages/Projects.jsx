import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { projects } from "../data/projects.js";
import Badge from "../components/ui/Badge.jsx";
import { Link } from "react-router-dom";

export default function Projects() {
  return (
    <section className="section">
      <Container>
        <SectionTitle eyebrow="Projects" title="Explore our work" centered />
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`} className="group">
              <div className="overflow-hidden rounded-2xl border border-white/5">
                <img
                  className="h-48 w-full object-cover transition scale-100 group-hover:scale-105"
                  src={p.thumb}
                  alt=""
                />
              </div>
              <div className="card-surface px-5 py-4 -mt-5 relative">
                <div className="flex gap-2 flex-wrap mb-2">
                  {p.stack.slice(0, 3).map((s) => <Badge key={s}>{s}</Badge>)}
                </div>
                <div className="font-extrabold">{p.title}</div>
                <div className="text-textSub text-sm">{p.summary}</div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}