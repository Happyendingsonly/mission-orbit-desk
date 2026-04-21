import { useEffect, useState, type FormEvent } from "react";
import { Lock, Radio, UserPlus } from "lucide-react";
import { Starfield } from "./Starfield";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "register";

export function LoginConsole() {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [operatorExists, setOperatorExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Detect whether the operator account already exists.
  // If yes → only allow sign-in. If no → show register mode by default.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count, error: err } = await supabase
        .from("operator_registry")
        .select("*", { count: "exact", head: true });
      if (cancelled) return;
      if (err) {
        // Table may not exist yet; default to allowing register
        setOperatorExists(false);
        setMode("register");
        return;
      }
      const exists = (count ?? 0) > 0;
      setOperatorExists(exists);
      setMode(exists ? "signin" : "register");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) setError(err);
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const cleanEmail = email.trim();
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (signUpErr) {
      setSubmitting(false);
      setError(signUpErr.message);
      return;
    }

    // Claim the operator slot. Inserts only succeed if no row exists yet
    // (single-row table, see migration). This is the lock.
    if (data.user) {
      const { error: claimErr } = await supabase
        .from("operator_registry")
        .insert({ user_id: data.user.id, email: cleanEmail });

      if (claimErr) {
        setSubmitting(false);
        setError(
          "An operator account already exists. Sign in with that account instead.",
        );
        setMode("signin");
        setOperatorExists(true);
        return;
      }
    }

    // Try to auto sign-in (auto-confirm is on, so this should work).
    const { error: signInErr } = await signIn(cleanEmail, password);
    setSubmitting(false);
    if (signInErr) {
      setInfo("Account created. Please sign in.");
      setMode("signin");
      setOperatorExists(true);
    }
  }

  const isRegister = mode === "register";
  const showToggle = operatorExists === false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Starfield />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded border border-grid-line bg-panel/60 px-3 py-1.5">
              <Radio className="h-3.5 w-3.5 text-signal" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-signal">
                {isRegister ? "Operator Enrollment" : "Secure Channel"}
              </span>
            </div>
            <h1 className="font-mono text-2xl tracking-[0.32em] text-foreground/90">
              MISSION&nbsp;CONTROL
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {isRegister
                ? "Claim the operator console · one-time setup"
                : "Operator authentication required"}
            </p>
          </div>

          <form
            onSubmit={isRegister ? handleRegister : handleSignIn}
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
                minLength={isRegister ? 8 : undefined}
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-grid-line bg-background/60 px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                placeholder={isRegister ? "min. 8 characters" : "••••••••••"}
              />
            </div>

            {error && (
              <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
                ERR · {error}
              </div>
            )}
            {info && !error && (
              <div className="rounded border border-signal/40 bg-signal/10 px-3 py-2 font-mono text-[11px] text-signal">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || operatorExists === null}
              className="group flex w-full items-center justify-center gap-2 rounded border border-signal/40 bg-signal/10 px-3 py-2.5 font-mono text-xs uppercase tracking-widest text-signal transition-colors hover:bg-signal/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRegister ? (
                <UserPlus className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              {submitting
                ? isRegister
                  ? "Enrolling…"
                  : "Authenticating…"
                : isRegister
                  ? "Claim Console"
                  : "Authenticate"}
            </button>

            {showToggle && (
              <button
                type="button"
                onClick={() => {
                  setMode(isRegister ? "signin" : "register");
                  setError(null);
                  setInfo(null);
                }}
                className="w-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {isRegister ? "Already enrolled? Sign in" : "Enroll as operator"}
              </button>
            )}

            <p className="pt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
              {operatorExists
                ? "Invite-only · Single operator console"
                : "First-come, first-served · single operator only"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
