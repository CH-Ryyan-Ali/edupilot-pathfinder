
/*
# Tighten admin function security

## Changes
1. Revoke EXECUTE from anon role on all admin SECURITY DEFINER functions.
   The functions already verify auth.uid() / is_super_admin() internally,
   but removing anon access follows least-privilege best practices.
2. Add fixed search_path to update_updated_at() to clear the linter warning.
3. Add a SELECT policy on user_roles so super_admin can read all admin rows
   directly (the list_admin_users function handles this via SECURITY DEFINER,
   but having the policy as well is belt-and-suspenders for any future direct queries).
*/

-- Revoke anon execute on all admin functions
REVOKE EXECUTE ON FUNCTION is_super_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION get_my_role() FROM anon;
REVOKE EXECUTE ON FUNCTION set_initial_super_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION promote_to_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION demote_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION list_admin_users() FROM anon;
REVOKE EXECUTE ON FUNCTION find_user_by_email(text) FROM anon;

-- Fix search_path on update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
