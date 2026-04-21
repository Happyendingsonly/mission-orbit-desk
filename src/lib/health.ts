export type HealthState = "FRESH" | "STALE" | "OFFLINE";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function deriveHealth(iso: string, now: Date = new Date()): HealthState {
  const diff = now.getTime() - new Date(iso).getTime();
  if (diff < HOUR_MS) return "FRESH";
  if (diff < DAY_MS) return "STALE";
  return "OFFLINE";
}
