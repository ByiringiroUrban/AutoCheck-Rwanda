import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | AutoCheck Rwanda",
  description: "Terms and conditions of use for AutoCheck Rwanda vehicle history reports and digital services.",
};

export default function TermsOfUsePage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              AutoCheck Rwanda Terms and Conditions
            </h1>
            <p className="mt-2 text-[14px] text-gray-500">
              Effective Date: January 1, 2026 | Republic of Rwanda
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or purchasing vehicle history reports through AutoCheck Rwanda (&ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or purchase reports.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">2. Description of Service</h2>
              <p>
                AutoCheck Rwanda compiles motor vehicle history reports derived from government databases (including Rwanda Revenue Authority and Rwanda National Police inspection records), international export registries, insurance providers, and automotive partners. Reports are intended to assist buyers and dealers in evaluating used vehicles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">3. Pricing & Currency</h2>
              <p>
                All prices on this platform are listed and billed in Rwandan Francs (Rfw). Fees for single reports and subscription packages are one-time payments with no recurring unauthorized billing. Once a report is generated, fees are non-refundable except under the terms of our Buyback Protection program.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">4. Disclaimer of Mechanical Condition</h2>
              <p>
                An AutoCheck report reflects historical public and proprietary records available up to the time of generation. It is not a substitute for a comprehensive hands-on pre-purchase mechanical inspection by an authorized mechanic or certified testing station.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">5. Intellectual Property</h2>
              <p>
                The AutoCheck name, logos, AutoCheck Score®, design layout, and compiled vehicle database are the exclusive intellectual property of AutoCheck Rwanda and its licensing partners. Reports may not be re-sold, re-packaged, or publicly broadcast without prior written authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">6. Governing Law & Dispute Resolution</h2>
              <p>
                These terms are governed by and construed in accordance with the laws of the Republic of Rwanda. Any legal proceedings arising from these terms shall be subject to the exclusive jurisdiction of the competent courts in Kigali, Rwanda.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
