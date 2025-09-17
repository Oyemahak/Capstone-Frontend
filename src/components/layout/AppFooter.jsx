import Container from "./Container.jsx";

export default function AppFooter() {
  return (
    <footer className="border-t border-white/5">
      <Container>
        <div className="py-10 grid gap-6 md:grid-cols-3 items-center">
          <div className="font-black">MSPixelPulse</div>
          <p className="text-sm text-textSub">© {new Date().getFullYear()} MSPixelPulse. All rights reserved.</p>
          <div className="md:text-right text-textSub text-sm">Built with React • Tailwind</div>
        </div>
      </Container>
    </footer>
  );
}