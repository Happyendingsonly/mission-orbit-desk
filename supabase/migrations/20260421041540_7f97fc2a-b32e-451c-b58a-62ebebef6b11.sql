INSERT INTO public.agents (name, status, current_mission, last_contact, description, provider, model, credentials_location, key_last_rotated_at, config_notes)
VALUES (
  'CLAUDE-ARCHITECT',
  'IDLE',
  NULL,
  now(),
  'Reads the brain + Happy Vault code, writes implementation plans, proposes fixes as pending reviews. Runs on Mac Mini M4. Hands off approved plans to KIMI-EXECUTOR.',
  'Anthropic API',
  'claude-opus-4-5',
  'Mac Mini M4: ~/claude-brain/.env → ANTHROPIC_API_KEY (shared with REFLECTION-01)',
  now(),
  'Same key as REFLECTION-01 — rotates together.'
);

UPDATE public.agents
SET description = 'DEPRECATED — replaced by CLAUDE-ARCHITECT. Kept for historical log entries.',
    status = 'IDLE',
    current_mission = NULL
WHERE name = 'CLAUDE-ANALYST';