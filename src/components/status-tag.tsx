import { Status } from "@/store/audit-store";

const styles: Record<Status, string> = {
  Completed: "bg-ok/10 text-ok border-ok/30",
  Pending: "bg-pending/10 text-pending border-pending/30",
  Flagged: "bg-flagged/10 text-flagged border-flagged/30",
};

export function StatusTag({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium sm:px-2.5 sm:py-1 sm:text-xs ${styles[status]}`}
    >
      {status}
    </span>
  );
}
