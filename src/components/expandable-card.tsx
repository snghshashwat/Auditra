"use client";

import { PropsWithChildren, useState } from "react";

type ExpandableCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function ExpandableCard({
  title,
  subtitle,
  children,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <article className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left sm:px-4"
      >
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-fg">{title}</h3>
          {subtitle && (
            <p className="truncate text-xs text-fg-subtle">{subtitle}</p>
          )}
        </div>
        <span
          className={`text-xl leading-none text-fg-subtle transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden border-t border-border/70 px-3 py-3 text-sm text-fg-subtle sm:px-4">
          {children}
        </div>
      </div>
    </article>
  );
}
