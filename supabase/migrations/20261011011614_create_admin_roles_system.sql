
/*
# Admin Roles System – user_roles table + security functions

## Overview
Creates a secure role management layer for the Pathfinder admin system.
Supports `super_admin` and `admin` roles. Public signup can NEVER grant admin
privileges. Only an existing `super_admin` can promote users to `admin`.

## New Tables
### `user_roles`
- `user_id` (uuid, PK, FK to auth.users ON DELETE CASCADE)
- `role` (text, NOT NULL, CHECK in 'super_admin','admin')
- `created_at` (timestamptz)
- `created_by` (uuid, nullable, FK to auth.users)
RLS enabled. Users can read their own role. All writes go through
SECURITY DEFINER functions callable only by authenticated users.

## Security Functions (SECURITY DEFINER)
1. `is_super_admin()` — returns true if auth.uid() has role 'super_admin'
2. `is_admin()` — returns true if auth.uid() has role 'super_admin' or 'admin'
3. `get_my_role()` — returns the current user's role string or NULL
4. `promote_to_admin(target_user_id uuid)` — super_admin only; inserts 'admin' role
5. `demote_admin(target_user_id uuid)` — super_admin only; removes 'admin' role
6. `set_initial_super_admin(target_user_id uuid)` — one-time bootstrap; callable
   by anyone authenticated BUT only works if NO super_admin exists yet. After
   the first super_admin is set, this function refuses to run.

## Security Notes
- user_roles has NO public INSERT/UPDATE/DELETE policies. All mutations go
  through SECURITY DEFINER functions that verify caller identity.
- The `set_initial_super_admin` function is a bootstrap: it checks
  `NOT EXISTS (SELECT 1 FROM user_roles WHERE role = 'super_admin')` and
  only then inserts. Once a super_admin exists, it raises an exception.
- `promote_to_admin` and `demote_admin` check `is_super_admin()` first.
- No service-role keys are exposed to the frontend.
*/

-- ─── user_roles table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id     uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('super_admin', 'admin')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role only
DROP POLICY IF EXISTS "user_roles_select_own" ON user_roles;
CREATE POLICY "user_roles_select_own"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT / UPDATE / DELETE policies — all mutations via SECURITY DEFINER funcs

-- ─── Helper functions (SECURITY DEFINER, fixed search_path) ──────────────────

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM user_roles WHERE user_id = auth.uid();
$$;

-- ─── Bootstrap: set initial super_admin (one-time only) ──────────────────────

CREATE OR REPLACE FUNCTION set_initial_super_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Refuse if any super_admin already exists
  IF EXISTS (SELECT 1 FROM user_roles WHERE role = 'super_admin') THEN
    RAISE EXCEPTION 'A super_admin already exists. Use promote_to_admin instead.';
  END IF;

  -- Only an authenticated user can call this
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be signed in to perform this action.';
  END IF;

  INSERT INTO user_roles (user_id, role, created_by)
  VALUES (target_user_id, 'super_admin', auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', created_by = auth.uid();
END;
$$;

-- ─── Promote to admin (super_admin only) ─────────────────────────────────────

CREATE OR REPLACE FUNCTION promote_to_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Only a super_admin can promote users.';
  END IF;

  INSERT INTO user_roles (user_id, role, created_by)
  VALUES (target_user_id, 'admin', auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin', created_by = auth.uid();
END;
$$;

-- ─── Demote admin (super_admin only, cannot demote self) ─────────────────────

CREATE OR REPLACE FUNCTION demote_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Only a super_admin can demote users.';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot demote yourself.';
  END IF;

  DELETE FROM user_roles WHERE user_id = target_user_id AND role = 'admin';
END;
$$;

-- ─── Grant execute to authenticated ──────────────────────────────────────────
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION set_initial_super_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION promote_to_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION demote_admin(uuid) TO authenticated;
