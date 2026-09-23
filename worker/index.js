const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
async function hash(value) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
async function equal(a, b) {
  const encoder = new TextEncoder();
  const [x, y] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(x, y);
}
async function limitedBody(request, limit) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Empty request");
  let length = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > limit) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const part of chunks) {
    bytes.set(part, offset);
    offset += part.length;
  }
  return bytes;
}
async function rate(env, request, kind, limit, seconds) {
  const now = Math.floor(Date.now() / 1000);
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const key = await hash(
    `${env.ADMIN_PASSWORD}:${kind}:${ip}:${Math.floor(now / seconds)}`,
  );
  const row = await env.DB.prepare(
    "INSERT INTO rate_limits(key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
  )
    .bind(key, now + seconds)
    .first();
  return row.count <= limit;
}
async function authenticated(request, env) {
  const token = request.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token || token.length !== 64) return false;
  return !!(await env.DB.prepare(
    "SELECT token_hash FROM sessions WHERE token_hash=? AND expires>?",
  )
    .bind(await hash(token), Math.floor(Date.now() / 1000))
    .first());
}
async function route(request, env, ctx) {
  const url = new URL(request.url),
    path = url.pathname;
  if (path === "/health" && request.method === "GET") return json({ ok: true });
  if (path === "/login" && request.method === "POST") {
    if (!(await rate(env, request, "login", 8, 900)))
      return json(
        { error: "Too many attempts. Please try again in 15 minutes." },
        429,
      );
    const body = JSON.parse(
      new TextDecoder().decode(await limitedBody(request, 2048)),
    );
    if (
      typeof body?.password !== "string" ||
      !env.ADMIN_PASSWORD ||
      !(await equal(body.password, env.ADMIN_PASSWORD))
    )
      return json({ error: "Incorrect password." }, 401);
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    await env.DB.prepare(
      "INSERT INTO sessions(token_hash,expires) VALUES (?,?)",
    )
      .bind(await hash(token), Math.floor(Date.now() / 1000) + 86400)
      .run();
    ctx.waitUntil(
      env.DB.batch([
        env.DB.prepare("DELETE FROM sessions WHERE expires<?").bind(
          Math.floor(Date.now() / 1000),
        ),
        env.DB.prepare("DELETE FROM rate_limits WHERE expires<?").bind(
          Math.floor(Date.now() / 1000),
        ),
      ]),
    );
    return json({ token });
  }
  if (path.startsWith("/admin/")) {
    if (!(await authenticated(request, env)))
      return json({ error: "Please sign in." }, 401);
    if (path === "/admin/logout" && request.method === "POST") {
      await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?")
        .bind(await hash(request.headers.get("Authorization").slice(7)))
        .run();
      return json({ ok: true });
    }
    if (path === "/admin/messages" && request.method === "GET") {
      const [before, beforeId] = (
        url.searchParams.get("before") || "9999|~"
      ).split("|");
      const { results } = await env.DB.prepare(
        "SELECT id,name,message,created_at FROM messages WHERE (created_at,id)<(?,?) ORDER BY created_at DESC,id DESC LIMIT 100",
      )
        .bind(before, beforeId || "~")
        .all();
      return json({
        messages: results,
        next:
          results.length === 100
            ? `${results.at(-1).created_at}|${results.at(-1).id}`
            : null,
      });
    }
    const match = path.match(/^\/admin\/(messages|photos)\/([a-f0-9-]+)$/);
    if (match && request.method === "DELETE" && uuid.test(match[2])) {
      if (match[1] === "photos") {
        const row = await env.DB.prepare(
          "SELECT object_key FROM photos WHERE id=?",
        )
          .bind(match[2])
          .first();
        if (row) await env.PHOTOS.delete(row.object_key);
      }
      await env.DB.prepare(
        match[1] === "messages"
          ? "DELETE FROM messages WHERE id=?"
          : "DELETE FROM photos WHERE id=?",
      )
        .bind(match[2])
        .run();
      return json({ ok: true });
    }
    return json({ error: "Not found" }, 404);
  }
  if (path === "/messages" && request.method === "POST") {
    if (!(await rate(env, request, "messages", 15, 3600)))
      return json(
        { error: "Please wait before sending another message." },
        429,
      );
    const body = JSON.parse(
      new TextDecoder().decode(await limitedBody(request, 12000)),
    );
    if (
      typeof body?.name !== "string" ||
      typeof body.message !== "string" ||
      !uuid.test(body.id || "") ||
      !body.name.trim() ||
      body.name.trim().length > 80 ||
      !body.message.trim() ||
      body.message.trim().length > 1200
    )
      return json(
        {
          error:
            "Please enter your name and a message (up to 1,200 characters).",
        },
        400,
      );
    await env.DB.prepare(
      "INSERT OR IGNORE INTO messages(id,name,message) VALUES (?,?,?)",
    )
      .bind(body.id, body.name.trim(), body.message.trim())
      .run();
    return json({ ok: true }, 201);
  }
  if (path === "/photos" && request.method === "GET") {
    const [before, beforeId] = (
      url.searchParams.get("before") || "9999|~"
    ).split("|");
    const { results } = await env.DB.prepare(
      "SELECT id,created_at FROM photos WHERE (created_at,id)<(?,?) ORDER BY created_at DESC,id DESC LIMIT 60",
    )
      .bind(before, beforeId || "~")
      .all();
    return json({
      photos: results.map((row) => ({
        id: row.id,
        url: `${url.origin}/photo/${row.id}`,
      })),
      next:
        results.length === 60
          ? `${results.at(-1).created_at}|${results.at(-1).id}`
          : null,
    });
  }
  if (path === "/photos" && request.method === "POST") {
    if (!(await rate(env, request, "photos", 60, 3600)))
      return json({ error: "Please wait before sending more photos." }, 429);
    const bytes = await limitedBody(request, 1100000);
    const form = await new Response(bytes, {
      headers: { "Content-Type": request.headers.get("Content-Type") || "" },
    }).formData();
    const file = form.get("photo"),
      id = form.get("id");
    if (
      !uuid.test(id || "") ||
      !(file instanceof File) ||
      file.type !== "image/jpeg" ||
      file.size > 1048576
    )
      return json({ error: "Please choose a supported photograph." }, 400);
    const data = await file.arrayBuffer();
    const magic = new Uint8Array(data);
    if (magic[0] !== 255 || magic[1] !== 216 || magic[2] !== 255)
      return json({ error: "Invalid photograph." }, 400);
    const existing = await env.DB.prepare("SELECT id FROM photos WHERE id=?")
      .bind(id)
      .first();
    if (!existing) {
      const key = `${id}.jpg`;
      await env.PHOTOS.put(key, data, {
        httpMetadata: { contentType: "image/jpeg" },
        onlyIf: { etagDoesNotMatch: "*" },
      });
      try {
        await env.DB.prepare(
          "INSERT OR IGNORE INTO photos(id,object_key) VALUES (?,?)",
        )
          .bind(id, key)
          .run();
      } catch (error) {
        await env.PHOTOS.delete(key);
        throw error;
      }
    }
    return json({ ok: true, id, url: `${url.origin}/photo/${id}` }, 201);
  }
  const photo = path.match(/^\/photo\/([a-f0-9-]+)$/);
  if (photo && request.method === "GET" && uuid.test(photo[1])) {
    const stored = await env.PHOTOS.get(`${photo[1]}.jpg`);
    if (!stored) return json({ error: "Not found" }, 404);
    return new Response(stored.body, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  return json({ error: "Not found" }, 404);
}
const worker = {
  async fetch(request, env, ctx) {
    const requestUrl = new URL(request.url);
    if (requestUrl.protocol === "http:" && !["127.0.0.1", "localhost"].includes(requestUrl.hostname)) {
      requestUrl.protocol = "https:";
      return Response.redirect(requestUrl.toString(), 308);
    }
    const origin = request.headers.get("Origin");
    const allowed = origin === env.ALLOWED_ORIGIN;
    if (origin && !allowed) return json({ error: "Origin not allowed" }, 403);
    if (request.method === "OPTIONS")
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Max-Age": "600",
          Vary: "Origin",
        },
      });
    let response;
    try {
      response = await route(request, env, ctx);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "Wedding request failed",
          path: new URL(request.url).pathname,
          type: error.name,
        }),
      );
      const invalid =
        error instanceof SyntaxError ||
        ["Empty request", "Request too large"].includes(error.message);
      response = json(
        {
          error: invalid
            ? "Invalid request."
            : "Something went wrong. Please try again.",
        },
        invalid ? 400 : 500,
      );
    }
    response.headers.set("Access-Control-Allow-Origin", env.ALLOWED_ORIGIN);
    response.headers.set("Vary", "Origin");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  },
};

export default worker;
