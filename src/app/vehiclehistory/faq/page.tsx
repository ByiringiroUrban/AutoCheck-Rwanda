"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is an AutoCheck Rwanda Vehicle History Report?",
      a: "An AutoCheck Rwanda report provides comprehensive data regarding a vehicle's background, including prior accidents, odometer readings, salvage/flood title brands, technical inspection records (Contrôle Technique), previous ownership transfers registered with RRA, and open recalls.",
    },
    {
      q: "How much does an AutoCheck report cost?",
      a: "A Single Report is 35,000 Rfw, which includes 21 days of dynamic data access. We also offer a 5-Report Package for 75,000 Rfw, as well as customized subscription packages for dealerships, microfinance institutions, and insurers.",
    },
    {
      q: "What payment methods are supported in Rwanda?",
      a: "We accept MTN Mobile Money (MoMo), Airtel Money, Visa, Mastercard, and direct bank transfers for corporate accounts.",
    },
    {
      q: "Can I search by Rwanda License Plate instead of VIN?",
      a: "Yes! If you do not have the 17-digit VIN, you can enter any Rwanda license plate number (e.g. RAC 123A). Our system maps registered plates to corresponding vehicle records.",
    },
    {
      q: "Does AutoCheck include pre-import data from Japan, UAE, Europe, or the USA?",
      a: "Yes. Many vehicles in Rwanda were imported through Mombasa or Dar es Salaam after originating in Japan, Dubai, the UK, or the United States. AutoCheck cross-references original export and auction records to reveal accidents or write-offs that occurred before the car entered Rwanda.",
    },
    {
      q: "How quickly do I receive my report after payment?",
      a: "Instant delivery! Your report is generated and displayed on your screen within seconds after payment confirmation, and a permanent PDF copy is sent directly to your email address.",
    },
    {
      q: "What is the AutoCheck Score®?",
      a: "The AutoCheck Score is a single numerical rating (e.g., 85 out of 100) that allows you to quickly assess a vehicle's overall condition and compare it with other vehicles of the same age and model class.",
    },
    {
      q: "What if I find an error in a report?",
      a: "You can submit a data dispute anytime through our Dispute Resolution portal. Our team will verify the records with official registry authorities and update the report accordingly.",
    },
  ];

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Everything you need to know about purchasing and understanding AutoCheck vehicle history reports in Rwanda.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {faqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden shadow-sm transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-[16px] text-ac-ink hover:text-ac-blue transition"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xl text-ac-blue ml-4 shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-[14px] text-gray-700 leading-relaxed border-t border-[#f1f5f9] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need more help */}
          <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-6 text-center">
            <h2 className="text-xl font-bold text-ac-blue mb-2">Still have questions?</h2>
            <p className="text-[14px] text-gray-600 mb-4">
              Our Kigali-based customer support team is available Monday through Saturday to help you.
            </p>
            <Link
              href="/vehiclehistory/contact"
              className="ac-btn inline-block text-white font-semibold px-6 py-2.5 no-underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
