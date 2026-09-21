export type CoopSyncAdapter = {
  source: "LEGACY_DB" | "REST_API" | "EXCEL" | "CSV";
  validate(): Promise<void>;
  preview(): Promise<{ rowCount: number; errorCount: number }>;
  commit(): Promise<{ successCount: number; errorCount: number }>;
};

export class AdapterNotConfiguredError extends Error {
  constructor(source: CoopSyncAdapter["source"]) {
    super(`Sync adapter is not configured: ${source}`);
  }
}
