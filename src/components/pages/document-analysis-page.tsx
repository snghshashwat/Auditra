"use client";

import { ExpandableCard } from "@/components/expandable-card";
import { StatusTag } from "@/components/status-tag";
import { useAuditStore } from "@/store/audit-store";

export function DocumentAnalysisPage() {
  const anomalies = useAuditStore((state) => state.anomalies);
  const openPanel = useAuditStore((state) => state.openPanel);

  return (
    <section className="grid gap-4 fade-up sm:gap-5 xl:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-4 sm:gap-5">
        <div className="card p-3.5 sm:p-4">
          <p className="section-title mb-3">Upload Documents</p>
          <div className="rounded-xl border-2 border-dashed border-border bg-surface-muted p-5 text-center sm:p-8">
            <p className="text-xs font-semibold text-fg sm:text-sm">
              Drop files here or browse
            </p>
            <p className="mt-1 text-xs text-fg-subtle sm:text-sm">
              Supports invoices, ledgers, trial balance, and contract PDFs
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-accent px-3 py-2 text-xs font-medium text-white transition hover:brightness-95 sm:px-4 sm:text-sm"
            >
              Choose Files
            </button>
          </div>
        </div>

        <div className="card p-3.5 sm:p-4">
          <p className="section-title mb-3">Document Viewer</p>
          <div className="rounded-xl border border-border bg-white p-3 sm:p-4">
            <p className="font-mono text-xs text-fg-subtle">
              Revenue_Journal_Q4.pdf
            </p>
            <div className="mt-3 space-y-2 text-xs text-fg-subtle sm:text-sm">
              <p>
                Page 12: Multiple journal entries posted post-closing date with
                identical amount patterns.
              </p>
              <p className="rounded bg-flagged/10 px-2 py-1 text-flagged">
                Highlight: Entry cluster between 30-31 Mar exceeds monthly
                baseline by 240%.
              </p>
              <p>
                Page 18: Supporting memo references are incomplete for three
                high-value postings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="card p-3.5 sm:p-4">
          <p className="section-title mb-3">Highlighted Anomalies</p>
          <ul className="space-y-3">
            {anomalies.map((anomaly) => (
              <li
                key={anomaly.id}
                className="group relative rounded-lg border border-border/80 bg-surface-muted p-3"
              >
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() =>
                    openPanel({
                      title: anomaly.section,
                      description: anomaly.description,
                      details: [
                        `Confidence: ${anomaly.confidence}%`,
                        `Status: ${anomaly.status}`,
                        anomaly.insight,
                      ],
                    })
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-fg sm:text-sm">
                      {anomaly.section}
                    </p>
                    <StatusTag status={anomaly.status} />
                  </div>
                  <p className="mt-1 text-xs text-fg-subtle">
                    {anomaly.description}
                  </p>
                </button>
                <div className="pointer-events-none absolute right-3 bottom-3 hidden max-w-[230px] rounded-md bg-fg px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                  {anomaly.insight}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ExpandableCard
          title="Model Confidence Notes"
          subtitle="Last calibrated today at 09:40"
        >
          <p>
            Confidence is computed from source consistency, historical pattern
            match, and rule-engine confirmations.
          </p>
        </ExpandableCard>
      </div>
    </section>
  );
}
