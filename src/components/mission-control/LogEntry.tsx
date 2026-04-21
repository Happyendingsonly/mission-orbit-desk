import type { ActivityEntry, LogClassification } from "@/types/mission-control";
import { formatUtcShort } from "@/lib/format";
import { cn } from "@/lib/utils";

const classStyles: Record<LogClassification, string> = {
  OK: "text-signal",
  INFO: "text-muted-foreground",
  WARN: "text-warning",
};

export function LogEntry({ entry }: { entry: ActivityEntry }) {
  return (
    <li className="grid grid-cols-[auto_auto_1fr] items-start gap-3 border-b border-grid-line/50 px-1 py-2 last:border-b-0">
      <span className="font-mono text-[10px] text-muted-foreground">
        {formatUtcShort(entry.timestamp)}
      </span>
      <span
        className={cn(
          "rounded border border-grid-line px-1 py-0 font-mono text-[9px] tracking-widest",
          classStyles[entry.classification],
        )}
      >
        {entry.classification}
      </span>
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/60">
          {entry.agentName}
        </div>
        <div className="mt-0.5 text-xs leading-snug text-foreground/85">{entry.message}</div>
      </div>
    </li>
  );
}
