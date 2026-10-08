"use client";

import { createContext, useContext, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

const PendingContext = createContext(false);

export function PendingForm({
  onSubmit,
  className,
  children,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      method="post"
      className={className}
      aria-busy={pending || undefined}
      onSubmit={(event) => {
        event.preventDefault();
        if (pending) return;
        const result = onSubmit(event);
        if (result && typeof (result as Promise<unknown>).then === "function") {
          setPending(true);
          void Promise.resolve(result).finally(() => setPending(false));
        }
      }}
    >
      <PendingContext.Provider value={pending}>{children}</PendingContext.Provider>
    </form>
  );
}

export function SubmitButton({
  children,
  busyLabel = "Working…",
  className = "ac-btn px-5",
}: {
  children: ReactNode;
  busyLabel?: string;
  className?: string;
}) {
  const pending = useContext(PendingContext);
  return (
    <button type="submit" className={`${className} gap-2`} disabled={pending}>
      {pending ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : null}
      {pending ? busyLabel : children}
    </button>
  );
}

export function AsyncButton({
  children,
  busyLabel,
  onClick,
  className = "ac-btn px-5",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  busyLabel?: string;
  onClick: () => void | Promise<void>;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const locked = pending || disabled;
  return (
    <button
      type={type}
      className={`${className} gap-2`}
      disabled={locked}
      onClick={() => {
        if (locked) return;
        const result = onClick();
        if (result && typeof (result as Promise<unknown>).then === "function") {
          setPending(true);
          void Promise.resolve(result).finally(() => setPending(false));
        }
      }}
    >
      {pending ? <Loader2 className="animate-spin" size={16} aria-hidden="true" /> : null}
      {pending && busyLabel ? busyLabel : children}
    </button>
  );
}
