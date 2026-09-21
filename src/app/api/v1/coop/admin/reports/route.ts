import { ok } from "@/core/api/response";

export async function GET() {
  return ok({
    reports: ["Member Growth", "Share Capital", "Deposit Balance", "Loan Portfolio", "Dividend Summary", "SLA"]
  });
}
