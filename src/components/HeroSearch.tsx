"use client";

import { useState, type FormEvent } from "react";

const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
  "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const inputBase =
  "block w-full h-[32px] px-[14px] py-[7px] text-[14px] leading-[14px] text-ac-ink bg-white border border-solid rounded-none placeholder:text-[rgba(33,37,41,0.75)] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-[border-color,box-shadow] duration-150";

const selectBase =
  "block w-full h-[33.5px] pt-[5.25px] pr-[24.5px] pb-[5.25px] pl-[10.5px] text-[14px] text-ac-select-text bg-white border border-solid rounded-none focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]";

const errorText = "mt-[4px] text-[12px] text-ac-danger";

const helpLink =
  "text-[14px] font-bold leading-[18.2px] text-ac-blue m-[7px] cursor-pointer";

const col = "shrink-0 px-[10.5px]";

export function HeroSearch() {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState(false);
  const [plate, setPlate] = useState("");
  const [plateError, setPlateError] = useState(false);
  const [usState, setUsState] = useState("");
  const [stateError, setStateError] = useState(false);

  const onVinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVinError(vin.trim() === "");
  };

  const onPlateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlateError(plate.trim() === "");
    setStateError(usState === "");
  };

  return (
    <section
      id="vehiclehistoryreport"
      className="bg-white md:bg-[url(/images/home-hero.jpg)] md:bg-cover md:bg-[position:80%_40%] md:bg-no-repeat"
    >
      <div className="ac-container mb-[21px]">
        <div className="flex flex-wrap mx-[-10.5px]">
          {/* Mobile-only hero image + heading */}
          <div className="md:hidden w-full shrink-0 px-[10.5px] mb-[20px] text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mobile-hero.jpg"
              alt="AutoCheck Report Pages"
              width={768}
              height={284}
              className="w-full h-auto"
            />
            <h2 className="m-0 mb-[7px] text-[19px] leading-[28px] font-bold text-ac-ink text-center">
              AutoCheck helps you buy and sell with confidence.
            </h2>
          </div>

          <div className={`${col} w-full md:w-1/2`}>
            <div className="bg-ac-card p-[10px] rounded-[10px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] my-[20px] min-[769px]:mt-[42px] min-[769px]:mb-[20px]">
              {/* Header bar */}
              <div className="bg-ac-navy rounded-t-[10px] mt-[-15px] mx-[-10.5px] mb-0 p-[15px] text-center">
                <h2 className="m-0 text-[29px] font-normal leading-[28px] text-white">
                  AutoCheck Vehicle History Reports
                </h2>
              </div>

              {/* Content */}
              <div className="p-[15px]">
                <p className="m-0 text-[14px] leading-[21px]">
                  Two ways to find the vehicle history you&apos;re looking for:
                </p>

                {/* VIN search */}
                <form noValidate onSubmit={onVinSubmit}>
                  <h4 className="m-0 pb-[10px] text-[16.8px] font-bold leading-[21.84px] text-ac-ink">
                    Search by VIN
                    <span className={`${helpLink} p-[15px]`}>
                      Where can I find the VIN? »
                    </span>
                  </h4>
                  <div className="flex flex-wrap mx-[-10.5px]">
                    <div className={`${col} w-full sm:w-2/3`}>
                      <div className="mb-[14px]">
                        <input
                          id="reports-vin"
                          name="vin"
                          type="text"
                          maxLength={17}
                          placeholder="Vehicle Identification Number"
                          aria-label="Vehicle Identification Number"
                          aria-invalid={vinError}
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
                    </div>
                    <div className={`${col} w-full sm:w-1/3`}>
                      <button type="submit" className="ac-btn w-full">
                        Get Report
                      </button>
                    </div>
                  </div>
                </form>

                {/* OR divider */}
                <div className="flex items-center mt-[10px] mb-[15px] mx-[-10.5px] text-[18px] font-bold italic leading-[27px] text-ac-or-gray">
                  <div className="grow-0 shrink-0 px-[10.5px]">OR</div>
                  <div className="flex-1 px-[10.5px]">
                    <hr className="my-[14px] mx-0 border-0 border-t border-solid border-ac-or-gray opacity-25" />
                  </div>
                </div>

                {/* Plate search */}
                <form noValidate onSubmit={onPlateSubmit}>
                  <h4 className="m-[7px] p-0 text-[16.8px] font-bold leading-[21.84px] text-ac-ink">
                    Search by US License Plate
                    <span className={`${helpLink} p-0`}>
                      Is it a specialty plate? »
                    </span>
                  </h4>
                  <div className="flex flex-wrap mx-[-10.5px]">
                    <div className={`${col} w-full md:w-5/12`}>
                      <div className="mb-[14px]">
                        <input
                          id="plate"
                          name="plate"
                          type="text"
                          placeholder="US License Plate"
                          aria-label="US License Plate"
                          aria-invalid={plateError}
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
                          <div className={errorText}>Please enter a license plate</div>
                        )}
                      </div>
                    </div>
                    <div className={`${col} w-8/12 md:w-3/12 mb-[14px]`}>
                      <select
                        id="reports-state"
                        name="state"
                        aria-label="State"
                        aria-invalid={stateError}
                        value={usState}
                        onChange={(e) => {
                          setUsState(e.target.value);
                          if (stateError) setStateError(false);
                        }}
                        className={`${selectBase} ${
                          stateError ? "border-ac-danger" : "border-ac-input-border"
                        }`}
                      >
                        <option value="" disabled>
                          State
                        </option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {stateError && (
                        <div className={errorText}>Please select a state</div>
                      )}
                    </div>
                    <div className={`${col} w-full sm:w-1/3`}>
                      <button type="submit" className="ac-btn w-full">
                        Get Report
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-[7px] mb-[3.5px] mx-[-10.5px]">
                    <div className={`${col} w-full`}>
                      <a
                        className="novin text-[15px] leading-[22.5px] text-ac-blue"
                        href="/vehiclehistory/vehicle-history-reports"
                      >
                        No VIN? Subscribe now, search later»
                      </a>
                    </div>
                  </div>
                </form>

                {/* reCAPTCHA notice */}
                <div className="flex flex-wrap mt-[14px] mx-[-10.5px]">
                  <div className={`${col} w-full`}>
                    <hr className="my-[14px] mx-0 border-0 border-t border-solid border-ac-ink opacity-25" />
                    <div className="text-[9.8px] leading-[14.7px]">
                      This site is protected by reCAPTCHA and the Google{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        className="p-[3px] text-ac-blue no-underline hover:underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://policies.google.com/terms"
                        className="p-[3px] text-ac-blue no-underline hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      apply.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
