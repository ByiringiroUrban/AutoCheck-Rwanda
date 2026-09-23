# SiteHeader Specification

## Overview
- **Target file:** `src/components/SiteHeader.tsx` ("use client")
- **Screenshot:** `docs/design-references/section-header.png` (desktop)
- **Interaction model:** click-driven (dropdown menus); static otherwise. NOT sticky on desktop.

## Global facts
- Root font-size 14px. Body font `Roboto, sans-serif`, 14px/21px, color #212529. Use exact px arbitrary values in Tailwind (e.g. `text-[16px]`, `p-[10px]`), never rem-based utilities.
- Container: use the global class `ac-container` (max-width 1140 at ≥1200, 960/720/540 below, padding-inline 10.5px, centered).
- Global class `ac-caret` renders the Bootstrap dropdown caret via ::after (4.5px triangle, margin-left 4.08px, vertical-align 4.08px, currentColor).

## DOM Structure (desktop ≥768px, `hidden md:block`)
header (relative, z-index 1, bg white, box-shadow `0 5px 10px 0 rgba(0,0,0,0.35)`, height 125px total)
  1. Utility row: `ac-container flex justify-end`, height 35px
     ul flex: [a "Dealer Sign In"] [li "|"] [a "Dispute"] [li "|"] [a "Contact Us"] [li "|"] [a "Consumer Sign In"]
     - links: padding 7px, color #212529, 14px/21px, no underline; hover → underline; transition color .15s ease-in-out. Heights 35px.
     - separators "|": margin-top 7px, 14px/21px, color #212529 (li width ~4px).
     - hrefs: https://www.autocheck.com/members/login.do (target _blank), /vehiclehistory/dispute, /vehiclehistory/contact, /vehiclehistory/login
  2. Main row: `ac-container flex pb-[14px]` height 90px
     - left col (flex-1): link to "/" wrapping `<img src="/images/logo-desktop.png" alt="AutoCheck by Experian" width=212 height=76>` (image top aligns with row top, i.e. y=35).
     - right col (flex-1, margin-top 14px): ul flex with 3 li (relative), each a button.
       Buttons: 16px/24px, color #004990, padding 10px, bg transparent, border 0, `ac-caret`, cursor pointer, heights 44px. Widths ~245 / 150 / 220px (natural).
       Open state: button color #212529.
       Dropdown ul (absolute, top: 100% + 2px, left 0, min-width 160px, z 1000, bg #fff, border 1px solid #ccc, radius 5.25px, box-shadow `0 0 3px 1px rgba(0,0,0,0.3)`, padding 0 (list), margin 0, white-space nowrap, text-align right on container but items use their own).
       Items: `a` block, 15px/22.5px, color #004990, padding 7px 15px, text-align left, hover bg #f8f9fa. First menu measured 279px wide × 75px (2 items × 37px + borders).
     - Only one dropdown open at a time; clicking outside or Escape closes.

## Dropdown content
- "Order Vehicle History Reports": "Order Vehicle History Reports" → /vehiclehistory/vehicle-history-reports; "See a Sample Vehicle History Report" → /vehiclehistory/sample-vehicle-history-report
- "Finding Vehicles": "How to Buy a Used Car" → /vehiclehistory/autoshoppers-guide
- "The AutoCheck Difference": "Data Backed by Experian" → /vehiclehistory/backed-by-experian; "The Patented AutoCheck Score" → /vehiclehistory/autocheck-score; "Vehicle Buyback Protection" → /vehiclehistory/vehicle-buyback-protection; "VIN Checks for Subscribers" → /vehiclehistory/subscription-benefits; "Flood Risk Check" → /vehiclehistory/flood-risk-check

## Mobile (<768px, `md:hidden`)
nav fixed top-0 left-0 right-0, z 1030, bg #f8f9fa, padding 14px, box-shadow `0 0 3px 1px rgba(0,0,0,0.3)`, height 86px.
  inner: flex justify-between items-center, padding 0 10.5px, height 58px.
  - Left: hamburger button 49.25×35: padding 3.5px 10.5px, border 1px solid rgba(0,0,0,0.15), radius 5.25px, bg transparent. Icon `HamburgerIcon` 26.25×26.25.
    Click toggles a collapse panel (absolute below the navbar, full width, bg #f8f9fa, padding 0 14px 14px) listing the 3 groups: group button 16px #004990 padding 8px 0 left-aligned with caret; clicking expands its links (15px #004990, padding 8px 16px). (Original is inert; this is an intentional small improvement.)
  - Center: link `mx-auto` with `<img src="/images/logo-mobile.png" alt="AutoCheck by Experian" width=212 height=61>` rendered at height 58px (width ~201px).
  - Right: flex items-center: 
    * Account button 36×35: bg #f8f9fa, border 1px solid #ccc, radius 5.25px, padding 0 6px, color rgb(134,135,135), `PersonFillIcon` 22px. Click toggles utility menu: absolute, top 100% + 2px, right 0, width 200px, bg #fff, border 1px solid #ccc, shadow `0 0 5px 1px rgba(0,0,0,0.3)`, padding 0. Items: Dealer Sign In, Dispute, Contact Us, Consumer Sign In (same hrefs as desktop), 15px, color #004990, padding 8px 10px, text-align right; hover bg #eee, color #0b5191, font-weight 500.
    * Cart button 36×35 margin-left 7px same style, `CartFillIcon` 22px, `disabled`, opacity .5, cursor not-allowed.

## Assets / imports
- `/images/logo-desktop.png` (212×76), `/images/logo-mobile.png` (212×61)
- `HamburgerIcon`, `PersonFillIcon`, `CartFillIcon` from `@/components/icons`
- Use plain `<img>` tags (add `// eslint-disable-next-line @next/next/no-img-element` above each).

## Responsive
- ≥768px: desktop header (125px, relative). <768px: only the fixed mobile navbar; the header element itself contributes 0 height (fixed nav overlays page top).
