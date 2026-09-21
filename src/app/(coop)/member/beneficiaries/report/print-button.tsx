"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-3 font-bold text-white print:hidden">
      <Printer className="h-5 w-5" aria-hidden />
      พิมพ์รายงาน
    </button>
  );
}
