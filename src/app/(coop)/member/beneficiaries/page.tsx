import Link from "next/link";
import { FileText, Send } from "lucide-react";
import { SweetAlertForm } from "@/app/_components/sweet-alert-form";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

const assetOptions = [
  { type: "SHARES", label: "หุ้นสะสม" },
  { type: "DEPOSITS", label: "เงินฝาก" },
  { type: "DIVIDEND", label: "เงินปันผล" },
  { type: "PATRONAGE_REFUND", label: "เงินเฉลี่ยคืน" },
  { type: "WELFARE", label: "สิทธิ์สวัสดิการค้างรับ" },
  { type: "OTHER", label: "สินทรัพย์อื่น" }
];

export default async function BeneficiariesPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      <StatePanel title="ทายาทและการมอบหมายสินทรัพย์">
        <div className="grid gap-3 md:grid-cols-2">
          {data.assetBeneficiaryAssignments.map((assignment) => (
            <article key={assignment.id} className="rounded-md border border-slate-200 p-4">
              <p className="text-sm font-semibold text-coop-blue">{assignment.requestNumber}</p>
              <h2 className="mt-1 text-lg font-bold text-navy-900">{assignment.beneficiaryFullName}</h2>
              <p className="text-sm text-slate-500">{assignment.relationship} · สถานะ {assignment.status}</p>
              <p className="mt-2 text-sm text-slate-600">จัดทำเมื่อ {formatThaiDate(assignment.generatedAt)}</p>
              <Link href="/member/beneficiaries/report" className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white">
                <FileText className="h-5 w-5" aria-hidden />
                เปิดรายงานยื่นสหกรณ์
              </Link>
            </article>
          ))}
        </div>
      </StatePanel>

      <StatePanel title="กรอกคำขอมอบหมายสินทรัพย์ให้ทายาท">
        <SweetAlertForm
          action="/api/v1/coop/me/beneficiary-assignments"
          className="grid gap-4"
          confirmTitle="ยืนยันการจัดทำคำขอ?"
          confirmText="ระบบจะสร้างรายงานสำหรับพิมพ์และยื่นกับสหกรณ์"
          successTitle="จัดทำคำขอแล้ว"
          successText="กำลังเปิดรายงานสำหรับยื่นสหกรณ์"
          errorTitle="จัดทำคำขอไม่สำเร็จ"
          redirectTo="/member/beneficiaries/report"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 font-semibold text-slate-700">
              ชื่อ-นามสกุลทายาท
              <input name="beneficiaryFullName" className="rounded-md border border-slate-300 p-3" placeholder="เช่น นางสาวสมใจ ใจดี" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              ความสัมพันธ์
              <input name="relationship" className="rounded-md border border-slate-300 p-3" placeholder="เช่น บุตร คู่สมรส บิดา มารดา" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              เลขประจำตัวประชาชน
              <input name="citizenId" className="rounded-md border border-slate-300 p-3" placeholder="ระบบจะแสดงแบบปกปิดในรายงาน" />
            </label>
            <label className="grid gap-2 font-semibold text-slate-700">
              โทรศัพท์ทายาท
              <input name="phone" className="rounded-md border border-slate-300 p-3" />
            </label>
          </div>
          <label className="grid gap-2 font-semibold text-slate-700">
            ที่อยู่ทายาท
            <textarea name="address" className="min-h-24 rounded-md border border-slate-300 p-3" />
          </label>

          <div className="rounded-md border border-slate-200 p-4">
            <h2 className="font-bold text-navy-900">เลือกสินทรัพย์และสัดส่วน</h2>
            <div className="mt-3 grid gap-3">
              {assetOptions.slice(0, 3).map((asset, index) => (
                <div key={asset.type} className="grid gap-2 rounded-md bg-slate-50 p-3 md:grid-cols-[1fr_120px_1fr]">
                  <input type="hidden" name="assetType" value={asset.type} />
                  <input name="assetLabel" defaultValue={asset.label} className="rounded-md border border-slate-300 p-3 font-semibold" />
                  <input name="percent" type="number" min="0" max="100" defaultValue={index === 0 ? 50 : index === 1 ? 30 : index === 2 ? 20 : 0} className="rounded-md border border-slate-300 p-3" aria-label={`สัดส่วน ${asset.label}`} />
                  <input name="note" className="rounded-md border border-slate-300 p-3" placeholder="หมายเหตุ" />
                </div>
              ))}
            </div>
          </div>

          <label className="grid gap-2 font-semibold text-slate-700">
            พยานรับรอง
            <input name="witnessName" className="rounded-md border border-slate-300 p-3" placeholder="ชื่อพยานหรือเจ้าหน้าที่ผู้ตรวจเอกสาร" />
          </label>
          <p className="rounded-md bg-cyan-50 p-3 text-sm font-semibold text-navy-900">
            หลังส่งคำขอ ระบบจะสร้างเลขคำร้องและรายงานสำหรับพิมพ์ลงนาม เพื่อนำไปยื่นกับสหกรณ์พร้อมเอกสารประกอบ
          </p>
          <button className="inline-flex w-fit items-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white">
            <Send className="h-5 w-5" aria-hidden />
            บันทึกคำขอและออกรายงาน
          </button>
        </SweetAlertForm>
      </StatePanel>
    </div>
  );
}
