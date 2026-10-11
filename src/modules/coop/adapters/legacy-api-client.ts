import type { MemberLoginInput } from "@/modules/coop/schemas/member-login";
import type { AdminLoginInput } from "@/modules/coop/schemas/admin-login";
import type { MemberProfileUpdateInput } from "@/modules/coop/schemas/member-profile-update";
import type { CoopMemberSession, CoopAdminSession } from "@/core/auth/session";
import type { MemberDashboard, DividendRecord, ServiceRequestSummary } from "@/modules/coop/types/member";
import { coopPermissions } from "@/modules/coop/permissions/catalog";
import { resolveBackendSession, rememberBackendSession } from "@/core/auth/backend-session-store";

export class BackendError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}
const memberPermissions = [coopPermissions.selfRead, coopPermissions.profileChangeRequest, coopPermissions.dividendRead];
export function mapAdminPermissions(user: {role: string; permissions?: string[]}): string[] {
  const existing = new Set(user.permissions || []);
  const mapping: Record<string,string[]> = {
    "members.view": [coopPermissions.membersRead, coopPermissions.requestsManage],
    "members.update": [coopPermissions.membersManage],
    "dividends.update": [coopPermissions.dividendManage],
    "news.view": [coopPermissions.announcementsManage]
  };
  return [...new Set(Object.entries(mapping).flatMap(([key,values]) =>
    user.role === "super_admin" || existing.has(key) ? values : []))];
}
const thb = (amount: unknown) => ({amount: String(amount ?? "0.00"), currency: "THB" as const});
export class LegacyApiClient {
  private get baseUrl() {
    const value = process.env.PHP_BACKEND_URL || process.env.LEGACY_API_BASE_URL;
    if (!value) throw new BackendError(503,"ยังไม่ได้กำหนด PHP_BACKEND_URL");
    const url = new URL(value);
    if (url.username || url.password || !["http:","https:"].includes(url.protocol)) throw new BackendError(503,"Backend URL ไม่ถูกต้อง");
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:" && !["localhost","127.0.0.1"].includes(url.hostname)) throw new BackendError(503,"Backend ต้องใช้ HTTPS");
    return value.replace(/\/$/, "");
  }
  private cookieName() {
    const name = process.env.PHP_SESSION_COOKIE_NAME || "rayongcoop_session";
    if (!/^[A-Za-z0-9_-]+$/.test(name)) throw new BackendError(503,"Cookie configuration ไม่ถูกต้อง");
    return name;
  }
  private async request(endpoint: string, sessionId?: string, init: RequestInit = {}) {
    const sid = sessionId ? resolveBackendSession(sessionId) : undefined;
    if (sid && !/^[A-Za-z0-9,-]+$/.test(sid)) throw new BackendError(401,"เซสชันไม่ถูกต้อง");
    const headers = new Headers(init.headers);
    headers.set("Accept","application/json");
    headers.set("X-Requested-With","XMLHttpRequest");
    if (sid) headers.set("Cookie",this.cookieName()+"="+sid);
    let response: Response;
    try { response = await fetch(this.baseUrl+endpoint, {...init, headers, cache:"no-store", redirect:"manual", signal:AbortSignal.timeout(10000)}); }
    catch { throw new BackendError(503,"ไม่สามารถเชื่อมต่อระบบกลาง กรุณาลองใหม่อีกครั้ง"); }
    const cookies = response.headers.getSetCookie?.() || [response.headers.get("set-cookie") || ""];
    let nextSid = sid;
    for (const cookie of cookies) {
      const pair = cookie.split(";",1)[0];
      const index = pair.indexOf("=");
      if (pair.slice(0,index) === this.cookieName()) nextSid = pair.slice(index+1);
    }
    if (sid && nextSid && nextSid !== sid) rememberBackendSession(sessionId!,nextSid);
    const data = await response.json().catch(()=>null);
    if (!response.ok || !data || data.success === false) {
      const status = response.status >= 300 && response.status < 400 ? 401 : response.status === 200 ? 502 : response.status;
      throw new BackendError(status, status === 401 || status === 403 ? "เซสชันหมดอายุหรือไม่มีสิทธิ์ กรุณาเข้าสู่ระบบใหม่" : "ระบบกลางไม่สามารถดำเนินการได้ ("+status+")");
    }
    return { data, sid:nextSid };
  }
  async authenticatedUser(sessionId?: string) {
    if (!sessionId) throw new BackendError(401,"กรุณาเข้าสู่ระบบใหม่");
    const {data} = await this.request("/api/auth/me",sessionId);
    if (data.authenticated !== true || !data.user?.id || !data.user?.role) throw new BackendError(401,"บัญชีไม่สามารถใช้งานได้");
    return data.user;
  }
  private async login(username: string,password: string) {
    const csrf = await this.request("/csrf-token");
    if (!csrf.sid || !csrf.data.token) throw new BackendError(503,"ไม่สามารถเริ่มเซสชันระบบกลาง");
    const result = await this.request("/login",csrf.sid,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","X-CSRF-Token":csrf.data.token},body:new URLSearchParams({username,password,_token:csrf.data.token,ajax:"1"})});
    if (!result.data.user || !result.sid) throw new BackendError(401,"บัญชีต้องยืนยันตัวตนเพิ่มเติม กรุณาใช้ระบบหลัก");
    return { user:await this.authenticatedUser(result.sid), sid:result.sid };
  }
  async memberLogin(input: MemberLoginInput): Promise<CoopMemberSession> {
    const {user,sid} = await this.login(input.username.trim(),input.password);
    if (user.role !== "member") throw new BackendError(403,"กรุณาใช้หน้าสำหรับเจ้าหน้าที่");
    const {data} = await this.request("/api/member/profile",sid);
    const member = data.data?.member;
    if (!member?.id || String(member.user_id) !== String(user.id) || member.status !== "active") throw new BackendError(403,"ไม่พบสมาชิกที่ใช้งานได้");
    return {userId:String(user.id),organizationId:"org_rayong_health_coop",memberId:String(member.id),memberNo:String(member.member_no),displayName:user.name,permissions:memberPermissions,issuedAt:new Date().toISOString(),phpSessionId:resolveBackendSession(sid)};
  }
  async adminLogin(input: AdminLoginInput): Promise<CoopAdminSession> {
    const {user,sid} = await this.login(input.username.trim(),input.password);
    const permissions = mapAdminPermissions(user);
    if (user.role === "member" || !permissions.length) throw new BackendError(403,"บัญชีนี้ไม่มีสิทธิ์เข้าหลังบ้านสมาชิก");
    return {userId:String(user.id),organizationId:"org_rayong_health_coop",username:user.username,displayName:user.name,role:user.role,permissions,issuedAt:new Date().toISOString(),phpSessionId:resolveBackendSession(sid)};
  }
  async getMemberDashboard(memberId: string, sessionId?: string): Promise<MemberDashboard> {
    const profile = await this.request("/api/member/profile",sessionId);
    const rawMember = profile.data.data?.member;
    if (!rawMember?.id || String(rawMember.id) !== memberId || rawMember.status !== "active") throw new BackendError(403,"ไม่มีสิทธิ์เข้าถึงสมาชิกนี้");
    const [dividends,requests] = await Promise.all([this.request("/api/member/dividends",sessionId),this.request("/api/member/requests",sessionId)]);
    if (!Array.isArray(dividends.data.records) || !Array.isArray(requests.data.data)) throw new BackendError(502,"รูปแบบข้อมูลระบบกลางไม่ถูกต้อง");
    const mapped: DividendRecord[] = dividends.data.records.map((item: any) => ({
      id:"div_"+item.year,fiscalYear:Number(item.year),averageShares:thb(0),dividendRate:String(item.dividend_rate ?? 0)+"%",
      dividendAmount:thb(item.income?.["เงินปันผล"]),eligibleLoanInterest:thb(0),patronageRate:String(item.refund_rate ?? 0)+"%",
      patronageRefund:thb(item.income?.["เงินเฉลี่ยคืน"]),totalNet:thb(item.net),announcedAt:item.imported_at || "",
      paymentStatus:"UNKNOWN",paymentChannel:"ยังไม่มีข้อมูลยืนยันการจ่าย",receivingAccountMasked:"ยังไม่มีข้อมูล"
    })).sort((a: DividendRecord,b: DividendRecord)=>b.fiscalYear-a.fiscalYear);
    const mappedRequests: ServiceRequestSummary[] = requests.data.data.map((req: any)=>({id:String(req.id),number:String(req.number || req.requestNumber || req.request_no),subject:req.subject || "คำขอแก้ไขข้อมูลส่วนตัว",status:String(req.status).toUpperCase() as ServiceRequestSummary["status"],updatedAt:req.updatedAt || req.updated_at || req.createdAt || ""}));
    return {
      profile:{id:String(rawMember.id),organizationId:"org_rayong_health_coop",userId:String(rawMember.user_id),memberNo:String(rawMember.member_no),prefix:rawMember.prefix || "",firstName:rawMember.first_name || "",lastName:rawMember.last_name || "",citizenIdMasked:"ปกปิดข้อมูล",birthDate:"",gender:"OTHER",memberType:"",joinDate:rawMember.join_date || "",status:"ACTIVE",organizationName:"สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด",department:rawMember.department || rawMember.org_name || "",position:rawMember.position || "",salary:thb(0),phone:rawMember.phone || "",email:rawMember.email || "",address:rawMember.address || "",bankAccountMasked:"ยังไม่มีข้อมูล",beneficiary:"",emergencyContact:""},
      summary:{shareCapital:thb(0),totalDeposits:thb(0),outstandingLoans:thb(0),monthlyInstallment:thb(0),guaranteeExposure:thb(0),latestDividend:thb(mapped[0]?.dividendAmount.amount),latestPatronageRefund:thb(mapped[0]?.patronageRefund.amount),welfareAvailable:thb(0)},
      shareTransactions:[],deposits:[],loans:[],guarantees:[],dividends:mapped,welfare:[],requests:mappedRequests,announcements:[],assetBeneficiaryAssignments:[],unreadMessages:0
    };
  }
  async submitProfileUpdateRequest(memberId: string,input: MemberProfileUpdateInput,sessionId?: string) {
    await this.getOwnedProfile(memberId,sessionId);
    if (input.avatarFileName) throw new BackendError(422,"ระบบอัปโหลดรูปยังไม่พร้อมใช้งาน");
    const csrf = await this.request("/csrf-token",sessionId);
    const {data} = await this.request("/api/member/requests/profile-change",sessionId,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-Token":csrf.data.token},body:JSON.stringify(input)});
    if (!data.data?.requestNumber) throw new BackendError(502,"ระบบกลางไม่ยืนยันการบันทึกคำร้อง");
    return data.data;
  }
  private async getOwnedProfile(memberId: string,sessionId?: string) {
    const {data}=await this.request("/api/member/profile",sessionId);
    if (String(data.data?.member?.id) !== memberId) throw new BackendError(403,"ไม่มีสิทธิ์เข้าถึงสมาชิกนี้");
    return data.data.member;
  }
  async adminRead(endpoint: string, sessionId?: string) { const data=(await this.request(endpoint,sessionId)).data; return data.data ?? data; }
  async listAdminRequests(status="",sessionId?: string) { return this.adminRead("/api/admin/members/requests?status="+encodeURIComponent(status),sessionId); }
  async logout(sessionId?: string) {
    if (!sessionId) return;
    const csrf=await this.request("/csrf-token",sessionId);
    try {await this.request("/logout",sessionId,{method:"POST",headers:{"X-CSRF-Token":csrf.data.token}});} catch(error) {if (!(error instanceof BackendError && error.status === 401)) throw error;}
  }
}
export const legacyApiClient = new LegacyApiClient();
