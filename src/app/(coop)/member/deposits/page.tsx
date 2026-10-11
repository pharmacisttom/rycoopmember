import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function DepositsPage() {
  const context = await getTomvisAuthContext();
  if (!context) {
    redirect("/login");
  }

  const data = await new CoopMemberService().getMyDashboard(context);

  return (
    <StatePanel title="บัญชีเงินฝาก">
      {data.deposits.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">ยังไม่มีบัญชีเงินฝากที่เปิดใช้งาน</p>
          <p className="mt-1 text-sm text-slate-500">หากท่านมีบัญชีเงินฝากกับสหกรณ์ กรุณาติดต่อเจ้าหน้าที่เพื่อตรวจสอบสถานะ</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.deposits.map((account) => (
            <article key={account.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{account.accountType}</p>
              <p className="mt-1 font-bold text-slate-800">{account.accountNoMasked}</p>
              <p className="mt-4 text-2xl font-bold text-navy-900">{formatMoney(account.balance)}</p>
              <p className="mt-1 text-sm text-slate-500">ดอกเบี้ยสะสม {formatMoney(account.interestAccrued)}</p>
            </article>
          ))}
        </div>
      )}
    </StatePanel>
  );
}
