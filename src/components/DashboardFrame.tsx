"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Car,
  ChevronDown,
  ClipboardCheck,
  FilePlus,
  Files,
  FileText,
  History,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Scale,
  ScanSearch,
  ScrollText,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
  Warehouse,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { accountLinkForRole, groupsForRole, linkIsActive } from "@/utils/navigation";

const ICONS: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/my-vehicles": Car,
  "/dashboard/ai-inspection": ScanSearch,
  "/dashboard/reports": FileText,
  "/dashboard/disputes": Scale,
  "/dashboard/settings": Settings,
  "/garage/dashboard": LayoutDashboard,
  "/garage/vehicles": Search,
  "/garage/records/new": Wrench,
  "/garage/inspections/new": ClipboardCheck,
  "/garage/history": History,
  "/garage/staff": Users,
  "/garage/settings": Building2,
  "/dealer/inventory": Warehouse,
  "/dealer/reports": Files,
  "/dealer/application": FilePlus,
  "/admin": LayoutDashboard,
  "/admin/organizations": Building2,
  "/admin/disputes": Scale,
  "/admin/vehicles": Car,
  "/admin/users": Users,
  "/admin/settings": SlidersHorizontal,
  "/admin/super": LayoutDashboard,
  "/admin/security": KeyRound,
  "/admin/audit-logs": ScrollText,
};

const GROUP_ICONS: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Vehicles: Car,
  Records: FileText,
  Account: Settings,
  Workshop: Wrench,
  History: History,
  People: Users,
  Dealership: Warehouse,
  Business: Building2,
  Operations: Scale,
  Registry: Car,
  Platform: SlidersHorizontal,
  Access: KeyRound,
  System: ScrollText,
};

