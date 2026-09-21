import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { coopSessionCookieName } from "@/core/auth/context";
import { verifyCoopMemberSessionToken } from "@/core/auth/session";
import { MemberShell } from "./_components/member-shell";

export const dynamic = "force-dynamic";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = verifyCoopMemberSessionToken(cookies().get(coopSessionCookieName)?.value);

  if (!session) {
    redirect("/login");
  }

  return <MemberShell>{children}</MemberShell>;
}
