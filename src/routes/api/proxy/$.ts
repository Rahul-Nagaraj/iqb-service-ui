import { createFileRoute } from "@tanstack/react-router";

const BACKEND = "https://iqbapp-1.onrender.com";

type Ctx = { request: Request; params: { _splat?: string } };

async function forward({ request, params }: Ctx) {
  const url = new URL(request.url);
  const target = `${BACKEND}/api/${params._splat ?? ""}${url.search}`;

  const init: RequestInit = {
    method: request.method,
    headers: {
      "content-type":
        request.headers.get("content-type") ?? "application/json",
      accept: request.headers.get("accept") ?? "application/json",
    },
  };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text();
  }

  try {
    const resp = await fetch(target, init);
    const body = await resp.text();
    return new Response(body, {
      status: resp.status,
      headers: {
        "content-type":
          resp.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Upstream backend unreachable",
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}

export const Route = createFileRoute("/api/proxy/$")({
  server: {
    handlers: {
      GET: forward,
      POST: forward,
      PUT: forward,
      DELETE: forward,
      PATCH: forward,
    },
  },
});
