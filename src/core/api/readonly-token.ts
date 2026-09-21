import { createHash, timingSafeEqual } from "node:crypto";

const defaultReadonlyTokenHash = "096a7cf2d5f056c9a8e55f33484c246d91da94e41538b3d23c9f9acd64793c42";

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function extractToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice("bearer ".length).trim();
  }

  return request.headers.get("x-api-token");
}

export function verifyReadonlyApiToken(request: Request): boolean {
  const token = extractToken(request);
  if (!token) {
    return false;
  }

  const expectedHash = process.env.WEB_READONLY_API_TOKEN_HASH ?? defaultReadonlyTokenHash;
  const actualHash = sha256Hex(token);
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(actualHash, "hex");

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export function isReadonlyMethod(request: Request): boolean {
  return request.method === "GET" || request.method === "HEAD";
}
