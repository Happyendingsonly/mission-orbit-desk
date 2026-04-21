import { useEffect, useState } from "react";
import { MissionControl } from "./MissionControl";
import { LoginConsole } from "./LoginConsole";
import { Starfield } from "./Starfield";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function MissionControlGate() {
  const { user, loading, signOut } = useAuth();
  const [isOperator, setIsOperator] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsOperator(null);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("operator_registry")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        // Signed-in user is NOT the operator — boot them.
        await signOut();
        setIsOperator(false);
        return;
      }
      setIsOperator(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, signOut]);

  const checking = loading || (user && isOperator === null);

  if (checking) {
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

  return user && isOperator ? <MissionControl /> : <LoginConsole />;
}
