export function maskCitizenId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 13) {
    return "X-XXXX-XXXXX-XX-X";
  }

  return `${digits[0]}-XXXX-XXXXX-${digits.slice(10, 12)}-${digits[12]}`;
}

export function maskBankAccount(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) {
    return "XXX-X-XXXXX-X";
  }

  return `XXX-X-${digits.slice(4, 9)}-${digits.slice(-1)}`;
}
