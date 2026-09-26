import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rwanda Vehicle Registry Data Sources | AutoCheck Rwanda",
  description: "Learn how AutoCheck aggregates vehicle data from RRA, Rwanda National Police, regional customs, and international auction houses.",
};

export default function DataSourcesPage() {
  const sources = [
    {
      name: "Rwanda Revenue Authority (RRA)",
      role: "Official Vehicle Registry & Customs",
      details:
        "Data on original date of entry into Rwanda, customs clearing documentation, chassis/engine number validation, and official title ownership transfer history.",
    },
    {
      name: "Rwanda National Police (Traffic Department)",
      role: "Roadworthiness & Technical Inspections",
      details:
        "Historical Contrôle Technique logs, recorded odometer mileage at each inspection interval, and police accident incident reports filed in Rwanda.",
    },
    {
      name: "International Export & Auction Houses",
      role: "Global Pre-Import Background",
      details:
        "Auction grading sheets, pre-shipment photos, and salvage/damage declarations from major export sources for Rwanda (Japan, UAE/Dubai, Europe, and the US).",
    },
    {
      name: "Insurance Companies in Rwanda",
      role: "Claims & Total Loss Records",
      details:
        "Comprehensive records of collision claims, flood write-offs, third-party liability damages, and declared total loss payouts.",
    },
    {
      name: "Rwanda Development Board (RDB) Mortgage Registry",
      role: "Lien & Financial Collateral Verification",
      details:
        "Checks for registered movable property mortgages ensuring vehicles are free of active debt or commercial pledges before purchase.",
    },
    {
      name: "Authorized Dealerships & Service Centers",
      role: "Maintenance & Recall Information",
      details:
        "Scheduled maintenance logs, factory warranty records, and manufacturer safety recalls affecting vehicles operated in Rwanda.",
    },
  ];

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Rwanda Vehicle Registry & Data Sources
            </h1>
            <p className="mt-2 text-[15px] text-[#555] max-w-3xl">
              AutoCheck Rwanda aggregates millions of records from trusted governmental, technical, financial, and global automotive sources to deliver the most accurate history available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sources.map((s) => (
              <div key={s.name} className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <div className="text-[13px] font-bold uppercase tracking-wider text-ac-blue mb-1">
                  {s.role}
                </div>
                <h3 className="text-xl font-bold text-ac-ink mb-2">{s.name}</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {s.details}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-8 text-center">
            <h2 className="text-2xl font-bold text-ac-blue mb-2">
              Ready to verify a vehicle using official records?
            </h2>
            <p className="text-[14px] text-gray-600 mb-6 max-w-xl mx-auto">
              Our automated system correlates all these databases within seconds to give you an authoritative report.
            </p>
            <Link
              href="/vehiclehistory/vehicle-history-reports"
              className="ac-btn inline-block text-white font-semibold px-8 py-3 no-underline"
            >
              Order AutoCheck Report Now
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
