-- =========================================
-- AGENTS
-- =========================================
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('ACTIVE','IDLE','BLOCKED')),
  current_mission text,
  last_contact timestamptz NOT NULL DEFAULT now(),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read agents"
  ON public.agents FOR SELECT
  TO authenticated
  USING (true);

-- =========================================
-- PENDING REVIEWS
-- =========================================
CREATE TABLE public.pending_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL,
  agent_name text NOT NULL,
  summary text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('critical','elevated','routine')),
  proposed_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolution text CHECK (resolution IN ('approved','aborted'))
);
ALTER TABLE public.pending_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read pending_reviews"
  ON public.pending_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert pending_reviews"
  ON public.pending_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can resolve pending_reviews"
  ON public.pending_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =========================================
-- ACTIVITY LOG
-- =========================================
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  agent_name text NOT NULL,
  message text NOT NULL,
  classification text NOT NULL CHECK (classification IN ('OK','INFO','WARN'))
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read activity_log"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert activity_log"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_activity_log_timestamp ON public.activity_log (timestamp DESC);
CREATE INDEX idx_pending_reviews_unresolved ON public.pending_reviews (proposed_at DESC) WHERE resolved_at IS NULL;

-- =========================================
-- REALTIME
-- =========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pending_reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agents;

-- =========================================
-- SEED (mirrors src/lib/mock-data.ts)
-- =========================================
INSERT INTO public.agents (name, status, current_mission, last_contact, description) VALUES
  ('CLAUDE-ANALYST', 'ACTIVE',  'Q3 revenue variance synthesis',     now() - interval '42 seconds',  'Synthesizes financial telemetry into operator-grade briefings.'),
  ('GPT-OPERATIONS', 'ACTIVE',  'Vendor SLA reconciliation',         now() - interval '2 minutes',   'Monitors operational pipelines across third-party vendors.'),
  ('GEMINI-RESEARCH','IDLE',    NULL,                                now() - interval '11 minutes',  'Long-horizon research scouting for strategic opportunities.'),
  ('SONNET-LEGAL',   'BLOCKED', 'Awaiting NDA template confirmation',now() - interval '37 minutes',  'Drafts and triages legal correspondence and contracts.'),
  ('NOVA-MARKETING', 'ACTIVE',  'Drafting Q4 launch narrative',      now() - interval '1 minute',    'Produces narrative drafts and campaign copy for review.');

INSERT INTO public.pending_reviews (tag, agent_name, summary, priority, proposed_at) VALUES
  ('PAYMENTS-01',  'GPT-OPERATIONS', 'Authorize emergency wire to logistics partner — flagged outside normal cadence.', 'critical', now() - interval '6 minutes'),
  ('CONTENT-14',   'NOVA-MARKETING', 'Approve revised Q4 launch headline; tone shifted from technical to founder voice.', 'elevated', now() - interval '14 minutes'),
  ('LEGAL-07',     'SONNET-LEGAL',   'Counter-sign vendor NDA with revised IP clause.',                                  'routine',  now() - interval '38 minutes');

INSERT INTO public.activity_log (timestamp, agent_name, message, classification) VALUES
  (now() - interval '20 seconds',  'CLAUDE-ANALYST', 'Variance brief compiled. 3 anomalies above threshold.',           'INFO'),
  (now() - interval '50 seconds',  'GPT-OPERATIONS', 'Vendor heartbeat OK across 14 partners.',                         'OK'),
  (now() - interval '95 seconds',  'NOVA-MARKETING', 'Draft revision queued for operator review.',                      'INFO'),
  (now() - interval '3 minutes',   'SONNET-LEGAL',   'Blocked: missing NDA template revision.',                         'WARN'),
  (now() - interval '4 minutes',   'GPT-OPERATIONS', 'Logistics anomaly detected. Awaiting authorization.',             'WARN'),
  (now() - interval '7 minutes',   'CLAUDE-ANALYST', 'Upstream feed reconnected. Resuming synthesis.',                  'OK'),
  (now() - interval '12 minutes',  'GEMINI-RESEARCH','Idle window opened. Awaiting next mission.',                      'INFO'),
  (now() - interval '18 minutes',  'NOVA-MARKETING', 'Headline tone shifted toward founder voice per directive.',       'INFO');