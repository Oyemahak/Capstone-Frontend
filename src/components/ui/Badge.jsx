// src/components/ui/Badge.jsx
import { useTheme } from "@/lib/theme.js";

export default function Badge({ children, className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const base = isDark
    ? "badge"
    : // light look: small muted pill
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-[rgba(37,99,255,0.07)] text-slate-800 border border-[rgba(148,163,184,0.25)]";

  return <span className={`${base} ${className}`}>{children}</span>;
}