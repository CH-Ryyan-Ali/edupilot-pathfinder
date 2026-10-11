import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Eye, EyeOff, Compass } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'signin' | 'signup';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else {
        // upsert profile name
        if (name.trim()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from('profiles').upsert({ id: session.user.id, full_name: name.trim() });
          }
        }
        setSuccess('Account created! You are now signed in.');
        setTimeout(onClose, 1500);
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError('Invalid email or password.');
      } else {
        onClose();
      }
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md glass-card rounded-3xl p-8 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg glass-light hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4 text-dark-200" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-white">Pathfinder</div>
            <div className="text-[10px] text-primary-300 uppercase tracking-wider">EduPilot AI</div>
          </div>
        </div>

        <h2 className="font-display font-bold text-2xl text-white mb-1">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-dark-300 text-sm mb-6">
          {mode === 'signin'
            ? 'Sign in to access your saved universities, scholarships and checklist.'
            : 'Save universities, track scholarships, and build your CV — all in one place.'}
        </p>

        <form onSubmit={submit} className="space-y-4">
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

          {error && (
            <p className="text-sm text-error-500 bg-error-500/10 border border-error-500/20 rounded-xl px-4 py-3">{error}</p>
          )}
          {success && (
            <p className="text-sm text-success-600 bg-success-500/10 border border-success-500/20 rounded-xl px-4 py-3">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-dark-300 mt-5">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={switchMode} className="text-primary-300 hover:text-primary-200 font-medium transition-colors">
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
