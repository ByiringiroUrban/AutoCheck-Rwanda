import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Vehicle History Reports | AutoCheck Rwanda",
  description: "Order comprehensive vehicle history reports in Rwanda to make informed purchasing decisions.",
};

export default function VehicleHistoryReportsPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-12">
        <div className="ac-container">
          <h1 className="text-3xl font-bold text-[#004990] mb-6">Order Vehicle History Reports</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#eaeaea] mb-8">
            <h2 className="text-xl font-bold text-[#333] mb-4">Why get an AutoCheck Vehicle History Report?</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              When buying a used car, it is essential to know its history. An AutoCheck Rwanda vehicle history report helps you understand a vehicle's past, including previous accidents, odometer readings, and title brands. This information is crucial in making a safe and sound investment.
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Check for major accidents or damage</li>
              <li>Verify the odometer reading</li>
              <li>See if the vehicle has been used as a taxi, rental, or police vehicle</li>
              <li>Check for open recalls</li>
            </ul>

            <div className="flex gap-4">
              <Link href="/#vehiclehistoryreport" className="ac-btn inline-block text-center no-underline text-white bg-[#004990] hover:bg-[#003366] px-6 py-3 rounded">
                Check VIN Now
              </Link>
              <Link href="/vehiclehistory/sample-vehicle-history-report" className="inline-block text-center no-underline text-[#004990] bg-transparent border border-[#004990] hover:bg-[#f0f4f8] px-6 py-3 rounded font-medium">
                View Sample Report
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
