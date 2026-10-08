"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { ApiError } from "@/services/api";
import { endpoints } from "@/services/endpoints";
import { AppShell, Alert, PageHeading, fieldClass } from "@/components/ui";

type Step = "EMAIL" | "OTP_PASSWORD" | "SUCCESS";

export default function ForgotPasswordOtpPage() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // Timer countdown for resending OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Focus OTP input when entering step 2
  useEffect(() => {
    if (step === "OTP_PASSWORD" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // STEP 1: Request OTP
  const handleRequestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setPending(true);
    setError(null);
    setSuccessNote(null);

    try {
      await endpoints.forgotPassword(cleanEmail);
      setStep("OTP_PASSWORD");
      setCooldown(60); // 60s cooldown for resend
      setSuccessNote(`A 6-digit code was sent to ${cleanEmail}. Please check your inbox.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send reset code. Please try again.");
    } finally {
      setPending(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || pending || !email) return;
    setPending(true);
    setError(null);
    setSuccessNote(null);

    try {
      await endpoints.forgotPassword(email);
      setCooldown(60);
      setSuccessNote("A new 6-digit verification code has been sent.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resend code.");
    } finally {
      setPending(false);
    }
  };

  // STEP 2: Verify OTP & Reset Password
  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError("Please enter the complete 6-digit verification code.");
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
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        new_password: password,
      });
      setStep("SUCCESS");
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

  return (
    <AppShell>
      <PageHeading
        title="Reset Your Password"
        subtitle="Recover access to your AutoCheck Rwanda account using a secure 6-digit verification code."
      />

      <div className="ac-container mt-8 max-w-lg">
        <div className="overflow-hidden rounded-[12px] border border-solid border-[#e2e8f0] bg-white shadow-md">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="m-0 text-[18px] font-bold text-white">
                  {step === "EMAIL" && "Password Recovery"}
                  {step === "OTP_PASSWORD" && "Enter 6-Digit Code"}
                  {step === "SUCCESS" && "Password Reset Complete"}
                </h2>
                <p className="m-0 mt-1 text-[13px] text-slate-300">
                  {step === "EMAIL" && "Enter your email to receive an instant OTP code."}
                  {step === "OTP_PASSWORD" && `Verification code sent to ${email}`}
                  {step === "SUCCESS" && "Your account credentials have been updated."}
                </p>
              </div>
              {step === "OTP_PASSWORD" && (
                <span className="rounded-full bg-sky-500/20 px-2.5 py-1 text-[12px] font-semibold text-sky-300 border border-sky-400/30">
                  Step 2 of 2
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* STEP 1: Request OTP Form */}
            {step === "EMAIL" && (
              <form method="post" onSubmit={handleRequestOtp} className="space-y-4">
                {error ? <Alert>{error}</Alert> : null}

                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#334155]" htmlFor="reset-email">
                    Account Email Address
                  </label>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className={fieldClass}
                    autoFocus
                  />
                  <p className="mt-1 text-[12px] text-[#64748b]">
                    We will send a 6-digit OTP code to this email immediately.
                  </p>
                </div>

                <button
                  type="submit"
                  className="ac-btn w-full h-[42px] text-[15px] font-semibold shadow-sm"
                  disabled={pending}
                >
                  {pending ? "Sending Code via Email…" : "Send 6-Digit Verification Code"}
                </button>

                <div className="pt-2 text-center">
                  <Link href="/vehiclehistory/login" className="text-[13px] text-ac-blue hover:underline">
                    &larr; Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 2: Enter OTP & New Password */}
            {step === "OTP_PASSWORD" && (
              <form method="post" onSubmit={handleResetPassword} className="space-y-4">
                {successNote ? <Alert tone="ok">{successNote}</Alert> : null}
                {error ? <Alert>{error}</Alert> : null}

                {/* 6-Digit OTP Box */}
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
                    <span className="text-[#64748b]">Didn&apos;t receive the code?</span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={cooldown > 0 || pending}
                      className="font-semibold text-ac-blue hover:underline disabled:text-[#94a3b8] disabled:no-underline"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </button>
                  </div>
                </div>

                <hr className="my-2 border-[#f1f5f9]" />

                {/* New Password */}
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

                {/* Confirm Password */}
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

                {/* Password Match Checklist */}
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
                  {pending ? "Verifying OTP & Updating…" : "Verify OTP & Reset Password"}
                </button>

                <div className="flex items-center justify-between pt-2 text-[13px]">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("EMAIL");
                      setOtp("");
                      setError(null);
                      setSuccessNote(null);
                    }}
                    className="text-ac-blue hover:underline"
                  >
                    &larr; Change email address
                  </button>
                  <Link href="/vehiclehistory/login" className="text-slate-500 hover:text-slate-800">
                    Cancel
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 3: Success Screen */}
            {step === "SUCCESS" && (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="m-0 text-[18px] font-bold text-slate-900">Password Changed Successfully!</h3>
                <p className="m-0 text-[14px] text-[#475569]">
                  Your AutoCheck Rwanda password has been updated. You can now sign in with your new credentials.
                </p>

                <div className="pt-3">
                  <Link
                    href="/vehiclehistory/login"
                    className="ac-btn block w-full text-center text-[15px] font-semibold"
                  >
                    Proceed to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
