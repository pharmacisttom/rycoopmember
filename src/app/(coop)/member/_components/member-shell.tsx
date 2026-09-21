import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  FileText,
  HandCoins,
  Headphones,
  Home,
  Landmark,
  MessageCircle,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon
} from "lucide-react";

const navItems: Array<{ href: Route; label: string; icon: LucideIcon }> = [
  { href: "/member", label: "หน้าหลัก", icon: Home },
  { href: "/member/profile", label: "ข้อมูลสมาชิก", icon: UserRound },
  { href: "/member/beneficiaries", label: "ทายาท", icon: UsersRound },
  { href: "/member/shares", label: "หุ้น", icon: HandCoins },
  { href: "/member/deposits", label: "เงินฝาก", icon: Landmark },
  { href: "/member/statements", label: "Statement", icon: FileText },
  { href: "/member/chat", label: "Chat", icon: MessageCircle },
  { href: "/member/help", label: "Helpdesk", icon: Headphones },
  { href: "/member/security", label: "ความปลอดภัย", icon: ShieldCheck },
  { href: "/member/notifications", label: "แจ้งเตือน", icon: Bell }
];

export function MemberShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f8fb]">
      <header className="sticky top-0 z-20 border-b border-white/20 bg-navy-950 text-white shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/member" className="text-base font-bold sm:text-lg">
            ระบบสมาชิกสหกรณ์
          </Link>
          <Link href="/admin/coop" className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20">
            Admin
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[248px_1fr]">
        <aside className="hidden rounded-md border border-slate-200 bg-white p-2 shadow-soft lg:block">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-cyan-50 hover:text-navy-900">
                <Icon aria-hidden className="h-5 w-5 text-coop-blue" />
                {item.label}
              </Link>
            );
          })}
        </aside>
        <main>{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white px-2 py-1 shadow-soft lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-slate-700">
              <Icon aria-hidden className="h-5 w-5 text-coop-blue" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
