import type { SVGProps } from "react";

/** Bootstrap navbar-toggler-icon: three 22px bars, stroke rgba(33,37,41,0.75). */
export function HamburgerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" {...props}>
      <path
        stroke="rgba(33, 37, 41, 0.75)"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M4 7h22M4 15h22M4 23h22"
      />
    </svg>
  );
}

/** Bootstrap Icons `bi-person-fill`. */
export function PersonFillIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>
  );
}

/** Bootstrap Icons `bi-cart-fill`. */
export function CartFillIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
    </svg>
  );
}

/** Native-select chevron (Bootstrap form-select arrow), stroke #343a40. */
export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path fill="none" stroke="#343a40" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m2 5 6 6 6-6" />
    </svg>
  );
}

/** Professional Cost Savings / Wallet / Discount Icon */
export function SavingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h14a1 1 0 0 1 1 1v3M19 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
      <path d="M16 14h.01" />
      <circle cx="16" cy="14" r="2" />
      <path d="M9 11h2" />
    </svg>
  );
}

/** Professional Analytics / Compare Chart Icon */
export function CompareChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <rect x="7" y="10" width="3" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="13" y="6" width="3" height="12" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect x="19" y="12" width="3" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
      <path d="M7 10l5-4 4 4 5-6" />
    </svg>
  );
}

/** Professional Clock / Dynamic Update History Icon */
export function ClockUpdateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
      <path d="M21 12a9 9 0 0 0-9-9" strokeDasharray="2 2" />
    </svg>
  );
}

/** Professional Shield Protection Icon */
export function ShieldProtectionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.1" />
      <path d="m9 12 2 2 4-4" strokeWidth="2" />
    </svg>
  );
}

/** Clean Automotive Front Vehicle Icon */
export function CarFrontIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <rect x="3" y="11" width="18" height="8" rx="2" fill="currentColor" fillOpacity="0.08" />
      <circle cx="7.5" cy="15" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="15" r="1.5" fill="currentColor" />
      <path d="M9 18h6" />
    </svg>
  );
}

/** Lightning Fast Delivery Icon */
export function LightningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

/** Email & PDF Report Icon */
export function MailReportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <polyline points="3 7 12 13 21 7" />
      <path d="M8 15h3" />
      <path d="M8 12h2" />
    </svg>
  );
}

/** Dynamic Sync / Refresh Icon */
export function SyncRefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
    </svg>
  );
}

/** Map Pin Location Icon */
export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** Briefcase / Department Icon */
export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
