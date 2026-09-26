import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Secure Shopping Guarantee | AutoCheck Rwanda",
  description: "Learn about bank-grade security, encrypted transactions, and safe payment protocols at AutoCheck Rwanda.",
};

export default function SecureShoppingPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Secure Shopping & Payment Protection
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Your financial transactions and personal details are safeguarded by enterprise-grade security protocols.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ac-blue mb-3">
                1. 256-Bit SSL/TLS Encryption
              </h2>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                All data transmitted between your browser and our servers is protected by industry-standard 256-bit Secure Sockets Layer (SSL) encryption. Your search inquiries, VIN lookups, and account details can never be intercepted by unauthorized parties.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ac-blue mb-3">
                2. Mobile Money Security (MTN MoMo & Airtel Money)
              </h2>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                Mobile money transactions require direct PIN verification on your handset. AutoCheck Rwanda never stores or has access to your mobile money PIN. All settlements are processed through licensed national payment gateways regulated by the National Bank of Rwanda (BNR).
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ac-blue mb-3">
                3. Card Protection & PCI-DSS Compliance
              </h2>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                Visa and Mastercard payments are routed through PCI-DSS Level 1 certified payment processors equipped with 3D-Secure authentication (Verified by Visa and Mastercard Identity Check).
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ac-blue mb-3">
                4. Private Escrow & Title Transfer with KeySavvy
              </h2>
              <p className="text-[14px] text-gray-700 leading-relaxed">
                Buying a car from a private seller? We have teamed up with KeySavvy to offer secure escrow and ownership transfer services, ensuring the seller only gets paid once the title and vehicle have been verified and transferred.
              </p>
            </div>
          </div>

          <div className="bg-[#f0f6fa] rounded-lg border border-[#cde0f5] p-6 text-center">
            <h2 className="text-xl font-bold text-ac-blue mb-2">Have security questions?</h2>
            <p className="text-[14px] text-gray-600 mb-4">
              Our technical support team in Kigali is happy to assist.
            </p>
            <Link
              href="/vehiclehistory/contact"
              className="ac-btn inline-block text-white font-semibold px-6 py-2.5 no-underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
