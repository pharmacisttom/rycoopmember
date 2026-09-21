import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, FileText, HandHeart, Landmark, MessageCircle, PiggyBank, ShieldCheck, TicketCheck, UsersRound, type LucideIcon } from "lucide-react";
import { getTomvisAuthContext } from "@/core/auth/context";
import { formatMoney, formatThaiDate } from "@/modules/coop/application/format";
import { CoopMemberService } from "@/modules/coop/services/member-service";

const quickActions: Array<{ href: Route; label: string; icon: LucideIcon }> = [
  { href: "/member/dividend", label: "ปันผล", icon: PiggyBank },
  { href: "/member/loans", label: "เงินกู้", icon: Landmark },
  { href: "/member/beneficiaries", label: "ทายาท", icon: UsersRound },
  { href: "/member/statements", label: "Statement", icon: FileText },
  { href: "/member/welfare", label: "สวัสดิการ", icon: HandHeart },
  { href: "/member/chat", label: "Chat", icon: MessageCircle },
  { href: "/member/help", label: "Helpdesk", icon: TicketCheck }
];

export default async function MemberDashboardPage() {
  const context = await getTomvisAuthContext();
  const data = await new CoopMemberService().getMyDashboard(context);
  const memberName = `${data.profile.prefix}${data.profile.firstName} ${data.profile.lastName}`;

  const summaryCards = [
    { label: "หุ้นสะสม", value: formatMoney(data.summary.shareCapital) },
    { label: "เงินฝากรวม", value: formatMoney(data.summary.totalDeposits) },
    { label: "หนี้คงเหลือ", value: formatMoney(data.summary.outstandingLoans) },
    { label: "ปันผลล่าสุด", value: formatMoney(data.summary.latestDividend) }
  ];

  return (
    <div className="pb-20 lg:pb-0">
      <section className="rounded-md bg-navy-950 p-5 text-white shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-cyan-100">สวัสดี คุณ{data.profile.firstName}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{memberName}</h1>
            <p className="mt-2 text-sm text-slate-200">สมาชิกเลขที่ {data.profile.memberNo} · {data.profile.department}</p>
            <p className="text-sm text-slate-200">เป็นสมาชิกตั้งแต่ {formatThaiDate(data.profile.joinDate)}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-100">
            <ShieldCheck className="h-5 w-5" aria-hidden />
            สถานะ {data.profile.status}
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-navy-900">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 rounded-md border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold text-navy-900">เมนูลัด</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className="flex min-h-24 flex-col justify-between rounded-md border border-slate-200 p-3 hover:border-coop-cyan hover:bg-cyan-50">
                <Icon className="h-6 w-6 text-coop-blue" aria-hidden />
                <span className="font-bold text-slate-800">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-soft xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">สถานะคำร้อง</h2>
            <Link href="/member/requests" className="flex items-center gap-1 text-sm font-bold text-coop-blue">
              ดูทั้งหมด <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {data.requests.map((request) => (
              <div key={request.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-bold text-slate-800">{request.subject}</p>
                <p className="text-sm text-slate-500">{request.number} · {request.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-navy-900">ข่าวล่าสุด</h2>
          <div className="mt-3 space-y-3">
            {data.announcements.map((announcement) => (
              <div key={announcement.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-coop-blue">{announcement.category}</p>
                <p className="font-bold text-slate-800">{announcement.title}</p>
                <p className="text-sm text-slate-500">{formatThaiDate(announcement.publishedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
