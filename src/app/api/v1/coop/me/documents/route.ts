import { ok } from "@/core/api/response";

export async function GET() {
  return ok({
    documents: [
      { id: "doc_member_certificate", type: "MEMBER_CERTIFICATE", name: "หนังสือรับรองสมาชิก" },
      { id: "doc_dividend_certificate", type: "DIVIDEND_CERTIFICATE", name: "หนังสือรับรองเงินปันผล" }
    ]
  });
}
