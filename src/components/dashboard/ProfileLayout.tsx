import type { ReactNode } from "react";
import { Panel, StatusBadge } from "@/components/dashboard/kit";

export const profileFieldClass =
  "h-10 w-full rounded-lg border border-solid border-[#d5e0e0] bg-white px-3 text-[14px] text-ac-ink outline-none focus:border-ac-navy";

export function ProfileLayout({
  name,
  email,
  badge,
  detail,
  children,
}: {
  name: string;
  email?: string | null;
  badge: string;
  detail?: string;
  children: ReactNode;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[280px_1fr]">
      <Panel>
        <div className="px-5 py-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-ac-navy text-[16px] font-medium text-white">{initials || "AC"}</div>
          <h2 className="mb-0 mt-3 text-[16px] font-medium leading-snug text-ac-navy">{name}</h2>
          {email ? <p className="mb-0 mt-1 break-all text-[13px] text-[#667]">{email}</p> : null}
          <div className="mt-3">
            <StatusBadge status={badge} />
          </div>
          {detail ? <p className="mb-0 mt-3 text-[12px] text-[#7a8686]">{detail}</p> : null}
        </div>
      </Panel>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function FieldLabel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#7a8686]">{label}</span>
      {children}
    </label>
  );
}
