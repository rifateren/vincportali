const WINDOW_MS = 60_000;
const MAX_UPLOADS_PER_WINDOW = 20;

// Primary: in-memory bucket (fast, works per-instance)
const buckets = new Map<string, number[]>();

// Periodic cleanup to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  Array.from(buckets.entries()).forEach(([key, timestamps]) => {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) {
      buckets.delete(key);
    } else {
      buckets.set(key, recent);
    }
  });
}

export function allowUpload(userId: string): boolean {
  cleanup();
  const now = Date.now();
  const timestamps = buckets.get(userId) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_UPLOADS_PER_WINDOW) {
    buckets.set(userId, recent);
    return false;
  }
  recent.push(now);
  buckets.set(userId, recent);
  return true;
}
