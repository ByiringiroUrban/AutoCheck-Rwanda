import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | AutoCheck Rwanda",
  description: "Contact AutoCheck Rwanda for help with vehicle history reports, billing, technical support, and more. We're here to help.",
};

const CONTACT_TOPICS = [
  { value: "", label: "Please Choose One" },
  { value: "report-question", label: "Question about my vehicle history report" },
  { value: "billing", label: "Billing or subscription question" },
  { value: "technical", label: "Technical support" },
  { value: "dispute", label: "Dispute a report record" },
  { value: "dealer", label: "Dealer / business inquiry" },
  { value: "feedback", label: "General feedback" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="pb-[56px]">
        {/* ── Page header ── */}
        <div className="border-b border-solid border-[#e0e0e0] bg-[#f8f9fa] py-6">
          <div className="ac-container">
            <h1 className="m-0 text-[28px] font-bold text-ac-ink">Contact Us</h1>
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

            {/* ── LEFT: Contact form ── */}
            <div className="w-full md:w-8/12 px-[10.5px]">
              <div className="rounded-[8px] border border-solid border-[#ddd] bg-white p-6 shadow-sm">
                <p className="mb-[20px] text-[14px] leading-[1.6] text-[#444]">
                  To help us serve you better, please provide as much detail as possible using the form below
                  and we&apos;ll get back to you as quickly as we can.
                </p>

                <form id="contact-form" noValidate>
                  {/* Topic */}
                  <div className="mb-[18px]">
                    <label htmlFor="contact-topic" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                      How may we help you?
                    </label>
                    <select
                      id="contact-topic"
                      name="topic"
                      className="block w-full h-[38px] px-3 text-[14px] text-ac-select-text bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] cursor-pointer"
                    >
                      {CONTACT_TOPICS.map((t) => (
                        <option key={t.value} value={t.value} disabled={t.value === ""}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Detail textarea */}
                  <div className="mb-[18px]">
                    <label htmlFor="contact-message" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                      Message
                    </label>
                    <p className="mb-[8px] text-[12px] leading-[1.5] text-ac-blue">
                      Please provide as much detail as possible about your concern. If disputing a portion of the report,
                      paste the section in question into this section.
                    </p>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      placeholder="Describe your question or concern in detail..."
                      className="block w-full px-3 py-2 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] resize-y focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                    />
                  </div>

                  {/* Name & Email */}
                  <div className="flex flex-wrap mx-[-8px] mb-[18px]">
                    <div className="w-full md:w-1/2 px-[8px] mb-[14px] md:mb-0">
                      <label htmlFor="contact-name" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="Full name"
                        className="block w-full h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                      />
                    </div>
                    <div className="w-full md:w-1/2 px-[8px]">
                      <label htmlFor="contact-email" className="block mb-[6px] text-[13px] font-semibold text-[#444]">
                        Your Email Address
                      </label>
                      <input
                        id="contact-email"
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

                  {/* Optional VIN */}
                  <div className="mb-[24px] rounded-[6px] bg-[#f8f9fa] border border-solid border-[#e8e8e8] p-4">
                    <p className="mb-[8px] text-[13px] font-semibold text-ac-blue">
                      Did you run a report? Please enter the Vehicle Identification Number (VIN) — optional
                    </p>
                    <input
                      id="contact-vin"
                      name="vin"
                      type="text"
                      maxLength={17}
                      placeholder="VIN (17 characters)"
                      className="block w-full md:w-1/2 h-[38px] px-3 text-[14px] text-ac-ink bg-white border border-solid border-ac-input-border rounded-[5px] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-all duration-150"
                    />
                    <p className="mt-[6px] text-[12px] text-[#777]">
                      If your question concerns more than one VIN, please include additional VINs in the message field above.
                    </p>
                  </div>

                  <button
                    type="submit"
                    id="contact-submit"
                    className="ac-btn px-8 h-[42px] text-[15px] font-medium"
                  >
                    Submit Question
                  </button>
                </form>
              </div>

              {/* Direct contact info */}
              <div className="mt-5 rounded-[8px] bg-[#f4f7fc] border border-solid border-[#dce8fb] p-5">
                <h3 className="m-0 mb-3 text-[15px] font-bold text-ac-blue">Other Ways to Reach Us</h3>
                <div className="flex flex-wrap gap-6 text-[13px] text-[#444]">
                  <div>
                    <span className="block font-semibold text-ac-ink mb-1">📧 Email</span>
                    <a href="mailto:support@autocheckrewanda.rw" className="text-ac-blue hover:underline">
                      support@autocheckrewanda.rw
                    </a>
                  </div>
                  <div>
                    <span className="block font-semibold text-ac-ink mb-1">📞 Phone</span>
                    <a href="tel:+250788000000" className="text-ac-blue hover:underline">
                      +250 788 000 000
                    </a>
                  </div>
                  <div>
                    <span className="block font-semibold text-ac-ink mb-1">🕐 Hours</span>
                    <span>Mon – Fri, 8:00 AM – 6:00 PM (CAT)</span>
                  </div>
                </div>
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
