"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";

export default function DealerSignupPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Become an AutoCheck Rwanda Dealer Member
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Empower your dealership with trusted vehicle history reports, sell inventory faster, and build lasting customer confidence across Rwanda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* Dealer Benefits */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-ac-blue mb-3">Why Join AutoCheck Rwanda?</h2>
                <ul className="space-y-3 text-[14px] text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-ac-blue font-bold">✓</span>
                    <span><strong>Wholesale Pricing:</strong> Deep volume discounts on bulk VIN and Rwanda plate reports.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ac-blue font-bold">✓</span>
                    <span><strong>Dealership Window Stickers:</strong> Official AutoCheck vehicle history summary stickers for your showroom cars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ac-blue font-bold">✓</span>
                    <span><strong>Dealer Dashboard:</strong> Real-time inventory tracking, saved search history, and instant PDF downloads.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ac-blue font-bold">✓</span>
                    <span><strong>Buyback Protection:</strong> Elevate buyer trust with AutoCheck Rwanda vehicle buyback coverage.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-5">
                <h3 className="text-[15px] font-bold text-ac-blue mb-1">Already a member?</h3>
                <p className="text-[13px] text-gray-600 mb-3">
                  Log in to your dealer portal to manage reports and billing.
                </p>
                <Link
                  href="/vehiclehistory/dealer-login"
                  className="font-bold text-ac-blue underline text-[14px]"
                >
                  Dealer Portal Sign In »
                </Link>
              </div>
            </div>

            {/* Signup Form */}
            <div className="md:col-span-7">
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 md:p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl font-bold mb-4">
                      ✓
                    </div>
                    <h3 className="text-2xl font-bold text-ac-ink mb-2">Application Received!</h3>
                    <p className="text-[14px] text-gray-600 mb-6">
                      Thank you for applying. An AutoCheck Rwanda Dealer Relations specialist in Kigali will contact you within 24 hours to activate your wholesale account.
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
                    <h2 className="text-xl font-bold text-ac-ink mb-4">
                      Request Dealership Membership
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                            Dealership / Business Name *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Kigali Motors Ltd"
                            className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                            TIN (Tax Identification Number) *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="9-digit RRA TIN"
                            className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                            Contact Person Name *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Full name"
                            className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                            Official Title / Role
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sales Manager, Director"
                            className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                            Phone Number *
                          </label>
                          <input
                            required
                            type="tel"
                            placeholder="+250 78... / +250 72..."
                            className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                            Business Email *
                          </label>
                          <input
                            required
                            type="email"
                            placeholder="dealer@company.rw"
                            className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                          Showroom / Yard Location in Rwanda
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Gikondo, Nyarutarama, Gatsata, Musanze"
                          className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] focus:outline-none focus:border-ac-blue"
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-semibold text-ac-ink mb-1">
                          Estimated Monthly Vehicle Inventory / Inspections
                        </label>
                        <select className="w-full h-[38px] px-3 border border-[#cbd5e1] rounded text-[14px] bg-white text-ac-ink">
                          <option>1 - 10 vehicles per month</option>
                          <option>11 - 30 vehicles per month</option>
                          <option>31 - 100 vehicles per month</option>
                          <option>100+ vehicles per month (Enterprise Fleet / Importer)</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button type="submit" className="ac-btn w-full py-3 font-semibold text-[15px]">
                          Submit Dealer Application
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
