import { getTomvisAuthContext } from "@/core/auth/context";
import { formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../../_components/state-panel";
import { PrintButton } from "./print-button";

export default async function BeneficiaryReportPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  const assignment = data.assetBeneficiaryAssignments[0];
  const p = data.profile;

  return (
    <StatePanel title="รายงานคำขอมอบหมายสินทรัพย์ให้ทายาท">
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>
      <article className="rounded-md border border-slate-300 bg-white p-6 text-slate-900 print:border-0 print:p-0">
        <header className="border-b border-slate-300 pb-4 text-center">
          <h1 className="text-2xl font-bold">แบบคำขอมอบหมายสินทรัพย์ให้ทายาท</h1>
          <p className="mt-1 font-semibold">สหกรณ์ออมทรัพย์สาธารณสุขระยอง จำกัด</p>
          <p className="mt-1 text-sm">เลขที่คำขอ {assignment.requestNumber}</p>
        </header>

        <section className="mt-5 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-slate-500">ข้อมูลสมาชิก</p>
            <p className="mt-1 font-bold">{p.prefix}{p.firstName} {p.lastName}</p>
            <p>เลขสมาชิก {p.memberNo}</p>
            <p>หน่วยงาน {p.department}</p>
            <p>เลขประชาชน {p.citizenIdMasked}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">ข้อมูลทายาท</p>
            <p className="mt-1 font-bold">{assignment.beneficiaryFullName}</p>
            <p>ความสัมพันธ์ {assignment.relationship}</p>
            <p>เลขประชาชน {assignment.citizenIdMasked}</p>
            <p>โทรศัพท์ {assignment.phone}</p>
          </div>
        </section>

        <section className="mt-5">
          <p className="font-bold text-navy-900">รายการสินทรัพย์ที่มอบหมาย</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">ประเภทสินทรัพย์</th>
                  <th className="border border-slate-300 p-2">สัดส่วน</th>
                  <th className="border border-slate-300 p-2">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {assignment.allocations.map((allocation) => (
                  <tr key={allocation.assetType}>
                    <td className="border border-slate-300 p-2">{allocation.assetLabel}</td>
                    <td className="border border-slate-300 p-2">{allocation.percent}%</td>
                    <td className="border border-slate-300 p-2">{allocation.note ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-5 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-900 print:bg-white">
          รายงานฉบับนี้เป็นคำขอจากสมาชิก ต้องยื่นเอกสารตัวจริงและให้เจ้าหน้าที่ตรวจสอบสิทธิ์ก่อนมีผลทางทะเบียนของสหกรณ์
        </section>

        <section className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="border-t border-slate-400 pt-2 text-center">สมาชิกผู้ยื่นคำขอ</div>
          <div className="border-t border-slate-400 pt-2 text-center">{assignment.witnessName}</div>
          <div className="border-t border-slate-400 pt-2 text-center">เจ้าหน้าที่สหกรณ์</div>
        </section>

        <footer className="mt-6 text-sm text-slate-500">
          จัดทำเมื่อ {formatThaiDate(assignment.generatedAt)} · สถานะ {assignment.status}
        </footer>
      </article>
    </StatePanel>
  );
}
