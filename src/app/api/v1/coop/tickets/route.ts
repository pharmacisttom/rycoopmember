import { ok } from "@/core/api/response";

export async function GET() {
  return ok({ tickets: [] });
}

export async function POST() {
  return ok({ ticketNumber: "RYS-2569-000001", status: "SUBMITTED" });
}
