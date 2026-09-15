const STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  review: "bg-sky-50 text-sky-700 ring-sky-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
  proposed: "bg-violet-50 text-violet-700 ring-violet-600/20",
  confirmed: "bg-brand-50 text-brand-700 ring-brand-600/20",
  "in-progress": "bg-sky-50 text-sky-700 ring-sky-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  not_started: "bg-slate-100 text-slate-600 ring-slate-500/20",
  in_review: "bg-sky-50 text-sky-700 ring-sky-600/20",
  cleared: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const LABELS = {
  pending: "Pending",
  review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  proposed: "Proposed",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  not_started: "Not started",
  in_review: "In review",
  cleared: "Cleared",
  failed: "Failed",
};

export default function Badge({ status }) {
  const style = STYLES[status] ?? "bg-slate-100 text-slate-600 ring-slate-500/10";
  const label = LABELS[status] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {label}
    </span>
  );
}
