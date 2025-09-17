import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import Button from "../components/ui/Button.jsx";

export default function Contact() {
  return (
    <main className="section">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Contact" title="Tell us about your project" align="left" />
            <div className="mt-6 space-y-4">
              <Input placeholder="Your name" />
              <Input placeholder="Email" type="email" />
              <Textarea rows={6} placeholder="Your message" />
              <Button className="w-full">Send message</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle>How we’ll respond</CardTitle></CardHeader>
            <CardContent className="text-textSub space-y-2">
              <div>• You’ll get a reply within 1 business day.</div>
              <div>• We’ll invite you to the client portal if it’s a fit.</div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}