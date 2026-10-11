import { describe,it,expect,vi,afterEach } from "vitest";
import { legacyApiClient,mapAdminPermissions } from "@/modules/coop/adapters/legacy-api-client";
import { CoopAdminAuthService } from "./admin-auth-service";
afterEach(()=>vi.restoreAllMocks());
describe("Staff authorization",()=>{
 it("does not grant administrator rights when central permissions are empty",()=>{
  expect(mapAdminPermissions({role:"auditor",permissions:[]})).toEqual([]);
  expect(mapAdminPermissions({role:"custom",permissions:["members.view"]})).not.toContain("coop.members.manage");
 });
 it("never bypasses central login using a local password hash",async()=>{
  vi.spyOn(legacyApiClient,"adminLogin").mockRejectedValue(Error("INVALID"));
  await expect(new CoopAdminAuthService().login({username:"admin",password:"wrong"})).rejects.toThrow("INVALID");
 });
});
