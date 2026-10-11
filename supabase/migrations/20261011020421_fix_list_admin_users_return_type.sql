
/*
# Fix list_admin_users return type mismatch

## Root Cause
auth.users.email is `character varying(255)` (varchar), but the function's
RETURNS TABLE declares `email text`. PostgreSQL's RETURN QUERY requires
the SELECT column types to exactly match the declared return column types.
varchar -> text is not an implicit cast in this context, causing:
"structure of query does not match function result type"

## Fix
Explicitly cast au.email::text in the RETURN QUERY SELECT.
Also cast find_user_by_email's email column the same way for consistency.

## Safety
- No tables altered, no data changed
- SECURITY DEFINER preserved with fixed search_path = public
- is_admin() / is_super_admin() authorization checks preserved
- anon EXECUTE remains revoked (from prior migration)
*/

CREATE OR REPLACE FUNCTION list_admin_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT
    ur.user_id,
    au.email::text,
    ur.role,
    ur.created_at
  FROM user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  ORDER BY
    CASE WHEN ur.role = 'super_admin' THEN 0 ELSE 1 END,
    ur.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION find_user_by_email(search_email text)
RETURNS TABLE (
  id uuid,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin role required.';
  END IF;

  RETURN QUERY
  SELECT id, email::text
  FROM auth.users
  WHERE email = lower(search_email)
  LIMIT 1;
END;
$$;

-- Re-grant only to authenticated (anon stays revoked)
GRANT EXECUTE ON FUNCTION list_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION find_user_by_email(text) TO authenticated;
