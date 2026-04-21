import { MissionControl } from "./MissionControl";
import { LoginConsole } from "./LoginConsole";
import { Starfield } from "./Starfield";
import { useAuth } from "@/hooks/use-auth";

export function MissionControlGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <Starfield />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            Establishing link…
          </span>
        </div>
      </div>
    );
  }

  return user ? <MissionControl /> : <LoginConsole />;
}
