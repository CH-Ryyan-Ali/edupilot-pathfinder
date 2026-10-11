
/*
# Admin dashboard helper functions

## Overview
Adds two SECURITY DEFINER functions needed by the admin dashboard:
1. `list_admin_users()` — returns all users with admin roles (super_admin or admin).
   Only callable by users who themselves have an admin role.
2. `find_user_by_email(search_email text)` — searches auth.users by email and returns
   { id, email }. Only callable by super_admin.

## Security
- Both functions are SECURITY DEFINER with fixed search_path = public.
- `list_admin_users` checks is_admin() before returning data.
- `find_user_by_email` checks is_super_admin() before returning data.
- Neither function exposes passwords, tokens, or sensitive metadata.
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
    au.email,
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
  SELECT id, email
  FROM auth.users
  WHERE email = lower(search_email)
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION list_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION find_user_by_email(text) TO authenticated;
