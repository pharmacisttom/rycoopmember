import type { TomvisPrincipal } from "@/core/auth/context";

export function assertPermission(context: TomvisPrincipal, permission: string): void {
  if (!context.permissions.includes(permission)) {
    throw new Error(`PERMISSION_DENIED:${permission}`);
  }
}

export function hasPermission(context: TomvisPrincipal, permission: string): boolean {
  return context.permissions.includes(permission);
}
