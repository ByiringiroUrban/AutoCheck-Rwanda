import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Protect Yourself from Odometer Fraud | AutoCheck Rwanda",
  description: "Learn how to spot and avoid odometer tampering and mileage rollback when purchasing a used car in Rwanda.",
};

export default function OdometerFraudPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Protect Yourself from Odometer Fraud in Rwanda
            </h1>
            <p className="mt-2 text-[15px] text-[#555] max-w-3xl">
              Odometer rollback is one of the most common scams in the used vehicle market, artificially inflating prices by tens of millions of Rwandan Francs. Learn how to verify mileage before you buy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-ac-blue mb-4">
                  What is Odometer Rollback?
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  Odometer tampering involves illegally altering the mileage display of a vehicle to make it appear as though it has been driven significantly fewer kilometers. In East Africa and Rwanda, vehicles imported from overseas (Japan, Dubai, Europe) are sometimes clocked prior to customs clearance or during local resale.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  A car with 220,000 km might have its digital cluster altered to show only 85,000 km. Unsuspecting buyers pay premium prices for worn engines, aging transmissions, and imminent costly repairs.
                </p>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-ac-blue mb-4">
                  5 Signs of Odometer Tampering to Watch For
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-[13px]">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-ac-ink text-[15px]">Excessive Wear vs. Low Claimed Mileage</h3>
                      <p className="text-[13px] text-gray-600">
                        Check the rubber pads on brake and accelerator pedals, the steering wheel texture, and driver&apos;s seat bolster. A car showing 60,000 km should not have heavily worn pedals or sagging seat springs.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-[13px]">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-ac-ink text-[15px]">Inspection (Contrôle Technique) Mileage Gaps</h3>
                      <p className="text-[13px] text-gray-600">
                        Rwanda National Police technical inspections log odometer readings at every annual or bi-annual check. If last year&apos;s inspection logged 140,000 km and the current cluster displays 110,000 km, the odometer was rolled back.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-[13px]">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-ac-ink text-[15px]">Service Stickers & Maintenance Invoices</h3>
                      <p className="text-[13px] text-gray-600">
                        Look on door frames or under the bonnet for oil change stickers or timing belt replacement dates. Sellers often overlook these telltale stickers.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-[13px]">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold text-ac-ink text-[15px]">Scratches or Misalignment on the Instrument Cluster</h3>
                      <p className="text-[13px] text-gray-600">
                        Tool marks, loose plastic clips, or scratches around the speedometer cover can indicate the dashboard was removed to reprogram the EEPROM chip.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-[13px]">
                      5
                    </span>
                    <div>
                      <h3 className="font-semibold text-ac-ink text-[15px]">AutoCheck Odometer Check Warning</h3>
                      <p className="text-[13px] text-gray-600">
                        Our report cross-references pre-export auction records, import manifests, and domestic inspection records to flag any chronological rollback.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-6">
                <h3 className="text-[18px] font-bold text-ac-blue mb-3">
                  Verify Mileage Now
                </h3>
                <p className="text-[14px] text-gray-700 mb-4">
                  Run an instant AutoCheck Rwanda report to check historical mileage readings from import to today.
                </p>
                <Link
                  href="/vehiclehistory/vehicle-history-reports"
                  className="ac-btn block text-center no-underline text-white font-semibold py-3"
                >
                  Order Mileage History Report
                </Link>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <h3 className="text-[16px] font-bold text-ac-ink mb-2">
                  AutoCheck Buyback Protection
                </h3>
                <p className="text-[13px] text-gray-600 mb-3">
                  Qualifying reports come backed by AutoCheck Rwanda Buyback Protection in case of undetected odometer fraud.
                </p>
                <Link
                  href="/vehiclehistory/vehicle-buyback-protection"
                  className="text-[14px] font-bold text-ac-blue underline"
                >
                  Learn About Buyback Protection »
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
