"use client";

import { ExpandableCard } from "@/components/expandable-card";
import { StatusTag } from "@/components/status-tag";
import { useAuditStore } from "@/store/audit-store";

export function AiAgentsPage() {
  const agents = useAuditStore((state) => state.agents);
  const openPanel = useAuditStore((state) => state.openPanel);

  return (
    <section className="grid gap-4 fade-up sm:gap-5 xl:grid-cols-[1.2fr_1fr]">
      <div className="card p-3.5 sm:p-4">
        <p className="section-title mb-4">Agent Panel</p>
        <ul className="space-y-3">
          {agents.map((agent) => (
            <li
              key={agent.id}
              className="rounded-lg border border-border/80 bg-surface p-3"
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() =>
                  openPanel({
                    title: agent.name,
                    description: agent.summary,
                    details: [
                      `Last run: ${agent.lastRun}`,
                      `Status: ${agent.status}`,
                      ...agent.findings,
                    ],
                  })
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-fg sm:text-sm">
                    {agent.name}
                  </h3>
                  <StatusTag status={agent.status} />
                </div>
                <p className="mt-1 text-xs text-fg-subtle sm:text-sm">
                  {agent.summary}
                </p>
                <p className="mt-2 font-mono text-xs text-fg-subtle">
                  {agent.lastRun}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <ExpandableCard
            key={`exp-${agent.id}`}
            title={agent.name}
            subtitle="Latest Results"
          >
            <ul className="space-y-1 text-sm">
              {agent.findings.map((finding) => (
                <li key={finding}>• {finding}</li>
              ))}
            </ul>
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
