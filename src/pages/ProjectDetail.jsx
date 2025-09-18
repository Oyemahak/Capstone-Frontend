import { useParams, Link } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import { projects } from "../data/projects.js";

export default function ProjectDetail() {
  const { id } = useParams();
  const p = projects.find((x) => x.id === id);

  if (!p) {
    return (
      <main className="section main-pad-top">
        <Container className="container-edge">
          <div className="card-surface p-8 text-center">
            <h1 className="text-2xl font-black mb-2">Project not found</h1>
            <p className="text-textSub">Please pick a project from the list.</p>
            <Link className="btn btn-primary mt-6" to="/projects">Back to Projects</Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="section main-pad-top">
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
            <p className="mt-4 text-textSub">
              {p.summary} We focused on speed, clarity, and conversion.
            </p>
            <div className="mt-6 flex gap-3">
              <a className="btn btn-primary" href="#" target="_blank" rel="noreferrer">View Live</a>
              <Link className="btn btn-outline" to="/contact">Start Similar Project</Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}