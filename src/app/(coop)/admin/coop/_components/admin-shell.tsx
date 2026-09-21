import Link from "next/link";
import type { Route } from "next";
import { BarChart3, FileArchive, Headphones, Import, LayoutDashboard, MessageSquare, Newspaper, PiggyBank, ScrollText, Settings, Users, type LucideIcon } from "lucide-react";

const adminNav: Array<{ href: Route; label: string; icon: LucideIcon }> = [
  { href: "/admin/coop", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/coop/members", label: "สมาชิก", icon: Users },
  { href: "/admin/coop/service-center", label: "Service Center", icon: Headphones },
  { href: "/admin/coop/requests", label: "คำร้อง", icon: ScrollText },
  { href: "/admin/coop/chats", label: "Chat", icon: MessageSquare },
  { href: "/admin/coop/tickets", label: "Helpdesk", icon: Headphones },
  { href: "/admin/coop/dividends", label: "ปันผล", icon: PiggyBank },
  { href: "/admin/coop/documents", label: "เอกสาร", icon: FileArchive },
  { href: "/admin/coop/announcements", label: "ข่าวสาร", icon: Newspaper },
  { href: "/admin/coop/import", label: "Import", icon: Import },
  { href: "/admin/coop/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/coop/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-md bg-navy-950 p-3 text-white shadow-soft">
          <Link href="/admin/coop" className="block px-3 py-3 text-lg font-bold">Cooperative Command Center</Link>
          <nav className="mt-2 grid gap-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
                  <Icon className="h-5 w-5 text-coop-cyan" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
