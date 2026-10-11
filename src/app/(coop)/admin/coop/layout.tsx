import { redirect } from "next/navigation";
import { requireCoopAdminSession } from "@/core/auth/admin-context";
import { AdminShell } from "./_components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminCoopLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCoopAdminSession().catch(()=>null);

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
