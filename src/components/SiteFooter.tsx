import type { FooterColumn, NavLink } from "@/types/content";

const columns: FooterColumn[] = [
  {
    heading: "AutoCheck® Rwanda Vehicle History Reports",
    links: [
      { label: "Order Vehicle History Reports", href: "/vehiclehistory/vehicle-history-reports" },
      { label: "View a Sample Vehicle History Report", href: "/vehiclehistory/sample-vehicle-history-report" },
      { label: "VIN and Plate Checks", href: "/vehiclehistory/subscription-benefits" },
      { label: "Search by Rwanda Plate Number", href: "/vehiclehistory/search-by-plate" },
    ],
  },
  {
    heading: "Buying a Used Car in Rwanda",
    links: [
      { label: "How to Buy a Used Car in Rwanda", href: "/vehiclehistory/buyers-guide" },
      { label: "What is a VIN?", href: "/vehiclehistory/vin-basics" },
      { label: "VIN Decode Explained", href: "/vehiclehistory/vin-basics#decode" },
      { label: "Where can I Find the VIN?", href: "/vehiclehistory/vin-basics#findVin" },
      { label: "Protect Yourself from Odometer Fraud", href: "/vehiclehistory/odometer-fraud" },
      { label: "Learn About Title Brands", href: "/vehiclehistory/title-brands" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { label: "Frequently Asked Questions", href: "/vehiclehistory/faq" },
      { label: "Contact Us", href: "/vehiclehistory/contact" },
      { label: "Free Digital Report Delivery", href: "/vehiclehistory/free-online-delivery" },
      { label: "Secure Shopping", href: "/vehiclehistory/secure-shopping" },
      { label: "Your Data Safety and Privacy", href: "/vehiclehistory/privacy" },
      { label: "Glossary of Vehicle History Terms", href: "/vehiclehistory/glossary" },
    ],
  },
  {
    heading: "The AutoCheck® Rwanda Difference",
    links: [
      { label: "The AutoCheck Score®", href: "/vehiclehistory/autocheck-score" },
      { label: "Vehicle Buyback Protection", href: "/vehiclehistory/vehicle-buyback-protection" },
      { label: "Flood & Accident Risk Check", href: "/vehiclehistory/risk-check" },
      { label: "Rwanda Vehicle Registry Data", href: "/vehiclehistory/data-sources" },
    ],
  },
  {
    heading: "Work With Us",
    links: [
      { label: "Car Dealer? Become an AutoCheck Rwanda Member", href: "/vehiclehistory/dealer-signup" },
      { label: "Online Advertiser? Join Our Affiliate Program", href: "/vehiclehistory/affiliate-program" },
      { label: "Careers at AutoCheck Rwanda", href: "/vehiclehistory/careers" },
    ],
  },
];

const legalLinks: NavLink[] = [
  { label: "AutoCheck Rwanda Terms and Conditions", href: "/vehiclehistory/terms-of-use" },
  { label: "Privacy Policy", href: "/vehiclehistory/privacy" },
  { label: "Your Ad Choices", href: "/vehiclehistory/your-ad-choices" },
];

// Global `a` styles are unlayered, so utilities need `!` to win.
const linkClass = "text-white! no-underline hover:underline!";

function FooterLink({ link }: { link: NavLink }) {
  return (
    <a
      href={link.href}
      className={linkClass}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-[50px] bg-ac-footer text-white">
      <div className="ac-container hidden pt-[42px] pb-[3.5px] px-[14px]! md:block">
        <div className="mx-[-10.5px] flex">
          {columns.map((col) => (
            <div key={col.heading} className="min-w-0 flex-1 px-[10.5px]">
              <h5 className="m-0 text-[12px] leading-[14.4px] font-bold text-white uppercase">
                {col.heading}
              </h5>
              <ul className="mt-[30px] mb-[14px] list-none p-0 text-[12px] leading-[18px]">
                {col.links.map((link) => (
                  <li key={link.label} className="py-[3.5px]">
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="ac-container pt-0 pb-[42px] px-[14px]!">
        <div className="flex justify-center text-center md:text-left">
          <ul className="mt-[30px] mb-[14px] list-none p-0 text-center">
            {legalLinks.map((link, i) => (
              <li key={link.label} className="contents">
                <span
                  className={`${i < legalLinks.length - 1 ? "mr-[7px] " : ""}inline-block text-[12px] leading-[18px] [&>a]:block`}
                >
                  <FooterLink link={link} />
                </span>
                {i < legalLinks.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mr-[7px] inline-block text-[14px] leading-[21px] text-white"
                  >
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center text-[12px] leading-[18px] text-white">
          © AutoCheck Rwanda {year}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
