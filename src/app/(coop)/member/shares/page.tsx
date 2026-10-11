import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function SharesPage() {
  const context = await getTomvisAuthContext();
  if (!context) {
    redirect("/login");
  }

  const data = await new CoopMemberService().getMyDashboard(context);

  return (
    <StatePanel title="หุ้นสะสม">
      <div className="rounded-md bg-navy-900 p-4 text-white shadow-soft">
        <p className="text-sm text-cyan-100">มูลค่าหุ้นสะสมทั้งหมด</p>
        <p className="mt-2 text-3xl font-bold">{formatMoney(data.summary.shareCapital)}</p>
      </div>

      <div className="mt-4">
        {data.shareTransactions.length === 0 ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-base font-semibold text-slate-700">ยังไม่มีข้อมูลรายการถือครองหรือเคลื่อนไหวหุ้น</p>
            <p className="mt-1 text-sm text-slate-500">ข้อมูลจะแสดงเมื่อมีการบันทึกหุ้นในระบบสหกรณ์</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.shareTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                <div>
                  <p className="font-bold text-slate-800">{tx.description}</p>
                  <p className="text-sm text-slate-500">{formatThaiDate(tx.postedAt)} · {tx.shareQty} หุ้น</p>
                </div>
                <p className="font-bold text-navy-900">{formatMoney(tx.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </StatePanel>
  );
}
