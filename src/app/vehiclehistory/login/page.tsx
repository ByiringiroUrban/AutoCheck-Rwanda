import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In or Create an Account | AutoCheck Rwanda",
  description: "Sign in to your AutoCheck Rwanda account or create a new account to access vehicle history reports, manage subscriptions, and more.",
};

export default function LoginPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="pb-[56px]">
        {/* ── Page heading ── */}
        <div className="border-b border-solid border-[#e0e0e0] bg-[#f8f9fa] py-5">
          <div className="ac-container">
            <h1 className="m-0 text-[26px] font-bold text-ac-ink">Sign In or Create a New Account</h1>
          </div>
        </div>

        <div className="ac-container mt-[28px]">

          {/* ── Top: Sign in + Register panels ── */}
          <div className="flex flex-wrap mx-[-10.5px] mb-[28px]">

            {/* Sign In panel */}
            <div className="w-full md:w-1/2 px-[10.5px] mb-[20px] md:mb-0">
              <div className="h-full rounded-[8px] border border-solid border-[#ddd] bg-white shadow-sm overflow-hidden">
                <div className="bg-ac-blue px-5 py-4">
                  <h2 className="m-0 text-[18px] font-bold text-white">
                    Returning Subscriber? Sign in now.
                  </h2>
                </div>
                <div className="p-6">
                  <p className="mb-[18px] text-[13px] text-[#555] leading-[1.5]">
                    Please enter your email address and password to access your AutoCheck Rwanda account and VHR history.
                  </p>

                  <form id="signin-form" noValidate>
                    <div className="mb-[16px]">
                      <label htmlFor="signin-email" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                        E-mail
                      </label>
                      <input
                        id="signin-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue focus:shadow-[0_0_0_0.2rem_rgba(0,73,144,0.2)] transition-all duration-150"
                      />
                    </div>

                    <div className="mb-[20px]">
                      <label htmlFor="signin-password" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                        Password
                      </label>
                      <input
                        id="signin-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue focus:shadow-[0_0_0_0.2rem_rgba(0,73,144,0.2)] transition-all duration-150"
                      />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        type="submit"
                        id="signin-submit"
                        className="ac-btn px-6 h-[38px] text-[14px]"
                      >
                        Sign in
                      </button>
                      <a
                        href="/vehiclehistory/forgot-password"
                        className="text-[13px] text-ac-blue hover:underline"
                      >
                        Unable to Sign in? Reset Your Password »
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Create Account panel */}
            <div className="w-full md:w-1/2 px-[10.5px]">
              <div className="h-full rounded-[8px] border border-solid border-[#ddd] bg-white shadow-sm overflow-hidden">
                <div className="bg-ac-navy px-5 py-4">
                  <h2 className="m-0 text-[18px] font-bold text-white">
                    New to AutoCheck? Create an account.
                  </h2>
                </div>
                <div className="p-6">
                  <form id="register-form" noValidate>
                    {/* First & Last name */}
                    <div className="flex flex-wrap mx-[-6px] mb-[16px]">
                      <div className="w-1/2 px-[6px]">
                        <label htmlFor="reg-firstname" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                          First Name
                        </label>
                        <input
                          id="reg-firstname"
                          name="firstName"
                          type="text"
                          placeholder="Jean"
                          className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue transition-all duration-150"
                        />
                      </div>
                      <div className="w-1/2 px-[6px]">
                        <label htmlFor="reg-lastname" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                          Last Name
                        </label>
                        <input
                          id="reg-lastname"
                          name="lastName"
                          type="text"
                          placeholder="Uwimana"
                          className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue transition-all duration-150"
                        />
                      </div>
                    </div>

                    <div className="mb-[16px]">
                      <label htmlFor="reg-email" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                        E-mail
                      </label>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue transition-all duration-150"
                      />
                    </div>

                    <div className="flex flex-wrap mx-[-6px] mb-[12px]">
                      <div className="w-full md:w-1/2 px-[6px] mb-[16px] md:mb-0">
                        <label htmlFor="reg-password" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                          Password
                        </label>
                        <input
                          id="reg-password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue transition-all duration-150"
                        />
                      </div>
                      <div className="w-full md:w-1/2 px-[6px]">
                        <label className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                          Requirements
                        </label>
                        <ul className="m-0 p-0 list-none space-y-[2px]">
                          {[
                            "At least 8 characters",
                            "A mix of CAPITAL (A-Z) and lower case (a-z) letters",
                            "At least one number (1-2) or special character (& ! @)",
                          ].map((req) => (
                            <li key={req} className="flex items-start gap-[5px] text-[11px] text-[#666] leading-[1.4]">
                              <span className="mt-[1px] text-ac-magenta flex-shrink-0">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-[16px]">
                      <label htmlFor="reg-confirm" className="block mb-[5px] text-[12px] font-semibold text-[#555] uppercase tracking-wide">
                        Confirm Password
                      </label>
                      <input
                        id="reg-confirm"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-[#ccc] rounded-none focus:outline-0 focus:border-ac-blue transition-all duration-150"
                      />
                    </div>

                    <div className="mb-[20px] flex items-start gap-2">
                      <input
                        id="reg-marketing"
                        name="marketing"
                        type="checkbox"
                        className="mt-[2px] h-4 w-4 accent-ac-magenta cursor-pointer flex-shrink-0"
                      />
                      <label htmlFor="reg-marketing" className="text-[12px] text-[#555] leading-[1.5] cursor-pointer">
                        Yes, Please send me email updates and exclusive offers from AutoCheck Rwanda
                      </label>
                    </div>

                    <button
                      type="submit"
                      id="register-submit"
                      className="ac-btn px-8 h-[38px] text-[14px]"
                    >
                      Create Account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-0 border-0 border-t border-solid border-[#ddd]" />

          {/* ── Bottom promo cards ── */}
          <div className="flex flex-wrap mx-[-10.5px] mt-[28px] gap-y-[20px]">

            {/* Dealer card */}
            <div className="w-full md:w-1/2 px-[10.5px]">
              <div className="flex gap-5 rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm h-full">
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/slides/slide-1.jpg"
                    alt="AutoCheck Rwanda for dealers"
                    width={90}
                    height={90}
                    className="rounded-[6px] object-cover"
                    style={{ width: 90, height: 90 }}
                  />
                </div>
                <div>
                  <h3 className="m-0 mb-2 text-[15px] font-bold text-ac-ink">
                    Are you a Car Dealer or Commercial Client?
                  </h3>
                  <p className="m-0 mb-3 text-[13px] text-[#555] leading-[1.5]">
                    Get more information on how AutoCheck Rwanda can help you grow your dealership.
                  </p>
                  <a href="/vehiclehistory/dealer-login" className="text-[13px] text-ac-blue hover:underline block mb-1">
                    Sign in to your AutoCheck Rwanda dealer account »
                  </a>
                  <a href="/vehiclehistory/dealer-signup" className="text-[13px] text-ac-blue hover:underline block">
                    Become an AutoCheck Rwanda member »
                  </a>
                </div>
              </div>
            </div>

            {/* Buyback card */}
            <div className="w-full md:w-1/2 px-[10.5px]">
              <div className="flex gap-5 rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm h-full">
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/BuybackProtection.png"
                    alt="Buyback Protection"
                    width={90}
                    height={90}
                    className="object-contain"
                    style={{ width: 90, height: 90 }}
                  />
                </div>
                <div>
                  <h3 className="m-0 mb-2 text-[15px] font-bold text-ac-ink">
                    Superior Buyback Protection Included
                  </h3>
                  <p className="m-0 mb-3 text-[13px] text-[#555] leading-[1.5]">
                    AutoCheck Buyback Protection is available at no extra cost on AutoCheck vehicle history reports.
                    If a certain title brand is found after the brand is reported to be free of the brand, we buy it back.
                  </p>
                  <p className="m-0 mb-3 text-[13px] text-[#555] leading-[1.5]">
                    There is no extra cost for you to take advantage of this exclusive benefit from AutoCheck Rwanda!
                    It&apos;s simple: we miss it, we buy it back.
                  </p>
                  <a href="/vehiclehistory/vehicle-buyback-protection" className="text-[13px] text-ac-blue hover:underline">
                    Learn More »
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
