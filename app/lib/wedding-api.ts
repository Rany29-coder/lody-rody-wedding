export const WEDDING_API =
  process.env.NEXT_PUBLIC_WEDDING_API_URL ||
  "https://rody-lody-wedding-api.lody-rody-wedding.workers.dev";
export async function weddingRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${WEDDING_API}${path}`, {
    ...init,
    cache: "no-store",
    signal: init.signal || AbortSignal.timeout(25000),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(
      body &&
        typeof body === "object" &&
        "error" in body &&
        typeof body.error === "string"
        ? body.error
        : "Unable to connect. Please try again.",
    );
  return body as T;
}
export type GalleryPhoto = { id: string; url: string };
export type GalleryResponse = { photos: GalleryPhoto[]; next: string | null };
