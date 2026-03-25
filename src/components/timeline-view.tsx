import { AuditEvent } from "@/store/audit-store";
import { StatusTag } from "@/components/status-tag";

export function TimelineView({ events }: { events: AuditEvent[] }) {
  return (
    <div className="card p-3.5 sm:p-4">
      <p className="section-title mb-4">Audit Timeline</p>
      <ul className="space-y-4">
        {events.map((event, index) => (
          <li key={event.id} className="relative pl-6">
            <span className="absolute top-2 left-0 h-2.5 w-2.5 rounded-full bg-accent" />
            {index < events.length - 1 && (
              <span className="absolute top-4 left-[4px] h-[calc(100%+4px)] w-px bg-border" />
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-fg sm:text-sm">
                {event.title}
              </h4>
              <StatusTag status={event.status} />
            </div>
            <p className="mt-1 text-xs text-fg-subtle sm:text-sm">
              {event.detail}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-fg-subtle">
              {event.date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
