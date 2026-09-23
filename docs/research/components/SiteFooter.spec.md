# SiteFooter Specification

## Overview
- **Target file:** `src/components/SiteFooter.tsx`
- **Screenshot:** `docs/design-references/section-footer.png`
- **Interaction model:** static (link hover underline)

## Global facts
Root 14px; font `Roboto, sans-serif`. Exact px Tailwind values. Global class `ac-container` (bootstrap container, padding-inline 10.5px — override to 14px here where noted).

## DOM & computed styles
footer: bg #252525, color #fff, margin-top 50px, 404px tall at desktop.
  A) (hidden <768, block ≥768) div.ac-container with padding 42px 14px 3.5px:
     row flex, margin 0 -10.5px; 5 equal cols (flex-1, padding 0 10.5px)
       h5: 12px bold lh 14.4px uppercase white, margin 0 0 21px
       ul list-none p-0: 12px lh 18px, margin 30px 0 14px — NOTE h5 mb 21px and ul mt 30px do not collapse-add; measured ul top = h5 bottom + 30px (margins collapse to max 30px). Use h5 mb-0 and ul mt-[30px].
         li padding 3.5px 0; a white, no underline, hover underline.
  B) div.ac-container padding 0 14px 42px:
     div flex justify-center text-center (md:text-left):
       ul list-inline margin 30px 0 14px, text-align center:
         li inline-block margin-right 7px: a 12px/18px white (hover underline) — separated by li "|" (14px/21px white, inline-block, margin-right 7px). Last li no margin.
         Links: "AutoCheck Terms and Conditions" /vehiclehistory/terms-of-use | "Experian Terms and Conditions" http://www.experian.com/corporate/legalterms.html | "Privacy Policy" https://www.experian.com/privacy/auto_check | "Your Ad Choices" /vehiclehistory/your-ad-choices
     div flex justify-center 12px/18px white: "© Experian {currentYear}. All rights reserved." (original renders "© Experian 2026 . All rights reserved." with a stray space; render "© Experian 2026. All rights reserved." — visually identical in the screenshot).

## Columns (verbatim)
1. "AUTOCHECK® VEHICLE HISTORY REPORTS" (wraps to 2 lines): Order Vehicle History Reports → /vehiclehistory/vehicle-history-reports; View a Sample Vehicle History Report → /vehiclehistory/sample-vehicle-history-report; VIN and License Plate Checks → /vehiclehistory/subscription-benefits; Search by License Plate → /vehiclehistory/search-by-license-plate
2. "Buying a Used Car": How to Buy a Used Car → /vehiclehistory/autoshoppers-guide; What is a VIN? → /vehiclehistory/vin-basics; VIN Decode Explained → /vehiclehistory/vin-basics#decode; Where can I Find the VIN? → /vehiclehistory/vin-basics#findVin; Protect Yourself from Odometer Fraud → /vehiclehistory/odometer-fraud; Learn About Title Brands → /vehiclehistory/title-brands
3. "Customer Service": Frequently Asked Questions → /vehiclehistory/faq; Contact Us → /vehiclehistory/contact; Free Digital Dashboard Delivery → /vehiclehistory/free-online-delivery; Secure Shopping → /vehiclehistory/secure-shopping; Your Data Safety and Personal Privacy → https://www.experian.com/privacy/auto_check; Glossary of Vehicle History Terms → /vehiclehistory/glossary
4. "THE AUTOCHECK® DIFFERENCE": The Patented AutoCheck Score® → /vehiclehistory/autocheck-score; U.S. Patent No. 8,005,759 → /vehiclehistory/patent-notice; Vehicle Buyback Protection → /vehiclehistory/vehicle-buyback-protection; Data Backed by Experian → /vehiclehistory/backed-by-experian; AutoCheck v. Carfax → /vehiclehistory/autocheck-vs-carfax; AutoCheck v. Bargain Reports → /vehiclehistory/autocheck-vs-bargain; Flood Risk Check → /vehiclehistory/flood-risk-check
5. "Work With Us": Auto Dealer? Become an AutoCheck Member → https://www.experian.com/automotive/autocheck-business#consumer?cmpid=auto_AutoCheckConsumer_web; Online Advertiser? Join the AutoCheck Affiliate Program → /vehiclehistory/affiliate-program; Experian Careers → https://www.experian.com/corporate/careers-home.html

(Headings are uppercase via CSS; source text case shown.) Columns measured 227px wide each at 1440 (1133px total row).

## Responsive
<768: only block B (legal links wrap onto 3 lines, centered) + copyright; footer ~167px tall.
