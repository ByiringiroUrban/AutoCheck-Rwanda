"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown, Eye, Loader2, X } from "lucide-react";

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-xl border border-solid border-[#e3ebeb] bg-white shadow-sm ${className}`}>
      {title || action ? (
        <header className="flex flex-col gap-3 border-b border-solid border-[#eef3f3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            {title ? <h2 className="m-0 text-[16px] font-bold text-ac-navy">{title}</h2> : null}
            {subtitle ? <p className="mb-0 mt-0.5 text-[12px] text-[#7a8686]">{subtitle}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-solid border-[#e3ebeb] bg-white p-4 shadow-sm">
      {icon ? (
        <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-[#e7f3f3] text-ac-navy">{icon}</div>
      ) : null}
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-[#7a8686]">{label}</p>
      <p className="m-0 mt-1 truncate text-[22px] font-medium leading-none text-ac-navy">{value}</p>
      {hint ? <p className="mb-0 mt-2 border-t border-solid border-[#eef3f3] pt-2 text-[12px] text-[#7a8686]">{hint}</p> : null}
    </article>
  );
}

export function ActionCard({
  href,
  title,
  text,
  icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl border border-solid border-[#e3ebeb] bg-white p-4 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#e7f3f3] text-ac-navy">{icon}</span>
      <span>
        <p className="m-0 font-bold text-ac-navy">{title}</p>
        <p className="mb-0 mt-1 text-[13px] text-[#555]">{text}</p>
      </span>
    </Link>
  );
}

const badgeTones = {
  success: "bg-ac-navy text-white",
  warning: "bg-ac-magenta text-white",
  danger: "bg-ac-danger text-white",
  info: "bg-ac-blue text-white",
  neutral: "bg-[#e7f3f3] text-ac-navy",
};

function badgeTone(status: string) {
  const value = status.toLowerCase().replaceAll("_", " ");
  if (["active", "approved", "completed", "resolved", "verified", "ok"].some((item) => value.includes(item))) return "success";
  if (["pending", "moderate", "in progress", "open"].some((item) => value.includes(item))) return "warning";
  if (["rejected", "failed", "suspended", "inactive", "severe"].some((item) => value.includes(item))) return "danger";
  if (["unknown"].some((item) => value.includes(item))) return "neutral";
  return "info";
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${badgeTones[badgeTone(status)]}`}>
      {status}
    </span>
  );
}

export type RowAction = {
  label: string;
  onClick?: () => void | Promise<void>;
  href?: string;
  danger?: boolean;
};

export function ActionMenu({ items }: { items: RowAction[] }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  const toggle = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) {
      const menuHeight = Math.max(items.length, 1) * 40 + 8;
      const openUp = rect.bottom + menuHeight > window.innerHeight - 16 && rect.top > menuHeight;
      setCoords({
        top: openUp ? rect.top - menuHeight - 4 : rect.bottom + 4,
        left: Math.min(rect.left, window.innerWidth - 210),
      });
    }
    setOpen((value) => !value);
  };

  const run = (item: RowAction) => {
    if (!item.onClick) {
      setOpen(false);
      return;
    }
    const result = item.onClick();
    if (result && typeof (result as Promise<void>).then === "function") {
      setBusy(item.label);
      void Promise.resolve(result).finally(() => {
        setBusy(null);
        setOpen(false);
      });
      return;
    }
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="inline-block text-left">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-solid border-[#d5e0e0] bg-white px-3 text-[12px] font-semibold text-ac-navy hover:bg-[#f4f8f8]"
        aria-expanded={open}
      >
        Actions
        <ChevronDown size={14} className="text-[#7a8686]" />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: coords.top, left: coords.left }}
              className="fixed z-[400] min-w-48 overflow-hidden rounded-xl border border-solid border-[#e3ebeb] bg-white py-1 shadow-lg"
            >
              {items.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium text-ac-ink no-underline hover:bg-[#f4f8f8]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    disabled={busy === item.label}
                    onClick={() => run(item)}
                    className={`flex w-full items-center gap-2 bg-transparent px-3 py-2 text-left text-[13px] font-medium hover:bg-[#f4f8f8] disabled:opacity-60 ${
                      item.danger ? "text-ac-danger" : "text-ac-ink"
                    }`}
                  >
                    {busy === item.label ? <Loader2 size={14} className="animate-spin" /> : null}
                    {item.label}
                  </button>
                ),
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function PreviewDialog({
  title,
  fields,
  onClose,
}: {
  title: string;
  fields: { label: string; value: string }[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[380] flex items-center justify-center p-4">
      <button type="button" aria-label="Close preview" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-solid border-[#e3ebeb] bg-white shadow-xl">
        <header className="flex items-start justify-between gap-3 border-b border-solid border-[#eef3f3] px-5 py-4">
          <div>
            <p className="m-0 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[#7a8686]">
              <Eye size={14} />
              Preview
            </p>
            <h2 className="m-0 mt-1 text-[18px] font-bold text-ac-navy">{title}</h2>
          </div>
          <button type="button" aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg bg-transparent text-[#667] hover:bg-[#f4f8f8]" onClick={onClose}>
            <X size={16} />
          </button>
        </header>
        <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="min-w-0">
              <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-[#7a8686]">{field.label}</p>
              <p className="mb-0 mt-1 break-words text-[14px] text-ac-ink">{field.value || "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
