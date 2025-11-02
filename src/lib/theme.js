// src/lib/theme.js
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  // 1️⃣ start from localStorage, otherwise dark
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("mspixelpulse-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  // 2️⃣ write to <html> + localStorage whenever it changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      // for your current CSS, not having data-theme means "light"
      root.removeAttribute("data-theme");
    }

    window.localStorage.setItem("mspixelpulse-theme", theme);
  }, [theme]);

  // 3️⃣ public setters
  const setTheme = (value) => {
    if (value !== "dark" && value !== "light") return;
    setThemeState(value);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // keep your React.createElement style
  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        theme,
        setTheme,
        toggleTheme,
      },
    },
    children
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}