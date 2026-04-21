import { Radio, Rocket, Satellite } from "lucide-react";
import { Starfield } from "./Starfield";
import { ConsoleHeader } from "./ConsoleHeader";
import { Panel } from "./Panel";
import { AgentCard } from "./AgentCard";
import { ReviewItem } from "./ReviewItem";
import { LogEntry } from "./LogEntry";
import {
  useActivityLog,
  useAgents,
  useMissionRealtime,
  usePendingReviews,
} from "@/hooks/use-mission-data";

export function MissionControl() {
  useMissionRealtime();
  const agentsQ = useAgents();
  const reviewsQ = usePendingReviews();
  const logQ = useActivityLog();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <ConsoleHeader />
        <main className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Fleet" icon={Satellite}>
              <div className="flex flex-col gap-3">
                {agentsQ.isLoading ? (
                  <SkeletonList rows={3} height="h-24" />
                ) : agentsQ.error ? (
                  <ErrorState message="Fleet telemetry unavailable" />
                ) : agentsQ.data && agentsQ.data.length > 0 ? (
                  agentsQ.data.map((a) => <AgentCard key={a.id} agent={a} />)
                ) : (
                  <EmptyState message="No agents online" />
                )}
              </div>
            </Panel>

            <Panel title="Awaiting Command" icon={Rocket}>
              <div className="flex flex-col gap-3">
                {reviewsQ.isLoading ? (
                  <SkeletonList rows={3} height="h-28" />
                ) : reviewsQ.error ? (
                  <ErrorState message="Command queue unreachable" />
                ) : reviewsQ.data && reviewsQ.data.length > 0 ? (
                  reviewsQ.data.map((r) => <ReviewItem key={r.id} item={r} />)
                ) : (
                  <EmptyState message="No pending decisions · all clear" />
                )}
              </div>
            </Panel>

            <Panel title="Transmission Log" icon={Radio}>
              {logQ.isLoading ? (
                <div className="flex flex-col">
                  <SkeletonList rows={6} height="h-10" />
                </div>
              ) : logQ.error ? (
                <ErrorState message="Log feed offline" />
              ) : logQ.data && logQ.data.length > 0 ? (
                <ul className="flex flex-col">
                  {logQ.data.map((e) => (
                    <LogEntry key={e.id} entry={e} />
                  ))}
                </ul>
              ) : (
                <EmptyState message="No transmissions received" />
              )}
            </Panel>
          </div>

          <footer className="mt-8 flex items-center justify-between border-t border-grid-line pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>◉ Link stable</span>
            <span>Mission Control · v0.1</span>
            <span>EOT</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function SkeletonList({ rows, height }: { rows: number; height: string }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${height} animate-pulse rounded border border-grid-line/60 bg-background/30`}
        />
      ))}
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded border border-dashed border-grid-line/60 bg-background/20 p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
        ◌ {message}
      </span>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded border border-critical/30 bg-critical/5 p-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-critical">
        ✕ {message}
      </span>
    </div>
  );
}
