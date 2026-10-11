export function validateCsrfOrigin(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method.toUpperCase())) return true;
  const source = request.headers.get("origin") || request.headers.get("referer");
  if (!source) return false;
  try {
    const actual = new URL(source);
    const expected = new URL(process.env.NEXT_PUBLIC_APP_URL || request.url);
    return actual.origin === expected.origin;
  } catch { return false; }
}
