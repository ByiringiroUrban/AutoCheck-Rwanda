/**
 * Rwanda & East African automotive partner logos rendered as inline SVG text.
 * These act as crisp, scalable partner badges — replace with real logo files when available.
 */

type PartnerBadge = {
  name: string;
  href: string;
  color: string;
  bg: string;
};

const partners: PartnerBadge[] = [
  { name: "Cheki Rwanda", href: "https://rw.cheki.com", color: "#e85d04", bg: "#fff3e0" },
  { name: "Carmudi Rwanda", href: "https://www.carmudi.co.rw", color: "#1565c0", bg: "#e3f2fd" },
  { name: "Motozone Rwanda", href: "https://www.motozone.rw", color: "#2e7d32", bg: "#e8f5e9" },
  { name: "RwandaAuto", href: "#", color: "#6a1b9a", bg: "#f3e5f5" },
  { name: "Jiji Rwanda", href: "https://jiji.rw/cars", color: "#bf360c", bg: "#fbe9e7" },
  { name: "AutoDeal RW", href: "#", color: "#004d40", bg: "#e0f2f1" },
];

export function PartnersSection() {
  return (
    <div className="ac-container mt-[14px] mb-[42px]">
      {/* Section heading */}
      <div className="mx-[-10.5px] flex flex-wrap">
        <div className="w-full px-[10.5px]">
          <div className="text-center">
            <h3 className="m-0 mb-[21px] text-[20px] min-[769px]:text-[22.5px] leading-[28px] font-bold text-ac-blue">
              AutoCheck Rwanda is Proud to Partner with Rwanda&apos;s Leading Automotive Platforms
            </h3>

            {/* Partner badge grid */}
            <div className="flex flex-wrap justify-center gap-[14px]">
              {partners.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-[8px] border border-solid border-[#e0e0e0] px-[24px] py-[16px] no-underline shadow-sm transition-shadow hover:shadow-md"
                  style={{ backgroundColor: p.bg, minWidth: 160, minHeight: 66 }}
                >
                  <span
                    className="text-[16px] font-bold"
                    style={{ color: p.color }}
                  >
                    {p.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
