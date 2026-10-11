import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
  };
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
  };
};

export function requestId(): string {
  return crypto.randomUUID();
}

export function ok<T>(data: T, id = requestId()): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: { requestId: id }
  }, { headers: { "Cache-Control": "no-store, private" } });
}

export function fail(code: string, message: string, status = 400, id = requestId()): NextResponse<ApiFailure> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
      meta: { requestId: id }
    },
    { status, headers: { "Cache-Control": "no-store, private" } }
  );
}
