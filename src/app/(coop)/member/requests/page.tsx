import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { StatePanel } from "../_components/state-panel";

export default async function RequestsPage() {
  const context = await getTomvisAuthContext();
  if (!context) {
    redirect("/login");
  }

  const data = await new CoopMemberService().getMyDashboard(context);

  return (
    <StatePanel title="คำร้องออนไลน์">
      {data.requests.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-base font-semibold text-slate-700">ยังไม่มีประวัติการยื่นคำร้องออนไลน์</p>
          <p className="mt-1 text-sm text-slate-500">หากท่านได้ยื่นคำขอแก้ไขข้อมูลหรือขอรับบริการ รายการจะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-navy-900">{request.subject}</p>
                <p className="mt-1 text-sm text-slate-500">
                  เลขที่คำร้อง: {request.number} · ปรับปรุงล่าสุด: {formatThaiDate(request.updatedAt)}
                </p>
              </div>
              <span
                className={`w-fit rounded-md px-3 py-1 text-xs font-bold ${
                  request.status === "APPROVED" || request.status === "RESOLVED" || request.status === "CLOSED"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : request.status === "REJECTED"
                    ? "border border-rose-200 bg-rose-50 text-rose-700"
                    : "border border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {request.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </StatePanel>
  );
}
