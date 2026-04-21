import { useState, type FormEvent } from "react";
import { Lock, Radio } from "lucide-react";
import { Starfield } from "./Starfield";
import { useAuth } from "@/hooks/use-auth";

export function LoginConsole() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) setError(err);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Starfield />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded border border-grid-line bg-panel/60 px-3 py-1.5">
              <Radio className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal">
                Secure Channel
              </span>
            </div>
            <h1 className="font-mono text-2xl tracking-[0.32em] text-foreground/90">
              MISSION&nbsp;CONTROL
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Operator authentication required
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-lg border border-grid-line bg-panel/60 p-6 backdrop-blur-sm"
          >
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Operator ID
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-grid-line bg-background/60 px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                placeholder="operator@mission.control"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Access Code
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-grid-line bg-background/60 px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                placeholder="••••••••••"
              />
            </div>

            {error && (
              <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
                ERR · {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group flex w-full items-center justify-center gap-2 rounded border border-signal/40 bg-signal/10 px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-signal transition-colors hover:bg-signal/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              {submitting ? "Authenticating…" : "Authenticate"}
            </button>

            <p className="pt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              Invite-only · No public registration
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
