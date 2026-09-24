"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";

// ── Slide data ────────────────────────────────────────────────────────────────
const SLIDES = [
  { src: "/images/slides/slide-1.jpg", alt: "Kigali Convention Centre lit in Rwanda flag colours at night" },
  { src: "/images/slides/slide-2.jpg", alt: "Kigali downtown skyscrapers at night" },
  { src: "/images/slides/slide-3.jpg", alt: "Kigali city lights and modern tower at night" },
  { src: "/images/slides/slide-4.jpg", alt: "Aerial view of Kigali roundabout and green city centre" },
  { src: "/images/slides/slide-5.jpg", alt: "Kigali green hills and modern skyline" },
];

const SLIDE_DURATION = 5000; // ms between auto-advances

// ── Form styles ───────────────────────────────────────────────────────────────
const inputBase =
  "block w-full h-[32px] px-[14px] py-[7px] text-[14px] leading-[14px] text-ac-ink bg-white border border-solid rounded-none placeholder:text-[rgba(33,37,41,0.75)] focus:outline-0 focus:border-[#86b7fe] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] transition-[border-color,box-shadow] duration-150";

const errorText = "mt-[4px] text-[12px] text-ac-danger";
const helpLink = "text-[14px] font-bold leading-[18.2px] text-ac-blue m-[7px] cursor-pointer";
const col = "shrink-0 px-[10.5px]";

// ── Hero Slider ───────────────────────────────────────────────────────────────
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 600);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, next]);

  return (
    <>
      {/* Slide layers — stack with absolute positioning */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out"
            style={{
              backgroundImage: `url(${slide.src})`,
              opacity: i === current ? (transitioning ? 0 : 1) : 0,
            }}
          />
        ))}
        {/* Dark overlay so the white search card stays readable */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Dot navigation */}
      <div
        className="absolute bottom-4 left-0 right-0 flex justify-center gap-[10px]"
        style={{ zIndex: 2 }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-[10px] rounded-full border-2 border-white transition-all duration-300 cursor-pointer ${
              i === current ? "w-[28px] bg-white" : "w-[10px] bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors duration-200 cursor-pointer border-0"
        style={{ zIndex: 2 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo((current + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors duration-200 cursor-pointer border-0"
        style={{ zIndex: 2 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function HeroSearch() {
  const [vin, setVin] = useState("");
  const [vinError, setVinError] = useState(false);
  const [plate, setPlate] = useState("");
  const [plateError, setPlateError] = useState(false);

  const onVinSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVinError(vin.trim() === "");
  };

  const onPlateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlateError(plate.trim() === "");
  };

  return (
    <section
      id="vehiclehistoryreport"
      className="relative overflow-hidden"
      style={{ minHeight: "520px" }}
    >
      {/* ── Sliding background (desktop only) ── */}
      <div className="hidden md:block absolute inset-0" style={{ zIndex: 0 }}>
        <HeroSlider />
      </div>

      {/* ── Static mobile hero image ── */}
      <div className="md:hidden w-full shrink-0 mb-[20px] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/slides/slide-4.jpg"
          alt="Kigali, Rwanda"
          width={768}
          height={284}
          className="w-full h-auto"
        />
        <h2 className="m-0 mb-[7px] px-4 text-[19px] leading-[28px] font-bold text-ac-ink text-center">
          AutoCheck Rwanda helps you buy and sell with confidence.
        </h2>
      </div>

      {/* ── Content layer (above slider) ── */}
      <div className="relative ac-container mb-[21px]" style={{ zIndex: 1 }}>
        <div className="flex flex-wrap mx-[-10.5px]">
          <div className={`${col} w-full md:w-1/2`}>
            <div className="bg-ac-card p-[10px] rounded-[10px] shadow-[0_0_5px_1px_rgba(0,0,0,0.3)] my-[20px] min-[769px]:mt-[42px] min-[769px]:mb-[42px]">
              {/* Header bar */}
              <div className="bg-ac-navy rounded-t-[10px] mt-[-15px] mx-[-10.5px] mb-0 p-[15px] text-center">
                <h2 className="m-0 text-[29px] font-normal leading-[28px] text-white">
                  AutoCheck Rwanda Vehicle History Reports
                </h2>
              </div>

              {/* Form content */}
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

                {/* Rwanda Plate search */}
                <form noValidate onSubmit={onPlateSubmit}>
                  <h4 className="m-[7px] p-0 text-[16.8px] font-bold leading-[21.84px] text-ac-ink">
                    Search by Rwanda Plate Number
                  </h4>
                  <div className="flex flex-wrap mx-[-10.5px]">
                    <div className={`${col} w-full md:w-8/12`}>
                      <div className="mb-[14px]">
                        <input
                          id="plate"
                          name="plate"
                          type="text"
                          placeholder="Rwanda Plate Number (e.g. RAC 123A)"
                          aria-label="Rwanda Plate Number"
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
                          <div className={errorText}>Please enter a Rwanda plate number</div>
                        )}
                      </div>
                    </div>
                    <div className={`${col} w-full sm:w-4/12`}>
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
                      <a href="https://policies.google.com/privacy" className="p-[3px] text-ac-blue no-underline hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="https://policies.google.com/terms" className="p-[3px] text-ac-blue no-underline hover:underline">
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
