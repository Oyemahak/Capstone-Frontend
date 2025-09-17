import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Profile() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Profile" title="Account" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card><CardHeader><CardTitle>Details</CardTitle></CardHeader><CardContent className="space-y-3"><Input placeholder="Name" /><Input type="password" placeholder="New password" /><Button>Save</Button></CardContent></Card>
          <Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent className="text-textSub">Email updates for milestones and messages.</CardContent></Card>
        </div>
      </Container>
    </main>
  );
}