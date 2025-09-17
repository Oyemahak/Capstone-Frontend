import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Card, { CardContent } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { projects } from "../../data/projects.js";

export default function Dashboard() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Dashboard" title="Your projects" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {projects.map(p => (
            <Card key={p.id} className="overflow-hidden">
              <img src={p.thumb} className="h-44 w-full object-cover" />
              <CardContent className="p-5">
                <h3 className="font-bold">{p.title}</h3>
                <div className="mt-2 flex gap-2 flex-wrap">{p.stack.map(s => <Badge key={s}>{s}</Badge>)}</div>
                <div className="mt-4 flex gap-2">
                  <a href={`/client/project/${p.id}`} className="btn btn-primary">Overview</a>
                  <a href={`/client/project/${p.id}/files`} className="btn btn-outline">Files</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}