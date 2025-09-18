import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import LiquidEther from "../components/effects/LiquidEther.jsx";
import { projects } from "../data/projects.js";
import Badge from "../components/ui/Badge.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative">
      {/* Full-page background */}
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          className="h-full w-full"
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          resolution={0.6}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={0}       // start immediately
          autoRampDuration={0}
          listenOnWindow={true}     // make cursor work when bg is behind content
        />
      </div>

      {/* CONTENT */}
      <section className="relative pt-28 md:pt-32">
        <Container className="pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight">
                Pixel-perfect
                <br /> websites
              </h1>
              <p className="mt-5 text-textSub max-w-xl">
                We design & build delightful sites with a client portal that keeps
                everything in one place — projects, files, discussions, and delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="btn btn-primary" to="/pricing">See Pricing</Link>
                <Link className="btn btn-outline" to="/projects">View Projects</Link>
              </div>
            </div>

            <div className="card-surface p-6 md:p-7">
              <div className="text-textSub text-sm mb-3">Includes</div>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                <li className="bg-white/5 px-4 py-3 rounded-xl">Managed hosting</li>
                <li className="bg-white/5 px-4 py-3 rounded-xl">SSL & Security</li>
                <li className="bg-white/5 px-4 py-3 rounded-xl">Client Portal</li>
                <li className="bg-white/5 px-4 py-3 rounded-xl">SEO & Analytics</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES */}
      <section className="section">
        <Container>
          <SectionTitle eyebrow="Services" title="Everything you need to launch" centered />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Website Design", b: ["Modern UI", "Responsive", "Accessibility AA"] },
              { t: "Development", b: ["React / WordPress / Wix", "Client portal", "File uploads"] },
              { t: "Care & Support", b: ["Hosting & SSL", "Updates", "Analytics & SEO"] },
            ].map((c) => (
              <div key={c.t} className="card-surface p-6">
                <h3 className="font-extrabold">{c.t}</h3>
                <ul className="mt-3 space-y-2 text-textSub text-sm">
                  {c.b.map((x) => <li key={x}>• {x}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* RECENT WORK */}
      <section className="section pt-6">
        <Container>
          <SectionTitle eyebrow="Projects" title="Recent work" centered />
          <div className="grid md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="group">
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img
                    className="h-48 w-full object-cover transition scale-100 group-hover:scale-105"
                    src={p.thumb}
                    alt=""
                  />
                </div>
                <div className="card-surface px-5 py-4 -mt-5 relative">
                  <div className="flex gap-2 flex-wrap mb-2">
                    {p.stack.slice(0, 3).map((s) => <Badge key={s}>{s}</Badge>)}
                  </div>
                  <div className="font-extrabold">{p.title}</div>
                  <div className="text-textSub text-sm">{p.summary}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 card-surface p-6 md:p-8">
            <div className="grid md:grid-cols-[1fr_auto_auto] items-center gap-4">
              <div>
                <h3 className="text-2xl font-black">Ready to boost your online presence?</h3>
                <p className="text-textSub mt-1">
                  Start a project today and get your custom site live fast.
                </p>
              </div>
              <Link to="/contact" className="btn btn-primary">Start Project</Link>
              <Link to="/pricing" className="btn btn-outline">See Pricing</Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}