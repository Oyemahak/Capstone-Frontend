// src/pages/DebugConnection.jsx
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DebugConnection() {
  const [out, setOut] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const health = await api.health();
        setOut(`VITE_API_BASE=${import.meta.env.VITE_API_BASE}\nhealth: ${JSON.stringify(health)}`);
      } catch (e) {
        setOut(`VITE_API_BASE=${import.meta.env.VITE_API_BASE}\nerror: ${e.message}`);
      }
    })();
  }, []);

  return (
    <pre className="p-4 text-xs whitespace-pre-wrap rounded-xl bg-black/50 border border-white/10 m-6">
      {out}
    </pre>
  );
}