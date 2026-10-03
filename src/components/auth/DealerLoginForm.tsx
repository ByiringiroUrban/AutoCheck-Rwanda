"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { Alert } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { homeForRole } from "@/utils/roles";

export function DealerLoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const user = await login(String(data.get("email") || ""), String(data.get("password") || ""));
      router.push(homeForRole(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign in failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form method="post" action="/vehiclehistory/dealer-login" noValidate onSubmit={onSubmit}>
      <div className="mb-[18px]">
        <label htmlFor="dealer-email" className="mb-[6px] block text-[13px] font-semibold text-[#444]">
          Email Address
        </label>
        <input
          id="dealer-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          className="block h-[40px] w-full rounded-[5px] border border-solid border-ac-input-border px-[14px] text-[14px]"
        />
      </div>
      <div className="mb-[18px]">
        <label htmlFor="dealer-password" className="mb-[6px] block text-[13px] font-semibold text-[#444]">
          Password
        </label>
        <input
          id="dealer-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          className="block h-[40px] w-full rounded-[5px] border border-solid border-ac-input-border px-[14px] text-[14px]"
        />
        <a href="/vehiclehistory/forgot-password" className="mt-1 block text-right text-[12px] text-ac-blue hover:underline">
          Forgot Password?
        </a>
      </div>
      {error ? (
        <div className="mb-3">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      <button type="submit" className="ac-btn h-[44px] w-full text-[15px] font-semibold" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
