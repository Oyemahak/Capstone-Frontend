// src/components/layout/AppFooter.jsx
import Container from "./Container.jsx";
import { useTheme } from "@/lib/theme.js";

export default function AppFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();

  return (
    <footer
      className={
        isDark
          ? "border-t border-white/10 bg-surface/40 backdrop-blur app-footer"
          : "border-t border-slate-200 bg-slate-100/90 backdrop-blur"
      }
    >
      <Container>
        <div className="py-8 grid gap-3 lg:grid-cols-3 lg:items-center">
          {/* Left (desktop) / Row 1 (mobile) */}
          <div
            className={
              isDark
                ? "font-bold text-center lg:text-left text-white"
                : "font-bold text-center lg:text-left text-slate-900"
            }
          >
            MSPixelPulse
          </div>

          {/* Middle (desktop) / Row 2 (mobile) */}
          <div
            className={
              isDark
                ? "text-sm text-textSub text-center"
                : "text-sm text-slate-500 text-center"
            }
          >
            © {year} MSPixelPulse. All rights reserved.
          </div>

          {/* Right (desktop) / Row 3 (mobile) */}
          <div
            className={
              isDark
                ? "text-xs text-textSub text-center lg:text-right"
                : "text-xs text-slate-500 text-center lg:text-right"
            }
          >
            Developed &amp; Design by Mahak Patel
          </div>
        </div>
      </Container>
    </footer>
  );
}