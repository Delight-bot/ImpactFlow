import { IconArrowUpRight } from "../icons";

export default function StatCard({ icon: Icon, label, value, change, trend }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="size-5" />
        </span>
        {trend === "up" && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
            <IconArrowUpRight className="size-3.5" />
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
      <p
        className={`mt-3 text-xs font-medium ${
          trend === "up" ? "text-emerald-600" : "text-slate-400"
        }`}
      >
        {change}
      </p>
    </div>
  );
}
