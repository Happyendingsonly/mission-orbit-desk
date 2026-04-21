import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex flex-col rounded-md border border-grid-line bg-panel/60 backdrop-blur-sm",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]",
        className,
      )}
    >
      <header className="flex items-center gap-2 border-b border-grid-line px-4 py-3">
        <Icon className="h-3.5 w-3.5 text-signal" strokeWidth={2} />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          {title}
        </h2>
        <div className="ml-auto h-px flex-1 bg-grid-line/60" />
      </header>
      <div className="flex-1 p-3">{children}</div>
    </section>
  );
}
