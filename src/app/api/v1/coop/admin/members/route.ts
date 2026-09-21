import { ok } from "@/core/api/response";

export async function GET() {
  return ok({
    members: [
      { memberNo: "RYS-001245", name: "สมชาย ใจดี", status: "ACTIVE", phone: "08X-XXX-4821" }
    ]
  });
}
