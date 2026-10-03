"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { accountLinkForRole, groupsForRole, linkIsActive } from "@/utils/navigation";

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
  const menuRef = useRef<HTMLDivElement>(null);
  const groups = groupsForRole(user?.role);
  const account = accountLinkForRole(user?.role);
  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() || "AC";

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
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-solid border-[#e3ebeb] bg-white px-3 shadow-sm md:px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-solid border-[#d5e0e0] bg-white text-ac-navy md:hidden"
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="block h-[2px] w-4 bg-ac-navy shadow-[0_5px_0_#063838,0_-5px_0_#063838]" />
          </button>
          <Link href="/" className="flex items-center no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-desktop.png" alt="AutoCheck Rwanda" width={148} height={42} className="h-9 w-auto" />
          </Link>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-solid border-[#d5e0e0] bg-white py-1 pl-1 pr-3"
            aria-label="Account menu"
            aria-expanded={menu}
            aria-haspopup="menu"
            onClick={() => setMenu((value) => !value)}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ac-magenta text-[12px] font-bold text-white">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[13px] font-semibold leading-4 text-ac-ink">
                {user ? user.first_name : "Account"}
              </span>
              <span className="block text-[11px] leading-4 text-[#7a8686]">{user?.role || ""}</span>
            </span>
          </button>
          {menu ? (
            <div role="menu" className="absolute right-0 top-12 w-64 rounded-xl border border-solid border-[#e3ebeb] bg-white p-3 text-ac-ink shadow-lg">
              <p className="m-0 text-[14px] font-bold">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="m-0 mt-1 text-[12px] text-[#667]">{user?.email}</p>
              <p className="m-0 mt-2 inline-block rounded-full bg-[#e7f3f3] px-2 py-0.5 text-[11px] font-bold text-ac-navy">
                {user?.role}
              </p>
              {account ? (
                <Link
                  href={account.href}
                  className="mt-3 block rounded-md px-2 py-2 text-[14px] font-semibold text-ac-navy no-underline hover:bg-[#f4f8f8]"
                  onClick={() => setMenu(false)}
                >
                  {account.label}
                </Link>
              ) : null}
              <button
                type="button"
                className="mt-1 w-full rounded-md bg-transparent px-2 py-2 text-left text-[14px] font-semibold text-ac-danger"
                onClick={() => void logout()}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 top-16 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-16 z-30 w-64 overflow-y-auto bg-ac-navy text-white ${
          open ? "block" : "hidden"
        } md:block`}
      >
        <nav className="pb-8 pt-3">
          {groups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="m-0 px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white/45">
                {group.label}
              </p>
              {group.links.map((item) => {
                const active = linkIsActive(path, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`mx-2 block rounded-md px-3 py-2 text-[14px] no-underline ${
                      active ? "bg-white/15 font-bold text-white" : "font-medium text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen pt-16 md:pl-64">
        <div className="px-4 py-5 md:px-6">
          <h1 className="m-0 text-[22px] font-bold text-ac-ink">{title}</h1>
          {subtitle ? <p className="mb-4 mt-1 text-[13px] text-[#667]">{subtitle}</p> : null}
          {children}
        </div>
      </main>
    </div>
  );
}
