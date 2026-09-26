"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CarFrontIcon } from "@/components/icons";

const inputBase =
  "block w-full h-[34px] px-[14px] py-[6px] text-[14px] leading-[14px] text-ac-ink bg-white border border-solid rounded-none placeholder:text-[rgba(33,37,41,0.65)] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-[border-color,box-shadow] duration-150";

const errorText = "mt-[4px] text-[12px] text-ac-danger";

export default function VehicleHistoryReportsPage() {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState(false);
  const [plate, setPlate] = useState("");
  const [plateError, setPlateError] = useState(false);
  const [plateCategory, setPlateCategory] = useState("kigali");

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
                <span className="font-semibold text-ac-blue">Get answers to your questions about vehicle history:</span>{" "}
                <Link
                  href="#search-reports"
                  className="font-medium text-ac-blue underline hover:text-[#003366]"
                >
                  Search now for vehicle history by VIN or Rwanda License Plate »
                </Link>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-ac-ink">
              AutoCheck® vehicle history reports
            </h1>
            <p className="mt-1 text-[15px] text-[#555]">
              Get the same vehicle history report that Rwandan auto industry professionals rely upon to support their vehicle purchasing decisions.
            </p>
          </div>

          {/* Report Options Cards */}
          <div className="space-y-6">
            {/* Card 1: Single Report */}
            <div className="flex flex-col md:flex-row items-center rounded-[8px] border border-[#e2e8f0] bg-[#fbfbfb] p-6 shadow-sm transition hover:shadow-md">
              <div className="w-full md:w-[220px] flex justify-center mb-6 md:mb-0 shrink-0">
                <Image
                  src="/images/DiveInDeepReports204.png"
                  alt="AutoCheck Single Vehicle History Report"
                  width={160}
                  height={190}
                  className="h-auto w-[150px] object-contain drop-shadow"
                />
              </div>
              <div className="flex-1 md:pl-8">
                <h2 className="text-[22px] font-bold text-ac-ink">Single Report</h2>
                <p className="text-[14px] font-semibold text-ac-blue">AutoCheck® vehicle history report</p>
                <ul className="mt-3 list-disc pl-5 text-[14px] text-ac-ink space-y-1">
                  <li>One AutoCheck® vehicle history report</li>
                  <li>Search by VIN or Rwanda License Plate (e.g. RAC 123A)</li>
                  <li>Includes access to dynamic vehicle data updates for 21 days</li>
                  <li>One-time fee. No recurring charges.</li>
                </ul>
                <div className="mt-4 text-[26px] font-bold text-ac-ink">
                  35,000 Rfw
                </div>
                <div className="mt-3">
                  <a
                    href="#search-reports"
                    className="ac-btn inline-block text-center no-underline text-white font-medium px-8 py-[9px] rounded-[5.25px] shadow-sm hover:opacity-95"
                  >
                    Add to Cart
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: 5 Reports for 21 Days */}
            <div className="flex flex-col md:flex-row items-center rounded-[8px] border border-[#e2e8f0] bg-[#fbfbfb] p-6 shadow-sm transition hover:shadow-md">
              <div className="w-full md:w-[220px] flex justify-center mb-6 md:mb-0 shrink-0">
                <Image
                  src="/images/DiveInDeepReports204.png"
                  alt="AutoCheck 5 Reports Package"
                  width={160}
                  height={190}
                  className="h-auto w-[150px] object-contain drop-shadow"
                />
              </div>
              <div className="flex-1 md:pl-8">
                <h2 className="text-[22px] font-bold text-ac-ink">5 Reports for 21 Days</h2>
                <p className="text-[14px] font-semibold text-ac-blue">AutoCheck® vehicle history report</p>
                <ul className="mt-3 list-disc pl-5 text-[14px] text-ac-ink space-y-1">
                  <li>5 AutoCheck® vehicle history reports for 21 days</li>
                  <li>Search by VIN or Rwanda License Plate</li>
                  <li>Includes access to dynamic vehicle data updates during subscription term</li>
                  <li>One-time fee. No recurring charges.</li>
                </ul>
                <div className="mt-4 text-[26px] font-bold text-ac-ink">
                  75,000 Rfw
                </div>
                <div className="mt-3">
                  <a
                    href="#search-reports"
                    className="ac-btn inline-block text-center no-underline text-white font-medium px-8 py-[9px] rounded-[5.25px] shadow-sm hover:opacity-95"
                  >
                    Add to Cart
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: AutoCheck for Business */}
            <div className="flex flex-col md:flex-row items-center rounded-[8px] border border-[#e2e8f0] bg-[#fbfbfb] p-6 shadow-sm transition hover:shadow-md">
              <div className="w-full md:w-[220px] flex justify-center mb-6 md:mb-0 shrink-0">
                <Image
                  src="/images/DiveInDeepReports204.png"
                  alt="AutoCheck for Business"
                  width={160}
                  height={190}
                  className="h-auto w-[150px] object-contain drop-shadow"
                />
              </div>
              <div className="flex-1 md:pl-8">
                <h2 className="text-[22px] font-bold text-ac-ink">AutoCheck for Business</h2>
                <p className="text-[14px] text-[#555]">
                  Packages for dealerships, lenders, insurers, fleet managers, auctions, and credit unions in Rwanda
                </p>
                <ul className="mt-3 list-disc pl-5 text-[14px] text-ac-ink space-y-1">
                  <li>Direct official records from Rwanda Revenue Authority (RRA) and National Police inspection sources</li>
                  <li>Tens of thousands of regional import and accident logs to identify problem vehicles</li>
                  <li>The patented AutoCheck® Score helps you assess vehicle health and compare market valuation</li>
                </ul>
                <div className="mt-4">
                  <Link
                    href="/vehiclehistory/dealer-signup"
                    className="font-bold text-ac-blue underline hover:text-[#003366] text-[15px]"
                  >
                    Click Here to Request Additional Information »
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* KeySavvy Secure Transaction Promo */}
          <div className="my-10 flex justify-center">
            <div className="w-full max-w-[640px] overflow-hidden rounded-[16px] shadow-lg transition hover:scale-[1.01]">
              <Link href="/vehiclehistory/secure-shopping">
                <Image
                  src="/images/KeySavvy-AutoCheck-teamup-bnr.png"
                  alt="AutoCheck and KeySavvy secure payment and title transfer"
                  width={640}
                  height={320}
                  className="w-full h-auto object-cover"
                />
              </Link>
            </div>
          </div>

          {/* Bottom Search Section */}
          <div id="search-reports" className="my-8 scroll-mt-6">
            <div className="rounded-[10px] border border-[#cfd6dc] bg-ac-card shadow-[0_0_5px_1px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Card Header Bar */}
              <div className="bg-ac-navy p-4 text-center">
                <h2 className="m-0 text-[24px] font-normal text-white">
                  AutoCheck Vehicle History Reports
                </h2>
              </div>

              {/* Form & Sample Report Grid */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Search Forms */}
                  <div className="lg:col-span-8">
                    <p className="mb-4 text-[14px] text-ac-ink font-medium">
                      Two ways to find the vehicle history you&apos;re looking for:
                    </p>

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
                            aria-label="Vehicle Identification Number"
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

                    {/* Rwanda License Plate Search */}
                    <form noValidate onSubmit={onPlateSubmit} className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[16px] font-bold text-ac-ink">
                          Search by Rwanda License Plate
                        </span>
                        <Link
                          href="/vehiclehistory/search-by-plate"
                          className="text-[13px] font-semibold text-ac-blue hover:underline"
                        >
                          Is it a specialty plate? »
                        </Link>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Rwanda License Plate (e.g. RAC 123A)"
                            aria-label="Rwanda License Plate"
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

                        <select
                          value={plateCategory}
                          onChange={(e) => setPlateCategory(e.target.value)}
                          className="h-[34px] px-3 text-[14px] bg-white border border-ac-input-border text-ac-ink focus:outline-0"
                        >
                          <option value="kigali">Kigali City</option>
                          <option value="eastern">Eastern Province</option>
                          <option value="northern">Northern Province</option>
                          <option value="southern">Southern Province</option>
                          <option value="western">Western Province</option>
                          <option value="commercial">Commercial / Taxi</option>
                          <option value="government">Gov / Diplomatic</option>
                        </select>

                        <button type="submit" className="ac-btn sm:w-[130px] font-semibold shrink-0">
                          Get Report
                        </button>
                      </div>
                    </form>

                    <div className="mt-6 border-t border-[#ddd] pt-3 text-[11px] leading-[16px] text-gray-500">
                      This site is protected by reCAPTCHA and the Google{" "}
                      <a href="https://policies.google.com/privacy" className="text-ac-blue hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="https://policies.google.com/terms" className="text-ac-blue hover:underline">
                        Terms of Service
                      </a>{" "}
                      apply.
                    </div>
                  </div>

                  {/* Right: Sample Report Callout */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-[#e2e8f0] pt-6 lg:pt-0 lg:pl-8 text-center">
                    <Image
                      src="/images/DiveInDeepReports204.png"
                      alt="See a Sample AutoCheck Report"
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
