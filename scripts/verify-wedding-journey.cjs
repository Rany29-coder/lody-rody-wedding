/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const privateMessage = `Private verification ${crypto.randomUUID()}`;
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await context.route(
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
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3116/lody-rody-wedding/");
  await page.getByRole("button", { name: "Open the invitation" }).click();
  await page
    .getByLabel("Your name", { exact: true })
    .fill("Journey verification");
  await page
    .getByLabel("Your wish", { exact: true })
    .fill(privateMessage);
  await page.locator("#your-wishes button[type=submit]").click();
  await page.getByText("Sent with love.", { exact: false }).waitFor();
  assert.equal(
    await page
      .getByText(privateMessage, { exact: true })
      .count(),
    0,
  );
  await page
    .getByLabel("Choose photographs")
    .setInputFiles("public/invitation/calla-lilies.webp");
  await page.locator(".pending-photos img").waitFor();
  await page.locator(".photo-send").click();
  await page.locator(".shared-gallery img").first().waitFor();
  await page.locator(".shared-gallery button").first().click();
  assert(await page.locator("dialog").isVisible());
  await page.keyboard.press("Escape");
  await page
    .locator("#memories")
    .screenshot({ path: "output/design-checks/real-gallery.png" });
  const admin = await context.newPage();
  await admin.goto("http://127.0.0.1:3116/lody-rody-wedding/couple/");
  assert.equal(await admin.locator(".private-wishes").count(), 0);
  await admin
    .getByLabel("Password")
    .fill(JSON.parse(fs.readFileSync("output/couple-access.json")).password);
  await admin.getByRole("button", { name: "Sign in", exact: true }).click();
  await admin
    .getByText(privateMessage, { exact: true })
    .waitFor();
  await admin.screenshot({ path: "output/design-checks/private-inbox.png" });
  await admin.getByRole("button", { name: "Sign out" }).click();
  await admin.getByLabel("Password").waitFor();
  await context.unrouteAll({ behavior: "ignoreErrors" });
  await browser.close();
  console.log(
    "PASS browser journey: Send private wish, persistent gallery, lightbox, separate protected inbox and sign out. Local test data only.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
