import { ok } from "@/core/api/response";

export async function GET() {
  return ok({
    types: ["shares", "deposits", "loans", "payments", "interest", "dividend", "patronage", "welfare"],
    exportFormats: ["PDF", "EXCEL", "PRINT"]
  });
}
