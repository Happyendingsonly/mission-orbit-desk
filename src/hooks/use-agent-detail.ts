import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  type ActivityEntry,
  type LogClassification,
  type PendingReviewItem,
  type ReviewPriority,
} from "@/types/mission-control";

export const agentDetailKeys = {
  transmissions: (name: string) =>
    ["mission", "agent", name, "transmissions"] as const,
  decisions: (name: string) =>
    ["mission", "agent", name, "decisions"] as const,
  stats: (name: string) => ["mission", "agent", name, "stats"] as const,
};

export interface AgentDecision {
  id: string;
  tag: string;
  summary: string;
  priority: ReviewPriority;
  proposedAt: string;
  resolvedAt: string | null;
  resolution: "approved" | "aborted" | null;
}

export interface AgentStats {
  totalTransmissions: number;
  totalDecisions: number;
  approvedCount: number;
  resolvedCount: number;
  approvalRate: number | null;
  firstSeen: string | null;
  lastSeen: string | null;
}

export function useAgentTransmissions(agentName: string, enabled = true) {
  return useQuery({
    queryKey: agentDetailKeys.transmissions(agentName),
    enabled,
    queryFn: async (): Promise<ActivityEntry[]> => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("id,timestamp,agent_name,message,classification")
        .eq("agent_name", agentName)
        .order("timestamp", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        timestamp: row.timestamp,
        agentName: row.agent_name,
        message: row.message,
        classification: row.classification as LogClassification,
      }));
    },
  });
}

export function useAgentDecisions(agentName: string, enabled = true) {
  return useQuery({
    queryKey: agentDetailKeys.decisions(agentName),
    enabled,
    queryFn: async (): Promise<AgentDecision[]> => {
      const { data, error } = await supabase
        .from("pending_reviews")
        .select("id,tag,summary,priority,proposed_at,resolved_at,resolution")
        .eq("agent_name", agentName)
        .order("proposed_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        tag: row.tag,
        summary: row.summary,
        priority: row.priority as ReviewPriority,
        proposedAt: row.proposed_at,
        resolvedAt: row.resolved_at,
        resolution: row.resolution as "approved" | "aborted" | null,
      }));
    },
  });
}

export function useAgentStats(agentName: string, enabled = true) {
  return useQuery({
    queryKey: agentDetailKeys.stats(agentName),
    enabled,
    queryFn: async (): Promise<AgentStats> => {
      const [txCount, decisions, firstSeen, lastSeen] = await Promise.all([
        supabase
          .from("activity_log")
          .select("id", { count: "exact", head: true })
          .eq("agent_name", agentName),
        supabase
          .from("pending_reviews")
          .select("resolution")
          .eq("agent_name", agentName),
        supabase
          .from("activity_log")
          .select("timestamp")
          .eq("agent_name", agentName)
          .order("timestamp", { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("activity_log")
          .select("timestamp")
          .eq("agent_name", agentName)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (txCount.error) throw txCount.error;
      if (decisions.error) throw decisions.error;
      if (firstSeen.error) throw firstSeen.error;
      if (lastSeen.error) throw lastSeen.error;

      const allDecisions = decisions.data ?? [];
      const resolved = allDecisions.filter((d) => d.resolution !== null);
      const approved = resolved.filter((d) => d.resolution === "approved");
      const approvalRate =
        resolved.length > 0
          ? Math.round((approved.length / resolved.length) * 100)
          : null;

      return {
        totalTransmissions: txCount.count ?? 0,
        totalDecisions: allDecisions.length,
        approvedCount: approved.length,
        resolvedCount: resolved.length,
        approvalRate,
        firstSeen: firstSeen.data?.timestamp ?? null,
        lastSeen: lastSeen.data?.timestamp ?? null,
      };
    },
  });
}
