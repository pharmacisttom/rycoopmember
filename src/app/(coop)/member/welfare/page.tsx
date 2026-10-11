import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function WelfarePage() {
  const context = await getTomvisAuthContext();
  if (!context) {
    redirect("/login");
  }

  const data = await new CoopMemberService().getMyDashboard(context);

  return (
    <StatePanel title="สวัสดิการสมาชิก">
      {data.welfare.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">ยังไม่มีข้อมูลสิทธิประโยชน์หรือประวัติการขอรับสวัสดิการ</p>
          <p className="mt-1 text-sm text-slate-500">ท่านสามารถติดตามระเบียบสวัสดิการประจำปีได้จากประกาศของสหกรณ์</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.welfare.map((benefit) => (
            <article key={benefit.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-bold text-navy-900">{benefit.type}</p>
              <p className="mt-2 text-2xl font-bold text-navy-900">{formatMoney(benefit.entitlement)}</p>
              <p className="mt-2 text-sm text-slate-600">{benefit.condition}</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">เอกสาร: {benefit.requiredDocuments.join(", ")}</p>
            </article>
          ))}
        </div>
      )}
    </StatePanel>
  );
}
