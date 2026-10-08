"use client";

import { useState, useEffect, useRef, Suspense, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { AppShell, Alert, PageHeading, fieldClass } from "@/components/ui";

function ResetPasswordOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryEmail = searchParams.get("email") || "";
  const queryOtp = searchParams.get("otp") || "";

  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState(queryOtp);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (queryEmail) setEmail(queryEmail);
    if (queryOtp) setOtp(queryOtp);
  }, [queryEmail, queryOtp]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || resending || !email.trim()) return;
    setResending(true);
    setError(null);
    setSuccessNote(null);

    try {
      await endpoints.forgotPassword(email.trim().toLowerCase());
      setCooldown(60);
      setSuccessNote(`A new 6-digit code was sent to ${email.trim()}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail) {
      setError("Please enter your account email address.");
      return;
    }

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      await endpoints.resetPassword({
        email: cleanEmail,
        otp: cleanOtp,
        new_password: password,
      });
      setCompleted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Password reset failed. Please check your verification code and try again."
      );
    } finally {
      setPending(false);
    }
  };

  if (completed) {
    return (
      <div className="ac-container mt-8 max-w-lg">
        <div className="overflow-hidden rounded-[12px] border border-solid border-[#e2e8f0] bg-white p-6 shadow-md text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 className="m-0 text-[20px] font-bold text-slate-900">Password Reset Successfully!</h3>
          <p className="m-0 text-[14px] text-[#475569]">
            You can now log in to your AutoCheck Rwanda account with your new password.
          </p>

          <div className="pt-2">
            <Link href="/vehiclehistory/login" className="ac-btn block w-full text-center text-[15px] font-semibold">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-container mt-8 max-w-lg">
      <div className="overflow-hidden rounded-[12px] border border-solid border-[#e2e8f0] bg-white shadow-md">
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-6 py-5 text-white">
          <h2 className="m-0 text-[18px] font-bold text-white">Verify OTP & Set New Password</h2>
          <p className="m-0 mt-1 text-[13px] text-slate-300">
            Enter the 6-digit verification code from your email to update your credentials.
          </p>
        </div>

        <div className="p-6">
          <form method="post" onSubmit={onSubmit} className="space-y-4">
            {successNote ? <Alert tone="ok">{successNote}</Alert> : null}
            {error ? <Alert>{error}</Alert> : null}

            <div>
              <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="reset-email">
                Account Email
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={fieldClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[13px] font-semibold text-[#334155]" htmlFor="reset-otp">
                  6-Digit OTP Verification Code
                </label>
                <span className="text-[11px] text-rose-600 font-medium">Valid for 10 min</span>
              </div>
              <input
                ref={otpInputRef}
                id="reset-otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className={`${fieldClass} text-center font-mono text-[22px] font-bold tracking-[0.4em] text-slate-800 placeholder:tracking-normal placeholder:font-sans placeholder:text-[14px] placeholder:font-normal`}
              />
              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-[#64748b]">Didn&apos;t get a code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending || !email}
                  className="font-semibold text-ac-blue hover:underline disabled:text-[#94a3b8] disabled:no-underline"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                </button>
              </div>
            </div>

            <hr className="my-2 border-[#f1f5f9]" />

            <div>
              <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="new-password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`${fieldClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] font-medium text-[#64748b] hover:text-[#0f172a]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={fieldClass}
              />
            </div>

            <div className="rounded-[6px] bg-[#f8fafc] p-3 text-[12px] text-[#64748b]">
              <ul className="list-disc pl-4 space-y-0.5 m-0">
                <li className={password.length >= 6 ? "text-emerald-600 font-medium" : ""}>
                  At least 6 characters {password.length >= 6 ? "✓" : ""}
                </li>
                <li
                  className={
                    password && confirmPassword && password === confirmPassword
                      ? "text-emerald-600 font-medium"
                      : ""
                  }
                >
                  Passwords match {password && confirmPassword && password === confirmPassword ? "✓" : ""}
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="ac-btn w-full h-[42px] text-[15px] font-semibold shadow-sm"
              disabled={pending}
            >
              {pending ? "Verifying & Updating…" : "Verify OTP & Reset Password"}
            </button>

            <div className="pt-2 text-center">
              <Link href="/vehiclehistory/login" className="text-[13px] text-ac-blue hover:underline">
                &larr; Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AppShell>
      <PageHeading
        title="Reset Password with OTP"
        subtitle="Use your 6-digit verification code to reset your AutoCheck Rwanda password."
      />
      <Suspense fallback={<div className="py-12 text-center">Loading…</div>}>
        <ResetPasswordOtpContent />
      </Suspense>
    </AppShell>
  );
}
