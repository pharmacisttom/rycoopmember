import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function DividendPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="เงินปันผลและเงินเฉลี่ยคืน">
      <div className="space-y-3">
        {data.dividends.map((item) => (
          <article key={item.id} className="rounded-md border border-slate-200 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">ปีบัญชี {item.fiscalYear}</p>
                <p className="text-3xl font-bold text-navy-900">{formatMoney(item.totalNet)}</p>
              </div>
              <span className="w-fit rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">{item.paymentStatus}</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3">ปันผล {formatMoney(item.dividendAmount)}</div>
              <div className="rounded-md bg-slate-50 p-3">เฉลี่ยคืน {formatMoney(item.patronageRefund)}</div>
              <div className="rounded-md bg-slate-50 p-3">ประกาศ {formatThaiDate(item.announcedAt)}</div>
            </div>
            <p className="mt-3 text-sm text-slate-500">ข้อมูลนี้มาจากรายการที่ฝ่ายบัญชีอนุมัติแล้วเท่านั้น</p>
          </article>
        ))}
      </div>
    </StatePanel>
  );
}
