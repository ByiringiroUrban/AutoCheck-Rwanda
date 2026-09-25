import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vehicle Buyback Protection | AutoCheck Rwanda",
  description: "Learn about the AutoCheck Vehicle Buyback Protection and how it safeguards your purchase.",
};

export default function VehicleBuybackProtectionPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-12">
        <div className="ac-container">
          <h1 className="text-3xl font-bold text-[#004990] mb-6">Vehicle Buyback Protection</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#eaeaea]">
            <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#333] mb-4">Buy with Confidence</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  AutoCheck Buyback Protection is designed to protect consumers from certain severe vehicle title problems that may not have been reported by the state issuing the title. If you buy an AutoCheck Assured vehicle and a covered state title brand is later discovered, AutoCheck may buy back your vehicle.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This protection adds an extra layer of security, giving you peace of mind when making your purchase decision.
                </p>
              </div>
              <div className="flex-shrink-0 w-full md:w-[300px] bg-[#f4f9ff] border border-[#cde0f5] p-6 rounded-lg text-center">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="/images/BuybackProtection.png" alt="Buyback Protection Logo" className="h-[80px] w-auto mx-auto mb-4" />
                 <p className="font-bold text-[#004990]">AutoCheck Assured™</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#333] mb-4">How it Works</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>1. Qualify:</strong> Ensure the vehicle you are purchasing is eligible for Buyback Protection (check the AutoCheck report).</p>
              <p><strong>2. Register:</strong> You must register for Buyback Protection within the specified timeframe after purchasing the vehicle (subject to Terms and Conditions).</p>
              <p><strong>3. Claim:</strong> If a covered title brand is later discovered (that wasn't on the original report), you may file a claim.</p>
            </div>

            <div className="mt-8 text-sm text-gray-500 bg-gray-50 p-4 rounded border border-gray-200">
              * Certain terms, conditions, and limitations apply. Buyback Protection may not cover all vehicles or all title problems. Please review the full Terms and Conditions for complete details.
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
