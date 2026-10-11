import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Globe, Award, Brain, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';

const stats = [
  { value: '1,600+', label: 'Global Universities', sub: 'across 50+ countries' },
  { value: '22+', label: 'Verified Scholarships', sub: 'fully funded options' },
  { value: 'AI', label: 'Smart Matching Engine', sub: 'profile-based fits' },
  { value: '100%', label: 'Free to Use', sub: 'no paywalls, ever' },
];

const badges = [
  { icon: Brain, label: 'AI Career Mapping', color: 'text-primary-300' },
  { icon: Zap, label: 'Real-Time Skill Gap Analysis', color: 'text-accent-300' },
  { icon: Target, label: '100% Personalized Paths', color: 'text-secondary-300' },
];

const floatingCards = [
  { icon: GraduationCap, label: 'World Universities', color: 'from-primary-400 to-primary-600', delay: '0s', x: '8%', y: '20%' },
  { icon: Award, label: 'Scholarships', color: 'from-accent-400 to-accent-600', delay: '1s', x: '78%', y: '15%' },
  { icon: Globe, label: 'Study Abroad', color: 'from-secondary-400 to-secondary-600', delay: '2s', x: '12%', y: '70%' },
  { icon: Brain, label: 'AI Matching', color: 'from-primary-400 to-secondary-600', delay: '0.5s', x: '82%', y: '68%' },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden animated-gradient">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {floatingCards.map((card) => (
        <div
          key={card.label}
          className="absolute hidden lg:flex flex-col items-center gap-2 animate-float"
          style={{ left: card.x, top: card.y, animationDelay: card.delay }}
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-xl glass-light`}>
            <card.icon className="w-7 h-7 text-white" />
          </div>
          <span className="text-xs font-medium text-white/70 glass-light px-3 py-1 rounded-full">{card.label}</span>
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <Sparkles className="w-4 h-4 text-primary-300" />
          <span className="text-sm text-dark-100 font-medium">AI-Powered Education & Career Pathfinding</span>
        </div>

        <h1 className={`font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.1] mb-6 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          Navigate Your Future with<br className="hidden sm:block" />{' '}
          <span className="text-gradient-primary">EduPilot AI</span>
        </h1>

        <p className={`text-base sm:text-lg text-dark-200 max-w-2xl mx-auto mb-8 leading-relaxed ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          Our AI maps out personalized learning paths and career goals tailored to your strengths — from university discovery to scholarship matching and skill gap analysis.
        </p>

        <div className={`flex flex-wrap items-center justify-center gap-3 mb-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.25s' }}>
          {badges.map((badge) => (
            <div key={badge.label} className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full">
              <badge.icon className={`w-4 h-4 ${badge.color}`} />
              <span className="text-sm text-white font-medium">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <Link
            to="/assessment"
            className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Brain className="w-5 h-5" />
            Explore Your Path
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/ai-guidance"
            className="px-8 py-4 glass text-white font-semibold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-primary-300" />
            Try AI Navigator
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card rounded-2xl p-5 text-left hover:border-primary-400/30 transition-all hover:scale-105 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary-300" />
                <div className="text-2xl lg:text-3xl font-display font-bold text-gradient-primary">{stat.value}</div>
              </div>
              <div className="text-sm font-semibold text-white">{stat.label}</div>
              <div className="text-xs text-dark-300 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
