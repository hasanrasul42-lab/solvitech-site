import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Development tool: saves a poster rendered by /3d-lab/poster-capture into
 * public/brand/poster/. Disabled unless the server runs with POSTER_CAPTURE=1
 * (e.g. `POSTER_CAPTURE=1 npx next start`), so it does nothing in production.
 */
const NAMES = new Set([
  "mark-entrance-start",
  "mark-entrance-final",
  "mark-entrance-start-refined",
  "mark-entrance-final-refined",
]);
const PREFIX = "data:image/webp;base64,";

export async function POST(request: Request) {
  if (process.env.POSTER_CAPTURE !== "1") return new Response("Not found", { status: 404 });

  const body = (await request.json().catch(() => null)) as { name?: string; dataUrl?: string } | null;
  if (!body?.name || !NAMES.has(body.name) || !body.dataUrl?.startsWith(PREFIX)) {
    return new Response("Bad request", { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "brand", "poster");
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(body.dataUrl.slice(PREFIX.length), "base64");
  await writeFile(path.join(dir, `${body.name}.webp`), bytes);
  return Response.json({ ok: true, bytes: bytes.length });
}
