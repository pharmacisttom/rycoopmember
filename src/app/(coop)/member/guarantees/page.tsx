import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function GuaranteesPage() {
  const context = await getTomvisAuthContext();
  if (!context) {
    redirect("/login");
  }

  const data = await new CoopMemberService().getMyDashboard(context);

  return (
    <StatePanel title="การค้ำประกันของฉัน">
      {data.guarantees.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">ยังไม่มีข้อมูลภาระการค้ำประกัน</p>
          <p className="mt-1 text-sm text-slate-500">ท่านไม่มีสัญญาที่ค้ำประกันผู้อื่น หรือมีผู้ค้ำประกันในขณะนี้</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {data.guarantees.map((guarantee) => (
            <article key={guarantee.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
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
      )}
    </StatePanel>
  );
}
