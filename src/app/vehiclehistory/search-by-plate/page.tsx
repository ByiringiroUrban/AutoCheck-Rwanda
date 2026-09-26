import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search by Rwanda License Plate | AutoCheck Rwanda",
  description: "Lookup vehicle history using Rwanda license plate numbers registered across Kigali and all provinces.",
};

export default function SearchByPlatePage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Search Vehicle History by Rwanda License Plate
            </h1>
            <p className="mt-2 text-[15px] text-[#555] max-w-3xl">
              Don&apos;t have the VIN handy? You can check vehicle records directly using the vehicle&apos;s Rwanda license plate number. Our database links registered Rwanda plates directly to official RRA records, technical inspection data, and insurance claims.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Search Card */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ac-blue mb-4">
                Enter Rwanda Plate Number
              </h2>
              <form action="/vehiclehistory/vehicle-history-reports#search-reports" method="GET" className="space-y-4">
                <div>
                  <label htmlFor="plate-input" className="block text-[14px] font-semibold text-ac-ink mb-1">
                    Plate Number
                  </label>
                  <input
                    id="plate-input"
                    name="plate"
                    type="text"
                    placeholder="e.g. RAC 123A, RAE 456B, GR 789C"
                    className="w-full h-[42px] px-4 text-[15px] border border-[#cbd5e1] rounded focus:outline-none focus:border-[#004990]"
                  />
                  <p className="text-[12px] text-gray-500 mt-1">
                    Format: 3 letters, 3 digits, followed by 1 letter (Standard private Rwanda plate).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-semibold text-ac-ink mb-1">
                      Registration Province / District
                    </label>
                    <select className="w-full h-[42px] px-3 text-[14px] border border-[#cbd5e1] rounded bg-white text-ac-ink">
                      <option value="kigali">Kigali City (Gasabo, Kicukiro, Nyarugenge)</option>
                      <option value="eastern">Eastern Province</option>
                      <option value="northern">Northern Province</option>
                      <option value="southern">Southern Province</option>
                      <option value="western">Western Province</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[14px] font-semibold text-ac-ink mb-1">
                      Vehicle Category
                    </label>
                    <select className="w-full h-[42px] px-3 text-[14px] border border-[#cbd5e1] rounded bg-white text-ac-ink">
                      <option value="private">Private Passenger Vehicle</option>
                      <option value="commercial">Commercial / Taxi / Bus</option>
                      <option value="government">Government (GR / GP)</option>
                      <option value="diplomatic">Diplomatic / NGO (CD / IT)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="ac-btn w-full sm:w-auto px-8 py-3 text-[15px] font-semibold">
                    Look Up Plate History
                  </button>
                </div>
              </form>
            </div>

            {/* Information Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-5">
                <h3 className="text-[16px] font-bold text-ac-blue mb-2">
                  What&apos;s Included in a Plate Check?
                </h3>
                <ul className="text-[13px] text-gray-700 space-y-2 list-disc pl-4">
                  <li>RRA ownership history & transfer dates</li>
                  <li>Technical inspection (Contrôle Technique) status</li>
                  <li>Recorded odometer mileage at inspection</li>
                  <li>Accident and insurance claim history in Rwanda</li>
                  <li>Original import country & customs clearance status</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-[#e2e8f0] p-5 shadow-sm">
                <h3 className="text-[16px] font-bold text-ac-ink mb-2">
                  Have the VIN instead?
                </h3>
                <p className="text-[13px] text-gray-600 mb-3">
                  VIN checks provide complete global history, including pre-import auction records from Japan, UAE, Europe, or the US.
                </p>
                <Link
                  href="/vehiclehistory/vehicle-history-reports"
                  className="text-[14px] font-semibold text-ac-blue underline"
                >
                  Order VIN History Report »
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
