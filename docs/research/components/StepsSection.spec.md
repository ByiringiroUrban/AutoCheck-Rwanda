# StepsSection Specification

## Overview
- **Target file:** `src/components/StepsSection.tsx`
- **Screenshot:** `docs/design-references/section-steps.png`
- **Interaction model:** static (button hover only)

## Global facts
Root 14px; body `Roboto, sans-serif` 14px/21px #212529. Use exact px arbitrary Tailwind values. Global classes: `ac-container` (bootstrap container), `ac-btn` (magenta button, hover #d81ba4).

## DOM & computed styles
div.ac-container (height 511 on desktop)
  row flex flex-wrap, margin 0 -10.5px
    col A: w-full md:w-1/2 (570px), padding 0 10.5px, margin 42px 0
      h2 "Get The AutoCheck Report": 28px, bold, line-height 28px, padding 3.5px 0, margin 0 0 7px, #212529
      h3 "Step 1. Find Your Car": 22.5px bold lh 28px color #004990 margin 0 0 7px
      p "Search by vehicle identification number (VIN) or US license plate to find the car you want to research." 14px/21px margin 0 0 14px
      h3 "Step 2. Pick Your Plan"
      p "Multiple Reports if you're still shopping and considering many vehicles. A single report might be right for you if you've found your dream car and are ready to buy."
      h3 "Step 3. Check Your Vehicle History"
      p "from your desktop. One time fee. No recurring charges"
      a block, href "/#vehiclehistoryreport", margin-bottom 21px, no underline: button.ac-btn inline (width auto: 162×38) "Get AutoCheck Report" — button is display:flex but not full width: use `inline-flex` or `w-fit`.
      a "See Sample Reports >>" 14px color #004990 → /vehiclehistory/sample-vehicle-history-report (hover underline)
    col B: w-full md:w-5/12 (475px), padding 0 10.5px, margin 42px 0 21px
      img /images/reportexample.jpg alt "AutoCheck Report Pages" natural 618×610, rendered max-width 100% → 454×448 on desktop (width = col width minus padding), 369×364 on 390 mobile.

## Responsive
- ≥768: two columns side by side (col B is 5/12 wide, left aligned directly after col A).
- <768: stacked; col A then image.
