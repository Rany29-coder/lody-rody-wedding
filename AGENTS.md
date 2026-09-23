<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Wedding design collection (2026-09-14)

- `/designs/` is the archived ten-design couple review page. Ten statically generated routes live at `/designs/[slug]/`; catalog and scoped CSS are in `app/components/designs/`.
- Read `docs/DESIGN_COLLECTION.md` for design interactions, generated-art prompts, limitations, and verification commands.
- All new concepts use ivory/sage/dusty rose from the user's reference. Keep Rody first, November 7, 2026, KDEC in Cairo. The new selected invitation confirms 6:30 PM Cairo time; old concept routes are historical previews.
- RSVP is intentionally absent. Archived guestbook and photo interactions are local previews. The selected invitation has a real Cloudflare backend; see below.
- `npm run verify:designs` verifies all concepts; `GITHUB_PAGES=true npm run build` tests the deployed base path.

- Couple review: `ReviewCollection.tsx` and `useReviewStore.ts` provide browser-local favorites/notes and explicit copy-to-chat feedback. No messages are automatically sent. The collection is Step 01: choose the opening/feel before developing the next stages.

## Selected invitation (2026-09-22)

- `/` and `/invitation/` now serve the chosen sage/ivory/calla-lily design. See `docs/SELECTED_INVITATION.md` for implementation, asset prompts and verification.
- Wedding time is **2026-11-07T18:30:00+02:00** (16:30 UTC). Venue: Kasr El Dobara Evangelical Church, Tahrir Square, Cairo. Do not invent an end time.
- Live accessible text, layered art, continuous confetti, unfolding details, reduced-motion controls, native share with clipboard fallback, timed .ics, and a real countdown. `node scripts/verify-selected.cjs` checks this route separately from the archived collection.

- Hero wordmark uses the supplied original JPEG through an SVG ink filter; do not replace with a script font. Date/time are displayed only in the hero (calendar/countdown retained).

- Mobile hero adapts to small viewport height; keep date/time/venue and unfold action visible on 320×568. Original artwork is reused in the header, with unique SVG IDs and no animation there. Share feedback clears automatically.

- Floral update: four larger hero bouquets, two closing bouquets; closing reuses static original wordmark. Confetti loops; pause/resume is below the invitation. Selected guestbook uses `refined` layout while keeping its local-preview status clear.

- Ceremony time updated at the couple’s request to 6:30 PM Cairo (16:30 UTC) on November 7, 2026; visible time, countdown, calendar and share text updated together.

- Latest cleanup: visible pause control removed at user request; OS reduced-motion remains supported. Circled helper notes removed from selected forms; action labels and post-action status still accurately describe local previews. Gap between wishes and memories reduced.

- Unfold uses a 3-second two-panel 3D paper transition before revealing/focusing details; reduced-motion skips it. Tests must wait for details visibility instead of a fixed short sleep.

- Continuous opening refinement: after the panels open, the card zooms to fill the viewport. Details are positioned underneath at 1.8s while the cover is opaque; the final crossfade reveals the page without a separate scroll/cut. Zoom adapts to viewport size. Verified sequence and full selected-route checks.

## Current selected implementation — 2026-09-23

Supersedes earlier selected-preview notes: real private wishes (Worker/D1, authenticated `/couple/`), public R2 photo gallery after Send, no header logo, explicit intro line breaks. Envelope flap + sliding invitation replaces gatefold; zoom/crossfade and reduced motion remain. See docs/SELECTED_INVITATION.md for deployment, security and verification. Never commit credentials under output/ or worker/.dev.vars. Backend resources are independent of Ekklesia.
