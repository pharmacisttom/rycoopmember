import { requireCoopAdminPermission } from "@/core/auth/admin-context";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
export default async function AdminMembersPage({searchParams}:{searchParams?:{q?:string;page?:string}}) {
 try {
  const session=await requireCoopAdminPermission("coop.members.read");
  const q=(searchParams?.q || "").slice(0,100),page=Math.max(1,Number(searchParams?.page)||1);
  const data=await legacyApiClient.adminRead("/api/admin/members?"+new URLSearchParams({q,page:String(page)}),session.phpSessionId);
  return <section className="rounded-md bg-white p-4"><h1 className="text-2xl font-bold text-navy-900">ค้นหาสมาชิก</h1><form className="my-4 flex gap-2"><input name="q" defaultValue={q} maxLength={100} className="w-full rounded border p-3" placeholder="เลขสมาชิกหรือชื่อ"/><button className="rounded bg-navy-900 px-4 text-white">ค้นหา</button></form><div className="overflow-auto"><table className="w-full text-left"><thead><tr><th>เลขสมาชิก</th><th>ชื่อ</th><th>สถานะ</th></tr></thead><tbody>{data.items?.map((m:{id:string;member_no:string;name:string;status:string})=><tr key={m.id}><td className="p-3">{m.member_no}</td><td>{m.name}</td><td>{m.status}</td></tr>)}</tbody></table>{!data.items?.length && <p>ไม่พบข้อมูล</p>}</div><p className="mt-4">ทั้งหมด {data.total} รายการ · หน้า {data.page}</p><nav className="mt-3 flex gap-4">{page>1 && <a href={"?"+new URLSearchParams({q,page:String(page-1)})}>ก่อนหน้า</a>}{page*data.limit<data.total && <a href={"?"+new URLSearchParams({q,page:String(page+1)})}>ถัดไป</a>}</nav></section>;
 } catch {return <p role="alert">ไม่สามารถโหลดสมาชิกได้ กรุณาตรวจสิทธิ์และระบบกลาง</p>;}
}
