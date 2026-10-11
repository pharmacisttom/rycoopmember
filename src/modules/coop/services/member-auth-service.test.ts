import { describe,it,expect,vi,afterEach } from "vitest";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
import { CoopMemberAuthService } from "./member-auth-service";
afterEach(()=>vi.restoreAllMocks());
describe("Member login delegates to central auth",()=>{
 it("forwards citizen username and unchanged password",async()=>{
  const spy=vi.spyOn(legacyApiClient,"memberLogin").mockResolvedValue({userId:"1"} as never);
  await new CoopMemberAuthService().login({username:"1234567890123",password:"00025"});
  expect(spy).toHaveBeenCalledWith({username:"1234567890123",password:"00025"});
 });
 it("does not fall back to demo credentials when backend fails",async()=>{
  vi.spyOn(legacyApiClient,"memberLogin").mockRejectedValue(Error("OFFLINE"));
  await expect(new CoopMemberAuthService().login({username:"1234567890123",password:"00025"})).rejects.toThrow("OFFLINE");
 });
});
