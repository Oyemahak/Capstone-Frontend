// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import Container from "@/components/layout/Container.jsx";
import LiquidEther from "@/components/effects/LiquidEther.jsx";
import { useTheme } from "@/lib/theme.js";

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          className="h-full w-full"
          colors={
            isDark
              ? ["#5227FF", "#FF9FFC", "#B19EEF"]
              : ["#e0ecff", "#fff0f5", "#e8e4ff"]
          }
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
        {/* subtle overlay to read text better in light */}
        {!isDark && <div className="absolute inset-0 bg-white/35 backdrop-blur-sm" />}
      </div>

      <Container className="pt-32 pb-16 px-6 text-center">
        <div
          className={`relative max-w-xl mx-auto rounded-2xl border backdrop-blur-2xl p-10 shadow-[0_0_40px_rgba(82,39,255,0.14)] transition-all duration-500 ${
            isDark
              ? "border-white/10 bg-white/5 hover:shadow-[0_0_60px_rgba(255,159,252,0.25)]"
              : "border-slate-200 bg-white/80 hover:shadow-[0_0_50px_rgba(82,39,255,0.08)]"
          }`}
        >
          <h1
            className={`text-[90px] md:text-[120px] font-black leading-none mb-2 ${
              isDark
                ? "bg-gradient-to-r from-[#5227FF] via-[#B19EEF] to-[#FF9FFC] text-transparent bg-clip-text"
                : "text-slate-900"
            }`}
          >
            404
          </h1>

          <h2
            className={`text-2xl md:text-3xl font-bold mb-3 ${
              isDark ? "text-white/90" : "text-slate-900"
            }`}
          >
            You’ve drifted off the grid
          </h2>

          <p
            className={`text-base md:text-lg mb-8 ${
              isDark ? "text-white/60" : "text-slate-500"
            }`}
          >
            Looks like this page took a wrong turn. Don’t worry — we’ll guide you back
            home.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className={`min-w-[140px] text-[15px] rounded-xl px-5 py-2.5 font-semibold transition ${
                isDark
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              ← Back to Home
            </Link>
            <Link
              to="/contact"
              className={`min-w-[160px] text-[15px] rounded-xl px-5 py-2.5 font-semibold border transition ${
                isDark
                  ? "border-white/15 text-white hover:bg-white/5"
                  : "border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              Start Project →
            </Link>
          </div>

          {/* Subtle top glow overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
        </div>

        <div
          className={`mt-24 text-sm ${
            isDark ? "text-white/40" : "text-slate-400"
          }`}
        >
          © {new Date().getFullYear()} MSPixelPulse. All rights reserved.
        </div>
      </Container>
    </section>
  );
}