import { redirect } from "next/navigation";
import { getTomvisAuthContext } from "@/core/auth/context";
import { MemberShell } from "./_components/member-shell";

export const dynamic = "force-dynamic";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getTomvisAuthContext();

  if (!session) {
    redirect("/login");
  }

  return <MemberShell>{children}</MemberShell>;
}
