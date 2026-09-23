/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const root = process.env.API_URL || "http://127.0.0.1:8787";
(async () => {
  const request = (path, options = {}) => fetch(root + path, options);
  const post = (body) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.equal((await request("/admin/messages")).status, 401);
  assert.equal((await request("/messages")).status, 404);
  assert.equal((await request("/messages", post(null))).status, 400);
  assert.equal(
    (await request("/login", post({ password: "incorrect" }))).status,
    401,
  );
  const { password } = JSON.parse(fs.readFileSync("output/couple-access.json"));
  const login = await request("/login", post({ password }));
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const headers = { Authorization: `Bearer ${token}` };
  const id = crypto.randomUUID(),
    photoId = crypto.randomUUID();
  try {
    assert.equal(
      (
        await request(
          "/messages",
          post({
            id,
            name: "Verification guest",
            message: "Private verification <script>test</script>",
          }),
        )
      ).status,
      201,
    );
    assert.equal(
      (
        await request(
          "/messages",
          post({
            id,
            name: "Verification guest",
            message: "Private verification <script>test</script>",
          }),
        )
      ).status,
      201,
    );
    const data = await (await request("/admin/messages", { headers })).json();
    assert.equal(data.messages.filter((m) => m.id === id).length, 1);
    const form = new FormData();
    form.set("id", photoId);
    form.set(
      "photo",
      new Blob(
        [fs.readFileSync("public/invitation/invitation-share-630.jpg")],
        { type: "image/jpeg" },
      ),
      "test.jpg",
    );
    const upload = await request("/photos", { method: "POST", body: form });
    assert.equal(upload.status, 201, await upload.text());
    const gallery = await (await request("/photos")).json();
    assert(gallery.photos.some((p) => p.id === photoId));
    assert(!JSON.stringify(gallery).includes("Private verification"));
    assert.equal((await request("/photo/" + photoId)).status, 200);
    assert.equal(
      (
        await request("/admin/messages", {
          headers: { Authorization: "Bearer " + "0".repeat(64) },
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await request("/messages", {
          ...post({ id: crypto.randomUUID(), name: "x", message: "x" }),
          headers: {
            Origin: "https://example.org",
            "Content-Type": "application/json",
          },
        })
      ).status,
      403,
    );
  } finally {
    await request("/admin/messages/" + id, { method: "DELETE", headers });
    await request("/admin/photos/" + photoId, { method: "DELETE", headers });
    await request("/admin/logout", { method: "POST", headers });
  }
  assert.equal((await request("/admin/messages", { headers })).status, 401);
  console.log(
    "PASS: private message storage, authenticated reads, idempotency, public photo persistence, origin protection and session revocation; test data removed.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
