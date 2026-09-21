import { AdminShell } from "./_components/admin-shell";

export default function AdminCoopLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
