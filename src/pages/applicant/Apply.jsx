import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Apply() {
  return (
    <main className="section">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Apply" title="Create your account" align="left" />
            <div className="mt-6 space-y-4">
              <Input placeholder="Full name" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Password" type="password" />
              <Button className="w-full">Create account</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle>What happens next</CardTitle></CardHeader>
            <CardContent className="text-textSub space-y-2">
              <div>• We review your application (same day).</div>
              <div>• You’ll get portal access after approval.</div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}