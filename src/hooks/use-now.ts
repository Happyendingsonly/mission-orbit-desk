import { useEffect, useState } from "react";

/**
 * Returns a Date that ticks every `intervalMs` milliseconds.
 * Used to keep relative timestamps (e.g., "5m ago") fresh without manual reload.
 */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
