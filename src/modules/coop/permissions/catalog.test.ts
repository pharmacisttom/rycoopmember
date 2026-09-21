import { describe, expect, it } from "vitest";
import { coopPermissionCatalog, coopPermissions } from "./catalog";

describe("coop permission catalog", () => {
  it("contains member self-service permissions", () => {
    expect(coopPermissionCatalog.map((item) => item.key)).toContain(coopPermissions.selfRead);
    expect(coopPermissionCatalog.map((item) => item.key)).toContain(coopPermissions.helpdeskCreate);
  });

  it("keeps staff permissions permission-based", () => {
    const staffPermissions = coopPermissionCatalog.filter((item) => item.audience === "staff");
    expect(staffPermissions.every((item) => item.key.startsWith("coop."))).toBe(true);
    expect(staffPermissions.some((item) => item.key === coopPermissions.membersManage)).toBe(true);
  });
});
