# HeroSearch Specification

## Overview
- **Target file:** `src/components/HeroSearch.tsx` ("use client")
- **Screenshot:** `docs/design-references/section-hero.png`
- **Interaction model:** click-driven (client-side validation on submit). No animation.

## Global facts
Root 14px; body `Roboto, sans-serif` 14px/21px #212529. Use exact px Tailwind arbitrary values. `ac-container` = bootstrap container (1140 max, padding-inline 10.5px). `ac-btn` = magenta button (bg #af1685 → hover #d81ba4, radius 5.25px, padding 8.4px 11.2px, 14px/21px white, flex centered, transition .15s) — both global classes already exist in globals.css.

## DOM & computed styles (desktop 1440)
section#vehiclehistoryreport (height 471px on desktop)
  - ≥768px: background-image url(/images/home-hero.jpg), background-size cover, background-position 80% 40%, no-repeat, bg-color white. <768px: no background image.
  div.ac-container, margin-bottom 21px
    row (flex, margin 0 -10.5px)
      [mobile only <768: div text-center, padding 0 10.5px, margin-bottom 20px:
         img /images/mobile-hero.jpg alt "AutoCheck Report Pages" w-full (768×284 natural)
         h2 "AutoCheck helps you buy and sell with confidence." 19px/28px bold #212529 center, margin-bottom 7px]
      col: width 100% below 768, 50% (570px) at ≥768; padding 0 10.5px
        CARD: bg #fbfbfb, padding 10px, radius 10px, box-shadow `0 0 5px 1px rgba(0,0,0,0.3)`; margin: 42px 0 20px at ≥769px, 20px 0 on mobile. Measured 549×409.
          HEADER BAR: bg #1e427a, radius 10px 10px 0 0, margin -15px -10.5px 0 (it overhangs card padding: it sits 5px ABOVE the card top edge and 0.5px wider each side — replicate with those negative margins), padding 15px, text-align center. Measured 550×58.
            h2 "AutoCheck Vehicle History Reports": 29px, weight 400, line-height 28px, color #fff, margin 0. (Wraps to 2 lines on mobile.)
          CONTENT: padding 15px
            p "Two ways to find the vehicle history you're looking for:" 14px/21px, margin 0
            form VIN:
              h4 "Search by VIN" 16.8px bold lh 21.84px, margin 0, padding-bottom 10px, color #212529, followed inline by span "Where can I find the VIN? »" (14px bold lh 18.2px color #004990, padding 15px, margin 7px, cursor pointer, inert).
              row (flex wrap, margin 0 -10.5px):
                col sm:w-2/3 (w-full <576) padding 0 10.5px: input wrapper margin-bottom 14px:
                  input#reports-vin placeholder "Vehicle Identification Number", maxLength 17, type text: height 32px, padding 7px 14px, 14px, line-height 14px, color #212529, bg #fff, border 1px solid #aeaeae, radius 0, width 100%, placeholder color rgba(33,37,41,0.75). Focus: border-color #86b7fe, box-shadow 0 0 0 .25rem rgba(13,110,253,.25), outline 0.
                  Invalid: border 1px solid #dc3545 + below input a div "Please enter a vehicle identification number to continue" 12px color #dc3545 margin-top 4px.
                col sm:w-1/3 padding 0 10.5px: button.ac-btn w-full "Get Report" (152×38)
            OR ROW: flex items-center, margin 10px -10.5px 15px, 18px bold italic lh 27px color #979797:
              col (flex-grow 0, padding 0 10.5px) "OR"; col flex-1 padding 0 10.5px with hr (margin 14px 0, border-top 1px solid #979797, opacity .25).
            form Plate:
              h4 "Search by US License Plate" 16.8px bold lh 21.84px, margin 7px, padding 0, followed by span "Is it a specialty plate? »" (14px bold lh 18.2px #004990, padding 0, margin 7px, cursor pointer).
              row: 
                col md:w-5/12 (w-full below 768) padding 0 10.5px: input#plate placeholder "US License Plate" same input styles, wrapper mb 14px (196px wide on desktop)
                col w-8/12 md:w-3/12 padding 0 10.5px mb 14px: select#reports-state name state: native appearance (keep browser default arrow), height 33.5px, padding 5.25px 24.5px 5.25px 10.5px, 14px, color #495057, bg #fff, border 1px solid #aeaeae, radius 0, width 100%. First option value "" disabled selected "State", then AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY.
                col w-full sm:w-1/3 padding 0 10.5px: button.ac-btn w-full "Get Report"
                Invalid (empty plate): plate input red border + "Please enter a license plate" 12px #dc3545 under it; empty state: select red border + "Please select a state".
              row margin 7px -10.5px 3.5px: a.novin "No VIN? Subscribe now, search later»" 15px/22.5px color #004990 → /vehiclehistory/vehicle-history-reports
            row margin-top 14px: col padding 0 10.5px:
              hr margin 14px 0, border-top 1px solid #212529, opacity .25
              div 9.8px/14.7px: "This site is protected by reCAPTCHA and the Google " a"Privacy Policy"(https://policies.google.com/privacy) " and " a"Terms of Service"(https://policies.google.com/terms) " apply." — links color #004990, padding 3px, no underline, underline on hover.
  Note: on valid submit just `preventDefault` (no backend) — optionally alert-free no-op.

## Responsive
- Desktop: card 549px wide at left of container (x=161), 42px from section top; bg photo fills 1440×471.
- Mobile 390: mobile-hero image top at y=0 (under fixed nav), h2 below, card full width (369px), margin-top 20px; inputs/buttons stack full width; select is 2/3 width (col-8).