export function DashboardFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const groups = groupsForRole(user?.role);
  const account = accountLinkForRole(user?.role);
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() || "AC";
  const roleLabel = (user?.role || "").replaceAll("_", " ");

  useEffect(() => {
    setNavigating(false);
    setOpen(false);
    const active = groups.filter((group) => group.links.some((item) => linkIsActive(path, item.href))).map((group) => group.label);
    setOpenGroups((current) => [...new Set([...current, ...active])]);
  }, [path, user?.role]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href.startsWith("/") || href.startsWith("//") || href === path) return;
      setNavigating(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [path]);

  useEffect(() => {
    if (!menu) return;
    const onDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenu(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <div className="min-h-screen bg-[#eef3f3] text-ac-ink">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden bg-[#8c2f0a] text-white ${
          open ? "flex" : "hidden"
        } md:flex`}
      >
        <Car aria-hidden size={168} strokeWidth={1.2} className="pointer-events-none absolute bottom-32 left-1/2 z-0 -translate-x-1/2 rotate-[-12deg] text-white/20" />
        <div className="relative z-10 flex h-16 shrink-0 items-center border-b border-solid border-white/20 px-4">
          <Link href="/" className="flex items-center no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-desktop.png" alt="AutoCheck Rwanda" width={148} height={42} className="h-9 w-auto" />
          </Link>
        </div>

        <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {groups.map((group) => {
            const GroupIcon = GROUP_ICONS[group.label] || LayoutDashboard;
            if (group.links.length === 1) {
              const item = group.links[0];
              const active = linkIsActive(path, item.href);
              const Icon = ICONS[item.href] || GroupIcon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium no-underline ${
                    active ? "bg-white text-ac-navy" : "text-white/90 hover:bg-white/15"
                  }`}
                >
                  <Icon size={16} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            }

            const childActive = group.links.some((item) => linkIsActive(path, item.href));
            const opened = openGroups.includes(group.label);
            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((current) =>
                      current.includes(group.label) ? current.filter((label) => label !== group.label) : [...current, group.label],
                    )
                  }
                  className={`flex h-9 w-full items-center gap-2.5 rounded-lg bg-transparent px-3 text-[13px] font-medium ${
                    childActive ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15"
                  }`}
                >
                  <GroupIcon size={16} />
                  <span className="flex-1 truncate text-left">{group.label}</span>
                  <ChevronDown size={14} className={`text-white/80 transition ${opened ? "rotate-180" : ""}`} />
                </button>
                {opened ? (
                  <div className="ml-5 mt-1 space-y-1 border-l border-solid border-white/35 pl-2">
                    {group.links.map((item) => {
                      const active = linkIsActive(path, item.href);
                      const Icon = ICONS[item.href] || LayoutDashboard;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex h-8 items-center gap-2 rounded-lg px-2 text-[13px] no-underline ${
                            active ? "bg-white text-ac-navy" : "text-white/90 hover:bg-white/15"
                          }`}
                        >
                          <Icon size={15} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="relative z-10 shrink-0 border-t border-solid border-white/20 p-3">
          {account ? (
            <Link href={account.href} onClick={() => setOpen(false)} className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2 no-underline hover:bg-white/15">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[12px] font-bold text-[#8c2f0a]">{initials}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-white">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="block truncate text-[11px] uppercase tracking-wide text-white/75">{roleLabel}</span>
              </span>
            </Link>
          ) : (
            <div className="mb-1 flex items-center gap-3 px-2 py-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[12px] font-bold text-[#8c2f0a]">{initials}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-white">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="block truncate text-[11px] uppercase tracking-wide text-white/75">{roleLabel}</span>
              </span>
            </div>
          )}
          <button
            type="button"
            disabled={signingOut}
            onClick={() => {
              setSigningOut(true);
              void logout();
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-lg bg-transparent px-3 text-[13px] font-medium text-white hover:bg-white/15 disabled:opacity-60"
          >
            <LogOut size={16} />
            {signingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </aside>

      {open ? (
        <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      ) : null}

      <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-solid border-[#e3ebeb] bg-white px-3 md:left-64 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-solid border-[#d5e0e0] bg-white text-ac-navy md:hidden"
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="min-w-0">
            <h1 className="m-0 truncate text-[15px] font-medium text-ac-navy">{title}</h1>
            {subtitle ? <p className="mb-0 mt-0.5 hidden truncate text-[12px] text-[#7a8686] sm:block">{subtitle}</p> : null}
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-solid border-[#d5e0e0] bg-white py-1 pl-1 pr-2 hover:border-ac-navy"
            aria-label="Account menu"
            aria-expanded={menu}
            onClick={() => setMenu((value) => !value)}
          >
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ac-magenta text-[12px] font-bold text-white">{initials}</span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-semibold leading-4">{user?.first_name || "Account"}</span>
              <span className="block text-[11px] leading-4 text-[#7a8686]">{roleLabel}</span>
            </span>
            <ChevronDown size={16} className={`text-[#667] transition ${menu ? "rotate-180" : ""}`} />
          </button>
          {menu ? (
            <div role="menu" className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-solid border-[#e3ebeb] bg-white p-3 shadow-lg">
              <div className="flex items-center gap-3">
                {user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-ac-magenta text-[14px] font-bold text-white">{initials}</span>
                )}
                <div className="min-w-0">
                  <p className="m-0 truncate text-[14px] font-medium">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="m-0 truncate text-[12px] text-[#667]">{user?.email}</p>
                </div>
              </div>
              <p className="m-0 mt-2 inline-block rounded-md bg-ac-navy px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">{roleLabel}</p>
              {account ? (
                <Link href={account.href} className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-medium text-ac-navy no-underline hover:bg-[#f4f8f8]" onClick={() => setMenu(false)}>
                  <Settings size={16} />
                  {account.label}
                </Link>
              ) : null}
              <button
                type="button"
                role="menuitem"
                disabled={signingOut}
                onClick={() => {
                  setSigningOut(true);
                  void logout();
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg bg-transparent px-2 py-2 text-left text-[14px] font-medium text-ac-danger hover:bg-[#fdecec] disabled:opacity-60"
              >
                <LogOut size={16} />
                {signingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          ) : null}
        </div>
        {navigating ? (
          <div className="absolute bottom-0 left-0 h-[3px] w-full overflow-hidden bg-[#fde7d6]" role="progressbar" aria-label="Opening page">
            <div className="ac-nav-progress h-full w-1/3 bg-ac-magenta" />
          </div>
        ) : null}
      </header>

      <main className="min-h-screen pt-16 md:pl-64">
        <div className="px-4 py-5 md:px-6">{children}</div>
      </main>
    </div>
  );
}
