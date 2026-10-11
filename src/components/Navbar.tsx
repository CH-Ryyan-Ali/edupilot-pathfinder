import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Universities', to: '/universities' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Assessment', to: '/assessment' },
  { label: 'Careers', to: '/career-roadmaps' },
  { label: 'CV Builder', to: '/cv-builder' },
  { label: 'AI Guidance', to: '/ai-guidance' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass py-3 shadow-lg shadow-black/20' : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/30 rounded-xl blur-lg group-hover:bg-primary-400/50 transition-all" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-lg text-white tracking-tight">Pathfinder</div>
              <div className="text-[10px] text-primary-300 font-medium tracking-wider uppercase">EduPilot AI</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-2.5 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive(link.to)
                    ? 'text-white bg-white/10'
                    : 'text-dark-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 glass-light rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-dark-100 max-w-[120px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 glass-light rounded-xl text-dark-300 hover:text-error-500 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105 transition-all text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg glass-light"
          >
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden mt-3 mx-4 glass rounded-2xl p-4 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-all text-left ${
                    isActive(link.to)
                      ? 'text-white bg-white/10'
                      : 'text-dark-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2 glass-light rounded-xl">
                  <span className="text-sm text-dark-100 truncate">{user.email}</span>
                  <button onClick={signOut} className="text-dark-300 hover:text-error-500 transition-colors ml-2">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setShowAuth(true); }}
                  className="block w-full px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl text-sm text-center"
                >
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
