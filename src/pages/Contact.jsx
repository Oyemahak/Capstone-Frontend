import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

export default function Contact() {
  return (
    <section className="section">
      <Container>
        <SectionTitle eyebrow="Contact" title="Tell us about your project" align="left" />
        <div className="grid md:grid-cols-2 gap-6">
          <form className="space-y-3">
            <input className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" placeholder="Your name" />
            <input className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4" placeholder="Email" />
            <textarea rows={6} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3" placeholder="Your message" />
            <button className="btn btn-primary w-full md:w-auto">Send message</button>
          </form>
          <div className="card-surface p-5">
            <div className="font-black">How we’ll respond</div>
            <ul className="text-textSub mt-3 space-y-2 text-sm">
              <li>• You’ll get a reply within 1 business day.</li>
              <li>• We’ll invite you to the client portal if it’s a fit.</li>
              <li>• You can track progress, files, and discussions in one place.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}