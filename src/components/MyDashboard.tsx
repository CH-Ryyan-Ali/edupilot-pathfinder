import { useState, useEffect } from 'react';
import { Bookmark, GraduationCap, Award, Trash2, ExternalLink, Calendar, ClipboardList } from 'lucide-react';
import { universities } from '@/data/universities';
import { scholarships } from '@/data/scholarships';
import { useSavedItems } from '@/hooks/useSavedItems';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import UniversityLogo from '@/components/UniversityLogo';

function lsChecklistStats(): { done: number; total: number } {
  try {
    const items = JSON.parse(localStorage.getItem('pathfinder_checklist_v2') || '[]');
    return { done: items.filter((i: { done: boolean }) => i.done).length, total: items.length };
  } catch {
    return { done: 0, total: 0 };
  }
}

export default function MyDashboard() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const { savedUniIds, savedScholarshipIds, removeUni, removeScholarship } = useSavedItems();
  const { user } = useAuth();
  const [checklistStats, setChecklistStats] = useState({ done: 0, total: 0 });

  useEffect(() => {
    if (!user) {
      setChecklistStats(lsChecklistStats());
      return;
    }
    supabase
      .from('checklist_items')
      .select('done')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return;
        setChecklistStats({ done: data.filter(i => i.done).length, total: data.length });
      });
  }, [user]);

  const savedUnis = universities.filter(u => savedUniIds.includes(u.id));
  const savedScholarships = scholarships.filter(s => savedScholarshipIds.includes(s.id));

  const deadlineItems = savedScholarships.map(s => ({
    id: s.id,
    name: s.name,
    deadline: s.deadline,
    status: s.status,
    country: s.countries[0],
    flag: s.flag,
  }));

  if (savedUnis.length === 0 && savedScholarships.length === 0 && checklistStats.done === 0) {
    return (
      <section id="dashboard" className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`max-w-5xl mx-auto reveal ${visible ? 'visible' : ''}`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
              <Bookmark className="w-4 h-4 text-primary-300" />
              <span className="text-sm text-primary-300 font-medium">Your Dashboard</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
              My <span className="text-gradient-primary">Opportunities</span>
            </h2>
          </div>
          <div className="glass-card rounded-2xl p-12 text-center">
            <Bookmark className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <p className="text-dark-200 text-lg mb-2">No saved items yet</p>
            <p className="text-dark-300 text-sm">Save universities and scholarships by clicking the bookmark icon on any card. They'll appear here for quick access.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Bookmark className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">Your Dashboard</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            My <span className="text-gradient-primary">Opportunities</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">Your saved universities, scholarships, and application progress in one place.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={GraduationCap} label="Saved Universities" value={savedUnis.length} color="text-primary-300" />
          <StatCard icon={Award} label="Saved Scholarships" value={savedScholarships.length} color="text-accent-300" />
          <StatCard icon={ClipboardList} label="Checklist Progress" value={`${checklistStats.done}/${checklistStats.total}`} color="text-success-600" />
          <StatCard icon={Calendar} label="Tracked Deadlines" value={deadlineItems.length} color="text-warning-600" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Saved Universities */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary-300" /> Saved Universities
            </h3>
            {savedUnis.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 text-center text-sm text-dark-300">
                No universities saved yet. Browse universities and click the bookmark icon to save them here.
              </div>
            ) : (
              <div className="space-y-3">
                {savedUnis.map(u => (
                  <div key={u.id} className="glass-card rounded-xl p-4 flex items-center gap-3 group">
                    <UniversityLogo uni={u} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{u.shortName}</span>
                        <span className="text-sm">{u.flag}</span>
                      </div>
                      <div className="text-xs text-dark-300 truncate">{u.city}, {u.country}</div>
                    </div>
                    <a href={u.website} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-300 transition-colors shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => removeUni(u.id)} className="text-dark-400 hover:text-error-500 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deadline Tracker */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning-600" /> Deadline Tracker
            </h3>
            {deadlineItems.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 text-center text-sm text-dark-300">
                No tracked deadlines. Save scholarships to track their deadlines here.
              </div>
            ) : (
              <div className="space-y-3">
                {deadlineItems.map(d => {
                  const statusColor = d.status === 'open' ? 'text-success-600' : d.status === 'upcoming' ? 'text-warning-600' : d.status === 'closed' ? 'text-error-500' : 'text-dark-200';
                  const statusBg = d.status === 'open' ? 'bg-success-500/15' : d.status === 'upcoming' ? 'bg-warning-500/15' : d.status === 'closed' ? 'bg-error-500/15' : 'bg-white/5';
                  return (
                    <div key={d.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${statusColor.replace('text-', 'bg-')}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{d.flag}</span>
                          <span className="font-medium text-sm text-white truncate">{d.name}</span>
                        </div>
                        <div className="text-xs text-dark-300 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{d.deadline}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusBg} ${statusColor}`}>
                            {d.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => removeScholarship(d.id)} className="text-dark-400 hover:text-error-500 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Saved Scholarships */}
        {savedScholarships.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-300" /> Saved Scholarships
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {savedScholarships.map(s => (
                <div key={s.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl shrink-0">{s.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white">{s.name}</div>
                    <div className="text-xs text-dark-300 mt-0.5">{s.provider}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.level.slice(0, 2).map(l => (
                        <span key={l} className="px-1.5 py-0.5 text-[10px] bg-secondary-500/15 text-secondary-300 rounded">{l}</span>
                      ))}
                      <span className={`px-1.5 py-0.5 text-[10px] rounded ${s.fundingType === 'Fully Funded' ? 'bg-success-500/20 text-success-600' : 'bg-warning-500/20 text-warning-600'}`}>
                        {s.fundingType}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-accent-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => removeScholarship(s.id)} className="text-dark-400 hover:text-error-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <div className="text-2xl font-display font-bold text-white">{value}</div>
      <div className="text-xs text-dark-400 mt-1">{label}</div>
    </div>
  );
}
