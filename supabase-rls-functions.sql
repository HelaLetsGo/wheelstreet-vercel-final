-- Function to check if RLS is enabled for a table
CREATE OR REPLACE FUNCTION check_rls_enabled(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_enabled BOOLEAN;
BEGIN
  SELECT rowsecurity INTO is_enabled FROM pg_tables WHERE tablename = table_name;
  RETURN is_enabled;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Function to enable RLS for a table
CREATE OR REPLACE FUNCTION enable_rls(table_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error enabling RLS: %', SQLERRM;
END;
$$;

-- Function to drop a policy if it exists
CREATE OR REPLACE FUNCTION drop_policy_if_exists(table_name TEXT, policy_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error dropping policy: %', SQLERRM;
END;
$$;

-- Function to create admin policy
CREATE OR REPLACE FUNCTION create_admin_policy(table_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('CREATE POLICY "Admins can do everything with %1$I" ON %1$I FOR ALL USING (auth.role() = ''authenticated'')', table_name);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating admin policy: %', SQLERRM;
END;
$$;

-- Function to create anonymous select policy
CREATE OR REPLACE FUNCTION create_anon_select_policy(table_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('CREATE POLICY "Anonymous users can select %1$I" ON %1$I FOR SELECT USING (auth.role() = ''anon'')', table_name);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating anon policy: %', SQLERRM;
END;
$$;
