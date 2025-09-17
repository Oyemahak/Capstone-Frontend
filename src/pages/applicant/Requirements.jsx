import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";
import Button from "../../components/ui/Button.jsx";
import { Tabs } from "../../components/ui/Tabs.jsx";
import Card, { CardContent } from "../../components/ui/Card.jsx";

export default function Requirements() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Requirements" title="Tell us what you need" />
        <div className="grid gap-8 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <Input placeholder="Business name" />
            <Tabs
              tabs={[
                { label: "Pages", content: (<div className="space-y-3"><Input placeholder="Add page (eg. About)" /><div className="text-textSub text-sm">Tip: keep names simple.</div></div>) },
                { label: "Deadline", content: (<Input type="date" />) },
                { label: "Notes", content: (<Textarea rows={6} placeholder="Anything else we should know?" />) },
              ]}
            />
            <Card><CardContent className="p-4 text-textSub">Drag & drop brand assets here</CardContent></Card>
            <div className="flex gap-3"><Button>Submit</Button><Button className="btn btn-outline" variant="outline">Save Draft</Button></div>
          </div>
          <Card><CardContent className="text-textSub space-y-2">• Add sample links • Share brand colors</CardContent></Card>
        </div>
      </Container>
    </main>
  );
}