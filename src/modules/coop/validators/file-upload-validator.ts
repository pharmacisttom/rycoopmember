const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv"
]);

export function validatePrivateMemberUpload(file: { name: string; size: number; type: string }) {
  const maxBytes = 10 * 1024 * 1024;
  const extension = file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions = new Set(["pdf", "jpg", "jpeg", "png", "xlsx", "csv"]);

  return {
    valid: file.size <= maxBytes && allowedMimeTypes.has(file.type) && !!extension && allowedExtensions.has(extension),
    requiresPrivateStorage: true,
    malwareScanRequired: true
  };
}
