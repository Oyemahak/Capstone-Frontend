import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Card, { CardContent } from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { projects } from "../data/projects.js";

export default function Projects() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Projects" title="Explore our work" subtitle="Filter by category to find similar projects." />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <a key={p.id} href={`/projects/${p.id}`} className="block">
              <Card className="overflow-hidden h-full">
                <img src={p.thumb} alt="" className="h-48 w-full object-cover" />
                <CardContent className="p-5">
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-sm text-textSub">{p.summary}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">{p.stack.map(s => <Badge key={s}>{s}</Badge>)}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </Container>
    </main>
  );
}