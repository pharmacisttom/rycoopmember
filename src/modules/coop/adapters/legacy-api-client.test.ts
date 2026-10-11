import { beforeEach,afterEach,describe,expect,it,vi } from "vitest";
import { LegacyApiClient } from "./legacy-api-client";
import { validateCsrfOrigin } from "@/core/security/csrf";
const user={id:1,role:"member",name:"Test Member",username:"1234567890123"};
const profile={id:25,user_id:1,member_no:"00025",status:"active",first_name:"Test"};
const json=(data:unknown,status=200,cookie?:string)=>new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json",...(cookie?{"Set-Cookie":cookie}:{})}});
beforeEach(()=>{
 vi.stubEnv("SESSION_STATE_DIR",(process.env.SESSION_STATE_DIR || process.env.TEMP || ".session-state")+"/contract-"+crypto.randomUUID());
 vi.stubEnv("PHP_BACKEND_URL","http://127.0.0.1:8087");
 vi.stubEnv("TOMVIS_SESSION_SECRET","a-test-secret-with-at-least-32-characters");
});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe("Central PHP contract",()=>{
 it("requests CSRF, carries session cookie, checks account, and uses actual member id",async()=>{
  const fetcher=vi.fn().mockResolvedValueOnce(json({token:"csrf"},200,"rayongcoop_session=initial; HttpOnly"))
   .mockResolvedValueOnce(json({success:true,user},200,"rayongcoop_session=rotated; HttpOnly"))
   .mockResolvedValueOnce(json({success:true,authenticated:true,user}))
   .mockResolvedValueOnce(json({success:true,data:{member:profile}}));
  vi.stubGlobal("fetch",fetcher);
  const session=await new LegacyApiClient().memberLogin({username:"1234567890123",password:"00025"});
  expect(session.memberId).toBe("25");expect(session.userId).toBe("1");
  const login=fetcher.mock.calls[1][1];
  expect(login.headers.get("Cookie")).toBe("rayongcoop_session=initial");
  expect(login.headers.get("X-CSRF-Token")).toBe("csrf");
  expect(login.body.get("password")).toBe("00025");
  expect(fetcher.mock.calls[2][1].headers.get("Cookie")).toBe("rayongcoop_session=rotated");
 });
 it("rejects two-factor pending response without creating a member session",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValueOnce(json({token:"csrf"},200,"rayongcoop_session=twofactor; HttpOnly")).mockResolvedValueOnce(json({success:true,redirect:"/admin/2fa"})));
  await expect(new LegacyApiClient().adminLogin({username:"admin",password:"test"})).rejects.toThrow("ยืนยันตัวตนเพิ่มเติม");
 });
 it("rejects cross-member profile before reading dividends",async()=>{
  const fetcher=vi.fn().mockResolvedValue(json({success:true,data:{member:profile}}));vi.stubGlobal("fetch",fetcher);
  await expect(new LegacyApiClient().getMemberDashboard("26","testsession")).rejects.toMatchObject({status:403});
  expect(fetcher).toHaveBeenCalledTimes(1);
 });
 it("does not convert backend failure into zero-balance success",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(json({success:false},500)));
  await expect(new LegacyApiClient().getMemberDashboard("25","testsession")).rejects.toMatchObject({status:500});
 });
 it("keeps dividend, refund, and net separate and does not invent payment confirmation",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockImplementation((url:string)=>{
   if(url.endsWith("/profile"))return Promise.resolve(json({success:true,data:{member:profile}}));
   if(url.endsWith("/requests"))return Promise.resolve(json({success:true,data:[]}));
   return Promise.resolve(json({success:true,records:[{year:2568,income:{เงินปันผล:"100.00",เงินเฉลี่ยคืน:"20.00"},net:"90.00",received:"0.00"}]}));
  }));
  const data=await new LegacyApiClient().getMemberDashboard("25","testsession");
  expect(data.summary.latestDividend.amount).toBe("100.00");
  expect(data.summary.latestPatronageRefund.amount).toBe("20.00");
  expect(data.dividends[0].totalNet.amount).toBe("90.00");
  expect(data.dividends[0].paymentStatus).toBe("UNKNOWN");
  expect(data.dividends[0].transactionReference).toBeUndefined();
 });
 it("adds central CSRF to profile request and requires persisted request number",async()=>{
  const fetcher=vi.fn().mockResolvedValueOnce(json({success:true,data:{member:profile}}))
   .mockResolvedValueOnce(json({token:"writecsrf"})).mockResolvedValueOnce(json({success:true,data:{requestNumber:"REQ-TEST"}}));vi.stubGlobal("fetch",fetcher);
  const result=await new LegacyApiClient().submitProfileUpdateRequest("25",{phone:"0890000000",email:"test@example.com",address:"Test address"},"testsession");
  expect(result.requestNumber).toBe("REQ-TEST");
  expect(fetcher.mock.calls[2][1].headers.get("X-CSRF-Token")).toBe("writecsrf");
 });
 it("supports existing unwrapped admin API envelope",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(json({success:true,items:[{id:1}],total:1})));
  expect(await new LegacyApiClient().adminRead("/api/admin/members","testsession")).toMatchObject({total:1});
 });
});
describe("CSRF origin isolation",()=>{
 beforeEach(()=>vi.stubEnv("NEXT_PUBLIC_APP_URL","https://member.rayongcoop.tomvisolution.tech"));
 it("accepts only the configured origin",()=>{
  expect(validateCsrfOrigin(new Request("http://internal:3000/api",{method:"POST",headers:{origin:"https://member.rayongcoop.tomvisolution.tech"}}))).toBe(true);
  for(const origin of ["https://evil.tomvisolution.tech","https://nottomvisolution.tech","http://localhost:9999","https://member.rayongcoop.tomvisolution.tech:444"])
   expect(validateCsrfOrigin(new Request("http://internal:3000/api",{method:"POST",headers:{origin}}))).toBe(false);
 });
 it("rejects unsafe requests without origin or referer",()=>expect(validateCsrfOrigin(new Request("http://internal/api",{method:"POST"}))).toBe(false));
});
