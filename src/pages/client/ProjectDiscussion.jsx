import Container from "../../components/layout/Container.jsx";
import SectionTitle from "../../components/SectionTitle.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function ProjectDiscussion() {
  const msgs = [
    { me: false, msg: "Hey! Can you share the brand logo?" },
    { me: true, msg: "Uploaded now—see Files tab." },
    { me: false, msg: "Great, proceeding with the hero." },
  ];
  return (
    <main className="section">
      <Container>
        <SectionTitle eyebrow="Discussion" title="Thread" />
        <div className="mt-6 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`max-w-xl p-3 rounded-xl ${m.me ? "bg-primary/20 ml-auto" : "bg-white/5"}`}>{m.msg}</div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input placeholder="Write a message" />
          <Button>Send</Button>
        </div>
      </Container>
    </main>
  );
}