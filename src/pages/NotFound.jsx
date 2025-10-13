// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import Container from "@/components/layout/Container.jsx";
import LiquidEther from "@/components/effects/LiquidEther.jsx";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          className="h-full w-full"
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          resolution={0.7}
          mouseForce={15}
          cursorSize={80}
          isViscous={false}
          viscous={30}
          iterationsViscous={24}
          iterationsPoisson={24}
          isBounce={false}
          autoDemo
          autoSpeed={0.6}
          autoIntensity={2}
          takeoverDuration={0.25}
          listenOnWindow
        />
      </div>

      <Container className="pt-32 pb-16 px-6 text-center">
        <div
          className="relative max-w-xl mx-auto rounded-2xl border border-white/10 
                     bg-white/5 backdrop-blur-2xl p-10 shadow-[0_0_40px_rgba(82,39,255,0.2)]
                     hover:shadow-[0_0_60px_rgba(255,159,252,0.25)] transition-all duration-500"
        >
          <h1
            className="text-[90px] md:text-[120px] font-black leading-none mb-2
                       bg-gradient-to-r from-[#5227FF] via-[#B19EEF] to-[#FF9FFC]
                       text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
            You’ve drifted off the grid
          </h2>

          <p className="text-textSub text-base md:text-lg mb-8">
            Looks like this page took a wrong turn.  
            Don’t worry — we’ll guide you back home.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="btn btn-primary min-w-[140px] text-[15px]"
            >
              ← Back to Home
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline min-w-[160px] text-[15px]"
            >
              Start Project →
            </Link>
          </div>

          {/* Subtle top glow overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
        </div>

        <div className="mt-24 text-sm text-white/40">
          © {new Date().getFullYear()} MSPixelPulse. All rights reserved.
        </div>
      </Container>
    </section>
  );
}