import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function WelfarePage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="สวัสดิการสมาชิก">
      <div className="grid gap-3 md:grid-cols-2">
        {data.welfare.map((benefit) => (
          <article key={benefit.id} className="rounded-md border border-slate-200 p-4">
            <p className="font-bold text-navy-900">{benefit.type}</p>
            <p className="mt-2 text-2xl font-bold">{formatMoney(benefit.entitlement)}</p>
            <p className="mt-2 text-sm text-slate-600">{benefit.condition}</p>
            <p className="mt-3 text-sm font-semibold text-slate-700">เอกสาร: {benefit.requiredDocuments.join(", ")}</p>
          </article>
        ))}
      </div>
    </StatePanel>
  );
}
