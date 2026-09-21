import { getTomvisAuthContext } from "@/core/auth/context";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function RequestsPage() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return (
    <StatePanel title="คำร้องออนไลน์">
      <div className="space-y-3">
        {data.requests.map((request) => (
          <div key={request.id} className="rounded-md border border-slate-200 p-3">
            <p className="font-bold">{request.subject}</p>
            <p className="text-sm text-slate-500">{request.number} · {request.status}</p>
          </div>
        ))}
      </div>
    </StatePanel>
  );
}
