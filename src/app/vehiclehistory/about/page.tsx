import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About AutoCheck Rwanda",
  description: "AutoCheck Rwanda helps buyers and garages check vehicle history before a purchase.",
};

export default function AboutPage() {
  return (
    <div className="app_container">
      <SiteHeader />
      <main className="pb-14">
        <div className="border-b border-solid border-[#e0e0e0] bg-[#f8f9fa] py-6">
          <div className="ac-container">
            <h1 className="m-0 text-[28px] font-bold text-ac-ink">About AutoCheck Rwanda</h1>
          </div>
        </div>
        <div className="ac-container mt-6 max-w-3xl space-y-4 text-[15px] leading-7 text-[#444]">
          <p>
            AutoCheck Rwanda brings VIN and plate history, garage service records, physical inspections, and AI exterior findings into one report for the used-vehicle market.
          </p>
          <p>
            Owners claim vehicles, garages record work they performed, and INGOGA AUTO administrators review disputes and organization applications.
          </p>
          <p>
            <Link href="/vehiclehistory/faq">Read the FAQ</Link>
            {" · "}
            <Link href="/vehiclehistory/vin-basics">VIN guide</Link>
            {" · "}
            <Link href="/vehiclehistory/sample-vehicle-history-report">Sample report</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
