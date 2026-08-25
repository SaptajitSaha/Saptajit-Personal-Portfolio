# Audit Evidence Notes — 24 August 2026

## Desktop baseline

- The page reads as a sequence of large, similarly bordered liquid-glass panels. The hero, signal strip, work section, learning section, about section, tools section, and reach-out section all use strong framed containers, which weakens hierarchy after the first screen.
- The fixed floating navigation is absent in the full-page capture’s top area, suggesting its presentation depends on the capture state and needs direct interaction verification rather than a static screenshot alone.
- The work section introduces a dense three-card cluster immediately after a separate signal-strip card. Nidarr is visually distinctive, but the two secondary projects repeat a similar dark card and small meta-label treatment.
- Small mono copy is used broadly for labels, controls, metadata, and tool chips; it appears visually compressed beside very large display type.

## Mobile baseline

- At 390px, the lower navigation is not visible in a full-page capture, so its actual persistent overlay and safe-area behavior need direct viewport interaction inspection.
- The hero and orbit become vertically stacked and retain their decorative depth. This is compelling, but it pushes primary content density higher before the work section.
- Secondary project cards become tall, text-forward blocks; repeated small labels and the low-contrast description text are more difficult to scan.
- The learning list becomes compact and structurally clearer than the project cards, but the number/title/explore hierarchy is likely sensitive to its small mono labels.
- The about, tools, and reach-out sections carry the same heavy glass outline, leading to reduced section differentiation over a long scroll.

## Remediation validation

The revised desktop composition preserves the hero and featured work as intentional glass focal points while allowing the learning and tools regions to sit more quietly on the signal field. The Nidarr disclosure now has a distinct elevated control surface rather than visually merging into the product-stage controls.

At the narrow mobile breakpoint, the page retains a single-column reading order without horizontal overflow. The carousel controls have more generous visual room, the featured disclosure remains visually separated from the active product media, and the lighter learning/tools framing improves the long-scroll rhythm.

## Live deployment validation

The live Vercel deployment served the liquid-glass navigation after the first-load handoff. Direct browser interaction confirmed the Work link updated the URL fragment, completed the section scroll, retained the fixed navigation, and showed the active navigation state.

Production Playwright checks passed for desktop and mobile liquid-glass navigation, navigation persistence, mobile placement, reduced-motion fallback, case-study disclosure open/close behavior, learning-topic single-open behavior, keyboard toggles, ripple cleanup, and reduced-motion disclosure behavior.

## Compact navigation refinement

The revised desktop navigation is visually smaller and quieter while retaining a clear active state. Its labels now use the portfolio’s sans display treatment rather than the former monospaced utility styling. On mobile, the reduced-width control strip stays legible, keeps every link at a 44px minimum control height, and remains comfortably offset above the safe-area edge.

## IIT Madras emblem asset

The requested IIT Madras emblem now uses a publicly reachable 600 × 600 color CDN image for the hero mark, footer mark, and favicon. This replaces the Manus preview-only storage path while retaining the vermilion outer ring, gold field, white lamp, and red lotus on the portfolio’s dark brand surface.

## Visual-editor refinement validation

Desktop verification confirms the further-compacted navigation remains centered and readable; its active Home item carries the requested small white rounded cap above the existing liquid highlight. The IIT Madras emblem appears cleanly at the hero mark. Mobile verification confirms the floating navigation remains bottom-positioned with the active cap visible, while the hero retains comfortable breathing room and no horizontal overflow was observed.

## Vercel asset-delivery correction

Live Vercel inspection confirmed that the deployed `/manus-storage/iitm-madras-emblem_ce837c30.png` path does not resolve as an image outside the Manus preview environment. The final replacement is a publicly reachable 600 × 600 color IIT Madras emblem served from a direct `files.manuscdn.com` CDN URL. The image request returns `200 image/png` and is used consistently for the hero mark, footer mark, and favicon.

