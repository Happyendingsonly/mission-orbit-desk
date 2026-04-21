import type { PendingReviewItem } from "@/types/mission-control";
import { formatUtcShort, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useResolveReview } from "@/hooks/use-mission-data";

const priorityStyles: Record<PendingReviewItem["priority"], string> = {
  critical: "text-critical border-critical/40",
  elevated: "text-warning border-warning/40",
  routine: "text-muted-foreground border-grid-line",
};

export function ReviewItem({ item }: { item: PendingReviewItem }) {
  const resolve = useResolveReview();
  const pending = resolve.isPending;

  return (
    <article className="rounded border border-grid-line bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-widest",
            priorityStyles[item.priority],
          )}
        >
          {item.tag}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {formatUtcShort(item.proposedAt)} · {timeAgo(item.proposedAt)}
        </span>
      </div>

      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        From · <span className="text-foreground/70">{item.agentName}</span>
      </div>

      <p className="mt-1.5 text-xs leading-snug text-foreground/85">
        {item.summary}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            resolve.mutate({ id: item.id, resolution: "approved" })
          }
          className="rounded border border-signal/40 bg-signal/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-signal transition-colors hover:bg-signal/20 hover:shadow-[0_0_10px_var(--signal)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ◉ Approve
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            resolve.mutate({ id: item.id, resolution: "aborted" })
          }
          className="rounded border border-critical/40 bg-critical/10 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-critical transition-colors hover:bg-critical/20 hover:shadow-[0_0_10px_var(--critical)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ✕ Abort
        </button>
      </div>
    </article>
  );
}
