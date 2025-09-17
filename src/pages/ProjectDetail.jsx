// src/pages/ProjectDetail.jsx
import Container from "../components/layout/Container.jsx";
import Badge from "../components/ui/Badge.jsx";
import { projects } from "../data/projects.js";

export default function ProjectDetail({ id }) {
  const p = projects.find((x) => x.id === id) || projects[0];

  return (
    <main className="section">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <img
            src={p.thumb}
            alt=""
            className="w-full h-80 object-cover rounded-2xl border border-white/5"
          />
          <div>
            <h1 className="text-3xl font-extrabold">{p.title}</h1>
            <div className="mt-2 flex gap-2 flex-wrap">
              {p.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            <p className="mt-4 text-textSub">
              {p.summary} We focused on speed, clarity, and conversion.
            </p>
            <div className="mt-6 flex gap-3">
              <a className="btn btn-primary" href="#">
                View Live
              </a>
              <a className="btn btn-outline" href="/apply">
                Start Similar Project
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}