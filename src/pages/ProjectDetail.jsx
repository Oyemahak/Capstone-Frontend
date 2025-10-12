// src/pages/ProjectDetail.jsx
import { useParams, Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Meta from "../components/Meta.jsx";
import { projects } from "../data/projects.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const p = projects.find((x) => x.id === id);

  if (!p) {
    return (
      <main className="section main-pad-top">
        <Container className="container-edge">
          <Meta title="Project not found — MSPixelPulse" />
          <div className="card-surface p-8 text-center">
            <h1 className="text-2xl font-black mb-2">Project not found</h1>
            <p className="text-textSub text-desc">Please pick a project from the list.</p>
            <Link className="btn btn-primary mt-6" to="/projects">Back to Projects</Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="section main-pad-top">
      <Meta title={`${p.title} — MSPixelPulse`} description={p.summary} />
      <Container className="container-edge">
        <div className="grid gap-8 lg:grid-cols-2">
          <img
            src={p.thumb}
            alt={p.title}
            className="w-full h-80 object-cover rounded-2xl border border-white/5"
          />
          <div>
            <h1 className="text-3xl font-extrabold">{p.title}</h1>
            <div className="mt-3 flex gap-2 flex-wrap">
              {p.stack.map((s) => (
                <span key={s} className="badge">{s}</span>
              ))}
            </div>
            <p className="mt-4 text-textSub text-desc">
              {p.summary} We focused on speed, clarity, and conversion.
            </p>

            <div className="mt-6 flex gap-3">
              {p.live ? (
                <a
                  className="btn btn-primary"
                  href={p.live}
                  target="_blank"
                  rel="noreferrer"
                >
                  View live site
                </a>
              ) : (
                <button className="btn btn-outline" disabled>
                  Live link coming soon
                </button>
              )}
              <Link className="btn btn-outline" to="/contact">Start similar project</Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}