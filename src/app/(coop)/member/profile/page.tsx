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
    ["ผู้รับผลประโยชน์", p.beneficiary]
  ];

  return (
    <StatePanel title="ข้อมูลสมาชิก">
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
        ข้อมูลสำคัญไม่สามารถแก้ไขโดยตรง กรุณายื่นคำร้องขอแก้ไขข้อมูลสมาชิก
      </p>
    </StatePanel>
  );
}
