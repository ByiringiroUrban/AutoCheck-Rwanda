import type { BenefitCard } from "@/types/content";

const benefits: BenefitCard[] = [
  {
    eyebrow: "Scan Quickly",
    title: "The AutoCheck Score",
    image: { src: "/images/ScanQuickly238.png", alt: "Scan Quickly", width: 370, height: 200 },
    body: "Spot your perfect vehicle quickly with the AutoCheck Score and minimize the risk of buying a vehicle with unseen problems in Rwanda's used car market.",
    href: "/vehiclehistory/autocheck-score",
  },
  {
    eyebrow: "Dive in Deep",
    title: "Full Vehicle Histories",
    image: { src: "/images/DiveInDeepReports204.png", alt: "Dive in Deeper", width: 204, height: 172 },
    body: "Learn if a vehicle has been reported in an accident, damaged in a flood, reported repossessed or stolen, and more — all from Rwanda's vehicle registry data.",
    href: "/vehiclehistory/vehicle-history-reports",
  },
  {
    eyebrow: "Rest Easy",
    title: "Rwanda-Trusted Reports",
    image: { src: "/images/BuybackProtection.png", alt: "Buyback Protection", width: 178, height: 184 },
    body: "Be confident in your purchase with access to benefits such as free Buyback Protection for registered, qualified vehicles in Rwanda.",
    href: "/vehiclehistory/vehicle-buyback-protection",
  },
];

export function BenefitsSection() {
  return (
    <div className="ac-container">
      <div className="mx-[-10.5px] flex flex-wrap">
        <div className="w-full my-[20px] rounded-[10px] bg-ac-card p-[10px]">
          <div className="mx-[-10.5px] flex flex-wrap text-center">
            {benefits.map((card) => (
              <div key={card.title} className="mb-[14px] w-full px-[10.5px] md:w-1/3">
                <div className="p-[15px]">
                  <h2 className="mb-[7px] text-[19px] font-bold leading-[28px] text-ac-ink">
                    {card.eyebrow}
                  </h2>
                  <h3 className="mb-[7px] text-[20px] min-[769px]:text-[22.5px] font-bold leading-[28px] text-ac-blue">
                    {card.title}
                  </h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image.src}
                    alt={card.image.alt}
                    width={card.image.width}
                    height={card.image.height}
                    className="inline h-auto max-w-full"
                  />
                  <p className="mb-[14px] text-[14px] leading-[21px]">{card.body}</p>
                  <a href={card.href} className="ac-btn mx-auto w-fit no-underline">
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
