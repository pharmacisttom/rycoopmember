type RateLimitEntry = {
  timestamps: number[];
};

class InMemoryRateLimiter {
  private entries = new Map<string, RateLimitEntry>();

  constructor(
    private readonly maxAttempts: number = 5,
    private readonly windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  check(key: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const cleanKey = key.trim().toLowerCase();
    let entry = this.entries.get(cleanKey);

    if (!entry) {
      entry = { timestamps: [] };
      this.entries.set(cleanKey, entry);
    }

    // Filter out timestamps outside the sliding window
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < this.windowMs);

    if (entry.timestamps.length >= this.maxAttempts) {
      const oldest = entry.timestamps[0];
      const retryAfterSeconds = Math.ceil((this.windowMs - (now - oldest)) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
    }

    return {
      allowed: true,
      remaining: this.maxAttempts - entry.timestamps.length,
      retryAfterSeconds: 0
    };
  }

  record(key: string): void {
    const now = Date.now();
    const cleanKey = key.trim().toLowerCase();
    const entry = this.entries.get(cleanKey) ?? { timestamps: [] };
    entry.timestamps.push(now);
    this.entries.set(cleanKey, entry);
  }

  reset(key: string): void {
    this.entries.delete(key.trim().toLowerCase());
  }
}

export const loginRateLimiter = new InMemoryRateLimiter(5, 15 * 60 * 1000);
export const adminLoginRateLimiter = new InMemoryRateLimiter(5, 15 * 60 * 1000);
