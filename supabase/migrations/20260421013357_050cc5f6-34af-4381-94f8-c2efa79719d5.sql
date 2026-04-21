DROP POLICY IF EXISTS "Anyone can attempt to claim the operator slot" ON public.operator_registry;

-- Only allow an insert when the registry is still empty.
-- Once one row exists, this WITH CHECK evaluates to false for everyone.
CREATE POLICY "Claim operator slot only while registry is empty"
  ON public.operator_registry
  FOR INSERT
  WITH CHECK (NOT EXISTS (SELECT 1 FROM public.operator_registry));