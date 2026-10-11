import { requireCoopAdminPermission } from "@/core/auth/admin-context";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
export default async function AdminDashboardPage() {
 try {
  const session=await requireCoopAdminPermission("coop.members.read");
  const data=await legacyApiClient.adminRead("/api/admin/members/dashboard",session.phpSessionId);
  const metrics=[["สมาชิกทั้งหมด",data.members?.total],["สมาชิกที่ใช้งาน",data.members?.active],["ระงับการใช้งาน",data.members?.suspended]];
  return <section className="rounded-md bg-white p-4"><h1 className="text-2xl font-bold text-navy-900">ภาพรวมสมาชิก</h1><div className="mt-4 grid gap-3 sm:grid-cols-3">{metrics.map(([label,value])=><div key={label} className="border p-4"><p>{label}</p><strong className="text-3xl">{value ?? "ยังไม่มีข้อมูล"}</strong></div>)}</div>{data.warnings?.length>0 && <p className="mt-4">ข้อมูลบางส่วนยังไม่พร้อมใช้งาน กรุณาตรวจระบบกลาง</p>}</section>;
 } catch {return <section role="alert" className="rounded-md bg-white p-4">ไม่สามารถโหลดภาพรวมสมาชิกได้ กรุณาตรวจสิทธิ์และการเชื่อมต่อระบบกลาง</section>;}
}
