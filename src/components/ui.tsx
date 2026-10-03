"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLoader } from "@/components/LogoLoader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const fieldClass =
  "block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue focus:shadow-[0_0_0_0.2rem_rgba(11,76,76,0.15)]";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />
      <main className="pb-14">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-solid border-[#e0e0e0] bg-[#f8f9fa] py-5">
      <div className="ac-container">
        <h1 className="m-0 text-[26px] font-bold text-ac-ink">{title}</h1>
        {subtitle ? <p className="mt-2 mb-0 text-[14px] text-[#666]">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function Alert({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "info" | "warn" | "ok";
}) {
  const tones = {
    error: "border-[#f5c2c7] bg-[#f8d7da] text-[#842029]",
    info: "border-[#d6e4f0] bg-[#f0f6fa] text-ac-ink",
    warn: "border-[#ffe69c] bg-[#fff3cd] text-[#664d03]",
    ok: "border-[#badbcc] bg-[#d1e7dd] text-[#0f5132]",
  };
  return (
    <div className={`rounded-[6px] border border-solid px-3 py-2 text-[13px] ${tones[tone]}`} role="alert">
      {children}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return <LogoLoader label={label} />;
}

export function PortalNav({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <div className="border-b border-solid border-[#e5e7eb] bg-white">
      <div className="ac-container flex gap-4 overflow-x-auto py-3">
        {items.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-[14px] no-underline ${active ? "font-bold text-ac-magenta" : "text-ac-blue"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
