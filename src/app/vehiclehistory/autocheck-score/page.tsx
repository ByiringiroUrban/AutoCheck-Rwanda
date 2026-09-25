import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The AutoCheck Score | AutoCheck Rwanda",
  description: "Learn about the AutoCheck Score and how it helps you evaluate a used vehicle.",
};

export default function AutoCheckScorePage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-12">
        <div className="ac-container">
          <h1 className="text-3xl font-bold text-[#004990] mb-6">The AutoCheck Score</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#eaeaea]">
            <h2 className="text-xl font-bold text-[#333] mb-4">What is the AutoCheck Score?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The AutoCheck Score is a quick and easy way to evaluate a used vehicle's history. It summarizes the vehicle's past into a single, easy-to-understand number, allowing you to compare it with similar vehicles.
            </p>

            <div className="flex flex-col md:flex-row gap-8 items-center mb-8 bg-[#f4f9ff] p-6 rounded-lg border border-[#cde0f5]">
              <div className="flex-shrink-0 relative flex flex-col items-center justify-center w-32 h-32 bg-white rounded-full border-[8px] border-[#28a745] shadow-sm">
                 <span className="text-4xl font-bold text-[#28a745]">88</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#004990] mb-2">How to read the score</h3>
                <p className="text-gray-700 text-sm">
                  The score typically ranges from 1 to 100. A higher score indicates a better vehicle history. The report also provides a "Score Range," showing the expected scores of similar vehicles (based on make, model, year). If a vehicle's score falls within or above the range, it generally means its history is as good as or better than average.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#333] mb-4">Factors that affect the Score</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Accidents & Damage:</strong> Major collisions or damage reduce the score.</li>
              <li><strong>Number of Owners:</strong> Fewer owners generally positively impact the score.</li>
              <li><strong>Odometer Readings:</strong> Consistent and verifiable mileage is crucial.</li>
              <li><strong>Vehicle Use:</strong> Fleet or rental use might slightly lower the score.</li>
              <li><strong>Title Brands:</strong> Salvage, rebuilt, or flood damage titles significantly drop the score.</li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
