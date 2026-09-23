# BenefitsSection Specification

## Overview
- **Target file:** `src/components/BenefitsSection.tsx`
- **Screenshot:** `docs/design-references/section-benefits.png`
- **Interaction model:** static (button hover only)

## Global facts
Root 14px; body `Roboto, sans-serif` 14px/21px #212529. Exact px Tailwind values. Global classes `ac-container`, `ac-btn` (magenta button).

## DOM & computed styles
div.ac-container (473 tall)
  row margin 0 -10.5px
    div (col-12 cardContainer): bg #fbfbfb, radius 10px, padding 10px, margin 20px 0 (width = full container width 1140 incl. the -10.5 row margins: i.e. it is the full row width), 
      row flex flex-wrap text-center, margin 0 -10.5px
        3× col: w-full md:w-1/3 (380px), padding 0 10.5px, margin-bottom 14px
          div padding 15px
            h2 eyebrow: 19px bold lh 28px #212529 margin 0 0 7px
            h3 title: 22.5px bold lh 28px #004990 margin 0 0 7px
            img (inline, centered by text-align center, max-width 100%)
            p 14px/21px margin 0 0 14px
            a → href wrapping button.ac-btn "Learn More" (94×38, centered: margin 0 auto, width fit)

## Content (verbatim)
1. eyebrow "Scan Quickly", title "The AutoCheck Score", img /images/ScanQuickly238.png alt "Scan Quickly" natural 370×200 rendered 329×178 (fills width), p "Spot your perfect vehicle quickly with the patented AutoCheck Score and minimize the risk of buying a vehicle with unseen problems.", href /vehiclehistory/autocheck-score
2. "Dive in Deep", "Full Vehicle Histories", /images/DiveInDeepReports204.png alt "Dive in Deeper" 204×172, p "Learn if a vehicle has been reported in an accident, branded a lemon, damaged in a flood, reported repossessed or stolen, and more.", href /vehiclehistory/vehicle-history-reports
3. "Rest Easy", "Backed by Experian", /images/BuybackProtection.png alt "Buyback Protection" 178×184, p "Be confident in your purchase and enjoy access to benefits such as free Buyback Protection for registered, qualified vehicles.", href /vehiclehistory/vehicle-buyback-protection

Cards are top-aligned; because image heights differ (178/172/184), paragraph & button positions differ slightly per card (desired — do not equalize).

## Responsive
≥768: 3 columns. <768: stacked single column, same centered content.
