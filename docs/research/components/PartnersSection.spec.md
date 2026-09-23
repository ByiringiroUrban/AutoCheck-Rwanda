# PartnersSection Specification

## Overview
- **Target file:** `src/components/PartnersSection.tsx`
- **Screenshot:** `docs/design-references/section-partners.png`
- **Interaction model:** static

## Global facts
Root 14px; body `Roboto, sans-serif` 14px/21px #212529. Exact px Tailwind values. Global class `ac-container`.

## DOM & computed styles
div.ac-container, margin 14px auto 42px (i.e. mt-[14px] mb-[42px])
  row (margin 0 -10.5px 21px): col full width text-center padding 0 10.5px
    a href "https://www.keysavvy.com/partners/autocheck?aaId=exp&buyOrSell=buy?aaId=exp" target _blank rel noopener:
      img /images/KeySavvy-AutoCheck-teamup-bnr.png alt "Buying or selling your vehicle private party?" 567×323 (inline, centered, max-width 100%)
  row: col-12 padding 0 10.5px: div text-center
    h3 "AutoCheck is Proud to be Partnered with Leaders in the Automotive Industry": 22.5px bold lh 28px color #004990 margin 0 0 7px
    p (margin 0 0 14px, line of inline imgs, vertical-align middle, no gaps other than inline whitespace — render imgs adjacent without whitespace between them):
      /images/partners/autotrader.png alt "AutoTrader" 141×66
      /images/partners/cargurus.png alt "cargurus.com" 135×34
      /images/partners/cars-com.png alt "Cars.com" 121×57
      /images/partners/carzing.png alt "carzing.com" 100×25
    p (same):
      /images/partners/ebay-motors.png alt "eBay" 123×66
      /images/partners/edmunds.png alt "Edmunds.com" 137×66
      /images/partners/kbb.png alt "KBB.com" 121×66
      /images/partners/jd-power.png alt "J.D. Power" rendered 117×20 (natural 135×20 — set width 117 height 20 explicitly)
Measured: row1 of logos spans x 472→969 at 1440 (centered), each p 66px tall.

## Responsive
Mobile: banner scales to 100% width; logos wrap naturally, centered.
