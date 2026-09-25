import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIN Checks for Subscribers | AutoCheck Rwanda",
  description: "Discover the benefits of subscribing to AutoCheck Rwanda for frequent VIN checks.",
};

export default function SubscriptionBenefitsPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="bg-[#f8f9fa] py-12">
        <div className="ac-container">
          <h1 className="text-3xl font-bold text-[#004990] mb-6">VIN Checks for Subscribers</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#eaeaea]">
            <h2 className="text-xl font-bold text-[#333] mb-4">Why Subscribe?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              If you are a car dealer, importer, or someone who frequently buys used vehicles, an AutoCheck Rwanda subscription is the most cost-effective way to run multiple VIN checks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#f4f9ff] border border-[#cde0f5] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#004990] mb-3">Cost Savings</h3>
                <p className="text-gray-700">Subscribers enjoy significant discounts per report compared to purchasing single reports. The more you check, the more you save.</p>
              </div>
              <div className="bg-[#f4f9ff] border border-[#cde0f5] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#004990] mb-3">Unlimited History Reports</h3>
                <p className="text-gray-700">Depending on your subscription tier, you can access unlimited reports for a set number of VINs during your subscription period.</p>
              </div>
              <div className="bg-[#f4f9ff] border border-[#cde0f5] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#004990] mb-3">Account Management</h3>
                <p className="text-gray-700">Easily manage your search history, save reports, and access them anytime from your dashboard.</p>
              </div>
              <div className="bg-[#f4f9ff] border border-[#cde0f5] p-6 rounded-lg">
                <h3 className="text-lg font-bold text-[#004990] mb-3">Priority Support</h3>
                <p className="text-gray-700">Get priority customer support for any questions or issues related to vehicle reports.</p>
              </div>
            </div>

            <div className="text-center">
              <a href="/vehiclehistory/dealer-login" className="ac-btn inline-block text-center no-underline text-white bg-[#004990] hover:bg-[#003366] px-8 py-3 rounded text-lg font-semibold">
                Become a Subscriber
              </a>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
