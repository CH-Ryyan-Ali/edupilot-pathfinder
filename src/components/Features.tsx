import { Brain, Compass, GraduationCap, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const features = [
  {
    icon: Brain,
    title: 'Diagnostic Assessment',
    description: '50 adaptive questions across aptitude, logic, spatial reasoning, and interests, mapped to a live compatibility radar.',
    color: 'from-primary-400 to-primary-600',
    glow: 'glow-primary',
  },
  {
    icon: Compass,
    title: 'Career Roadmap Engine',
    description: 'Salary benchmarks in PKR and USD, required skill matrices, and a visual path from high school to your first job.',
    color: 'from-secondary-400 to-secondary-600',
    glow: 'glow-secondary',
  },
  {
    icon: GraduationCap,
    title: '1,500+ Global Universities',
    description: 'Discover universities across 50+ countries — from NUST and LUMS to Oxford, MIT, and NUS. Filter by country, degree, and field.',
    color: 'from-accent-400 to-accent-600',
    glow: 'glow-accent',
  },
  {
    icon: Compass,
    title: 'AI University & Scholarship Matching',
    description: 'Answer a few questions and our AI engine matches you to universities and scholarships that fit your profile, budget, and goals.',
    color: 'from-primary-400 to-secondary-600',
    glow: 'glow-primary',
  },
  {
    icon: FileText,
    title: 'ATS-Optimized CV Builder',
    description: 'Template gallery with live preview and one-click PDF export, built to pass applicant tracking systems.',
    color: 'from-primary-400 to-secondary-600',
    glow: 'glow-primary',
  },
  {
    icon: MessageSquare,
    title: 'EduPilot AI Assistant',
    description: 'A conversational guide for admissions, merit calculations, and course selection, available around the clock.',
    color: 'from-secondary-400 to-accent-500',
    glow: 'glow-secondary',
  },
  {
    icon: TrendingUp,
    title: 'Job Market Dashboard',
    description: 'Live-style view of in-demand skills, emerging roles, and regional hiring trends across Pakistan and globally.',
    color: 'from-accent-400 to-primary-500',
    glow: 'glow-accent',
  },
  {
    icon: MessageSquare,
    title: 'AI Text Summarizer',
    description: 'Shorten paragraphs into action-oriented bullet points that preserve key metrics, numbers, and dates for CVs and applications.',
    color: 'from-secondary-400 to-primary-500',
    glow: 'glow-secondary',
  },
];

export default function Features() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div ref={ref} className={`relative max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            <span className="text-sm text-primary-300 font-medium">Core Features</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Everything you need to <span className="text-gradient-primary">plan your future</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Eight integrated tools that take you from self-discovery to university admission to your first job offer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group glass-card rounded-2xl p-7 hover:border-primary-400/20 hover:scale-[1.02] transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">{feature.title}</h3>
              <p className="text-dark-200 text-sm leading-relaxed">{feature.description}</p>
              <div className="mt-5 flex items-center gap-2 text-primary-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
