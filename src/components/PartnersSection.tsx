import type { PartnerLogo } from "@/types/content";

const logoRows: PartnerLogo[][] = [
  [
    { src: "/images/partners/autotrader.png", alt: "AutoTrader", width: 141, height: 66 },
    { src: "/images/partners/cargurus.png", alt: "cargurus.com", width: 135, height: 34 },
    { src: "/images/partners/cars-com.png", alt: "Cars.com", width: 121, height: 57 },
    { src: "/images/partners/carzing.png", alt: "carzing.com", width: 100, height: 25 },
  ],
  [
    { src: "/images/partners/ebay-motors.png", alt: "eBay", width: 123, height: 66 },
    { src: "/images/partners/edmunds.png", alt: "Edmunds.com", width: 137, height: 66 },
    { src: "/images/partners/kbb.png", alt: "KBB.com", width: 121, height: 66 },
    { src: "/images/partners/jd-power.png", alt: "J.D. Power", width: 117, height: 20 },
  ],
];

export function PartnersSection() {
  return (
    <div className="ac-container mt-[14px] mb-[42px]">
      <div className="mx-[-10.5px] mb-[21px] flex flex-wrap">
        <div className="w-full px-[10.5px] text-center">
          <a
            href="https://www.keysavvy.com/partners/autocheck?aaId=exp&buyOrSell=buy?aaId=exp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/KeySavvy-AutoCheck-teamup-bnr.png"
              alt="Buying or selling your vehicle private party?"
              width={567}
              height={323}
              className="inline-block h-auto max-w-full align-middle"
            />
          </a>
        </div>
      </div>
      <div className="mx-[-10.5px] flex flex-wrap">
        <div className="w-full px-[10.5px]">
          <div className="text-center">
            <h3 className="m-0 mb-[7px] text-[20px] min-[769px]:text-[22.5px] leading-[28px] font-bold text-ac-blue">
              AutoCheck is Proud to be Partnered with Leaders in the Automotive Industry
            </h3>
            {logoRows.map((row, i) => (
              <p key={i} className="m-0 mb-[14px]">
                {row.map((logo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={logo.src}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="inline-block align-middle"
                    style={{ width: logo.width, height: logo.height }}
                  />
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