The initial black-and-white public SVG replacement was reachable but did not provide the required visible emblem treatment on the portfolio’s dark mark surface. The final color emblem retains its vermilion outer ring, gold field, white lamp, and red lotus at compact hero and footer mark sizes.

After the user redeployed GitHub commit `8055bc3` on Vercel, the live portfolio served the final `files.manuscdn.com` color PNG rather than either the former Manus storage URL or the monochrome Wikimedia SVG. Direct desktop inspection confirmed the small hero emblem is visible and colored on the dark liquid-glass surface.

The deployed liquid-glass navigation, disclosure motion, and reach-out regression checks also passed after the branding redeployment.

## Visual-editor correction pass

The revised IIT Madras emblem now uses a transparent-background PNG on its public CDN route for the shared hero mark, footer mark, and favicon. The mark receives a circular clip as an additional guard against background artifacts. Hero, work, learning, about, tools, and reach-out display headings now use less-constricted tracking while preserving their existing editorial hierarchy. The orbital scene exposes a mouse-only paused state, pauses on pointer enter or movement, resumes on leave or cancel, and keeps its reduced-motion behavior unchanged. Desktop and 390 px mobile captures, 15 unit tests, the interaction regression, type checking, and the production build all passed.

## Signal-thread layering correction

The long orange signal thread now follows a dedicated outer rail: 16 px from the viewport on smaller screens and 12 px outside the centered 1400 px content width on larger displays. This keeps the accent continuous while preventing it from crossing the translucent signal strip or selected-work/learning surfaces. Desktop, 817 px transition, 16-unit-test, type-check, and production-build verification passed.

## Nidarr case-study control correction

The Nidarr case-study affordance now uses only its natural 40 px trigger height in the closed state rather than a second oversized framed card. Its content switches between `display: none` and `display: block` without disclosure or chevron animation, while retaining the same semantic Radix trigger and keyboard behavior. Closed and expanded local browser checks, 17 unit tests, the interaction regression, type checking, and production build passed.

## Disclosure bounce stabilization

Project and lesson disclosures now use direct open/closed display states with no grid-height expansion, transform scale, ripple, or icon-transition effects. The open lesson card also no longer alters its own padding, margin, border, or background, removing the source of page-level bounce. Semantic Radix buttons and keyboard activation remain intact. Repeated interaction checks, 18 unit tests, type checking, and the production build passed.

## iPhone-style disclosure motion refinement

The project and lesson panels now use a compact, reversible iOS-native `cubic-bezier(.32,.72,0,1)` continuity curve: 280 ms for the container and a smaller -2 px content settle. It avoids ripple, scale, layout-card resizing, and overshoot. Keyboard-focused and reduced-motion paths remain immediate. Rapid interaction regression, desktop/mobile review, 19 unit tests, type checking, and the production build passed.

## Disclosure animation rollback

At the user's request, the iPhone-style disclosure override was removed. Project and lesson controls are restored to direct, instant open/closed states with no ripple, scale, chevron, grid-height, or content animation. Pointer and keyboard semantics remain intact. Desktop review, 18 unit tests, interaction regression, type checking, and the production build passed.

## Mobile project and lesson readability refinement

On phones, Nidarr now follows a copy-then-media order rather than competing with its carousel in a fixed-height overlay. The project copy uses more comfortable body rhythm, a 48 px case-study trigger, and a separate 430 px media panel. Lesson controls now provide a 78 px two-row touch target, keeping the topic label, state cue, and chevron distinct; expanded detail text uses the full available width at 15 px. 390 px and 320 px captures showed no horizontal overflow. Nineteen unit tests, interaction regression, type checking, and the production build passed.

## Nidarr mobile preview spacing correction

The leftover 940 px mobile `project-card__content` minimum height from the former overlay composition was removed. Nidarr’s preview now follows immediately after the case-study control instead of being separated by a reserved blank area. The 390 px and 320 px captures confirm the tighter transition without overflow; 20 unit tests, interaction regression, type checking, and the production build passed.
