// Mission Control standardizes display on Mountain Time.
// America/Denver observes MST (UTC-7) in winter and MDT (UTC-6) in summer.
// Using Intl ensures DST is handled automatically; the suffix reflects current zone abbreviation.
const MT_ZONE = "America/Denver";

function getZoneAbbr(d: Date): string {
  // e.g. "MST" or "MDT"
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MT_ZONE,
    timeZoneName: "short",
  }).formatToParts(d);
  return parts.find((p) => p.type === "timeZoneName")?.value ?? "MT";
}

function getZoneParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MT_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  // Intl can return "24" for midnight hour in some engines; normalize.
  if (map.hour === "24") map.hour = "00";
  return map;
}

export function formatUtc(iso: string): string {
  const d = new Date(iso);
  const p = getZoneParts(d);
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} ${getZoneAbbr(d)}`;
}

export function formatUtcShort(iso: string): string {
  const d = new Date(iso);
  const p = getZoneParts(d);
  return `${p.hour}:${p.minute}:${p.second} ${getZoneAbbr(d)}`;
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  const sec = Math.max(0, Math.floor(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}
