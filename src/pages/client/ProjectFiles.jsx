import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";

export default function ProjectFiles() {
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Files" title="Uploads" />
        <Card className="mt-6">
          <CardContent className="p-6 text-textSub">Drag & drop files here or click to browse</CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader><CardTitle>File list</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-textSub"><tr><th className="py-2">Name</th><th>Size</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                <tr className="border-t border-white/5"><td className="py-2">logo.png</td><td>120KB</td><td>2025-09-05</td><td><Button className="btn btn-outline h-9 px-3">Download</Button></td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}