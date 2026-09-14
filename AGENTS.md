<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Wedding design collection (2026-09-14)

- `/` and `/designs/` are the five-design comparison page. Five statically generated routes live at `/designs/[slug]/`; catalog and scoped CSS are in `app/components/designs/`.
- Read `docs/DESIGN_COLLECTION.md` for design interactions, generated-art prompts, limitations, and verification commands.
- All new concepts use ivory/sage/dusty rose from the user's reference. Keep Rody first, November 7, 2026, KDEC in Cairo. The ceremony time is unconfirmed; date-hold calendar download must stay all-day until confirmed.
- RSVP is intentionally absent. Guestbook and photo interactions are explicitly labeled local design previews. Do not imply shared persistence before a backend is implemented.
- `npm run verify:designs` verifies all concepts; `GITHUB_PAGES=true npm run build` tests the deployed base path.
