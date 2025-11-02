// src/components/ui/Textarea.jsx
import { useTheme } from "@/lib/theme.js";

export default function Textarea({ className = "", rows = 5, ...props }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const base =
    "w-full rounded-xl px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-primary/55 text-[15px] resize-y";

  const themeClass = isDark
    ? "bg-white/5 border border-white/10 text-white placeholder:text-white/50"
    : "bg-[rgba(255,255,255,0.9)] border border-[rgba(148,163,184,0.25)] text-slate-900 placeholder:text-slate-400";

  return (
    <textarea
      rows={rows}
      {...props}
      className={`${base} ${themeClass} ${className}`}
    />
  );
}