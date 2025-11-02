// src/components/SectionTitle.jsx
import { useTheme } from "@/lib/theme.js";

function SectionTitle({
  eyebrow,
  title,
  centered = false,
  align = "center",
  description,
  className = "",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // layout
  const wrapper =
    centered ? "text-center" : align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mb-8 ${wrapper} ${className}`}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-primary text-sm tracking-[0.28em] font-black uppercase">
            {eyebrow}
          </span>
        </div>
      ) : null}

      {title ? (
        <h2
          className={`text-3xl md:text-4xl font-black tracking-tight ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h2>
      ) : null}

      {description ? (
        <p
          className={`mt-3 max-w-3xl text-[15px] md:text-[16px] leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${isDark ? "text-white/65" : "text-slate-600"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

// 👇 this fixes your error
export default SectionTitle;
export { SectionTitle };