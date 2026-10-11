import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function DividendPage() {
  const context = await getTomvisAuthContext();
  if (!context) {
    redirect("/login");
  }

  const data = await new CoopMemberService().getMyDashboard(context);

  return (
    <StatePanel title="เงินปันผลและเงินเฉลี่ยคืน">
      {data.dividends.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">ยังไม่พบรายการเงินปันผลหรือเงินเฉลี่ยคืนสำหรับบัญชีของคุณ</p>
          <p className="mt-1 text-sm text-slate-500">เมื่อสหกรณ์ประกาศและฝ่ายบัญชีนำเข้าข้อมูลประจำปี รายการจะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.dividends.map((item) => (
            <article key={item.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">ปีบัญชี {item.fiscalYear}</p>
                  <p className="mt-1 text-3xl font-bold text-navy-900">{formatMoney(item.totalNet)}</p>
                  <p className="text-xs text-slate-500">ยอดเงินสุทธิที่ได้รับ</p>
                </div>
                <span className="w-fit rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 border border-emerald-200">
                  {item.paymentStatus === "UNKNOWN" ? "ยังไม่มีข้อมูลยืนยันการจ่าย" : item.paymentStatus}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">เงินปันผล ({item.dividendRate})</p>
                  <p className="mt-1 font-bold text-slate-800">{formatMoney(item.dividendAmount)}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">เงินเฉลี่ยคืน ({item.patronageRate})</p>
                  <p className="mt-1 font-bold text-slate-800">{formatMoney(item.patronageRefund)}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">ช่องทางชำระ</p>
                  <p className="mt-1 font-bold text-slate-800">{item.paymentChannel}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">วันที่ปรับปรุงข้อมูล</p>
                  <p className="mt-1 font-bold text-slate-800">{formatThaiDate(item.announcedAt)}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                ข้อมูลเงินปันผลอ้างอิงจากฐานข้อมูลกลางระบบสหกรณ์ (คำนวณสุทธิ: รายรับทั้งหมด หัก รายการหักชำระ)
              </p>
            </article>
          ))}
        </div>
      )}
    </StatePanel>
  );
}
