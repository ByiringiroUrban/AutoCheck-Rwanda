import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Safety | AutoCheck Rwanda",
  description: "Learn how AutoCheck Rwanda collects, uses, and safeguards your personal data in accordance with Rwanda Law N° 058/2021.",
};

export default function PrivacyPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Privacy Policy & Data Protection
            </h1>
            <p className="mt-2 text-[14px] text-gray-500">
              Last Updated: January 2026 | Compliant with Rwanda Data Protection Law N° 058/2021
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">1. Introduction</h2>
              <p>
                AutoCheck Rwanda (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy and personal data. This Privacy Policy outlines how we collect, process, and secure personal information when you use our vehicle history platform and associated services in Rwanda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-[14px]">
                <li><strong>Vehicle Information:</strong> Vehicle Identification Numbers (VIN), Rwanda license plate numbers, make, model, and year searched.</li>
                <li><strong>Contact Details:</strong> Your name, phone number (for Mobile Money receipts), and email address (for PDF report delivery).</li>
                <li><strong>Transaction Records:</strong> Payment transaction IDs, dates, and amounts (we never store banking credentials or mobile money PINs).</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information to prevent automated scraping and fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">3. How We Use Your Data</h2>
              <p>
                We use collected information solely to generate vehicle history reports, confirm payment fulfillment, provide customer support, and detect fraud. We do not sell, rent, or trade your personal data to external advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">4. Compliance with Rwanda Data Protection Law</h2>
              <p>
                AutoCheck Rwanda complies with Law N° 058/2021 of 13/10/2021 relating to the protection of personal data and privacy, supervised by the National Cyber Security Authority (NCSA) and the Data Protection Office (DPO). You have the right to request access to, correction of, or deletion of your personal account data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">5. Data Security & Storage</h2>
              <p>
                We utilize encrypted data storage, multi-factor administrative access, and regular vulnerability audits to ensure your records remain safe and confidential.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">6. Contact Our Data Protection Officer</h2>
              <p>
                If you have questions regarding this privacy policy or wish to exercise your data rights, contact our Data Protection Officer at:
                <br />
                <span className="font-semibold text-ac-blue">privacy@autocheck.rw</span> | Kigali, Rwanda.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
