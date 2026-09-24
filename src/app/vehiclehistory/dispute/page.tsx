import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispute a Vehicle History Record | AutoCheck Rwanda",
  description: "Dispute inaccurate information in your AutoCheck Rwanda vehicle history report. Submit your concern and we'll get back to you quickly.",
};

const DISPUTE_TOPICS = [
  "Vehicle history report record dispute",
  "Incorrect accident record",
  "Wrong odometer reading",
  "Title brand error",
  "Ownership history inaccuracy",
  "Stolen/repossessed record dispute",
  "Other record dispute",
];

export default function DisputePage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="pb-[56px]">
        {/* ── Page header ── */}
        <div className="border-b border-solid border-[#e0e0e0] bg-[#f8f9fa] py-6">
          <div className="ac-container">
            <h1 className="m-0 text-[28px] font-bold text-ac-ink">Dispute a Vehicle Record</h1>
            <p className="mt-2 mb-0 text-[14px] text-[#666]">
              Have a question?{" "}
              <a href="/vehiclehistory/faq" className="text-ac-blue hover:underline font-medium">
                Try our FAQ for answers to frequently asked questions »
              </a>
            </p>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="ac-container mt-[28px]">
          <div className="flex flex-wrap mx-[-10.5px]">

            {/* ── LEFT: Form ── */}
            <div className="w-full md:w-8/12 px-[10.5px]">
              <div className="rounded-[8px] border border-solid border-[#ddd] bg-white p-6 shadow-sm">
                <p className="mb-[20px] text-[14px] leading-[1.6] text-[#444]">
                  To help us serve you better, please provide as much detail as possible using the form below
                  and we&apos;ll get back to you as quickly as we can.
                </p>

                <form id="dispute-form" noValidate>
                  {/* Topic selector */}
                  <div className="mb-[18px]">
                    <label htmlFor="dispute-topic" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                      How may we help you?
                    </label>
                    <select
                      id="dispute-topic"
                      name="topic"
                      className="block w-full h-[38px] px-3 text-[14px] text-ac-select-text bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] cursor-pointer"
                    >
                      {DISPUTE_TOPICS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Detail textarea */}
                  <div className="mb-[18px]">
                    <label htmlFor="dispute-detail" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                      Please describe your concern
                    </label>
                    <p className="mb-[8px] text-[12px] leading-[1.5] text-ac-blue">
                      Please provide as much detail as possible about your concern. If disputing a portion of the report,
                      paste the section in question into this field.
                    </p>
                    <textarea
                      id="dispute-detail"
                      name="detail"
                      rows={6}
                      placeholder="Describe your dispute in detail..."
                      className="block w-full px-3 py-2 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] resize-y focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                    />
                  </div>

                  {/* Name & Email */}
                  <div className="flex flex-wrap mx-[-8px] mb-[18px]">
                    <div className="w-full md:w-1/2 px-[8px] mb-[14px] md:mb-0">
                      <label htmlFor="dispute-name" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                        Your Name
                      </label>
                      <input
                        id="dispute-name"
                        name="name"
                        type="text"
                        placeholder="Full name"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                      />
                    </div>
                    <div className="w-full md:w-1/2 px-[8px]">
                      <label htmlFor="dispute-email" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                        Your Email Address
                      </label>
                      <input
                        id="dispute-email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                      />
                    </div>
                  </div>

                  <p className="mb-[18px] text-[12px] leading-[1.5] text-[#666]">
                    We must have your email address to contact you about your concern. We promise to keep it safe.
                    Please read our{" "}
                    <a href="/vehiclehistory/privacy" className="text-ac-blue hover:underline">privacy policy</a>
                    {" "}for more information.
                  </p>

                  {/* VIN (optional) */}
                  <div className="mb-[24px] rounded-[6px] bg-[#f8f9fa] border border-solid border-[#e8e8e8] p-4">
                    <p className="mb-[8px] text-[13px] font-semibold text-ac-blue">
                      Did you run a report? Please enter the Vehicle Identification Number (VIN) — optional
                    </p>
                    <input
                      id="dispute-vin"
                      name="vin"
                      type="text"
                      maxLength={17}
                      placeholder="VIN (17 characters)"
                      className="block w-full md:w-1/2 h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                    />
                    <p className="mt-[6px] text-[12px] text-[#777]">
                      If your question concerns more than one VIN, please include additional VINs in the detail field above.
                    </p>
                  </div>

                  <button
                    type="submit"
                    id="dispute-submit"
                    className="ac-btn px-8 h-[42px] text-[15px] font-medium"
                  >
                    Submit Dispute
                  </button>
                </form>
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div className="w-full md:w-4/12 px-[10.5px] mt-[28px] md:mt-0">
              {/* Business box */}
              <div className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 mb-5 shadow-sm">
                <h3 className="m-0 mb-4 pb-3 border-b border-solid border-[#eee] text-[16px] font-bold text-ac-ink">
                  AutoCheck Rwanda for Business
                </h3>
                <ul className="m-0 p-0 list-none space-y-2">
                  {[
                    { label: "AutoCheck for Car Dealers »", href: "/vehiclehistory/dealer-signup" },
                    { label: "AutoCheck for Lenders »", href: "/vehiclehistory/lenders" },
                    { label: "AutoCheck for Fleet Managers »", href: "/vehiclehistory/fleet" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-[13px] text-ac-blue hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ box */}
              <div className="rounded-[8px] border border-solid border-[#ddd] bg-white p-5 shadow-sm">
                <h3 className="m-0 mb-4 pb-3 border-b border-solid border-[#eee] text-[16px] font-bold text-ac-ink">
                  Frequently Asked Questions
                </h3>
                <ul className="m-0 p-0 list-none space-y-2">
                  {[
                    { label: "How do I reset my password? »", href: "/vehiclehistory/faq#password" },
                    { label: "Can I view a sample report? »", href: "/vehiclehistory/sample-vehicle-history-report" },
                    { label: "What is the AutoCheck Score? »", href: "/vehiclehistory/autocheck-score" },
                    { label: "What is Vehicle Buyback Protection? »", href: "/vehiclehistory/vehicle-buyback-protection" },
                    { label: "How do I read my report? »", href: "/vehiclehistory/faq#reading" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-[13px] text-ac-blue hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
