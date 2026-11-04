"use client";

import Link from "next/link";
import { DealerApplicationForm } from "@/components/dealer/DealerApplicationForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function DealerSignupPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-10">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">Request AutoCheck Rwanda Dealer Access</h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Individual dealers can apply with their account details. If you represent a registered business, include its organization information for review.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-5">
              <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-ac-blue">Why join AutoCheck Rwanda?</h2>
                <ul className="space-y-3 text-[14px] text-gray-700">
                  <li>✓ Access vehicle history reports for more transparent sales.</li>
                  <li>✓ Manage dealer inventory and saved reports.</li>
                  <li>✓ Build buyer confidence with verified vehicle information.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-[#cde0f5] bg-[#f0f6fa] p-5">
                <h3 className="mb-1 text-[15px] font-bold text-ac-blue">Already have dealer access?</h3>
                <p className="mb-3 text-[13px] text-gray-600">Sign in to your AutoCheck account.</p>
                <Link
                  href="/vehiclehistory/dealer-login"
                  className="text-[14px] font-bold text-ac-blue underline"
                >
                  Dealer Portal Sign In »
                </Link>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-xl font-bold text-ac-ink">Dealer access application</h2>
                <DealerApplicationForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
