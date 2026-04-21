-- Function to bump agents.last_contact whenever activity_log gets a new row
CREATE OR REPLACE FUNCTION public.bump_agent_last_contact()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.agents
  SET last_contact = NEW.timestamp
  WHERE name = NEW.agent_name;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_agent_last_contact ON public.activity_log;

CREATE TRIGGER trg_bump_agent_last_contact
AFTER INSERT ON public.activity_log
FOR EACH ROW
EXECUTE FUNCTION public.bump_agent_last_contact();

-- Allow authenticated operators to update agents (needed because trigger runs as definer,
-- but we also want operators to be able to manually update if needed)
DROP POLICY IF EXISTS "Authenticated can update agents" ON public.agents;
CREATE POLICY "Authenticated can update agents"
ON public.agents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);