/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        surface: "#111827",
        primary: "#0D47A1",
        primaryAccent: "#1976D2",
        textMain: "#F9FAFB",
        textSub: "#CBD5E1",
        success: "#22C55E",
      },
      boxShadow: {
        card: "0 6px 24px -6px rgba(0,0,0,.35)",
        soft: "0 3px 12px -2px rgba(0,0,0,.25)",
      },
      borderRadius: { xl2: "1rem" },
    },
  },
  plugins: [],
};