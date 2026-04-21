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
      // Look up current operator
      const { data: existing } = await supabase
        .from("operator_registry")
        .select("user_id")
        .maybeSingle();

      if (cancelled) return;

      if (existing) {
        setIsOperator(existing.user_id === user.id);
        if (existing.user_id !== user.id) {
          await signOut();
        }
        return;
      }

      // No operator yet — claim the slot for this user.
      const { error: claimErr } = await supabase
        .from("operator_registry")
        .insert({
          user_id: user.id,
          email: user.email ?? "unknown@operator",
        });

      if (cancelled) return;

      if (claimErr) {
        // Race: someone else claimed it first.
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
