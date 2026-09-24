import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealer Sign In | AutoCheck Rwanda",
  description: "Sign in to your AutoCheck Rwanda dealer account to access vehicle history reports and manage your subscription.",
};

export default function DealerLoginPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main>
        {/* ── Hero banner ── */}
        <div
          className="relative hidden md:flex items-center justify-center"
          style={{
            minHeight: 220,
            backgroundImage: "url(/images/slides/slide-2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center px-4 py-10">
            <h1 className="m-0 text-[36px] font-bold leading-tight text-white drop-shadow-lg">
              Dealer Member Sign In
            </h1>
            <p className="mt-2 text-white/80 text-[15px]">
              Access your AutoCheck Rwanda dealer dashboard
            </p>
          </div>
        </div>

        {/* Mobile heading */}
        <div className="md:hidden bg-ac-navy px-4 py-6 text-center">
          <h1 className="m-0 text-[26px] font-bold text-white">Dealer Member Sign In</h1>
        </div>

        {/* ── Main content ── */}
        <div className="ac-container py-[42px]">
          <div className="flex flex-wrap mx-[-10.5px] justify-center">

            {/* Left: Login card */}
            <div className="w-full md:w-5/12 px-[10.5px] mb-[28px]">
              <div className="rounded-[10px] border border-solid border-[#ddd] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Card header */}
                <div className="bg-ac-navy px-6 py-4 text-center">
                  <p className="m-0 text-white text-[13px] font-medium tracking-wide uppercase opacity-80">
                    AutoCheck Rwanda
                  </p>
                  <h2 className="m-0 mt-1 text-[22px] font-bold text-white">Member Portal</h2>
                </div>

                {/* Form */}
                <div className="px-8 py-8">
                  <form noValidate>
                    <div className="mb-[18px]">
                      <label htmlFor="dealer-email" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                        Email Address / Customer ID
                      </label>
                      <input
                        id="dealer-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email or customer ID"
                        className="block w-full h-[40px] px-[14px] text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                      />
                      <a href="/vehiclehistory/forgot-customer-id" className="mt-1 block text-right text-[12px] text-ac-blue hover:underline">
                        Forgot Customer ID?
                      </a>
                    </div>

                    <div className="mb-[18px]">
                      <label htmlFor="dealer-password" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                        Password
                      </label>
                      <input
                        id="dealer-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="block w-full h-[40px] px-[14px] text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                      />
                      <a href="/vehiclehistory/forgot-password" className="mt-1 block text-right text-[12px] text-ac-blue hover:underline">
                        Forgot Password?
                      </a>
                    </div>

                    <div className="mb-[22px] flex items-center gap-2">
                      <input
                        id="remember-me"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 accent-ac-magenta cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="text-[13px] text-[#555] cursor-pointer select-none">
                        Remember My Customer ID
                      </label>
                    </div>

                    <button
                      type="submit"
                      id="dealer-login-submit"
                      className="ac-btn w-full text-[15px] font-semibold h-[44px]"
                    >
                      Sign In
                    </button>
                  </form>

                  <hr className="my-6 border-0 border-t border-solid border-[#eee]" />

                  <p className="text-center text-[13px] text-[#666]">
                    New dealer?{" "}
                    <a href="/vehiclehistory/dealer-signup" className="text-ac-blue font-semibold hover:underline">
                      Become an AutoCheck Rwanda Member »
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Info panel */}
            <div className="w-full md:w-5/12 px-[10.5px] mb-[28px]">
              <div className="rounded-[10px] border border-solid border-[#e8f0fb] bg-[#f4f7fc] p-6">
                <h3 className="mb-4 text-[18px] font-bold text-ac-blue">
                  Why AutoCheck Rwanda for Dealers?
                </h3>
                <ul className="m-0 p-0 list-none space-y-3">
                  {[
                    "Access unlimited vehicle history reports for your lot",
                    "Rwanda-specific vehicle registry data and records",
                    "Bulk VIN check tools for faster inventory management",
                    "Professional reports to share with buyers",
                    "Dedicated dealer support team in Rwanda",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] text-[#444] leading-[1.5]">
                      <span className="mt-[2px] flex-shrink-0 h-5 w-5 rounded-full bg-ac-magenta flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-[8px] bg-ac-navy p-4 text-white">
                  <p className="m-0 text-[13px] leading-[1.6]">
                    <strong>Need help?</strong> Contact our dealer support team at{" "}
                    <a href="mailto:dealers@autocheckreawanda.rw" className="text-white underline">
                      dealers@autocheckreawanda.rw
                    </a>
                    {" "}or call{" "}
                    <a href="tel:+250788000000" className="text-white underline">
                      +250 788 000 000
                    </a>
                  </p>
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
