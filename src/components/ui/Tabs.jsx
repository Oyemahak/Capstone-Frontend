import { useState } from "react";

export function Tabs({ tabs, defaultIndex = 0 }) {
  const [i, setI] = useState(defaultIndex);
  return (
    <div>
      <div className="flex gap-2">
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            onClick={() => setI(idx)}
            className={`btn h-10 px-4 rounded-lg ${i === idx ? "btn-primary" : "btn-outline"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[i]?.content}</div>
    </div>
  );
}