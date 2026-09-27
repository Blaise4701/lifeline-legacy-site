export class GuideBodyTooLargeError extends Error {}

export async function readGuideJson(request: Request, maxBytes: number): Promise<unknown> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > maxBytes)) {
    throw new GuideBodyTooLargeError("Guide request body is too large");
  }

  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Missing JSON body");

  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new GuideBodyTooLargeError("Guide request body is too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}
