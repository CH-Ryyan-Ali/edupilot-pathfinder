
-- Bootstrap: set the first registered user (usman) as super_admin
-- This is safe because no super_admin exists yet (verified: count = 0).
-- After this, only set_initial_super_admin (which also checks this) or
-- promote_to_admin (super_admin only) can change roles.
INSERT INTO user_roles (user_id, role)
VALUES ('0f774d84-767a-47b0-a6c8-e155068fbbcf', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
