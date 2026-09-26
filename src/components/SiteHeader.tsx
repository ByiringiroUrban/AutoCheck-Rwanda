"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CartFillIcon, HamburgerIcon, PersonFillIcon } from "@/components/icons";

type NavLink = { label: string; href: string };
type NavGroup = { label: string; links: NavLink[] };

const UTILITY_LINKS: (NavLink & { external?: boolean })[] = [
  { label: "My Dashboard", href: "/vehiclehistory/dashboard" },
  { label: "Dealer Sign In", href: "/vehiclehistory/dealer-login" },
  { label: "Dispute", href: "/vehiclehistory/dispute" },
  { label: "Contact Us", href: "/vehiclehistory/contact" },
  { label: "Sign In", href: "/vehiclehistory/login" },
];

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Order Vehicle History Reports",
    links: [
      { label: "Order Vehicle History Reports", href: "/vehiclehistory/vehicle-history-reports" },
      { label: "See a Sample Vehicle History Report", href: "/vehiclehistory/sample-vehicle-history-report" },
    ],
  },
  {
    label: "Finding Vehicles",
    links: [{ label: "How to Buy a Used Car in Rwanda", href: "/vehiclehistory/buyers-guide" }],
  },
  {
    label: "The AutoCheck Rwanda Difference",
    links: [
      { label: "The AutoCheck Score", href: "/vehiclehistory/autocheck-score" },
      { label: "Vehicle Buyback Protection", href: "/vehiclehistory/vehicle-buyback-protection" },
      { label: "VIN Checks for Subscribers", href: "/vehiclehistory/subscription-benefits" },
      { label: "Flood & Accident Risk Check", href: "/vehiclehistory/risk-check" },
    ],
  },
];

/** Closes a menu on outside click (mousedown) or Escape. */
function useDismiss(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, active, onClose]);
}

function DesktopHeader() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const close = useCallback(() => setOpenIdx(null), []);
  useDismiss(navRef, openIdx !== null, close);

  return (
    <div className="hidden md:block">
      {/* Utility row */}
      <div className="ac-container flex h-[35px] justify-end">
        <ul className="m-0 flex list-none p-0">
          {UTILITY_LINKS.map((link, i) => (
            <li key={link.label} className="flex">
              {i > 0 && (
                <span aria-hidden="true" className="mt-[7px] text-[14px] leading-[21px] text-[#212529]">
                  |
                </span>
              )}
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="block h-[35px] p-[7px] text-[14px] leading-[21px] text-[#212529] no-underline transition-colors duration-150 ease-in-out hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main row */}
      <div className="ac-container flex h-[90px] pb-[14px]">
        <div className="flex-1">
          <Link href="/" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-desktop.png"
              alt="AutoCheck Rwanda"
              width={212}
              height={76}
              className="block h-[76px] w-[212px]"
            />
          </Link>
        </div>
        <div className="mt-[14px] flex-1">
          <ul ref={navRef} className="m-0 flex list-none p-0">
            {NAV_GROUPS.map((group, i) => {
              const open = openIdx === i;
              const menuId = `ac-nav-menu-${i}`;
              return (
                <li
                  key={group.label}
                  className="relative group"
                  onMouseEnter={() => setOpenIdx(i)}
                  onMouseLeave={() => setOpenIdx(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-controls={menuId}
                    onClick={() => setOpenIdx(open ? null : i)}
                    className={`ac-caret h-[44px] cursor-pointer whitespace-nowrap border-0 bg-transparent p-[10px] text-[16px] leading-[24px] ${
                      open ? "text-[#212529]" : "text-[#004990]"
                    }`}
                  >
                    {group.label}
                  </button>
                  {open && (
                    <div className="absolute left-0 top-full pt-[2px] z-[1000]">
                      <ul
                        id={menuId}
                        className="m-0 min-w-[200px] list-none whitespace-nowrap rounded-[5.25px] border border-solid border-[#ccc] bg-white p-0 shadow-[0_0_3px_1px_rgba(0,0,0,0.3)]"
                      >
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              onClick={close}
                              className="block px-[15px] py-[8px] text-left text-[15px] leading-[22.5px] text-[#004990] hover:bg-[#f8f9fa] transition-colors"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

const MOBILE_ICON_BTN =
  "flex h-[35px] w-[36px] items-center justify-center rounded-[5.25px] border border-solid border-[#ccc] bg-[#f8f9fa] px-[6px] py-0 text-[rgb(134,135,135)]";

function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setExpanded(null);
  }, []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);
  useDismiss(navRef, menuOpen, closeMenu);
  useDismiss(accountRef, accountOpen, closeAccount);

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-[1030] h-[86px] bg-[#f8f9fa] p-[14px] shadow-[0_0_3px_1px_rgba(0,0,0,0.3)] md:hidden"
    >
      <div className="flex h-[58px] items-center justify-between px-[10.5px]">
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="ac-mobile-nav"
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
          className="flex h-[35px] w-[49.25px] cursor-pointer items-center justify-center rounded-[5.25px] border border-solid border-[rgba(0,0,0,0.15)] bg-transparent px-[10.5px] py-[3.5px]"
        >
          <HamburgerIcon width={26.25} height={26.25} className="h-[26.25px] w-[26.25px] shrink-0" />
        </button>

        <Link href="/" className="mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-mobile.png"
            alt="AutoCheck Rwanda"
            width={212}
            height={61}
            className="block h-[58px] w-auto"
          />
        </Link>

        <div className="flex items-center">
          <div ref={accountRef} className="relative">
            <button
              type="button"
              aria-label="Account"
              aria-haspopup="true"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((v) => !v)}
              className={`${MOBILE_ICON_BTN} cursor-pointer`}
            >
              <PersonFillIcon width={22} height={22} className="h-[22px] w-[22px] shrink-0" />
            </button>
            {accountOpen && (
              <ul className="absolute right-0 top-[calc(100%+2px)] z-[1000] m-0 w-[200px] list-none border border-solid border-[#ccc] bg-white p-0 shadow-[0_0_5px_1px_rgba(0,0,0,0.3)]">
                {UTILITY_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      onClick={closeAccount}
                      className="block px-[10px] py-[8px] text-right text-[15px] text-[#004990] hover:bg-[#eee] hover:font-medium hover:text-[#0b5191]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            aria-label="Cart"
            disabled
            className={`${MOBILE_ICON_BTN} ml-[7px] cursor-not-allowed opacity-50`}
          >
            <CartFillIcon width={22} height={22} className="h-[22px] w-[22px] shrink-0" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="ac-mobile-nav"
          className="absolute left-0 right-0 top-full bg-[#f8f9fa] px-[14px] pb-[14px] pt-0"
        >
          <ul className="m-0 list-none p-0">
            {NAV_GROUPS.map((group, i) => {
              const open = expanded === i;
              return (
                <li key={group.label}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setExpanded(open ? null : i)}
                    className="ac-caret block w-full cursor-pointer border-0 bg-transparent px-0 py-[8px] text-left text-[16px] text-[#004990]"
                  >
                    {group.label}
                  </button>
                  {open && (
                    <ul className="m-0 list-none p-0">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={closeMenu}
                            className="block px-[16px] py-[8px] text-[15px] text-[#004990]"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="md:relative md:z-[1] md:bg-white md:shadow-[0_5px_10px_0_rgba(0,0,0,0.35)]">
      <DesktopHeader />
      <MobileHeader />
    </header>
  );
}

export default SiteHeader;
