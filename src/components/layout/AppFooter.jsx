import Container from "./Container.jsx";

export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-surface/40 backdrop-blur">
      <Container className="py-8 flex items-center justify-between">
        <div className="font-bold">MSPixelPulse</div>
        <div className="text-sm text-textSub">
          © {new Date().getFullYear()} MSPixelPulse. All rights reserved.
        </div>
        <div className="text-xs text-textSub">Developed & Design by Mahak Patel</div>
      </Container>
    </footer>
  );
}