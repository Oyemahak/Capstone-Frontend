// src/components/layout/AppFooter.jsx
import Container from "./Container.jsx";

export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-surface/40 backdrop-blur">
      <Container>
        <div className="py-8 grid gap-3 lg:grid-cols-3 lg:items-center">
          {/* Left (desktop) / Row 1 (mobile) */}
          <div className="font-bold text-center lg:text-left">
            MSPixelPulse
          </div>

          {/* Middle (desktop) / Row 2 (mobile) */}
          <div className="text-sm text-textSub text-center">
            © {new Date().getFullYear()} MSPixelPulse. All rights reserved.
          </div>

          {/* Right (desktop) / Row 3 (mobile) */}
          <div className="text-xs text-textSub text-center lg:text-right">
            Developed &amp; Design by Mahak Patel
          </div>
        </div>
      </Container>
    </footer>
  );
}