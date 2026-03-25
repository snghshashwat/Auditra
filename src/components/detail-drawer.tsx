"use client";

import { useAuditStore } from "@/store/audit-store";

export function DetailDrawer() {
  const panel = useAuditStore((state) => state.panel);
  const closePanel = useAuditStore((state) => state.closePanel);

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/20 transition-opacity ${panel.open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closePanel}
      />
      <aside
        className={`fixed top-0 right-0 z-40 h-full w-full max-w-md border-l border-border bg-surface p-4 shadow-2xl transition-transform duration-300 sm:p-6 ${panel.open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="section-title">Details</p>
            <h2 className="mt-2 text-lg font-semibold text-fg sm:text-xl">
              {panel.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closePanel}
            className="rounded-md border border-border px-2 py-1 text-sm text-fg-subtle hover:bg-surface-muted"
          >
            Close
          </button>
        </header>
        <p className="mb-5 text-sm leading-6 text-fg-subtle">
          {panel.description}
        </p>
        <ul className="space-y-3">
          {panel.details.map((item, idx) => (
            <li
              key={`${item}-${idx}`}
              className="rounded-lg border border-border/80 bg-surface-muted px-3 py-2 text-sm text-fg"
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
