"use client";

import { useEffect } from "react";

type Theme = "light" | "dark";

function getResolvedTheme(): Theme {
  const stored = window.localStorage.getItem("auditra-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  useEffect(() => {
    const resolvedTheme = getResolvedTheme();
    applyTheme(resolvedTheme);
    window.localStorage.setItem("auditra-theme", resolvedTheme);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem("auditra-theme", nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-fg-subtle transition hover:text-fg sm:h-9 sm:w-9"
      aria-label="Toggle theme"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3c.2 0 .4.01.59.03a7 7 0 0 0 9.2 9.76c.01.16 0 .33 0 .5Z" />
      </svg>
    </button>
  );
}
