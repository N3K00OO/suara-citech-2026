import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

const port = 4300 + Math.floor(Math.random() * 500);
const origin = `http://127.0.0.1:${port}`;
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Next.js production server did not become ready");
}

test.before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    stdio: "ignore",
  });
  await waitForServer();
});

test.after(() => server?.kill());

test("renders every public route and critical static asset", async () => {
  const checks = [
    ["/", /Ikuti satu suara sampai kebijakan berubah/],
    ["/product", /Jejak kebijakan/],
    ["/consultations", /Temukan rancangan yang memengaruhi kehidupan Anda/],
    ["/responses", /Jejak yang tetap dapat diperiksa/],
    ["/artworks/blok-m-mobility/index.html", /Blok M — Live Mobility/],
    ["/suara-mark.svg", /<svg/],
  ];

  for (const [pathname, expected] of checks) {
    const response = await fetch(`${origin}${pathname}`);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected, pathname);
  }

  const icon = await fetch(`${origin}/suara-icon.png`);
  assert.equal(icon.status, 200);
  assert.match(icon.headers.get("content-type") ?? "", /^image\/png/);
});
