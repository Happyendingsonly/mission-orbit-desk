import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { formatUtc } from "@/lib/format";
import { operator } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";

export function ConsoleHeader() {
  const { signOut } = useAuth();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="border-b border-grid-line bg-panel/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-mono text-2xl tracking-[0.32em] text-foreground/90 md:text-3xl">
            MISSION&nbsp;CONTROL
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {operator.org} · Operator: {operator.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs text-muted-foreground md:text-sm">
            {formatUtc(now.toISOString())}
          </div>
          <div className="flex items-center gap-2 rounded border border-grid-line bg-panel/60 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-pulse-glow rounded-full bg-signal" />
              <span className="relative h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-signal">
              All systems nominal
            </span>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign out"
            className="flex items-center gap-1.5 rounded border border-grid-line bg-panel/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <LogOut className="h-3 w-3" />
            Disconnect
          </button>
        </div>
      </div>
    </header>
  );
}
