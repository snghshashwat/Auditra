"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { DetailDrawer } from "@/components/detail-drawer";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/document-analysis", label: "Document Analysis" },
  { href: "/ai-agents", label: "AI Agents" },
  { href: "/reports", label: "Reports" },
];

function getTitle(pathname: string) {
  const item = navItems.find((nav) => nav.href === pathname);
  return item?.label ?? "Auditra";
}

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (pathname === "/") {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-2 px-3 py-3 sm:px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/auditra-mark.jpg"
                alt="Auditra"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-base font-semibold text-fg hidden sm:inline">
                Auditra
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg-subtle transition hover:text-fg sm:px-3 sm:text-sm md:hidden"
                aria-label="Toggle menu"
              >
                Menu
              </button>
              <nav className="hidden items-center gap-2 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-fg-subtle transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          <div
            className={`grid transition-all duration-200 md:hidden ${mobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden border-t border-border/70 px-4 py-3">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg-subtle"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-bg/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="shrink-0 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-fg-subtle sm:px-3 sm:text-sm"
            aria-label="Toggle navigation"
          >
            Menu
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-fg">
            {getTitle(pathname)}
          </p>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-950/35 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-[82%] max-w-[320px] border-r border-border bg-surface p-4 transition-transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="mb-6 block rounded-xl border border-accent/20 bg-accent-soft p-3"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/auditra-mark.jpg"
                alt="Auditra"
                width={24}
                height={24}
                className="rounded"
              />
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                Auditra Suite
              </p>
            </div>
            <h1 className="mt-1 text-base font-semibold text-fg">
              AI Audit Workspace
            </h1>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={`drawer-${item.href}`}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-accent text-white" : "text-fg-subtle hover:bg-surface-muted hover:text-fg"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-surface px-4 py-5 lg:block lg:px-5">
          <Link
            href="/"
            className="mb-8 block rounded-xl border border-accent/20 bg-accent-soft p-3 transition hover:brightness-95"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/auditra-mark.jpg"
                alt="Auditra"
                width={28}
                height={28}
                className="rounded"
              />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  Auditra Suite
                </p>
              </div>
            </div>
            <h1 className="mt-2 text-lg font-semibold text-fg">
              AI Audit Workspace
            </h1>
          </Link>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-accent text-white" : "text-fg-subtle hover:bg-surface-muted hover:text-fg"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-xl border border-border bg-surface-muted px-3 py-4">
            <p className="text-xs font-medium text-fg-subtle">
              Active Engagement
            </p>
            <p className="mt-1 text-sm font-semibold text-fg">
              FY 2025-26 Statutory Audit
            </p>
          </div>
        </aside>

        <main className="px-4 py-5 lg:px-8">
          <header className="mb-6 hidden flex-wrap items-center justify-between gap-3 lg:flex">
            <div>
              <p className="section-title">Workspace</p>
              <h2 className="mt-1 text-2xl font-semibold text-fg">
                {getTitle(pathname)}
              </h2>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <ThemeToggle />
              <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg-subtle">
                Last sync: 10:32 AM
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
      <DetailDrawer />
    </div>
  );
}
