
/*
# Fix anon execute on admin functions

The previous REVOKE didn't take because Supabase's PostgREST layer
re-exposes public-schema functions to anon. We fix this by:
1. REVOKE ALL on the functions from anon and PUBLIC.
2. GRANT EXECUTE only to authenticated.
3. Also REVOKE all table privileges on user_roles from anon (should already
   be restricted by RLS, but belt-and-suspenders).
*/

REVOKE ALL ON FUNCTION is_super_admin() FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION is_admin() FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION get_my_role() FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION set_initial_super_admin(uuid) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION promote_to_admin(uuid) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION demote_admin(uuid) FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION list_admin_users() FROM anon, PUBLIC;
REVOKE ALL ON FUNCTION find_user_by_email(text) FROM anon, PUBLIC;

-- Re-grant only to authenticated
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION set_initial_super_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION promote_to_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION demote_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION list_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION find_user_by_email(text) TO authenticated;

-- Also revoke table privileges from anon on user_roles
REVOKE ALL ON user_roles FROM anon;
