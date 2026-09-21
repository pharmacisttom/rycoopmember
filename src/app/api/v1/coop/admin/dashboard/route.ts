import { ok } from "@/core/api/response";

export async function GET() {
  return ok({
    totalMembers: 12842,
    activeMembers: 12660,
    membersOnline: 214,
    openServiceRequests: 38,
    openChats: 11,
    openTickets: 24,
    slaCompliance: "96.4%",
    satisfactionScore: "4.7"
  });
}
