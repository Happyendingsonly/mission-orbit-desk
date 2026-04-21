import {
  AgentStatus,
  type Agent,
  type ActivityEntry,
  type PendingReviewItem,
} from "@/types/mission-control";

export const agents: Agent[] = [
  {
    id: "claude-analyst",
    name: "CLAUDE-ANALYST",
    kind: "analyst",
    status: AgentStatus.ACTIVE,
    lastContact: "2026-04-21T14:32:11Z",
    currentMission: "Parsing Q2 retention cohorts",
  },
  {
    id: "kimi-executor",
    name: "KIMI-EXECUTOR",
    kind: "executor",
    status: AgentStatus.BLOCKED,
    lastContact: "2026-04-21T14:28:02Z",
    currentMission: "Awaiting payment approval — PAYMENTS-01",
  },
  {
    id: "reflection-01",
    name: "REFLECTION-01",
    kind: "reflection",
    status: AgentStatus.IDLE,
    lastContact: "2026-04-21T13:55:48Z",
  },
];

export const pendingReviews: PendingReviewItem[] = [
  {
    id: "rev-1",
    tag: "PAYMENTS-01",
    agentId: "kimi-executor",
    agentName: "KIMI-EXECUTOR",
    summary: "Disburse $1,240 vendor payout to Stripe destination acct_8x12.",
    proposedAt: "2026-04-21T14:25:00Z",
    priority: "critical",
  },
  {
    id: "rev-2",
    tag: "MSG-02",
    agentId: "claude-analyst",
    agentName: "CLAUDE-ANALYST",
    summary: "Send weekly investor digest draft (3 paragraphs, attached metrics).",
    proposedAt: "2026-04-21T14:10:00Z",
    priority: "elevated",
  },
  {
    id: "rev-3",
    tag: "OPS-07",
    agentId: "reflection-01",
    agentName: "REFLECTION-01",
    summary: "Archive 14 stale Linear issues flagged inactive >30d.",
    proposedAt: "2026-04-21T13:48:00Z",
    priority: "routine",
  },
];

export const activityLog: ActivityEntry[] = [
  {
    id: "log-1",
    timestamp: "2026-04-21T14:32:11Z",
    agentName: "CLAUDE-ANALYST",
    message: "Cohort segmentation complete · 7 segments identified",
    classification: "OK",
  },
  {
    id: "log-2",
    timestamp: "2026-04-21T14:30:44Z",
    agentName: "KIMI-EXECUTOR",
    message: "Payout request escalated to operator review",
    classification: "WARN",
  },
  {
    id: "log-3",
    timestamp: "2026-04-21T14:22:09Z",
    agentName: "CLAUDE-ANALYST",
    message: "Pulled 12,408 events from analytics warehouse",
    classification: "INFO",
  },
  {
    id: "log-4",
    timestamp: "2026-04-21T14:15:31Z",
    agentName: "REFLECTION-01",
    message: "Daily retrospective compiled · 3 insights archived",
    classification: "OK",
  },
  {
    id: "log-5",
    timestamp: "2026-04-21T14:02:18Z",
    agentName: "KIMI-EXECUTOR",
    message: "Drafted 4 outbound vendor messages",
    classification: "INFO",
  },
  {
    id: "log-6",
    timestamp: "2026-04-21T13:48:55Z",
    agentName: "REFLECTION-01",
    message: "Flagged 14 stale issues for archival",
    classification: "INFO",
  },
  {
    id: "log-7",
    timestamp: "2026-04-21T13:31:02Z",
    agentName: "CLAUDE-ANALYST",
    message: "Anomaly detected in churn signal · investigating",
    classification: "WARN",
  },
  {
    id: "log-8",
    timestamp: "2026-04-21T13:12:47Z",
    agentName: "KIMI-EXECUTOR",
    message: "Synced CRM contacts (218 updated)",
    classification: "OK",
  },
  {
    id: "log-9",
    timestamp: "2026-04-21T12:58:10Z",
    agentName: "REFLECTION-01",
    message: "Standby — no new context since 12:42",
    classification: "INFO",
  },
];

export const operator = {
  name: "Romo",
  org: "Happy Endings Inc",
};
