import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Buy a Used Car in Rwanda | AutoCheck Rwanda",
  description: "A comprehensive guide on how to buy a used car in Rwanda safely and confidently.",
};

export default function BuyersGuidePage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-12">
        <div className="ac-container">
          <h1 className="text-3xl font-bold text-[#004990] mb-6">How to Buy a Used Car in Rwanda</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#eaeaea]">
            <p className="text-gray-700 mb-6 leading-relaxed">
              Buying a used car can be a challenging process, but being well-informed is your best defense against bad investments. Here is a step-by-step guide on how to buy a used car in Rwanda.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#333] mb-2">1. Determine Your Budget</h3>
                <p className="text-gray-700">Before you start looking for a car, figure out how much you can afford to spend. Remember to factor in insurance, fuel, maintenance, and potential repairs.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-[#333] mb-2">2. Research the Right Car</h3>
                <p className="text-gray-700">Identify the type of car that suits your needs. Consider factors such as fuel efficiency, availability of spare parts in Rwanda, and resale value.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#333] mb-2">3. Check the Vehicle History</h3>
                <p className="text-gray-700">Always get an AutoCheck Vehicle History Report using the VIN or chassis number. This will reveal past accidents, odometer tampering, and other critical information.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#333] mb-2">4. Inspect the Car and Take a Test Drive</h3>
                <p className="text-gray-700">Never buy a car without inspecting it in person. Check the exterior, interior, engine, and take it for a test drive on different road types.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#333] mb-2">5. Get a Mechanic Inspection</h3>
                <p className="text-gray-700">Have a trusted, independent mechanic inspect the car before finalizing the purchase. They can spot hidden issues that you might miss.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
