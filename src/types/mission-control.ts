export enum AgentStatus {
  IDLE = "IDLE",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  lastContact: string; // ISO timestamp
  currentMission?: string | null;
  description?: string | null;
}

export type ReviewPriority = "routine" | "elevated" | "critical";
export type ReviewResolution = "approved" | "aborted";

export interface PendingReviewItem {
  id: string;
  tag: string;
  agentName: string;
  summary: string;
  proposedAt: string;
  priority: ReviewPriority;
}

export type LogClassification = "INFO" | "WARN" | "OK";

export interface ActivityEntry {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  classification: LogClassification;
}
