# AutoCheck homepage — Behaviors

Target: https://www.autocheck.com/vehiclehistory/?siteID=0 (Bootstrap 5 + React SPA). Root font-size 14px.

## Scroll sweep
- No scroll-driven behavior. Header is `position: relative` (NOT sticky) on desktop; it scrolls away.
- On mobile (<768px) the header is a `position: fixed` top navbar (86px tall, z-index 1030, bg #f8f9fa, shadow `0 0 3px 1px rgba(0,0,0,.3)`). Page content starts at y=0, so the mobile hero image sits partially under the fixed bar (faithful quirk).
- No entrance animations, no smooth-scroll library, no scroll-snap, no parallax.
- `.scroll-to-top` wrapper exists but is `display:none`.

## Click sweep
- Desktop nav dropdown toggles (3): click toggles `.dropdown-menu.show` (no animation). Menu: absolute, top = toggle bottom + 2px, left aligned to toggle, bg #fff, 1px solid #ccc, radius 5.25px, shadow `0 0 3px 1px rgba(0,0,0,.3)`, z 1000. Items 15px/22.5px #004990, padding 7px 15px, hover bg #f8f9fa. While open, the toggle color becomes #212529. Click outside closes.
- "Get Report" (VIN) with empty input: input gets red border `1px solid #dc3545`, and red message "Please enter a vehicle identification number to continue" (12px, #dc3545) appears directly under the input. Same pattern for plate ("Please enter a license plate" / state).
- "Where can I find the VIN? »" / "Is it a specialty plate? »": cursor pointer, no visible effect on click (inert).
- Mobile hamburger: inert on the original (Bootstrap JS not wired). Clone: toggles a simple collapse listing the 3 dropdown groups (documented deviation — harmless improvement).
- Mobile person icon button: toggles `.utilitymenu` dropdown (200px wide, right-aligned under button, 1px #ccc border, shadow `0 0 5px 1px rgba(0,0,0,.3)`, items 15px #004990 padding 8px 10px text-align right, hover bg #eee color #0b5191 weight 500).
- Mobile cart button: disabled (opacity .5, cursor not-allowed).

## Hover sweep
- Magenta buttons: bg #af1685 → #d81ba4, transition 0.15s ease-in-out.
- Utility links (Dealer Sign In…): underline on hover.
- Footer links: underline on hover.
- Nav dropdown toggles: color stays #004990 (Bootstrap nav-link hover var), no underline.
- Dropdown items: bg → #f8f9fa.

## Responsive sweep
- ≥1200: container 1140. 992–1199: 960. 768–991: 720. <768: full width w/ 10.5px padding.
- <768: desktop header hidden; fixed mobile navbar shown. Hero background image hidden; instead a `mobile-hero.jpg` (full width) + centered h2 "AutoCheck helps you buy and sell with confidence." (19px/28px bold) above the search card. Search card stacks: inputs & buttons full width.
- Steps: 2 columns (col-md-6 / col-md-5) ≥768, stacked below.
- Benefits: 3 columns ≥768, stacked below.
- Footer: 5 link columns only ≥768; mobile shows only legal links + copyright.
