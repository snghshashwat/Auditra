"use client";

import { ExpandableCard } from "@/components/expandable-card";
import { StatusTag } from "@/components/status-tag";
import { useAuditStore } from "@/store/audit-store";

export function ReportsPage() {
  const reports = useAuditStore((state) => state.reports);
  const openPanel = useAuditStore((state) => state.openPanel);

  return (
    <section className="grid gap-4 fade-up sm:gap-5 xl:grid-cols-[1.2fr_1fr]">
      <div className="card p-3.5 sm:p-4">
        <p className="section-title mb-4">Generated Reports</p>
        <ul className="space-y-3">
          {reports.map((report) => (
            <li
              key={report.id}
              className="rounded-lg border border-border/80 bg-surface px-3 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-left"
                  onClick={() =>
                    openPanel({
                      title: report.name,
                      description: `${report.period} | ${report.pages} pages`,
                      details: [
                        `Generated: ${report.generatedAt}`,
                        "Reviewer comments: 3 unresolved",
                        "Recommended action: export and circulate to engagement lead",
                      ],
                    })
                  }
                >
                  <h3 className="text-xs font-semibold text-fg sm:text-sm">
                    {report.name}
                  </h3>
                  <p className="text-xs text-fg-subtle">{report.period}</p>
                </button>
                <StatusTag status={report.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-md border border-border px-2.5 py-1.5 text-[11px] text-fg hover:bg-surface-muted sm:px-3 sm:text-xs"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  className="rounded-md border border-border px-2.5 py-1.5 text-[11px] text-fg hover:bg-surface-muted sm:px-3 sm:text-xs"
                >
                  Export XLS
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <ExpandableCard
          title="Report Generation Pipeline"
          subtitle="Auto refresh every 30 minutes"
        >
          <p>
            Draft preparation uses anomaly index, risk scoring, and control
            exceptions to structure issue narratives.
          </p>
        </ExpandableCard>
        <ExpandableCard
          title="Distribution Matrix"
          subtitle="Engagement stakeholders"
        >
          <ul className="space-y-1 text-sm">
            <li>• Audit Partner - Full report</li>
            <li>• Finance Controller - Exception summary</li>
            <li>• Compliance Lead - Regulatory appendix</li>
          </ul>
        </ExpandableCard>
      </div>
    </section>
  );
}
