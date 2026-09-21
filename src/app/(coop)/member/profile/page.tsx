import { Camera, Send } from "lucide-react";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function ProfilePage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  const p = data.profile;
  const rows = [
    ["เลขสมาชิก", p.memberNo],
    ["ชื่อ-นามสกุล", `${p.prefix}${p.firstName} ${p.lastName}`],
    ["เลขประชาชน", p.citizenIdMasked],
    ["ประเภทสมาชิก", p.memberType],
    ["วันที่เป็นสมาชิก", formatThaiDate(p.joinDate)],
    ["หน่วยงาน", p.department],
    ["ตำแหน่ง", p.position],
    ["เงินเดือน", formatMoney(p.salary)],
    ["โทรศัพท์", p.phone],
    ["อีเมล", p.email],
    ["บัญชีรับเงิน", p.bankAccountMasked],
    ["ผู้รับผลประโยชน์เดิม", p.beneficiary]
  ];

  return (
    <div className="space-y-4">
      <StatePanel title="ข้อมูลสมาชิก">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-navy-900 text-3xl font-bold text-white">
              {p.firstName.slice(0, 1)}
            </div>
            <p className="mt-3 font-bold text-navy-900">{p.prefix}{p.firstName} {p.lastName}</p>
            <p className="text-sm text-slate-500">{p.memberNo}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="rounded-md bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </StatePanel>

      <StatePanel title="เพิ่มรูปและแก้ไขข้อมูลส่วนบุคคล">
        <form action="/api/v1/coop/me/profile-change" method="post" encType="multipart/form-data" className="grid gap-3">
          <label className="grid gap-2 font-semibold text-slate-700">
            รูปสมาชิก
            <span className="flex min-h-24 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              <Camera className="mr-2 h-5 w-5" aria-hidden />
              เลือกไฟล์รูปภาพเพื่อแนบคำร้อง
            </span>
            <input name="avatar" type="file" accept="image/png,image/jpeg" className="rounded-md border border-slate-300 p-3" />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 font-semibold text-slate-700">
              โทรศัพท์
              <input name="phone" defaultValue={p.phone} className="rounded-md border border-slate-300 p-3" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              อีเมล
              <input name="email" type="email" defaultValue={p.email} className="rounded-md border border-slate-300 p-3" />
            </label>
          </div>
          <label className="grid gap-2 font-semibold text-slate-700">
            ที่อยู่
            <textarea name="address" defaultValue={p.address} className="min-h-28 rounded-md border border-slate-300 p-3" />
          </label>
          <label className="grid gap-2 font-semibold text-slate-700">
            ผู้ติดต่อฉุกเฉิน
            <input name="emergencyContact" defaultValue={p.emergencyContact} className="rounded-md border border-slate-300 p-3" />
          </label>
          <label className="grid gap-2 font-semibold text-slate-700">
            หมายเหตุถึงเจ้าหน้าที่
            <textarea name="note" className="min-h-24 rounded-md border border-slate-300 p-3" placeholder="ระบุเหตุผลหรือรายละเอียดเพิ่มเติม" />
          </label>
          <p className="rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            ระบบจะสร้างคำร้องให้เจ้าหน้าที่ตรวจสอบก่อนบันทึกจริง โดยเฉพาะข้อมูลสำคัญและรูปสมาชิก
          </p>
          <button className="inline-flex w-fit items-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white">
            <Send className="h-5 w-5" aria-hidden />
            ยื่นคำร้องแก้ไขข้อมูล
          </button>
        </form>
      </StatePanel>
    </div>
  );
}
