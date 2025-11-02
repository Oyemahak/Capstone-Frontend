// src/components/ui/Input.jsx
import { useTheme } from "@/lib/theme.js";

export default function Input({ className = "", ...props }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const base =
    "w-full h-11 rounded-xl px-4 transition focus:outline-none focus:ring-2 focus:ring-primary/55 text-[15px]";

  const themeClass = isDark
    ? // dark
      "bg-white/5 border border-white/10 text-white placeholder:text-white/50"
    : // light
      "bg-[rgba(255,255,255,0.9)] border border-[rgba(148,163,184,0.25)] text-slate-900 placeholder:text-slate-400";

  return <input {...props} className={`${base} ${themeClass} ${className}`} />;
}