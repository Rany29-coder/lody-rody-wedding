# Rody & Lody — botanical collection

Ten mobile invitation prototypes based on the user's September reference: warm ivory paper, muted sage botanical art, dusty rose accents, fine borders, and serif typography. The names/date/venue printed on the reference are example content, not replacements for this couple's details.

## Routes and interactions

The home page and `/designs/` show the comparison collection. Each route works as a direct static link:

- `/designs/the-letter/`: rose wax seal releases; top flap rotates on its hinge; ivory invitation rises from the paper pocket.
- `/designs/the-fold/`: two sage paper doors open around a botanical invitation.
- `/designs/the-keepsake/`: linen box lid slides away from a recessed invitation.
- `/designs/the-storybook/`: dusty rose book cover turns; a second page introduces the venue.
- `/designs/the-garden/`: separated arch/foliage layers open around the invitation; a sunlight slider changes illumination and shadow direction.

The depth is CSS perspective and independent 3D transforms controlled by React/JavaScript, not a WebGL model viewer. All ten have click/tap, keyboard opening, swipe-to-open, replay, and reduced-motion support. After opening, the invitation is still and scrollable.

All use Rody first, then Lody; November 7, 2026; Qasr El Dobara Evangelical Church, Cairo. Ceremony time is explicitly unconfirmed. Calendar download is an ALL-DAY date hold, not an invented ceremony time. RSVP remains absent, per the couple's earlier feedback.

Shared journey: scripture and invitation → date and map → guestbook preview → photo previews → closing. Forms clearly disclose that they are local previews, not sent or uploaded. No fake guest messages. Photo object URLs are revoked on removal/unmount, formats and sizes are checked, and previews have a keyboard-closeable native dialog.

## Art assets and prompts

Generated with the built-in image-generation tool, then converted to optimized WebP for the site. Source images remain in the Codex generated-images folder. The reference photo was used for visual direction; its personal content is not copied.

- `public/designs/botanical-paper.webp` (174 KB), generated paper background.
- `public/designs/eucalyptus.webp` (77 KB, alpha preserved), separate foliage for depth layers.

Final paper prompt:

> Create a premium botanical wedding stationery art asset, portrait 2:3. Extremely delicate watercolor eucalyptus branches with muted sage green translucent leaves and tiny dusty rose berries occupying ONLY top left corner and bottom right corner of warm ivory handmade cotton paper (#f6f2ea). Very fine double dusty rose border with inward scalloped corners. Huge EMPTY center (75% of the image) for live HTML typography. No text, no lettering, no monogram. Soft natural fine paper grain, very subtle uneven paint pigment, graceful thin stems, refined European botanical stationery, restrained luxury, like a real high resolution flat scan of artisan watercolor invitation paper. Palette warm off-white, grey sage #83917a, desaturated antique pink #c1a09b. No gold, no shiny objects, no mockup perspective, no extra objects. This is a background texture for five interactive 3D wedding invitation websites.

Final foliage prompt:

> Single slender curved eucalyptus botanical sprig, genuinely transparent background PNG, isolated with no paper, no border, no letters. Vertical 1:2 portrait composition, long thin curved taupe stem grows from bottom left toward upper right with irregular round sage eucalyptus leaves and tiny dusty rose berry clusters. Sophisticated detailed vintage watercolor artwork for wedding stationery, muted desaturated sage and olive greens with visible pigment and subtle paper-like texture WITHIN the leaves only. Leaves must be natural and individually varied with delicate veins, three dimensional shaded folds, botanical accuracy, soft ivory highlights. Around 10 leaves total, airy generous gaps, narrow delicate silhouette. Gentle flowing curve, refined luxury, no cartoon shapes, no thick outlines, no extra flowers. Transparent exterior required.

## Verification

`npm run verify:designs` uses Playwright (install Chromium with `npx playwright install chromium` if necessary). Default target is `http://localhost:3115`; override `DESIGN_BASE_URL` for the GitHub Pages URL including its base path.

Checks all ten openings and replay, keyboard access, book pages, sunlight slider, date/venue text, actual .ics download contents, guestbook preview submission, actual photo selection/lightbox/removal, horizontal overflow at 320/390/768/1440 widths, reduced motion, collection links, and browser console errors. Screenshots go to gitignored `output/design-checks/`.

Build with `GITHUB_PAGES=true npm run build`. GitHub Actions publishes the `out/` directory after a push to main. Existing Rany29-coder repo identity remains in place. No Ekklesia files or services are used by the implementation.

## Couple review round (2026-09-14)

Added five distinct openings: `/designs/the-vellum/` (translucent wrap), `/designs/the-ribbon/` (satin release), `/designs/the-scroll/` (extending parchment), `/designs/the-fan/` (pivoted keepsake cards), and `/designs/the-frame/` (hinged glass display).

The collection is now addressed directly to Rody & Lody as Step 01: choose an opening and overall feel. It offers all/new/shortlist filters, favorites from the collection or individual design pages, notes, and copyable feedback for the couple to send in their own chat. No feedback is sent automatically. The versioned browser-local store uses useSyncExternalStore for SSR-safe hydration and cross-tab changes, validates restored data, and falls back to memory when storage is unavailable. Existing guestbook/photo previews remain distinct and unsaved.

Browser coverage also checks shortlist filters, favorites and notes surviving reload, feedback text/copy UI, and removing favorites.
