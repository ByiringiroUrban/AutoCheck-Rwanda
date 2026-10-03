"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { AppShell, Alert, PageHeading, fieldClass } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const result = await endpoints.forgotPassword(String(data.get("email") || ""));
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "The reset request could not be sent.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AppShell>
      <PageHeading title="Reset your password" subtitle="Enter the email on your AutoCheck Rwanda account." />
      <div className="ac-container mt-6 max-w-md">
        <form method="post" onSubmit={onSubmit} className="space-y-3 rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
          {message ? <Alert tone="ok">{message}</Alert> : null}
          {error ? <Alert>{error}</Alert> : null}
          <label className="block text-[13px] font-semibold" htmlFor="reset-email">
            Email
          </label>
          <input id="reset-email" name="email" type="email" required className={fieldClass} />
          <button type="submit" className="ac-btn px-5" disabled={pending}>
            {pending ? "Sending…" : "Send reset instructions"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
