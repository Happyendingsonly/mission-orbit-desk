import { useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AgentStatus,
  type ActivityEntry,
  type Agent,
  type LogClassification,
  type PendingReviewItem,
  type ReviewPriority,
  type ReviewResolution,
} from "@/types/mission-control";

// ---------- Query keys ----------
export const missionKeys = {
  agents: ["mission", "agents"] as const,
  reviews: ["mission", "pending_reviews"] as const,
  log: ["mission", "activity_log"] as const,
};

// ---------- Fetchers ----------
async function fetchAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from("agents")
    .select("id,name,status,current_mission,last_contact,description")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status as AgentStatus,
    currentMission: row.current_mission,
    lastContact: row.last_contact,
    description: row.description,
  }));
}

async function fetchPendingReviews(): Promise<PendingReviewItem[]> {
  const { data, error } = await supabase
    .from("pending_reviews")
    .select("id,tag,agent_name,summary,priority,proposed_at")
    .is("resolved_at", null)
    .order("proposed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    tag: row.tag,
    agentName: row.agent_name,
    summary: row.summary,
    priority: row.priority as ReviewPriority,
    proposedAt: row.proposed_at,
  }));
}

async function fetchActivityLog(): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("id,timestamp,agent_name,message,classification")
    .order("timestamp", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    timestamp: row.timestamp,
    agentName: row.agent_name,
    message: row.message,
    classification: row.classification as LogClassification,
  }));
}

// ---------- Hooks ----------
export function useAgents() {
  return useQuery({ queryKey: missionKeys.agents, queryFn: fetchAgents });
}

export function usePendingReviews() {
  return useQuery({
    queryKey: missionKeys.reviews,
    queryFn: fetchPendingReviews,
  });
}

export function useActivityLog() {
  return useQuery({ queryKey: missionKeys.log, queryFn: fetchActivityLog });
}

// ---------- Realtime ----------
export function useMissionRealtime() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("mission-control")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "activity_log" },
        () => qc.invalidateQueries({ queryKey: missionKeys.log }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pending_reviews" },
        () => qc.invalidateQueries({ queryKey: missionKeys.reviews }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agents" },
        () => qc.invalidateQueries({ queryKey: missionKeys.agents }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);
}

// ---------- Mutations ----------
export function useResolveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      resolution: ReviewResolution;
    }) => {
      const { error } = await supabase
        .from("pending_reviews")
        .update({
          resolution: params.resolution,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: missionKeys.reviews });
    },
  });
}
