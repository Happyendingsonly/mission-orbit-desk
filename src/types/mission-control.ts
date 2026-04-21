export enum AgentStatus {
  IDLE = "IDLE",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export type AgentKind = "analyst" | "executor" | "reflection";

export interface Agent {
  id: string;
  name: string;
  kind: AgentKind;
  status: AgentStatus;
  lastContact: string; // ISO timestamp
  currentMission?: string;
}

export type ReviewPriority = "routine" | "elevated" | "critical";

export interface PendingReviewItem {
  id: string;
  tag: string; // e.g. "PAYMENTS-01"
  agentId: string;
  agentName: string;
  summary: string;
  proposedAt: string;
  priority: ReviewPriority;
}

export type LogClassification = "INFO" | "WARN" | "OK";

export interface ActivityEntry {
  id: string;
  timestamp: string; // ISO
  agentName: string;
  message: string;
  classification: LogClassification;
}
