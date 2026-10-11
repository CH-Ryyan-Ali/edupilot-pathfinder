import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, Users, Mail, Loader2, ArrowLeft, LogOut,
  UserPlus, UserMinus, Crown, AlertCircle, Search,
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { supabase } from '@/lib/supabase';

type AdminUser = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, role, loading, signOut, refreshRole } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<{ id: string; email: string } | null>(null);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (role !== 'super_admin' && role !== 'admin') {
      navigate('/admin/login');
      return;
    }
  }, [user, role, loading, navigate]);

  const isSuperAdmin = role === 'super_admin';

  const fetchAdmins = useCallback(async () => {
    setAdminsLoading(true);
    // We can't directly query user_roles for all rows (RLS only lets us see our own).
    // Use the is_admin() / is_super_admin() RPC to verify, and fetch via a
    // SECURITY DEFINER function we'll call. But since we only have the policies,
    // super_admins need a way to see all admins. Let's use execute_sql approach
    // through an RPC that returns the list.
    //
    // Actually, RLS only allows SELECT on own row. Super_admin needs to see all.
    // We need a SECURITY DEFINER function that returns all admin users.
    // Let's call it via RPC.
    const { data, error: err } = await supabase.rpc('list_admin_users');
    if (err) {
      // Function might not exist yet — handle gracefully
      setError('Could not load admin list: ' + err.message);
    } else if (data) {
      setAdmins(data as AdminUser[]);
    }
    setAdminsLoading(false);
  }, []);

  useEffect(() => {
    if (user && (role === 'super_admin' || role === 'admin')) {
      fetchAdmins();
    }
  }, [user, role, fetchAdmins]);

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    setSearching(true);
    setError('');
    setSearchResult(null);

    const { data, error: err } = await supabase.rpc('find_user_by_email', {
      search_email: searchEmail.trim().toLowerCase(),
    });

    if (err) {
      setError('Search failed: ' + err.message);
    } else if (data && data.length > 0) {
      setSearchResult(data[0]);
    } else {
      setError('No user found with that email.');
    }
    setSearching(false);
  };

  const handlePromote = async (targetUserId: string, targetEmail: string) => {
    setError('');
    setSuccess('');
    setActionLoading(targetUserId);
    const { error: err } = await supabase.rpc('promote_to_admin', {
      target_user_id: targetUserId,
    });
    if (err) {
      setError('Failed to promote: ' + err.message);
    } else {
      setSuccess(`${targetEmail} has been promoted to admin.`);
      fetchAdmins();
    }
    setActionLoading(null);
  };

  const handleDemote = async (targetUserId: string, targetEmail: string) => {
    setError('');
    setSuccess('');
    setActionLoading(targetUserId);
    const { error: err } = await supabase.rpc('demote_admin', {
      target_user_id: targetUserId,
    });
    if (err) {
      setError('Failed to demote: ' + err.message);
    } else {
      setSuccess(`${targetEmail} has been removed from admin.`);
      fetchAdmins();
    }
    setActionLoading(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header bar */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-white">Admin Dashboard</div>
              <div className="text-xs text-dark-300">
                Signed in as <span className="text-primary-300 font-medium">{user?.email}</span>
                {' · '}
                <span className={`font-medium ${isSuperAdmin ? 'text-warning-600' : 'text-primary-300'}`}>
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 glass-light text-dark-200 text-sm rounded-xl hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 glass-light text-dark-200 text-sm rounded-xl hover:text-error-500 hover:bg-error-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="flex items-start gap-2 mb-6 px-4 py-3 rounded-xl bg-error-500/10 border border-error-500/20">
            <AlertCircle className="w-4 h-4 text-error-500 shrink-0 mt-0.5" />
            <p className="text-sm text-error-500">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 mb-6 px-4 py-3 rounded-xl bg-success-500/10 border border-success-500/20">
            <ShieldCheck className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
            <p className="text-sm text-success-600">{success}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-300" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">{admins.length}</div>
                <div className="text-xs text-dark-400">Total Admins</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">
                  {admins.filter(a => a.role === 'super_admin').length}
                </div>
                <div className="text-xs text-dark-400">Super Admins</div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-secondary-300" />
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-white">
                  {admins.filter(a => a.role === 'admin').length}
                </div>
                <div className="text-xs text-dark-400">Regular Admins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Super admin only: promote/demote section */}
        {isSuperAdmin && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <h3 className="font-display font-bold text-lg text-white mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary-300" /> Manage Admin Roles
            </h3>
            <p className="text-sm text-dark-300 mb-4">
              Search for a registered user by email to promote or demote them.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchUser()}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900/60 border border-white/10 rounded-xl text-white placeholder-dark-400 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                />
              </div>
              <button
                onClick={handleSearchUser}
                disabled={searching || !searchEmail.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>

            {searchResult && (
              <div className="glass-light rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{searchResult.email}</div>
                    <div className="text-xs text-dark-400">User ID: {searchResult.id.substring(0, 8)}...</div>
                  </div>
                </div>
                <button
                  onClick={() => handlePromote(searchResult.id, searchResult.email)}
                  disabled={actionLoading === searchResult.id}
                  className="px-4 py-2 bg-success-600/20 text-success-600 text-sm font-medium rounded-lg hover:bg-success-600/30 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  {actionLoading === searchResult.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                  Promote to Admin
                </button>
              </div>
            )}
          </div>
        )}

        {/* Admin list */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-300" /> Admin Users
          </h3>

          {adminsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
            </div>
          ) : admins.length === 0 ? (
            <p className="text-sm text-dark-300 text-center py-8">No admin users found.</p>
          ) : (
            <div className="space-y-3">
              {admins.map(admin => (
                <div
                  key={admin.user_id}
                  className="glass-light rounded-xl p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      admin.role === 'super_admin'
                        ? 'bg-gradient-to-br from-warning-500 to-warning-700'
                        : 'bg-gradient-to-br from-primary-400 to-secondary-600'
                    }`}>
                      {admin.role === 'super_admin' ? (
                        <Crown className="w-5 h-5 text-white" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {admin.email}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          admin.role === 'super_admin'
                            ? 'bg-warning-500/15 text-warning-600'
                            : 'bg-primary-500/15 text-primary-300'
                        }`}>
                          {admin.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Only super_admin can demote, and can't demote self or other super_admins */}
                  {isSuperAdmin && admin.role === 'admin' && admin.user_id !== user?.id && (
                    <button
                      onClick={() => handleDemote(admin.user_id, admin.email)}
                      disabled={actionLoading === admin.user_id}
                      className="px-3 py-2 text-sm text-dark-400 hover:text-error-500 transition-all flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {actionLoading === admin.user_id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <UserMinus className="w-3.5 h-3.5" />
                      )}
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Non-super-admin notice */}
        {!isSuperAdmin && (
          <div className="mt-6 glass-light rounded-xl p-4 flex items-start gap-3 border border-primary-500/20">
            <AlertCircle className="w-5 h-5 text-primary-300 shrink-0 mt-0.5" />
            <p className="text-sm text-dark-200">
              You have admin access. Only a super_admin can promote or demote users.
              Contact a super_admin if you need role changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
