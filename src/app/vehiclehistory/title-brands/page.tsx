import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vehicle Title Brands Guide | AutoCheck Rwanda",
  description: "Understand vehicle title brands such as salvage, flood damage, total loss, rebuilt titles, and bank liens in Rwanda.",
};

export default function TitleBrandsPage() {
  const brands = [
    {
      title: "Salvage Title",
      severity: "High Risk",
      badgeColor: "bg-red-100 text-red-700 border-red-300",
      description:
        "The vehicle was involved in a major collision or incident where repair costs exceeded its fair market value. Often imported into Africa as damaged salvage and patched up cheaply.",
    },
    {
      title: "Flood & Water Damage",
      severity: "High Risk",
      badgeColor: "bg-red-100 text-red-700 border-red-300",
      description:
        "The car was submerged in deep water or floodwaters. Corrodes electrical harnesses, computers (ECUs), sensor connectors, and creates hidden rust that compromises structural safety.",
    },
    {
      title: "Rebuilt / Reconditioned",
      severity: "Moderate Risk",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
      description:
        "A previously written-off salvage car that was repaired and inspected to regain roadworthiness. Requires thorough mechanical verification by certified technicians.",
    },
    {
      title: "Odometer Tampered / Exceeds Mechanical Limits",
      severity: "High Risk",
      badgeColor: "bg-red-100 text-red-700 border-red-300",
      description:
        "The mileage has been altered or the mechanical counter rolled over. Severe impact on vehicle resale value and maintenance scheduling.",
    },
    {
      title: "Bank Lien / Financial Collateral (Rwanda Mortgage)",
      severity: "Legal Risk",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
      description:
        "The vehicle was pledged as security for a loan with a Rwandan bank or microfinance institution (RDB mortgage registry). It cannot be legally transferred until the debt is cleared.",
    },
    {
      title: "Lemon / Manufacturer Buyback",
      severity: "Moderate Risk",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
      description:
        "The vehicle suffered from chronic, unresolvable mechanical defects while under original factory warranty in its country of origin.",
    },
  ];

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Vehicle Title Brands & Registration Status in Rwanda
            </h1>
            <p className="mt-2 text-[15px] text-[#555] max-w-3xl">
              A title brand is a permanent designation on a vehicle&apos;s record signifying severe prior damage, total insurance write-offs, or active legal claims. Know what each brand means before committing your savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {brands.map((b) => (
              <div key={b.title} className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-ac-ink">{b.title}</h3>
                  <span className={`text-[12px] font-semibold px-2.5 py-0.5 rounded border ${b.badgeColor}`}>
                    {b.severity}
                  </span>
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-ac-blue mb-2">
                  Check if a Vehicle Has a Branded Title
                </h2>
                <p className="text-[15px] text-gray-600 max-w-2xl">
                  AutoCheck Rwanda checks both global registry data and local RRA records for salvage, flood, theft, and active bank mortgages.
                </p>
              </div>
              <Link
                href="/vehiclehistory/vehicle-history-reports"
                className="ac-btn shrink-0 text-white font-semibold px-8 py-3 no-underline"
              >
                Check Title Brands Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
