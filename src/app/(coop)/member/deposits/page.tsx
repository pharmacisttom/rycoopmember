import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function DepositsPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="บัญชีเงินฝาก">
      <div className="grid gap-3 md:grid-cols-2">
        {data.deposits.map((account) => (
          <article key={account.id} className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-500">{account.accountType}</p>
            <p className="mt-1 font-bold text-slate-800">{account.accountNoMasked}</p>
            <p className="mt-4 text-2xl font-bold text-navy-900">{formatMoney(account.balance)}</p>
            <p className="mt-1 text-sm text-slate-500">ดอกเบี้ยสะสม {formatMoney(account.interestAccrued)}</p>
          </article>
        ))}
      </div>
    </StatePanel>
  );
}
