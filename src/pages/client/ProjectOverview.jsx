import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../../components/ui/Card.jsx";

export default function ProjectOverview() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Project" title="Aurora Bakery Website" />
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><span className="badge">Active</span></CardContent></Card>
          <Card><CardHeader><CardTitle>Next action</CardTitle></CardHeader><CardContent>Provide about page copy.</CardContent></Card>
          <Card className="md:col-span-2"><CardHeader><CardTitle>Milestones</CardTitle></CardHeader><CardContent className="text-textSub">• Wireframes ✓ • Hi-fi → • Build → • Launch</CardContent></Card>
        </div>
      </Container>
    </main>
  );
}