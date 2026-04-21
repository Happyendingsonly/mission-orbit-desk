ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS credentials_location text,
  ADD COLUMN IF NOT EXISTS key_last_rotated_at timestamptz,
  ADD COLUMN IF NOT EXISTS config_notes text;

UPDATE public.agents
SET provider = 'Anthropic API',
    model = 'claude-sonnet-4-5',
    credentials_location = 'Mac Mini M4: ~/claude-brain/.env → ANTHROPIC_API_KEY',
    key_last_rotated_at = now(),
    config_notes = 'Rotated 2026-04-20 after accidental screenshot exposure'
WHERE name = 'REFLECTION-01';

UPDATE public.agents
SET provider = 'Claude subscription (Max plan)',
    model = 'claude-opus-4-5 (via Claude Code)',
    credentials_location = 'Mac Mini M4: Claude Code OAuth token (no API key file)',
    key_last_rotated_at = NULL,
    config_notes = 'Uses Claude subscription via Claude Code, not API key. No rotation needed.'
WHERE name = 'CLAUDE-ANALYST';

UPDATE public.agents
SET provider = 'Kimi API (Moonshot AI)',
    model = 'kimi-k2-0711',
    credentials_location = 'OpenClaude M4 (separate machine): ~/.env → KIMI_API_KEY',
    key_last_rotated_at = NULL,
    config_notes = 'Running on the original OpenClaude Mac Mini. Has been running since before Mission Control existed. Rotate on next maintenance window.'
WHERE name = 'KIMI-EXECUTOR';