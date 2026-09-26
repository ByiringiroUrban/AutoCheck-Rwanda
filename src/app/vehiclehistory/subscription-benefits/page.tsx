"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CarFrontIcon,
  SavingsIcon,
  CompareChartIcon,
  ClockUpdateIcon,
  ShieldProtectionIcon,
} from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const inputBase =
  "block w-full h-[34px] px-[14px] py-[6px] text-[14px] leading-[14px] text-ac-ink bg-white border border-solid rounded-none placeholder:text-[rgba(33,37,41,0.65)] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-[border-color,box-shadow] duration-150";

const errorText = "mt-[4px] text-[12px] text-ac-danger";

export default function SubscriptionBenefitsPage() {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState(false);
  const [plate, setPlate] = useState("");
  const [plateError, setPlateError] = useState(false);

  const onVinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (vin.trim() === "") {
      setVinError(true);
    } else {
      setVinError(false);
      window.location.href = `/vehiclehistory/sample-vehicle-history-report?vin=${encodeURIComponent(vin.trim())}`;
    }
  };

  const onPlateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (plate.trim() === "") {
      setPlateError(true);
    } else {
      setPlateError(false);
      window.location.href = `/vehiclehistory/sample-vehicle-history-report?plate=${encodeURIComponent(plate.trim())}`;
    }
  };

  return (
    <div className="app_container min-h-screen bg-white">
      <SiteHeader />

      <main className="py-6">
        <div className="ac-container">
          {/* Top Notice Banner */}
          <div className="mb-6 flex items-center justify-between rounded-[6px] border border-[#d6e4f0] bg-[#f0f6fa] p-3 text-[14px] text-ac-ink shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004990]/10 text-ac-blue shrink-0">
                <CarFrontIcon width={18} height={18} />
              </span>
              <div>
                <span className="font-semibold text-ac-blue">Shopping for cars in Rwanda?</span>{" "}
                <Link
                  href="#subscribe-plans"
                  className="font-medium text-ac-blue underline hover:text-[#003366]"
                >
                  Subscribe now, search later — save up to 70% per report »
                </Link>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-ac-ink">
              AutoCheck Rwanda Subscriber Benefits
            </h1>
            <p className="mt-1 text-[15px] text-[#555] max-w-3xl">
              Researching multiple used cars before making a decision? An AutoCheck multi-report package gives you the freedom to run checks across multiple vehicles over 21 days at significant savings.
            </p>
          </div>

          {/* Key Subscriber Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-[#fbfbfb] border border-[#e2e8f0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                <SavingsIcon width={22} height={22} />
              </div>
              <h3 className="text-[17px] font-bold text-ac-ink mb-2">Massive Cost Savings</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Rather than paying 35,000 Rfw per single report, subscriber packages drop your cost per check by more than half, letting you inspect multiple cars affordably.
              </p>
            </div>

            <div className="bg-[#fbfbfb] border border-[#e2e8f0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                <CompareChartIcon width={22} height={22} />
              </div>
              <h3 className="text-[17px] font-bold text-ac-ink mb-2">Side-by-Side Comparison</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Compare shortlisted vehicles using their patented AutoCheck Score®, odometer histories, and accident records to pick the absolute best vehicle.
              </p>
            </div>

            <div className="bg-[#fbfbfb] border border-[#e2e8f0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                <ClockUpdateIcon width={22} height={22} />
              </div>
              <h3 className="text-[17px] font-bold text-ac-ink mb-2">21 Days of Dynamic Updates</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Your purchased reports remain active and update dynamically for 21 days as new technical inspections (Contrôle Technique) or customs events are logged.
              </p>
            </div>

            <div className="bg-[#fbfbfb] border border-[#e2e8f0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f0fe] text-ac-blue border border-[#cde0f5] mb-4">
                <ShieldProtectionIcon width={22} height={22} />
              </div>
              <h3 className="text-[17px] font-bold text-ac-ink mb-2">Buyback Protection</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Qualifying vehicle reports come backed by AutoCheck Rwanda Buyback Protection, guarding you against undisclosed salvage or total loss records.
              </p>
            </div>
          </div>

          {/* Pricing Options */}
          <div id="subscribe-plans" className="space-y-6 mb-12 scroll-mt-6">
            <h2 className="text-2xl font-bold text-ac-ink mb-4">Choose Your Subscriber Package</h2>

            {/* 5-Report Package */}
            <div className="flex flex-col md:flex-row items-center rounded-[8px] border border-[#e2e8f0] bg-[#fbfbfb] p-6 shadow-sm hover:shadow-md transition">
              <div className="w-full md:w-[200px] flex justify-center mb-6 md:mb-0 shrink-0">
                <Image
                  src="/images/DiveInDeepReports204.png"
                  alt="5 Reports Package"
                  width={150}
                  height={180}
                  className="h-auto w-[140px] object-contain drop-shadow"
                />
              </div>
              <div className="flex-1 md:pl-8">
                <div className="inline-block bg-[#e0f2fe] text-[#0369a1] text-[12px] font-bold px-2.5 py-0.5 rounded mb-1">
                  POPULAR FOR CAR SHOPPERS
                </div>
                <h3 className="text-[22px] font-bold text-ac-ink">5 Reports for 21 Days</h3>
                <p className="text-[14px] font-semibold text-ac-blue">Ideal if comparing 2 to 5 cars in Kigali</p>
                <ul className="mt-3 list-disc pl-5 text-[14px] text-ac-ink space-y-1">
                  <li>5 complete AutoCheck vehicle history reports</li>
                  <li>Search by VIN or Rwanda License Plate (e.g. RAC 123A)</li>
                  <li>Access to dynamic vehicle data updates for 21 days</li>
                  <li>One-time fee. No recurring subscription or auto-renewals.</li>
                </ul>
                <div className="mt-4 text-[26px] font-bold text-ac-ink">
                  75,000 Rfw
                </div>
                <div className="mt-3">
                  <Link
                    href="/vehiclehistory/vehicle-history-reports#search-reports"
                    className="ac-btn inline-block text-center no-underline text-white font-medium px-8 py-[9px] rounded-[5.25px]"
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>
            </div>

            {/* 25-Report Package */}
            <div className="flex flex-col md:flex-row items-center rounded-[8px] border-2 border-ac-blue bg-white p-6 shadow-md transition">
              <div className="w-full md:w-[200px] flex justify-center mb-6 md:mb-0 shrink-0">
                <Image
                  src="/images/DiveInDeepReports204.png"
                  alt="25 Reports Package"
                  width={150}
                  height={180}
                  className="h-auto w-[140px] object-contain drop-shadow"
                />
              </div>
              <div className="flex-1 md:pl-8">
                <div className="inline-block bg-[#004990] text-white text-[12px] font-bold px-2.5 py-0.5 rounded mb-1">
                  BEST VALUE FOR SERIOUS BUYERS & IMPORTERS
                </div>
                <h3 className="text-[22px] font-bold text-ac-ink">25 Reports Package</h3>
                <p className="text-[14px] font-semibold text-ac-blue">Only 6,000 Rfw per vehicle report</p>
                <ul className="mt-3 list-disc pl-5 text-[14px] text-ac-ink space-y-1">
                  <li>25 full AutoCheck vehicle history reports valid for 30 days</li>
                  <li>Search by VIN, Chassis Number, or Rwanda License Plate</li>
                  <li>Full export history from Japan, UAE, Europe, and North America</li>
                  <li>Convenient subscriber dashboard to manage all searched VINs</li>
                </ul>
                <div className="mt-4 text-[26px] font-bold text-ac-ink">
                  150,000 Rfw
                </div>
                <div className="mt-3">
                  <Link
                    href="/vehiclehistory/vehicle-history-reports#search-reports"
                    className="ac-btn inline-block text-center no-underline text-white font-medium px-8 py-[9px] rounded-[5.25px]"
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Commercial Dealer Subscription */}
            <div className="flex flex-col md:flex-row items-center rounded-[8px] border border-[#e2e8f0] bg-[#fbfbfb] p-6 shadow-sm hover:shadow-md transition">
              <div className="w-full md:w-[200px] flex justify-center mb-6 md:mb-0 shrink-0">
                <Image
                  src="/images/DiveInDeepReports204.png"
                  alt="AutoCheck for Business"
                  width={150}
                  height={180}
                  className="h-auto w-[140px] object-contain drop-shadow"
                />
              </div>
              <div className="flex-1 md:pl-8">
                <h3 className="text-[22px] font-bold text-ac-ink">AutoCheck for Dealerships & Fleets</h3>
                <p className="text-[14px] text-[#555]">
                  Custom monthly and annual packages for car dealerships, insurance providers, microfinance lenders, and auction houses in Rwanda.
                </p>
                <ul className="mt-3 list-disc pl-5 text-[14px] text-ac-ink space-y-1">
                  <li>Unlimited or high-volume report batches with dealer API integration</li>
                  <li>Showroom window stickers and digital badges for vehicle listings</li>
                  <li>Dedicated account manager based in Kigali</li>
                </ul>
                <div className="mt-4">
                  <Link
                    href="/vehiclehistory/dealer-signup"
                    className="font-bold text-ac-blue underline hover:text-[#003366] text-[15px]"
                  >
                    Request Dealership Membership »
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Search Section */}
          <div className="my-8">
            <div className="rounded-[10px] border border-[#cfd6dc] bg-ac-card shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] overflow-hidden">
              <div className="bg-ac-navy p-4 text-center">
                <h2 className="m-0 text-[24px] font-normal text-white">
                  Search Vehicle History Now
                </h2>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8">
                    {/* VIN Search */}
                    <form noValidate onSubmit={onVinSubmit} className="mb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[16px] font-bold text-ac-ink">Search by VIN</span>
                        <Link
                          href="/vehiclehistory/vin-basics#findVin"
                          className="text-[13px] font-semibold text-ac-blue hover:underline"
                        >
                          Where can I find the VIN? »
                        </Link>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            maxLength={17}
                            placeholder="Vehicle Identification Number"
                            value={vin}
                            onChange={(e) => {
                              setVin(e.target.value);
                              if (vinError) setVinError(false);
                            }}
                            className={`${inputBase} ${
                              vinError ? "border-ac-danger" : "border-ac-input-border"
                            }`}
                          />
                          {vinError && (
                            <div className={errorText}>
                              Please enter a vehicle identification number to continue
                            </div>
                          )}
                        </div>
                        <button type="submit" className="ac-btn sm:w-[130px] font-semibold shrink-0">
                          Get Report
                        </button>
                      </div>
                    </form>

                    {/* OR divider */}
                    <div className="flex items-center my-4 text-[16px] font-bold italic text-ac-or-gray">
                      <div className="pr-3">OR</div>
                      <div className="flex-1">
                        <hr className="border-0 border-t border-ac-or-gray opacity-30" />
                      </div>
                    </div>

                    {/* Plate Search */}
                    <form noValidate onSubmit={onPlateSubmit} className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[16px] font-bold text-ac-ink">
                          Search by Rwanda License Plate
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Rwanda License Plate (e.g. RAC 123A)"
                            value={plate}
                            onChange={(e) => {
                              setPlate(e.target.value);
                              if (plateError) setPlateError(false);
                            }}
                            className={`${inputBase} ${
                              plateError ? "border-ac-danger" : "border-ac-input-border"
                            }`}
                          />
                          {plateError && (
                            <div className={errorText}>Please enter a Rwanda license plate</div>
                          )}
                        </div>
                        <button type="submit" className="ac-btn sm:w-[130px] font-semibold shrink-0">
                          Get Report
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="lg:col-span-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-[#e2e8f0] pt-6 lg:pt-0 lg:pl-8 text-center">
                    <Image
                      src="/images/DiveInDeepReports204.png"
                      alt="Sample AutoCheck Report"
                      width={140}
                      height={170}
                      className="h-auto w-[130px] object-contain drop-shadow"
                    />
                    <Link
                      href="/vehiclehistory/sample-vehicle-history-report"
                      className="mt-4 font-bold text-ac-blue underline hover:text-[#003366] text-[15px]"
                    >
                      See a Sample Report »
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
