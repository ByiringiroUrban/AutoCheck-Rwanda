import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LightningIcon, MailReportIcon, SyncRefreshIcon } from "@/components/icons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Digital Report Delivery | AutoCheck Rwanda",
  description: "Receive instant electronic delivery of your vehicle history report directly to your screen and email.",
};

export default function FreeOnlineDeliveryPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Free Digital Report Delivery
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Get your AutoCheck Rwanda vehicle history report immediately with zero shipping delays or delivery fees.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm space-y-6 mb-8">
            <h2 className="text-xl font-bold text-ac-blue">Instant Electronic Access</h2>
            <p className="text-[15px] text-gray-700 leading-relaxed">
              When you purchase an AutoCheck Rwanda Vehicle History Report, there is never any waiting for postal delivery or courier services. As soon as your MTN MoMo, Airtel Money, or credit card payment is confirmed, your report is generated on screen in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 border border-[#e2e8f0] rounded-lg bg-[#fbfbfb] hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                  <LightningIcon width={22} height={22} />
                </div>
                <h3 className="font-bold text-ac-ink text-[16px] mb-2">Instant On-Screen Display</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Read and review the complete vehicle record on your smartphone, tablet, or laptop immediately.
                </p>
              </div>

              <div className="p-6 border border-[#e2e8f0] rounded-lg bg-[#fbfbfb] hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                  <MailReportIcon width={22} height={22} />
                </div>
                <h3 className="font-bold text-ac-ink text-[16px] mb-2">PDF Sent to Your Email</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  A high-resolution, printable PDF copy is simultaneously emailed to you for your permanent records.
                </p>
              </div>

              <div className="p-6 border border-[#e2e8f0] rounded-lg bg-[#fbfbfb] hover:shadow-md transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                  <SyncRefreshIcon width={22} height={22} />
                </div>
                <h3 className="font-bold text-ac-ink text-[16px] mb-2">21 Days Dynamic Updates</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  Re-check your report anytime during the 21-day subscription window to catch any newly logged inspections or events.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-6 text-center">
            <h2 className="text-xl font-bold text-ac-blue mb-2">Ready to look up a vehicle?</h2>
            <p className="text-[14px] text-gray-600 mb-4">
              Enter any 17-digit VIN or Rwanda license plate to receive your report now.
            </p>
            <Link
              href="/vehiclehistory/vehicle-history-reports"
              className="ac-btn inline-block text-white font-semibold px-6 py-2.5 no-underline"
            >
              Order Vehicle History Report
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
