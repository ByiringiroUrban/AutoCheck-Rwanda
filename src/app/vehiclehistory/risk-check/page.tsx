import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flood & Accident Risk Check | AutoCheck Rwanda",
  description: "Check for hidden flood damage and severe accident history before you buy.",
};

export default function RiskCheckPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-12">
        <div className="ac-container">
          <h1 className="text-3xl font-bold text-[#004990] mb-6">Flood & Accident Risk Check</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#eaeaea]">
            
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#dc3545] mb-4 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Hidden Flood Damage
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Flood-damaged vehicles are often cleaned up and resold, sometimes crossing borders. Water can severely damage a vehicle's electrical systems, engine, and interior, leading to expensive repairs down the line. Our reports check title brands and other records to identify vehicles that have been reported as flood-damaged.
              </p>
            </div>

            <hr className="border-gray-200 mb-8" />

            <div>
              <h2 className="text-2xl font-bold text-[#fd7e14] mb-4 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" />
                </svg>
                Severe Accident History
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                While a minor fender bender might not be a dealbreaker, structural damage or airbag deployments are serious concerns. AutoCheck Rwanda checks data sources to reveal reported severe accidents, helping you avoid vehicles with compromised safety structural integrity.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Frame/Structural Damage Checks</li>
                <li>Airbag Deployment Records</li>
                <li>Salvage/Rebuilt Title Checks</li>
              </ul>
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
