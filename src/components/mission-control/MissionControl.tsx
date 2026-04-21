import { Radio, Rocket, Satellite } from "lucide-react";
import { Starfield } from "./Starfield";
import { ConsoleHeader } from "./ConsoleHeader";
import { Panel } from "./Panel";
import { AgentCard } from "./AgentCard";
import { ReviewItem } from "./ReviewItem";
import { LogEntry } from "./LogEntry";
import { agents, pendingReviews, activityLog } from "@/lib/mock-data";

export function MissionControl() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Starfield />
      <div className="relative z-10">
        <ConsoleHeader />
        <main className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Fleet" icon={Satellite}>
              <div className="flex flex-col gap-3">
                {agents.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </Panel>

            <Panel title="Awaiting Command" icon={Rocket}>
              <div className="flex flex-col gap-3">
                {pendingReviews.map((r) => (
                  <ReviewItem key={r.id} item={r} />
                ))}
              </div>
            </Panel>

            <Panel title="Transmission Log" icon={Radio}>
              <ul className="flex flex-col">
                {activityLog.map((e) => (
                  <LogEntry key={e.id} entry={e} />
                ))}
              </ul>
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
