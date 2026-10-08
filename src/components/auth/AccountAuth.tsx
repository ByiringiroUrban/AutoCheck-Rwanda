"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/services/api";
import { Alert, fieldClass } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { homeForRole } from "@/utils/roles";

const input = fieldClass;

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

export function AccountAuth() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [signError, setSignError] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);
  const [pending, setPending] = useState<"in" | "up" | null>(null);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSignError(null);
    setPending("in");
    try {
      const user = await login(String(data.get("email") || ""), String(data.get("password") || ""));
      router.push(homeForRole(user.role));
    } catch (error) {
      setSignError(error instanceof ApiError ? error.message : "Sign in failed.");
    } finally {
      setPending(null);
    }
  };

  const onRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirmPassword") || "");
    if (password.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setRegError("Password and confirmation do not match.");
      return;
    }
    setRegError(null);
    setPending("up");
    try {
      const user = await register({
        first_name: String(data.get("firstName") || ""),
        last_name: String(data.get("lastName") || ""),
        email: String(data.get("email") || ""),
        password,
        phone: String(data.get("phone") || "") || undefined,
      });
      router.push(homeForRole(user.role));
    } catch (error) {
      setRegError(error instanceof ApiError ? error.message : "Registration failed.");
    } finally {
      setPending(null);
    }
  };

  return (
    <main className="pb-[56px]">
      <div className="border-b border-solid border-[#e0e0e0] bg-[#f8f9fa] py-5">
        <div className="ac-container">
          <h1 className="m-0 text-[26px] font-bold text-ac-ink">Sign In or Create a New Account</h1>
        </div>
      </div>
      <div className="ac-container mt-[28px]">
        <div className="mb-[28px] flex flex-wrap mx-[-10.5px]">
          <div className="mb-[20px] w-full px-[10.5px] md:mb-0 md:w-1/2">
            <div className="h-full overflow-hidden rounded-[8px] border border-solid border-[#ddd] bg-white shadow-sm">
              <div className="bg-ac-blue px-5 py-4">
                <h2 className="m-0 text-[18px] font-bold text-white">Returning Subscriber? Sign in now.</h2>
              </div>
              <div className="p-6">
                <form method="post" action="/vehiclehistory/login" onSubmit={onSignIn}>
                  <label className="mb-[5px] block text-[12px] font-semibold uppercase tracking-wide text-[#555]" htmlFor="signin-email">
                    E-mail
                  </label>
                  <input id="signin-email" name="email" type="email" required autoComplete="email" className={`${input} mb-4`} />
                  <label className="mb-[5px] block text-[12px] font-semibold uppercase tracking-wide text-[#555]" htmlFor="signin-password">
                    Password
                  </label>
                  <div className="relative mb-4">
                    <input id="signin-password" name="password" type={showSignInPassword ? "text" : "password"} required autoComplete="current-password" className={`${input} w-full pr-10`} />
                    <button type="button" onClick={() => setShowSignInPassword(!showSignInPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333]" aria-label="Toggle password visibility">
                      {showSignInPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {signError ? (
                    <div className="mb-3">
                      <Alert>{signError}</Alert>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="submit" className="ac-btn h-[38px] px-6" disabled={pending === "in"}>
                      {pending === "in" ? "Signing in…" : "Sign in"}
                    </button>
                    <a href="/vehiclehistory/forgot-password" className="text-[13px] text-ac-blue hover:underline">
                      Unable to Sign in? Reset Your Password »
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="w-full px-[10.5px] md:w-1/2">
            <div className="h-full overflow-hidden rounded-[8px] border border-solid border-[#ddd] bg-white shadow-sm">
              <div className="bg-ac-navy px-5 py-4">
                <h2 className="m-0 text-[18px] font-bold text-white">New to AutoCheck? Create an account.</h2>
              </div>
              <div className="p-6">
                <form method="post" action="/vehiclehistory/login" onSubmit={onRegister}>
                  <div className="mb-4 flex flex-wrap mx-[-6px]">
                    <div className="w-1/2 px-[6px]">
                      <label className="mb-[5px] block text-[12px] font-semibold uppercase text-[#555]" htmlFor="reg-firstname">
                        First Name
                      </label>
                      <input id="reg-firstname" name="firstName" required className={input} />
                    </div>
                    <div className="w-1/2 px-[6px]">
                      <label className="mb-[5px] block text-[12px] font-semibold uppercase text-[#555]" htmlFor="reg-lastname">
                        Last Name
                      </label>
                      <input id="reg-lastname" name="lastName" required className={input} />
                    </div>
                  </div>
                  <label className="mb-[5px] block text-[12px] font-semibold uppercase text-[#555]" htmlFor="reg-email">
                    E-mail
                  </label>
                  <input id="reg-email" name="email" type="email" required className={`${input} mb-4`} />
                  <label className="mb-[5px] block text-[12px] font-semibold uppercase text-[#555]" htmlFor="reg-phone">
                    Phone
                  </label>
                  <input id="reg-phone" name="phone" type="tel" className={`${input} mb-4`} placeholder="+250 …" />
                  <label className="mb-[5px] block text-[12px] font-semibold uppercase text-[#555]" htmlFor="reg-password">
                    Password
                  </label>
                  <div className="relative mb-4">
                    <input id="reg-password" name="password" type={showRegPassword ? "text" : "password"} required minLength={8} className={`${input} w-full pr-10`} />
                    <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333]" aria-label="Toggle password visibility">
                      {showRegPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <label className="mb-[5px] block text-[12px] font-semibold uppercase text-[#555]" htmlFor="reg-confirm">
                    Confirm Password
                  </label>
                  <div className="relative mb-4">
                    <input id="reg-confirm" name="confirmPassword" type={showRegConfirm ? "text" : "password"} required className={`${input} w-full pr-10`} />
                    <button type="button" onClick={() => setShowRegConfirm(!showRegConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333]" aria-label="Toggle password visibility">
                      {showRegConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <ul className="mb-4 list-none p-0 text-[11px] text-[#666]">
                    <li>• At least 8 characters</li>
                    <li>• A mix of CAPITAL and lower case letters is recommended</li>
                    <li>• At least one number or special character is recommended</li>
                  </ul>
                  {regError ? (
                    <div className="mb-3">
                      <Alert>{regError}</Alert>
                    </div>
                  ) : null}
                  <button type="submit" className="ac-btn h-[38px] px-6" disabled={pending === "up"}>
                    {pending === "up" ? "Creating account…" : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-0 border-0 border-t border-solid border-[#ddd]" />
        <div className="mt-[28px] flex flex-wrap gap-y-[20px] mx-[-10.5px]">
          <div className="w-full px-[10.5px] md:w-1/2">
            <div className="h-full rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
              <h3 className="m-0 mb-2 text-[15px] font-bold">Are you a Car Dealer or Commercial Client?</h3>
              <a href="/vehiclehistory/dealer-login" className="block text-[13px] text-ac-blue hover:underline">
                Sign in to your AutoCheck Rwanda dealer account »
              </a>
              <a href="/vehiclehistory/dealer-signup" className="mt-1 block text-[13px] text-ac-blue hover:underline">
                Become an AutoCheck Rwanda member »
              </a>
            </div>
          </div>
          <div className="w-full px-[10.5px] md:w-1/2">
            <div className="h-full rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
              <h3 className="m-0 mb-2 text-[15px] font-bold">Superior Buyback Protection Included</h3>
              <a href="/vehiclehistory/vehicle-buyback-protection" className="text-[13px] text-ac-blue hover:underline">
                Learn More »
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
