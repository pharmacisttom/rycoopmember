import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function SharesPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="หุ้นสะสม">
      <div className="rounded-md bg-navy-900 p-4 text-white">
        <p className="text-sm text-cyan-100">มูลค่าหุ้นทั้งหมด</p>
        <p className="mt-2 text-3xl font-bold">{formatMoney(data.summary.shareCapital)}</p>
      </div>
      <div className="mt-4 space-y-3">
        {data.shareTransactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
            <div>
              <p className="font-bold">{tx.description}</p>
              <p className="text-sm text-slate-500">{formatThaiDate(tx.postedAt)} · {tx.shareQty} หุ้น</p>
            </div>
            <p className="font-bold text-navy-900">{formatMoney(tx.amount)}</p>
          </div>
        ))}
      </div>
    </StatePanel>
  );
}
