import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Mail, Lock, User, Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'signup';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, refreshRole } = useAdminAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    // Fetch role after login
    await refreshRole();
    navigate('/admin/dashboard');
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const { error: err, needsBootstrap } = await signUp(email, password, name);
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }

    if (needsBootstrap) {
      // Try to set initial super_admin — will only work if no super_admin exists yet
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.user?.id;
      if (userId) {
        const { error: bootstrapErr } = await supabase.rpc('set_initial_super_admin', {
          target_user_id: userId,
        });
        if (bootstrapErr) {
          setInfo(
            'Account created, but a super_admin already exists. You need to ask the super_admin to promote your account.'
          );
        } else {
          setInfo('Account created and you have been set as the initial super_admin. You can now sign in.');
          setMode('login');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-secondary-900/20" />

      <div className="relative w-full max-w-md">
        {/* Back to site */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-dark-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pathfinder
        </Link>

        <div className="glass-card rounded-3xl p-8">
          {/* Logo + heading */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-xl text-white">Admin Portal</div>
              <div className="text-[10px] text-primary-300 uppercase tracking-wider">Pathfinder EduPilot AI</div>
            </div>
          </div>

          <h2 className="font-display font-bold text-2xl text-white mb-1">
            {mode === 'login' ? 'Admin Sign In' : 'Create Admin Account'}
          </h2>
          <p className="text-dark-300 text-sm mb-6">
            {mode === 'login'
              ? 'Sign in to access the admin dashboard.'
              : 'Create your account. The first account becomes the super_admin automatically.'}
          </p>

          {error && (
            <div className="flex items-start gap-2 mb-4 px-4 py-3 rounded-xl bg-error-500/10 border border-error-500/20">
              <AlertCircle className="w-4 h-4 text-error-500 shrink-0 mt-0.5" />
              <p className="text-sm text-error-500">{error}</p>
            </div>
          )}

          {info && (
            <div className="flex items-start gap-2 mb-4 px-4 py-3 rounded-xl bg-success-500/10 border border-success-500/20">
              <ShieldCheck className="w-4 h-4 text-success-600 shrink-0 mt-0.5" />
              <p className="text-sm text-success-600">{info}</p>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900/60 border border-white/10 rounded-xl text-white placeholder-dark-400 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-900/60 border border-white/10 rounded-xl text-white placeholder-dark-400 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 bg-dark-900/60 border border-white/10 rounded-xl text-white placeholder-dark-400 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-300 mt-5">
            {mode === 'login' ? "Don't have an admin account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }}
              className="text-primary-300 hover:text-primary-200 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-dark-400 mt-4">
          Admin access is restricted. All actions are logged and verified.
        </p>
      </div>
    </div>
  );
}
