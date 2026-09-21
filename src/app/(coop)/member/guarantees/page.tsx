import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function GuaranteesPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="การค้ำประกันของฉัน">
      <div className="grid gap-3 lg:grid-cols-2">
        {data.guarantees.map((guarantee) => (
          <article key={guarantee.id} className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold text-coop-blue">{guarantee.direction === "GIVEN" ? "ฉันค้ำประกันใคร" : "ใครค้ำประกันฉัน"}</p>
            <p className="mt-1 font-bold text-navy-900">{guarantee.personName}</p>
            <p className="text-sm text-slate-500">{guarantee.loanContractNo} · เริ่ม {formatThaiDate(guarantee.startDate)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">วงเงินค้ำ</p>
                <p className="font-bold">{formatMoney(guarantee.guaranteeAmount)}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs text-slate-500">หนี้คงเหลือ</p>
                <p className="font-bold">{formatMoney(guarantee.outstandingLoan)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </StatePanel>
  );
}
