const VARIANTS = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
};

export default function Button({ variant = "primary", icon: Icon, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium shadow-sm transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="size-4" />}
      {children}
    </button>
  );
}
