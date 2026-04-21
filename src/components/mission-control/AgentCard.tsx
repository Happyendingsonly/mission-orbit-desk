import { Rocket, Satellite, AlertTriangle, ArrowRight } from "lucide-react";
import { AgentStatus, type Agent } from "@/types/mission-control";
import { formatUtcShort, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  AgentStatus,
  { label: string; color: string; dot: string; glow: string }
> = {
  [AgentStatus.ACTIVE]: {
    label: "ACTIVE",
    color: "text-signal",
    dot: "bg-signal",
    glow: "shadow-[0_0_8px_var(--signal)]",
  },
  [AgentStatus.IDLE]: {
    label: "IDLE",
    color: "text-muted-foreground",
    dot: "bg-muted-foreground",
    glow: "",
  },
  [AgentStatus.BLOCKED]: {
    label: "BLOCKED",
    color: "text-warning",
    dot: "bg-warning",
    glow: "shadow-[0_0_8px_var(--warning)]",
  },
};

export function AgentCard({ agent }: { agent: Agent }) {
  const s = statusStyles[agent.status];
  const Icon = agent.status === AgentStatus.ACTIVE ? Rocket : Satellite;
  const isBlocked = agent.status === AgentStatus.BLOCKED;

  return (
    <article className="group relative rounded border border-grid-line bg-background/40 p-3 transition-colors hover:border-signal/30">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-grid-line bg-panel/80",
            agent.status === AgentStatus.ACTIVE && "border-signal/40",
          )}
        >
          <Icon
            className={cn(
              "h-3.5 w-3.5",
              agent.status === AgentStatus.ACTIVE
                ? "text-signal"
                : "text-muted-foreground",
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-mono text-sm tracking-wide text-foreground",
                agent.status === AgentStatus.ACTIVE &&
                  "text-signal drop-shadow-[0_0_6px_var(--signal)]",
              )}
            >
              {agent.name}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 rounded border border-grid-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                s.color,
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  s.dot,
                  agent.status === AgentStatus.ACTIVE && "animate-pulse-glow",
                  s.glow,
                )}
              />
              {s.label}
            </span>
          </div>

          <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Last contact · {formatUtcShort(agent.lastContact)} ·{" "}
            {timeAgo(agent.lastContact)}
          </div>

          {agent.currentMission && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-foreground/80">
              {isBlocked && (
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
              )}
              <span className="leading-snug">{agent.currentMission}</span>
            </p>
          )}

          <button
            type="button"
            className="mt-3 flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-signal"
          >
            Telemetry <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}
