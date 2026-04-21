import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { Starfield } from "./Starfield";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export function LoginConsole() {
  const [operatorExists, setOperatorExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count, error: err } = await supabase
        .from("operator_registry")
        .select("*", { count: "exact", head: true });
      if (cancelled) return;
      if (err) {
        setOperatorExists(false);
        return;
      }
      setOperatorExists((count ?? 0) > 0);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.redirected) return;
    if (result.error) {
      setSubmitting(false);
      setError(result.error.message ?? "Sign-in failed");
    }
  }

  const isEnrollment = operatorExists === false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Starfield />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded border border-grid-line bg-panel/60 px-3 py-1.5">
              <Radio className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal">
                {isEnrollment ? "Operator Enrollment" : "Secure Channel"}
              </span>
            </div>
            <h1 className="font-mono text-2xl tracking-[0.32em] text-foreground/90">
              MISSION&nbsp;CONTROL
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {isEnrollment
                ? "Claim the operator console · one-time setup"
                : "Operator authentication required"}
            </p>
          </div>

          <div className="space-y-4 rounded-lg border border-grid-line bg-panel/60 p-6 backdrop-blur-sm">
            {error && (
              <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
                ERR · {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting || operatorExists === null}
              className="group flex w-full items-center justify-center gap-3 rounded border border-signal/40 bg-signal/10 px-3 py-3 font-mono text-xs uppercase tracking-widest text-signal transition-colors hover:bg-signal/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleGlyph />
              {submitting
                ? "Establishing link…"
                : isEnrollment
                  ? "Claim console with Google"
                  : "Sign in with Google"}
            </button>

            <p className="pt-1 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              {operatorExists
                ? "Single operator console · access locked to enrolled identity"
                : "First Google identity to authenticate becomes the operator"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.2s2.69-6.2 6-6.2c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.83 3.18 14.62 2.2 12 2.2 6.86 2.2 2.7 6.36 2.7 12s4.16 9.8 9.3 9.8c5.37 0 8.92-3.78 8.92-9.1 0-.61-.07-1.07-.16-1.5H12z"
      />
    </svg>
  );
}
