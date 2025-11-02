// src/components/ui/Button.jsx
import { useTheme } from "@/lib/theme.js";

export default function Button({
  className = "",
  variant = "primary", // "primary" | "outline" | "ghost"
  ...props
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // shared
  const base =
    "inline-flex items-center justify-center font-bold rounded-xl h-11 px-5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[rgba(82,39,255,0.35)]";

  let variantClass = "";

  if (variant === "primary") {
    variantClass = isDark
      ? "bg-primary hover:bg-primaryAccent text-white"
      : "bg-[#2563ff] hover:bg-[#1d4fd1] text-white shadow-[0_12px_30px_rgba(37,99,255,0.18)]";
  } else if (variant === "outline") {
    variantClass = isDark
      ? "border border-white/10 bg-transparent text-textMain hover:bg-white/5"
      : "border border-[rgba(148,163,184,0.35)] bg-[rgba(255,255,255,0.45)] text-slate-900 hover:bg-white";
  } else {
    // ghost
    variantClass = isDark
      ? "text-textMain hover:bg-white/5"
      : "text-slate-900 hover:bg-white/60";
  }

  return (
    <button className={`${base} ${variantClass} ${className}`} {...props} />
  );
}