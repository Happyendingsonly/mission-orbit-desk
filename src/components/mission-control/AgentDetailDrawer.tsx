import { useState } from "react";
import { KeyRound, Loader2, Satellite, X } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AgentStatus, type Agent } from "@/types/mission-control";
import { formatUtc, formatUtcShort, timeAgo } from "@/lib/format";
import type { HealthState } from "@/lib/health";
import { cn } from "@/lib/utils";
import { LogEntry } from "./LogEntry";
import {
  useAgentDecisions,
  useAgentStats,
  useAgentTransmissions,
  type AgentDecision,
} from "@/hooks/use-agent-detail";
import { useUpdateAgentRotation } from "@/hooks/use-mission-data";

const statusStyles: Record<AgentStatus, { color: string; dot: string }> = {
  [AgentStatus.ACTIVE]: { color: "text-signal", dot: "bg-signal" },
  [AgentStatus.IDLE]: {
    color: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  [AgentStatus.BLOCKED]: { color: "text-warning", dot: "bg-warning" },
};

const healthLabels: Record<
  HealthState,
  { label: string; symbol: string; color: string }
> = {
  FRESH: { label: "live", symbol: "●", color: "text-signal" },
  STALE: { label: "stale", symbol: "⚠", color: "text-warning" },
  OFFLINE: { label: "offline", symbol: "✕", color: "text-critical" },
};

const decisionResolutionStyles: Record<
  "pending" | "approved" | "aborted",
  string
> = {
  pending: "text-muted-foreground border-grid-line",
  approved: "text-signal border-signal/40",
  aborted: "text-critical border-critical/40",
};

interface Props {
  agent: Agent;
  health: HealthState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentDetailDrawer({ agent, health, open, onOpenChange }: Props) {
  const tx = useAgentTransmissions(agent.name, open);
  const dec = useAgentDecisions(agent.name, open);
  const stats = useAgentStats(agent.name, open);

  const s = statusStyles[agent.status];
  const h = healthLabels[health];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-grid-line bg-background/95 p-0 backdrop-blur sm:max-w-md md:max-w-lg"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-grid-line bg-panel/80 px-5 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <Satellite className="h-3 w-3" />
                Telemetry channel
              </div>
              <div className="mt-1 font-mono text-base tracking-wide text-signal drop-shadow-[0_0_6px_var(--signal)]">
                {agent.name}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "flex items-center gap-1.5 rounded border border-grid-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                    s.color,
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                  {agent.status}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded border border-grid-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest",
                    h.color,
                  )}
                >
                  <span>{h.symbol}</span>
                  {h.label}
                </span>
              </div>
            </div>
            <SheetClose className="rounded border border-grid-line p-1 text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal">
              <X className="h-4 w-4" />
            </SheetClose>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5">
          {/* DESCRIPTION */}
          <Section title="Description">
            <p className="text-xs leading-relaxed text-foreground/80">
              {agent.description ?? (
                <span className="text-muted-foreground/60">
                  No description on record.
                </span>
              )}
            </p>
            {agent.currentMission && (
              <div className="mt-3 rounded border border-grid-line bg-background/40 p-2.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Current mission
                </div>
                <div className="mt-1 text-xs text-foreground/85">
                  {agent.currentMission}
                </div>
              </div>
            )}
          </Section>

          {/* CONFIGURATION */}
          <ConfigurationSection agent={agent} />

          {/* RECENT TRANSMISSIONS */}
          <Section title="Recent Transmissions">
            {tx.isLoading ? (
              <Skeleton rows={4} height="h-8" />
            ) : tx.error ? (
              <ErrorLine message="Channel unreachable" />
            ) : tx.data && tx.data.length > 0 ? (
              <ul className="flex flex-col rounded border border-grid-line bg-background/30 px-1">
                {tx.data.map((e) => (
                  <LogEntry key={e.id} entry={e} />
                ))}
              </ul>
            ) : (
              <EmptyLine message="No transmissions on record" />
            )}
          </Section>

          {/* PROPOSED DECISIONS */}
          <Section title="Proposed Decisions">
            {dec.isLoading ? (
              <Skeleton rows={3} height="h-14" />
            ) : dec.error ? (
              <ErrorLine message="Decision log unreachable" />
            ) : dec.data && dec.data.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {dec.data.map((d) => (
                  <DecisionRow key={d.id} decision={d} />
                ))}
              </ul>
            ) : (
              <EmptyLine message="No decisions proposed" />
            )}
          </Section>

          {/* STATS */}
          <Section title="Stats">
            {stats.isLoading ? (
              <Skeleton rows={2} height="h-14" />
            ) : stats.error ? (
              <ErrorLine message="Stats unavailable" />
            ) : stats.data ? (
              <div className="grid grid-cols-2 gap-2">
                <StatBox
                  label="Transmissions"
                  value={String(stats.data.totalTransmissions)}
                />
                <StatBox
                  label="Decisions"
                  value={String(stats.data.totalDecisions)}
                />
                <StatBox
                  label="Approval rate"
                  value={
                    stats.data.approvalRate !== null
                      ? `${stats.data.approvalRate}%`
                      : "—"
                  }
                  hint={
                    stats.data.resolvedCount > 0
                      ? `${stats.data.approvedCount}/${stats.data.resolvedCount} resolved`
                      : "no resolved decisions"
                  }
                />
                <StatBox
                  label="Resolved"
                  value={String(stats.data.resolvedCount)}
                />
                <StatBox
                  label="First seen"
                  value={
                    stats.data.firstSeen
                      ? formatUtcShort(stats.data.firstSeen)
                      : "—"
                  }
                  hint={
                    stats.data.firstSeen
                      ? formatUtc(stats.data.firstSeen)
                      : undefined
                  }
                  className="col-span-2 sm:col-span-1"
                />
                <StatBox
                  label="Last seen"
                  value={
                    stats.data.lastSeen
                      ? `${timeAgo(stats.data.lastSeen)}`
                      : "—"
                  }
                  hint={
                    stats.data.lastSeen
                      ? formatUtc(stats.data.lastSeen)
                      : undefined
                  }
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            ) : null}
          </Section>

          <div className="border-t border-grid-line pt-3 text-center font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/70">
            ◉ End of channel
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        ▾ {title}
      </h3>
      {children}
    </section>
  );
}

