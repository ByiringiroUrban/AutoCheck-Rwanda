# Page topology (desktop 1440, total height 2608px)

| # | Section | Component | y / height | Interaction |
|---|---------|-----------|-----------|-------------|
| 1 | Header (utility bar + logo + 3 dropdowns; mobile fixed navbar) | `SiteHeader.tsx` | 0 / 125 | click (dropdowns) |
| 2 | Hero w/ search card | `HeroSearch.tsx` | 125 / 471 | click (validation) |
| 3 | "Get The AutoCheck Report" steps + report image | `StepsSection.tsx` | 617 / 511 | static |
| 4 | Benefits card (3 columns) | `BenefitsSection.tsx` | 1128 / 473 | hover only |
| 5 | KeySavvy banner + partners logos | `PartnersSection.tsx` | 1615 (mt 14) / 539 (+42 mb) | static |
| 6 | Footer (dark) | `SiteFooter.tsx` | 2204 / 404 (margin-top 50) | hover only |

Layout: single column flow, no scroll container. `header` has `box-shadow: 0 5px 10px rgba(0,0,0,.35)`, position relative, z-index 1 so its shadow overlays the hero.
Assembly: `<SiteHeader/><main><HeroSearch/><StepsSection/><BenefitsSection/><PartnersSection/></main><SiteFooter/>`.
