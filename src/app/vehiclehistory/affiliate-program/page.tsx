"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function AffiliateProgramPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              AutoCheck Rwanda Affiliate Program
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Monetize your automotive website, classified portal, blog, or digital media platform by referring car buyers to AutoCheck Rwanda reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <div className="text-3xl font-bold text-ac-blue mb-1">Up to 25%</div>
              <h3 className="font-bold text-ac-ink text-[16px] mb-2">High Commissions</h3>
              <p className="text-[13px] text-gray-600">
                Earn competitive payouts in Rwandan Francs (Rfw) on every single report and subscription package purchased through your tracking links.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <div className="text-3xl font-bold text-ac-blue mb-1">30-Day</div>
              <h3 className="font-bold text-ac-ink text-[16px] mb-2">Cookie Window</h3>
              <p className="text-[13px] text-gray-600">
                Benefit from a 30-day tracking cookie. Even if a buyer returns weeks later to complete their vehicle search, you still earn your commission.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <div className="text-3xl font-bold text-ac-blue mb-1">Instant</div>
              <h3 className="font-bold text-ac-ink text-[16px] mb-2">MoMo & Bank Payouts</h3>
              <p className="text-[13px] text-gray-600">
                Get monthly disbursements directly to your MTN MoMo account, Airtel Money, or local Rwandan commercial bank account.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm mb-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-4">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-ac-ink mb-2">Application Submitted!</h2>
                <p className="text-[14px] text-gray-600 mb-6">
                  Our affiliate team will review your website or platform and email your affiliate tracking link and banner kit within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="ac-btn inline-block text-white font-semibold px-6 py-2"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-ac-blue mb-4">
                  Join the AutoCheck Rwanda Affiliate Network
                </h2>
                <p className="text-[14px] text-gray-600 mb-6">
                  Ideal for automotive marketplaces, financial comparison portals, insurance brokers, and tech creators across Rwanda.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-ac-ink mb-1">Full Name *</label>
                      <input required type="text" placeholder="Your name" className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-ac-ink mb-1">Email Address *</label>
                      <input required type="email" placeholder="name@example.com" className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold text-ac-ink mb-1">Website URL or Social Channel *</label>
                      <input required type="text" placeholder="https://myautoblog.rw" className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-ac-ink mb-1">Phone / WhatsApp Number *</label>
                      <input required type="tel" placeholder="+250 78... / +250 72..." className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-ac-ink mb-1">How will you promote AutoCheck Rwanda?</label>
                    <textarea rows={3} placeholder="Tell us about your audience, monthly visitors, and promotional strategy..." className="w-full p-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue" />
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="ac-btn w-full sm:w-auto px-8 py-3 font-semibold text-[15px]">
                      Apply to Affiliate Program
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
