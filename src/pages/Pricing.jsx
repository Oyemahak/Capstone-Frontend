import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import { plans } from "../data/plans.js";

export default function Pricing() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Pricing" title="Simple plans" subtitle="Transparent, flexible options." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map(p => (
            <Card key={p.name} className={p.highlight ? "ring-2 ring-primary" : ""}>
              <CardHeader><CardTitle className="flex items-center justify-between">{p.name}{p.highlight && <span className="badge">Popular</span>}</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold">{p.price}</div>
                <ul className="mt-4 space-y-2 text-textSub">{p.features.map(f => <li key={f}>• {f}</li>)}</ul>
                <a href="/apply"><Button className="w-full mt-6">Choose {p.name}</Button></a>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}