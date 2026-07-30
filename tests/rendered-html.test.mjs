import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the SUARA landing experience", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /SUARA/);
  assert.match(html, /Ikuti satu suara sampai kebijakan berubah/);
  assert.match(html, /Sebuah kebijakan akan mengubah cara kawasan ini bergerak/);
  assert.match(html, /Buka prototipe produk/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("renders every public product surface", async () => {
  const routes = [
    ["/product", /Jejak kebijakan/],
    ["/consultations", /Temukan rancangan yang memengaruhi kehidupan Anda/],
    ["/responses", /Jejak yang tetap dapat diperiksa/],
  ];

  for (const [route, expected] of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.match(html, expected, route);
    assert.match(html, /Prototipe CITECH 2026/i, route);
  }
});
