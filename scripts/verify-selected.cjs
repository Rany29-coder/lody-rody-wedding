/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base =
  process.env.DESIGN_BASE_URL || "http://127.0.0.1:3116/lody-rody-wedding";
(async () => {
  fs.mkdirSync("output/design-checks", { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  if (base.includes("127.0.0.1"))
    await page.route(
      "https://rody-lody-wedding-api.lody-rody-wedding.workers.dev/**",
      async (route) => {
        const response = await route.fetch({
          url: route
            .request()
            .url()
            .replace(
              "https://rody-lody-wedding-api.lody-rody-wedding.workers.dev",
              "http://127.0.0.1:8787",
            ),
        });
        await route.fulfill({ response });
      },
    );
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const response = await page.goto(base + "/", { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(
    await page.locator("h1").getAttribute("aria-label"),
    "Rody and Lody",
  );
  assert.match(await page.locator(".sage-time").innerText(), /6:30 PM/);
  assert.equal(
    await page
      .locator(".lilies-left")
      .first()
      .evaluate((e) => e.complete && e.naturalWidth > 0),
    true,
  );
  await page.screenshot({
    path: "output/design-checks/selected-mobile.png",
    fullPage: true,
  });
  assert.equal(await page.locator("#our-invitation").isVisible(), false);
  assert.equal(
    await page
      .getByRole("button", { name: "Pause motion", exact: true })
      .count(),
    0,
  );
  await page.getByRole("button", { name: "Open the invitation" }).tap();
  await page.locator("#our-invitation").waitFor({ state: "visible" });
  assert.equal(await page.locator("#our-invitation").isVisible(), true);
  await page.screenshot({ path: "output/design-checks/selected-unfolded.png" });
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Add to my calendar" }).click();
  const file = await download;
  const ics = fs.readFileSync(await file.path(), "utf8");
  assert.match(ics, /DTSTART:20261107T163000Z/);
  assert.doesNotMatch(ics, /DTEND/);
  assert.match(ics, /Tahrir Square/);
  assert.match(
    await page
      .getByRole("link", { name: "Directions to the church" })
      .getAttribute("href"),
    /maps/,
  );
  const expected = Math.max(
    0,
    Math.floor((Date.parse("2026-11-07T16:30:00Z") - Date.now()) / 86400000),
  );
  assert.equal(
    Number(await page.locator(".sage-countdown strong").first().innerText()),
    expected,
  );
  assert.equal(await page.locator(".sage-header svg").count(), 0);
  assert.equal(
    await page.locator('#your-wishes button[type="submit"]').innerText(),
    "Send",
  );
  await page
    .getByLabel("Choose photographs")
    .setInputFiles("public/invitation/calla-lilies.webp");
  await page.locator(".pending-photos img").waitFor();
  assert.equal(await page.locator(".pending-photos img").count(), 1);
  await page
    .getByRole("button", { name: "Fold the invitation closed" })
    .click();
  assert.equal(await page.locator("#our-invitation").isVisible(), false);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.getByRole("button", { name: "Open the invitation" }).click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page
      .getByRole("button", { name: "Fold the invitation closed" })
      .click();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "output/design-checks/selected-desktop.png",
    fullPage: true,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Open the invitation" }).click();
  assert.equal(
    await page
      .locator(".unfolded-paper")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.equal(await page.locator(".sage-confetti").isVisible(), false);
  await page.goto(base + "/designs/", { waitUntil: "networkidle" });
  assert.equal(await page.locator(".concept-preview").count(), 10);
  await page.getByRole("link", { name: /see the refined invitation/ }).click();
  await page.waitForURL("**/invitation/");
  assert.match(page.url(), /\/invitation\//);
  assert.equal(
    await page.locator("h1").getAttribute("aria-label"),
    "Rody and Lody",
  );
  assert.deepEqual(errors, []);
  await page.unrouteAll({ behavior: "ignoreErrors" });
  await browser.close();
  console.log(
    "PASS: chosen design, artwork, unfolding, reduced motion, timed Cairo calendar, countdown, directions, guest forms/photo preparation, 320–1440px layouts, archived collection, zero browser errors.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
