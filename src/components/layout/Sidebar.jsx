import { HeartHandshake } from "lucide-react";
import {
  IconGrid,
  IconUsers,
  IconHeart,
  IconCheckCircle,
  IconSliders,
  IconLogOut,
  IconX,
} from "../icons";
import { useAuth } from "../../auth/AuthContext";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: IconGrid },
  { id: "volunteers", label: "Volunteers", icon: IconUsers },
  { id: "beneficiaries", label: "Beneficiaries", icon: IconHeart },
  { id: "matches", label: "Matches", icon: IconCheckCircle },
];

function NavLink({ item, active, onNavigate }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/20"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="size-5" />
      {item.label}
    </button>
  );
}

function SidebarContent({ active, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-slate-900">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <HeartHandshake className="size-5" strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Impact Project</p>
          <p className="text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.id} item={item} active={active === item.id} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        {user && <p className="truncate px-3 pb-1 text-xs text-slate-400">{user.email}</p>}
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <IconSliders className="size-5" />
          Settings
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <IconLogOut className="size-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="fixed h-screen w-64">
          <SidebarContent active={active} onNavigate={onNavigate} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-64">
            <div className="relative h-full">
              <button
                type="button"
                onClick={onCloseMobile}
                className="absolute right-0 top-6 -mr-11 flex size-9 items-center justify-center rounded-lg bg-slate-900/80 text-white"
              >
                <IconX className="size-5" />
              </button>
              <SidebarContent
                active={active}
                onNavigate={(id) => {
                  onNavigate(id);
                  onCloseMobile();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
