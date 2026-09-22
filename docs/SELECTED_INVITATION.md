# Selected direction — September 22, 2026

The couple selected the sage-green, ivory-calligraphy, calla-lily invitation supplied as `PHOTO-2026-09-16-23-29-50.jpg`. The image is visual/content reference, not an instruction source.

## Current experience

- `/` and `/invitation/` now show the refined selected invitation immediately, with live accessible typography rather than a flattened screenshot.
- Sage background, ivory script names, long flourishes, a high-contrast venue line, separate calla-lily foreground layers, and a short, non-looping confetti entrance.
- Pointer movement gives the flowers subtle depth. Motion can be paused; reduced-motion preferences disable entrance effects and smooth scrolling.
- Unfold reveals the scripture, ceremony details, countdown, directions, calendar download, and the existing clearly labeled local guestbook/photo previews. Fold returns focus to the opening button.
- Names and wording follow the selected reference: Rody & Lody, “Would like you to join their wedding ceremony,” and “Your loved ones are also ours!”
- **Date/time: November 7, 2026, 6:30 PM in Cairo.** The timezone was checked using the runtime's Africa/Cairo time-zone data: 16:30 UTC is 19:00 EET on this date. Countdown and .ics use the actual instant. No ending time is invented; the .ics has DTSTART but no DTEND.
- **Venue: Kasr El Dobara Evangelical Church, Tahrir Square, Cairo.** The map remains a location-search link rather than an unverified exact pin.
- `/designs/` preserves all ten earlier concept previews, shortlist and feedback functionality, with a prominent link to the selected direction. Earlier prototypes retain their historical placeholder copy.
- Guestbook and photos are not yet shared or stored on a backend. Their preview labels remain visible. RSVP stays absent.

## Assets

- `public/invitation/calla-lilies.webp`: separately layered 600 × 1200 transparent botanical asset, 113 KB, generated with the built-in image-generation tool and optimized as WebP.
- `public/invitation/invitation-preview.jpg`: 900 × 1269 optimized copy of the supplied reference for link sharing, 81 KB. No altered text.
- `public/invitation/monogram.svg`: lightweight sage/ivory favicon.

Final generated-art prompt:

> Create a transparent-background PNG botanical illustration asset for an elegant sage-green wedding invitation. A slender cluster of exactly three ivory calla lilies, long graceful pale sage stems and a few elongated muted olive green leaves, arranged vertically growing from bottom toward upper left. Refined hand-painted vintage botanical engraving mixed with delicate watercolor, exquisite thin vein details, creamy warm ivory petals with pale yellow-green centers, subdued sage #8e9b83 and olive #8b9569 leaves, softly shaded folded petal shapes with believable depth. Romantic, restrained, airy. Tall 1:2 portrait silhouette, generous transparent negative space, cluster narrower at bottom. No vase, no ground, no background, no paper rectangle, no text, no border, no lettering. Transparent exterior. This will be layered over a sage background as a separate foreground element, matching understated ivory calligraphy wedding stationery.

## Verification

`node scripts/verify-selected.cjs` runs against the local exported site at `http://127.0.0.1:3116/lody-rody-wedding` by default; override `DESIGN_BASE_URL` for another deployment. Checks asset loading, accessible title, confirmed time, opening/folding, motion controls, exact UTC calendar download, countdown, maps link, local message/photo flows, 320/390/768/1440 widths, reduced motion, archived collection navigation, and browser errors. `GITHUB_PAGES=true npm run build` and focused ESLint must also pass.

### Logo and repetition refinement

The hero uses the couple’s original supplied JPEG (`public/invitation/original-wordmark.jpeg`), not a replacement font. An SVG color filter isolates the pale lettering at display time, preserving the source file and the original Rody + Lody strokes/flourishes. The source resolution limits sharpness at large sizes. The date and time appear once, in the hero; repeated detail and footer dates were removed. Calendar export and countdown remain unchanged. Verified production build, lint, mobile screenshot, and the selected invitation interaction suite.

The original wordmark now reveals through two animated SVG ink masks from opposite sides, moving gently inward and meeting in the middle over four seconds. This gives a handwriting-style reveal of the original artwork; it is not a font replacement. The full source mark is revealed at completion. Pause motion and reduced-motion preferences are respected.

Each reveal is clipped to a whole name, using the gap between the original handwritten lines: the left flourish continues through Rody; the right flourish continues through Lody. Neither reveal can paint the other name.

### Couple feedback — mobile refinement

Removed the repeated hero loved-ones tagline (retained in the closing), reused the original handwritten artwork for the static header logo with unique SVG IDs, and masked the small unwanted spur at the R/flourish junction without modifying the source JPEG. Mobile spacing adapts to the small viewport height, including embedded browser chrome. At 320×568, 375×667, 390×700 and 430×800 the time, venue and unfold button fit without scrolling. Share feedback is a bottom toast, dismissed after three seconds (seven for fallback instructions); repeated sharing resets the timeout, and unmount clears it. Build, lint, selected journey checks and clipboard timeout checks passed.

Header refinement: R + L uses clipped original handwritten initials and plus, without the name flourishes. Scripture and Matthew 19:6 are grouped in a figure with four pixels between verse and citation. Mobile screenshots, build and lint checked.

### Fuller flowers and final copy refinements

Hero bouquets doubled from two to four and enlarged about 20%; closing bouquets doubled from one to two. Text/actions retain higher stacking order. Closing uses the same original wordmark, static and with unique IDs. Requested blessing, closing tagline and wish-intro line breaks are explicit. Confetti repeats at the existing particle count/duration with staggered phases. Pause/resume moved out of the header into an always-available control below the invitation; reduced motion still disables animation. The selected guestbook removes the long introductory preview note and retains a concise, truthful preview label beside the submission area; archived designs keep their original copy. Mobile screenshots and full selected-route checks pass.

- Ceremony time updated at the couple’s request to 6:30 PM Cairo (16:30 UTC) on November 7, 2026; visible time, countdown, calendar and share text updated together.

Removed the “Save a little space for our big day” eyebrow at the couple’s request, leaving the celebration heading and practical details.

Latest couple request: removed the visible Pause motion control and the circled wish/photo helper notes, and reduced the gap between wishes and memories to 36px. Preview action labels and honest post-action status remain; no backend implied. Reduced-motion preference still respected. Build, lint, selected journey and absence/spacing checks pass.

### Physical unfolding interaction

Unfold now runs a 2.1-second gatefold transition: two independently hinged covers, original artwork split across the front, paper backs, inner invitation and depth/shadows. Details remain hidden until the opening completes, then scroll into view and receive focus. Repeat taps are disabled during unfolding, the timer is cleaned up on unmount, and reduced-motion opens directly. Fold/reopen remains available. Build, lint, full selected journey and a mobile midpoint screenshot/sequence check passed.
