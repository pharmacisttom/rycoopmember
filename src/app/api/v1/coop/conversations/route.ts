import { ok } from "@/core/api/response";

export async function GET() {
  return ok({ conversations: [] });
}

export async function POST() {
  return ok({ conversationId: crypto.randomUUID(), status: "OPEN" });
}
