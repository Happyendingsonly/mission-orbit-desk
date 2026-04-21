-- Single-row registry that locks the console to one operator.
-- Once a row exists here, the app disables the registration form and
-- only allows that user to sign in.
CREATE TABLE public.operator_registry (
  id INTEGER PRIMARY KEY DEFAULT 1,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT operator_registry_singleton CHECK (id = 1)
);

ALTER TABLE public.operator_registry ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read the registry — needed so the login
-- screen can detect whether enrollment is still open. Only the email
-- and user_id are stored, no sensitive data.
CREATE POLICY "Registry is publicly readable"
  ON public.operator_registry
  FOR SELECT
  USING (true);

-- Anyone can attempt to claim the operator slot, but the singleton
-- CHECK constraint + primary key on id=1 means only the FIRST insert
-- succeeds. All subsequent attempts fail with a duplicate key error.
CREATE POLICY "Anyone can attempt to claim the operator slot"
  ON public.operator_registry
  FOR INSERT
  WITH CHECK (true);

-- No update/delete policies → registry is immutable once claimed.