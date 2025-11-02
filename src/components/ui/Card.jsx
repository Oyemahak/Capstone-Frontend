// src/components/ui/Card.jsx
import { useTheme } from "@/lib/theme.js";

export default function Card({ children, className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const surface = isDark
    ? // your current dark surface
      "bg-surface/80 backdrop-blur border border-white/5 shadow-card"
    : // light surface: white, soft border, soft shadow
      "bg-white/95 backdrop-blur-md border border-[rgba(148,163,184,0.18)] shadow-[0_22px_40px_rgba(15,23,42,0.06)]";

  return (
    <div
      className={`${surface} rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-extrabold">{children}</h3>;
}