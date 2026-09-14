const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.DESIGN_BASE_URL || "http://localhost:3115";
const slugs = [
  "the-letter",
  "the-fold",
  "the-keepsake",
  "the-storybook",
  "the-garden",
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const results = [];
  for (const slug of slugs) {
    await page.goto(`${base}/designs/${slug}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `output/design-checks/${slug}-closed.png` });
    assert.equal(await page.locator("#wedding-details").isVisible(), false);
    await page.locator(".opening-controls .primary-action").click();
    await page.waitForTimeout(1900);
    assert.equal(await page.locator("#wedding-details").isVisible(), true);
    await page.screenshot({ path: `output/design-checks/${slug}-open.png` });
    if (slug === "the-storybook") {
      await page.getByRole("button", { name: "Turn to the day" }).click();
      assert.match(
        await page.locator(".book-page-copy").innerText(),
        /Meet us/,
      );
      await page.getByRole("button", { name: "Back to our story" }).click();
    }
    if (slug === "the-garden") {
      await page.getByLabel("Move the sunlight").fill("80");
      assert.match(await page.locator(".scene").getAttribute("style"), /80%/);
    }
    await page.getByRole("button", { name: "Discover the day" }).click();
    await page.locator("#invitation").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `output/design-checks/${slug}-invitation.png`,
    });
    assert.match(
      await page.locator("#the-day").innerText(),
      /time to be confirmed/,
    );
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Save the date" }).click();
    const download = await downloadPromise;
    const content = fs.readFileSync(await download.path(), "utf8");
    assert.match(content, /DTSTART;VALUE=DATE:20261107/);
    await page.getByLabel("Your name", { exact: true }).fill("Test guest");
    await page
      .getByLabel("Your wish", { exact: true })
      .fill("Wishing you a wonderful life together.");
    await page.getByRole("button", { name: "Preview your wish" }).click();
    assert.match(await page.locator(".wishes-list").innerText(), /Test guest/);
    await page
      .getByLabel("Add photo previews")
      .setInputFiles("public/designs/botanical-paper.webp");
    assert.equal(await page.locator(".photo-grid img").count(), 1);
    await page
      .getByRole("button", { name: "View botanical-paper.webp", exact: true })
      .click();
    assert.equal(await page.locator("dialog").isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").isVisible(), false);
    await page
      .getByRole("button", { name: "Remove botanical-paper.webp" })
      .click();
    assert.equal(await page.locator(".photo-grid img").count(), 0);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.locator(".opening-controls .primary-action").click();
    assert.equal(await page.locator("#wedding-details").isVisible(), false);
    await page.locator(".object-tilt").tap();
    assert.equal(await page.locator("#wedding-details").isVisible(), true);
    await page.locator(".opening-controls .primary-action").click();
    await page.locator(".object-tilt").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#wedding-details").isVisible(), true);
    results.push(
      `${slug}: opening/replay, keyboard, details, calendar, guestbook, gallery, no overflow PASS`,
    );
  }
  await page.goto(`${base}/designs/`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".concept-preview").count(), 5);
  await page.screenshot({
    path: "output/design-checks/collection-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "output/design-checks/collection-desktop.png",
    fullPage: true,
  });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of slugs) {
      await page.goto(`${base}/designs/${slug}/`, { waitUntil: "networkidle" });
      await page.locator(".opening-controls .primary-action").click();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${slug} ${width} overflow`,
      );
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/designs/the-fold/`);
  await page.locator(".opening-controls .primary-action").click();
  assert.equal(await page.locator("#wedding-details").isVisible(), true);
  assert.equal(
    await page
      .locator(".left-gate")
      .evaluate((e) => getComputedStyle(e).transitionDuration),
    "0s",
  );
  await browser.close();
  assert.deepEqual(errors, []);
  console.log(results.join("\n"));
  console.log(
    "Collection, responsive widths 320/390/768/1440, reduced motion, zero browser errors PASS",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
