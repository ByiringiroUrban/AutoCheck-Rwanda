import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Ad Choices & Cookie Preferences | AutoCheck Rwanda",
  description: "Learn how AutoCheck Rwanda manages cookies, analytics, and advertising preferences.",
};

export default function YourAdChoicesPage() {
  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-10 bg-[#f8f9fa]">
        <div className="ac-container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ac-ink">
              Your Ad Choices & Cookie Preferences
            </h1>
            <p className="mt-2 text-[15px] text-[#555]">
              Learn how we use cookies and manage your online advertising preferences on AutoCheck Rwanda.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 shadow-sm space-y-6 text-gray-700 leading-relaxed text-[15px] mb-8">
            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">Understanding Online Advertising</h2>
              <p>
                AutoCheck Rwanda may partner with third-party digital networks to deliver relevant automotive information and services. These partners may use cookies, pixels, and similar technologies to collect non-personally identifiable browsing data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">Types of Cookies We Use</h2>
              <div className="space-y-3 text-[14px]">
                <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                  <h3 className="font-bold text-ac-ink mb-1">Essential Cookies</h3>
                  <p className="text-gray-600">Necessary for search form sessions, vehicle report generation, and secure payments via MTN MoMo, Airtel, and bank cards. These cannot be disabled.</p>
                </div>
                <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                  <h3 className="font-bold text-ac-ink mb-1">Performance & Analytics</h3>
                  <p className="text-gray-600">Help us measure visitor traffic, page load performance, and search tool efficiency so we can enhance the user experience across Rwanda.</p>
                </div>
                <div className="border border-[#e2e8f0] rounded p-4 bg-[#fbfbfb]">
                  <h3 className="font-bold text-ac-ink mb-1">Marketing Preferences</h3>
                  <p className="text-gray-600">Ensure that automotive offers and dealer solutions displayed to you are tailored to your vehicle shopping interests.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ac-blue mb-3">Managing Your Preferences</h2>
              <p>
                You can configure your web browser settings to reject all non-essential cookies, or notify you when a cookie is placed. For more information on how we handle personal data, review our{" "}
                <Link href="/vehiclehistory/privacy" className="text-ac-blue underline font-semibold">
                  Privacy Policy
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