function StatBox({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded border border-grid-line bg-background/40 px-2.5 py-2",
        className,
      )}
    >
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm text-foreground">{value}</div>
      {hint && (
        <div className="mt-0.5 font-mono text-[9px] tracking-wider text-muted-foreground/70">
          {hint}
        </div>
      )}
    </div>
  );
}

function DecisionRow({ decision }: { decision: AgentDecision }) {
  const state: "pending" | "approved" | "aborted" =
    decision.resolution ?? "pending";
  const label =
    state === "pending"
      ? "PENDING"
      : state === "approved"
        ? "APPROVED"
        : "ABORTED";
  const stamp =
    state === "pending"
      ? `proposed ${timeAgo(decision.proposedAt)}`
      : decision.resolvedAt
        ? `${state} ${timeAgo(decision.resolvedAt)}`
        : state;

  return (
    <li className="rounded border border-grid-line bg-background/40 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded border border-grid-line px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-muted-foreground">
          {decision.tag}
        </span>
        <span
          className={cn(
            "rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-widest",
            decisionResolutionStyles[state],
          )}
        >
          {label}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-snug text-foreground/85">
        {decision.summary}
      </p>
      <div className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/80">
        {stamp}
      </div>
    </li>
  );
}

function Skeleton({ rows, height }: { rows: number; height: string }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${height} animate-pulse rounded border border-grid-line/60 bg-background/30`}
        />
      ))}
    </div>
  );
}

function EmptyLine({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded border border-dashed border-grid-line/60 bg-background/20 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
      ◌ {message}
    </div>
  );
}

function ErrorLine({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center rounded border border-critical/30 bg-critical/5 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-critical">
      ✕ {message}
    </div>
  );
}
