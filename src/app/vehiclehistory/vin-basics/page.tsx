import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VIN Basics & Decode Guide | AutoCheck Rwanda",
  description: "Learn what a Vehicle Identification Number (VIN) is, where to find it on vehicles in Rwanda, and how to decode it.",
};

export default function VinBasicsPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container">
          {/* Breadcrumb / Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Understanding Your Vehicle Identification Number (VIN)
            </h1>
            <p className="mt-2 text-[15px] text-[#555] max-w-3xl">
              A vehicle&apos;s VIN is its unique 17-character DNA. Learn how to locate it, decode its hidden specifications, and verify imported vehicles in Rwanda before buying.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Section 1: What is a VIN */}
              <section id="what-is-vin" className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-ac-blue mb-4">
                  What is a VIN?
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  A Vehicle Identification Number (VIN) is a 17-character code of letters and numbers assigned to every motor vehicle when manufactured. Just like a Rwandan national identity card (Indangamuntu), no two vehicles in operation anywhere in the world have the same VIN.
                </p>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  In Rwanda, the VIN (often referenced in the &ldquo;Carte Jaune&rdquo; registration certificate as the Chassis Number) is used by Rwanda Revenue Authority (RRA) customs, Rwanda National Police for inspections, and insurance companies to trace ownership, liens, and title brands.
                </p>
                <div className="bg-[#f0f6fa] border-l-4 border-ac-blue p-4 rounded-r">
                  <p className="text-[14px] text-ac-ink font-medium">
                    Important: A standard modern VIN never includes the letters <strong>I (i)</strong>, <strong>O (o)</strong>, or <strong>Q (q)</strong> to avoid confusion with the numerals 1 and 0.
                  </p>
                </div>
              </section>

              {/* Section 2: Where to Find VIN */}
              <section id="findVin" className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm scroll-mt-6">
                <h2 className="text-2xl font-bold text-ac-blue mb-4">
                  Where Can I Find the VIN?
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                  When inspecting a car in Kigali or anywhere in Rwanda, always verify that the VIN stamped on the vehicle physically matches the VIN printed on the official registration document (Carte Jaune / Yellow Card).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                    <h3 className="font-bold text-[16px] text-ac-ink mb-2">1. Vehicle Registration (Carte Jaune)</h3>
                    <p className="text-[13px] text-gray-600">
                      Look under the &ldquo;Chassis Number / Numéro de Châssis&rdquo; field on the physical or electronic RRA motor vehicle ownership certificate.
                    </p>
                  </div>
                  <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                    <h3 className="font-bold text-[16px] text-ac-ink mb-2">2. Driver-Side Dashboard</h3>
                    <p className="text-[13px] text-gray-600">
                      Stand outside the vehicle and look through the lower corner of the front windshield on the driver&apos;s side.
                    </p>
                  </div>
                  <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                    <h3 className="font-bold text-[16px] text-ac-ink mb-2">3. Driver-Side Door Pillar</h3>
                    <p className="text-[13px] text-gray-600">
                      Open the driver&apos;s door and examine the safety certification sticker located on the door jamb or door post.
                    </p>
                  </div>
                  <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                    <h3 className="font-bold text-[16px] text-ac-ink mb-2">4. Engine Bay / Firewall</h3>
                    <p className="text-[13px] text-gray-600">
                      Pop the hood and check the metal stamping on the firewall separating the engine compartment from the passenger cabin.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: VIN Decode Explained */}
              <section id="decode" className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm scroll-mt-6">
                <h2 className="text-2xl font-bold text-ac-blue mb-4">
                  VIN Decode Explained
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
                  Each segment of the 17-digit VIN reveals critical factory specifications. AutoCheck breaks down these digits automatically:
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 border-b border-[#edf2f7] pb-4">
                    <div className="w-full sm:w-[160px] shrink-0 font-bold text-ac-ink">
                      Positions 1–3
                    </div>
                    <div>
                      <h4 className="font-semibold text-ac-blue text-[15px]">World Manufacturer Identifier (WMI)</h4>
                      <p className="text-[13px] text-gray-600">
                        Indicates the country of origin and vehicle manufacturer (e.g., JT for Toyota Japan, 1G for General Motors USA, WBA for BMW Germany).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 border-b border-[#edf2f7] pb-4">
                    <div className="w-full sm:w-[160px] shrink-0 font-bold text-ac-ink">
                      Positions 4–8
                    </div>
                    <div>
                      <h4 className="font-semibold text-ac-blue text-[15px]">Vehicle Descriptor Section (VDS)</h4>
                      <p className="text-[13px] text-gray-600">
                        Describes model line, body style, transmission type, and engine size. Useful for catching cloned vehicles or counterfeit engine swaps.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 border-b border-[#edf2f7] pb-4">
                    <div className="w-full sm:w-[160px] shrink-0 font-bold text-ac-ink">
                      Position 9
                    </div>
                    <div>
                      <h4 className="font-semibold text-ac-blue text-[15px]">Check Digit Validation</h4>
                      <p className="text-[13px] text-gray-600">
                        A mathematical verification code calculated using all other digits to verify the VIN is genuine and hasn&apos;t been forged.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 border-b border-[#edf2f7] pb-4">
                    <div className="w-full sm:w-[160px] shrink-0 font-bold text-ac-ink">
                      Position 10
                    </div>
                    <div>
                      <h4 className="font-semibold text-ac-blue text-[15px]">Model Year</h4>
                      <p className="text-[13px] text-gray-600">
                        The exact manufacturing year code, ensuring the seller is not misrepresenting the vehicle&apos;s age.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[160px] shrink-0 font-bold text-ac-ink">
                      Positions 11–17
                    </div>
                    <div>
                      <h4 className="font-semibold text-ac-blue text-[15px]">Assembly Plant & Serial Number</h4>
                      <p className="text-[13px] text-gray-600">
                        The specific manufacturing factory and unit production sequence number.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
                <h3 className="text-[18px] font-bold text-ac-ink mb-3">
                  Ready to Run a VIN Check?
                </h3>
                <p className="text-[14px] text-gray-600 mb-4">
                  Check accidents, odometer rollbacks, salvage titles, and prior usage for only 35,000 Rfw.
                </p>
                <Link
                  href="/vehiclehistory/vehicle-history-reports"
                  className="ac-btn block text-center no-underline text-white font-semibold py-3"
                >
                  Order AutoCheck Report
                </Link>
              </div>

              <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-6">
                <h3 className="text-[16px] font-bold text-ac-blue mb-2">
                  Need Help Finding Your VIN?
                </h3>
                <p className="text-[13px] text-gray-600 mb-3">
                  If the VIN on the chassis is unreadable or scratched, contact Rwanda National Police traffic inspection or our support team for guidance.
                </p>
                <Link
                  href="/vehiclehistory/contact"
                  className="text-[14px] font-bold text-ac-blue underline"
                >
                  Contact Support »
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
