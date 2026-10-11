import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Briefcase, DollarSign, TrendingUp, X, GraduationCap, Building, Zap } from 'lucide-react';
import { careers } from '@/data/careers';
import type { Career } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const categories = ['All', 'Technology', 'Engineering', 'Medical', 'Finance', 'Business', 'Design'];

const difficultyColors: Record<string, string> = {
  Low: 'bg-success-500/20 text-success-600',
  Medium: 'bg-warning-500/20 text-warning-600',
  High: 'bg-accent-500/20 text-accent-300',
  'Very High': 'bg-error-500/20 text-error-500',
};

export default function Careers() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Career | null>(null);

  const filtered = category === 'All' ? careers : careers.filter((c) => c.category === category);

  return (
    <section id="careers" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Briefcase className="w-4 h-4 text-secondary-300" />
            <span className="text-sm text-secondary-300 font-medium">Career Roadmaps</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Plan Your <span className="text-gradient-primary">Career Path</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Salary benchmarks in PKR and USD, required skills, and step-by-step education paths from high school to your first job.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${
                category === cat ? 'bg-secondary-600 text-white' : 'glass-light text-dark-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((career, i) => {
            const IconComponent = (Icons[career.icon as keyof typeof Icons] as React.ElementType) || Briefcase;
            return (
              <button
                key={career.id}
                onClick={() => setSelected(career)}
                className="group text-left glass-card rounded-2xl p-6 hover:border-secondary-400/30 transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-secondary-300 transition-colors">{career.title}</h3>
                <p className="text-xs text-dark-300 mb-3 line-clamp-2">{career.description}</p>

                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-dark-200">
                    <DollarSign className="w-3 h-3 text-success-500" />
                    {career.salaryPKR.split('/')[0]}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-dark-200">
                    <TrendingUp className="w-3 h-3 text-primary-400" />
                    {career.growthRate}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${difficultyColors[career.difficulty]}`}>
                    {career.difficulty}
                  </span>
                  <span className="text-secondary-300 text-sm group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && <CareerModal career={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function CareerModal({ career, onClose }: { career: Career; onClose: () => void }) {
  const IconComponent = (Icons[career.icon as keyof typeof Icons] as React.ElementType) || Briefcase;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin glass rounded-3xl p-8 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-400 to-primary-600 flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-2xl text-white">{career.title}</h3>
            <span className="text-sm text-dark-300">{career.category}</span>
          </div>
        </div>

        <p className="text-dark-100 text-sm leading-relaxed mb-6">{career.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-light rounded-xl p-4">
            <DollarSign className="w-5 h-5 text-success-500 mb-1" />
            <div className="text-xs text-dark-400 mb-0.5">Salary (PKR)</div>
            <div className="text-sm text-white font-medium">{career.salaryPKR}</div>
          </div>
          <div className="glass-light rounded-xl p-4">
            <DollarSign className="w-5 h-5 text-secondary-300 mb-1" />
            <div className="text-xs text-dark-400 mb-0.5">Salary (USD Remote)</div>
            <div className="text-sm text-white font-medium">{career.salaryUSD}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-light rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-primary-400 mb-1" />
            <div className="text-xs text-dark-400 mb-0.5">Growth Rate</div>
            <div className="text-sm text-white font-medium">{career.growthRate}</div>
          </div>
          <div className="glass-light rounded-xl p-4">
            <Zap className="w-5 h-5 text-accent-300 mb-1" />
            <div className="text-xs text-dark-400 mb-0.5">Difficulty</div>
            <div className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-0.5 ${difficultyColors[career.difficulty]}`}>{career.difficulty}</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-primary-300" /> Education Path
          </h4>
          <div className="space-y-3">
            {career.educationPath.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 glass-light rounded-xl px-4 py-2.5 text-sm text-dark-100">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 text-sm bg-secondary-500/15 text-secondary-200 rounded-lg">{skill}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Building className="w-4 h-4 text-accent-300" /> Top Employers
          </h4>
          <div className="flex flex-wrap gap-2">
            {career.topEmployers.map((emp) => (
              <span key={emp} className="px-3 py-1.5 text-sm glass-light text-dark-100 rounded-lg">{emp}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
