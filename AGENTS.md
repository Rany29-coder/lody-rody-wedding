<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Wedding design collection (2026-09-14)

- `/designs/` is the archived ten-design couple review page. Ten statically generated routes live at `/designs/[slug]/`; catalog and scoped CSS are in `app/components/designs/`.
- Read `docs/DESIGN_COLLECTION.md` for design interactions, generated-art prompts, limitations, and verification commands.
- All new concepts use ivory/sage/dusty rose from the user's reference. Keep Rody first, November 7, 2026, KDEC in Cairo. The new selected invitation confirms 6:30 PM Cairo time; old concept routes are historical previews.
- RSVP is intentionally absent. Guestbook and photo interactions are explicitly labeled local design previews. Do not imply shared persistence before a backend is implemented.
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
