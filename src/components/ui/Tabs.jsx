// src/components/ui/Tabs.jsx
import { useState } from "react";
import { useTheme } from "@/lib/theme.js";

export function Tabs({ tabs, defaultIndex = 0 }) {
  const [i, setI] = useState(defaultIndex);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t, idx) => {
          const active = idx === i;
          const base =
            "h-10 px-4 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2";

          const styles = active
            ? isDark
              ? "bg-primary text-white"
              : "bg-[#2563ff] text-white shadow-[0_12px_30px_rgba(37,99,255,0.15)]"
            : isDark
              ? "bg-white/5 text-white/75 hover:bg-white/10"
              : "bg-[rgba(255,255,255,0.55)] text-slate-700 hover:bg-white border border-[rgba(148,163,184,0.15)]";

          return (
            <button
              key={t.label}
              onClick={() => setI(idx)}
              className={`${base} ${styles}`}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">{tabs[i]?.content}</div>
    </div>
  );
}