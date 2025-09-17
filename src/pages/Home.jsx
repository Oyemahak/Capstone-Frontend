import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Button from "../components/ui/Button.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { services } from "../data/services.js";
import { projects } from "../data/projects.js";

export default function Home() {
  return (
    <main>
      <section className="section">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight">Pixel-perfect websites</h1>
              <p className="mt-4 text-lg text-textSub">We design & build delightful sites with a client portal that keeps everything in one place.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/pricing" className="btn btn-primary">See Pricing</a>
                <a href="/projects" className="btn btn-outline">View Projects</a>
              </div>
            </div>
            <Card className="overflow-hidden">
              <div className="h-64 bg-white/5" />
              <CardContent className="p-6 text-textSub">Managed hosting • SSL • Analytics</CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle eyebrow="Services" title="Everything you need to launch" subtitle="Design, development, and care — done right." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card key={s.title}>
                <CardHeader><CardTitle>{s.title}</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-textSub">
                  {s.features.map(f => <div key={f}>• {f}</div>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle eyebrow="Projects" title="Recent work" subtitle="A quick look at what we’ve shipped." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a key={p.id} href={`/projects/${p.id}`} className="block">
                <Card className="overflow-hidden h-full">
                  <img src={p.thumb} alt="" className="h-44 w-full object-cover" />
                  <CardContent className="p-5">
                    <div className="flex gap-2 flex-wrap">{p.stack.map(s => <Badge key={s}>{s}</Badge>)}</div>
                    <h3 className="mt-3 font-bold">{p.title}</h3>
                    <p className="text-sm text-textSub">{p.summary}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primaryAccent p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-extrabold">Ready to boost your online presence?</h3>
            <p className="mt-1 text-white/90">Start a project today and get your custom site live fast.</p>
            <div className="mt-6 flex gap-3">
              <a href="/apply" className="btn bg-white text-ink">Start Project</a>
              <a href="/pricing" className="btn btn-outline border-white text-white">See Pricing</a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}