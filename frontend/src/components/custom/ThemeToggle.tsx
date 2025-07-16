"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      updateHtmlClass(savedTheme);
    } else {
      updateHtmlClass(theme);
    }
  }, [theme]);

  function updateHtmlClass(theme: "light" | "dark") {
    if (typeof window === "undefined") return;
    const html = window.document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    updateHtmlClass(newTheme);
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded text-black dark:text-white"
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema claro/escuro"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
