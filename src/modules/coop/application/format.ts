import type { Money } from "@/modules/coop/types/member";

export function formatMoney(value: Money): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: value.currency,
    minimumFractionDigits: 2
  }).format(Number(value.amount));
}

export function formatThaiDate(value: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium"
  }).format(new Date(value));
}
