import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary of Vehicle History Terms | AutoCheck Rwanda",
  description: "A comprehensive glossary of automotive, inspection, and vehicle title terms used in Rwanda.",
};

export default function GlossaryPage() {
  const terms = [
    {
      term: "AutoCheck Score®",
      definition:
        "A proprietary rating based on a vehicle's history data that allows quick comparison against other vehicles of the same model and year.",
    },
    {
      term: "Carte Jaune (Yellow Card)",
      definition:
        "The official motor vehicle registration certificate issued by the Rwanda Revenue Authority (RRA) showing the registered owner, chassis/VIN, engine number, and fiscal tax status.",
    },
    {
      term: "Contrôle Technique (Technical Inspection)",
      definition:
        "Mandatory periodic vehicle roadworthiness and emissions testing conducted by the Rwanda National Police Traffic Inspection Centre.",
    },
    {
      term: "Frame / Structural Damage",
      definition:
        "Damage to the core structural chassis or unibody of the vehicle caused by a collision. Significant impact on vehicle safety in future crashes.",
    },
    {
      term: "Gross Vehicle Weight (GVW)",
      definition:
        "The maximum operating weight/mass of a vehicle as specified by the manufacturer, including passengers and cargo.",
    },
    {
      term: "Lien / RDB Mortgage Registry",
      definition:
        "A legal claim or financial hold placed on a vehicle by a bank, credit union, or lender in Rwanda as security for an unpaid loan. A vehicle with an active lien cannot be legally transferred.",
    },
    {
      term: "Odometer Rollback",
      definition:
        "The illegal alteration or reprogramming of a vehicle's odometer to deceptively display lower mileage than the vehicle has actually traveled.",
    },
    {
      term: "Rebuilt Vehicle",
      definition:
        "A vehicle previously written off as total loss or salvage that has been repaired, reconstructed, and passed a safety inspection to be re-licensed.",
    },
    {
      term: "Salvage Title",
      definition:
        "A title brand indicating that the vehicle was damaged so severely that estimated repair costs exceeded its actual cash market value.",
    },
    {
      term: "Total Loss",
      definition:
        "An insurance determination where the cost of repairing a vehicle after an accident or fire is greater than the pre-accident market value of the vehicle.",
    },
    {
      term: "Vehicle Identification Number (VIN)",
      definition:
        "A standardized 17-character alphanumeric code uniquely identifying every motor vehicle produced worldwide since 1981.",
    },
    {
      term: "Water / Flood Damage",
      definition:
        "A designation indicating the vehicle has been submerged in water up to or above the dashboard, compromising electrical wires, computers, and mechanical systems.",
    },
  ];

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Glossary of Vehicle History Terms
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Familiarize yourself with key automotive, legal, and inspection terminology used across Rwanda and in AutoCheck reports.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 md:p-8 shadow-sm divide-y divide-[#edf2f7]">
            {terms.map((item) => (
              <div key={item.term} className="py-4 first:pt-0 last:pb-0">
                <h2 className="text-[17px] font-bold text-ac-blue mb-1">
                  {item.term}
                </h2>
                <p className="text-[14px] text-gray-700 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
