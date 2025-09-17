import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../components/ui/Card.jsx";
import { services } from "../data/services.js";

export default function Services() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Services" title="Design, build, and support" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(s => (
            <Card key={s.title}>
              <CardHeader><CardTitle>{s.title}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-textSub">{s.features.map(f => <div key={f}>• {f}</div>)}</CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}