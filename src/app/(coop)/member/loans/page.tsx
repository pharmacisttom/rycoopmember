import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function LoansPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="เงินกู้ของฉัน">
      <div className="space-y-3">
        {data.loans.map((loan) => {
          const percent = Math.round((loan.currentInstallment / loan.totalInstallments) * 100);
          return (
            <article key={loan.id} className="rounded-md border border-slate-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-navy-900">{loan.loanType}</p>
                  <p className="text-sm text-slate-500">{loan.contractNo} · ดอกเบี้ย {loan.interestRate}</p>
                </div>
                <p className="text-xl font-bold">{formatMoney(loan.outstandingPrincipal)}</p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-coop-cyan" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-500">งวดที่ {loan.currentInstallment}/{loan.totalInstallments} · ชำระถัดไป {formatThaiDate(loan.nextPaymentDate)}</p>
            </article>
          );
        })}
      </div>
    </StatePanel>
  );
}
