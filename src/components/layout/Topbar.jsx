import { IconMenu, IconSearch, IconBell, IconChevronDown } from "../icons";
import Avatar from "../ui/Avatar";
import { useAuth } from "../../auth/AuthContext";

const TITLES = {
  overview: "Overview",
  volunteers: "Volunteers",
  beneficiaries: "Beneficiaries",
  matches: "Matches",
};

export default function Topbar({ active, onOpenMobile }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
      >
        <IconMenu className="size-5" />
      </button>

      <h1 className="text-lg font-semibold text-slate-900">{TITLES[active] ?? "Overview"}</h1>

      <div className="ml-auto flex items-center gap-3">
        <label className="relative hidden sm:block">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </label>

        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <IconBell className="size-5" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <button type="button" className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100">
          <Avatar name={user?.email ?? "User"} className="size-8" />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-medium text-slate-900">{user?.email ?? "…"}</span>
            <span className="block text-xs capitalize text-slate-500">{user?.role ?? ""}</span>
          </span>
          <IconChevronDown className="hidden size-4 text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
