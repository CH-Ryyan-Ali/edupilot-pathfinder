import { useState } from 'react';
import { TrendingUp, DollarSign, Zap, Flame, ArrowUpRight, Briefcase } from 'lucide-react';
import { jobMarketData } from '@/data/jobMarket';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const demandConfig: Record<string, { color: string; bg: string; icon: typeof Flame }> = {
  'Very High': { color: 'text-error-500', bg: 'bg-error-500/15', icon: Flame },
  High: { color: 'text-accent-300', bg: 'bg-accent-500/15', icon: TrendingUp },
  Medium: { color: 'text-warning-600', bg: 'bg-warning-500/15', icon: Zap },
  Emerging: { color: 'text-secondary-300', bg: 'bg-secondary-500/15', icon: ArrowUpRight },
};

const filters = ['All', 'Very High', 'High', 'Medium', 'Emerging'];

export default function JobMarket() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? jobMarketData : jobMarketData.filter((j) => j.demand === filter);

  const avgGrowth = jobMarketData.reduce((acc, j) => acc + parseInt(j.growth.replace(/[^0-9]/g, '')), 0) / jobMarketData.length;

  return (
    <section id="job-market" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <span className="text-sm text-success-600 font-medium">Job Market Dashboard</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            <span className="text-gradient">In-Demand Roles</span> & Trends
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Live-style view of in-demand skills, emerging roles, and regional hiring trends across Pakistan and globally.
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="glass-card rounded-2xl p-5">
            <Briefcase className="w-6 h-6 text-primary-300 mb-2" />
            <div className="text-2xl font-display font-bold text-white">{jobMarketData.length}+</div>
            <div className="text-xs text-dark-300">Active Roles Tracked</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <TrendingUp className="w-6 h-6 text-success-500 mb-2" />
            <div className="text-2xl font-display font-bold text-white">{Math.round(avgGrowth)}%</div>
            <div className="text-xs text-dark-300">Avg YoY Growth</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <Flame className="w-6 h-6 text-error-500 mb-2" />
            <div className="text-2xl font-display font-bold text-white">{jobMarketData.filter(j => j.demand === 'Very High').length}</div>
            <div className="text-xs text-dark-300">Very High Demand Roles</div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <ArrowUpRight className="w-6 h-6 text-secondary-300 mb-2" />
            <div className="text-2xl font-display font-bold text-white">{jobMarketData.filter(j => j.demand === 'Emerging').length}</div>
            <div className="text-xs text-dark-300">Emerging Fields</div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-xl font-medium transition-all ${
                filter === f ? 'bg-success-500 text-white' : 'glass-light text-dark-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {f === 'All' ? 'All Roles' : `${f} Demand`}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((job, i) => {
            const config = demandConfig[job.demand];
            const DemandIcon = config.icon;
            return (
              <div
                key={job.role}
                className="group glass-card rounded-2xl p-6 hover:border-success-500/20 transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-success-500 transition-colors">{job.role}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
                      <DemandIcon className="w-3.5 h-3.5" /> {job.demand}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Salary (PKR)</span>
                    <span className="text-white font-medium text-xs">{job.avgSalaryPKR}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Growth</span>
                    <span className="text-success-500 font-semibold text-sm">{job.growth}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <div className="text-xs text-dark-400 font-medium uppercase tracking-wider mb-2">Top Skills</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.topSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 text-xs glass-light text-dark-100 rounded-md">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
