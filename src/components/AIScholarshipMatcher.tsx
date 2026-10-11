import { useState } from 'react';
import { Award, RefreshCw, AlertCircle, CheckCircle2, GraduationCap, MapPin, ExternalLink, Brain } from 'lucide-react';
import { scholarships } from '@/data/scholarships';
import type { Scholarship } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const levelOptions = ['Undergraduate', "Master's", 'PhD'];
const fieldOptions = ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law', 'Economics', 'Natural Sciences', 'Social Sciences'];
const countryOptions = ['UK', 'USA', 'Canada', 'Australia', 'Germany', 'Switzerland', 'Netherlands', 'Turkey', 'Hungary', 'China', 'South Korea', 'Japan', 'New Zealand', 'Singapore', 'Multiple'];
const budgetOptions = ['Need full scholarship', 'Can contribute partial', 'Self-funded'];

export default function AIScholarshipMatcher() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [level, setLevel] = useState('');
  const [field, setField] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [needFullyFunded, setNeedFullyFunded] = useState(true);
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState<{ scholarship: Scholarship; score: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCountry = (c: string) => {
    setCountries(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const calculateMatch = (s: Scholarship): number => {
    let score = 0;
    if (s.level.some(l => l.includes(level))) score += 25; else score -= 10;
    if (s.pakistanEligible) score += 20;
    if (needFullyFunded && s.fundingType === 'Fully Funded') score += 20;
    if (countries.length > 0) {
      if (countries.some(c => s.countries.some(sc => sc.includes(c)) || s.country.includes(c))) score += 15; else score -= 5;
    } else { score += 5; }
    if (s.featured) score += 10;
    if (s.status === 'open' || s.status === 'check') score += 5;
    if (budget === 'Need full scholarship' && s.fundingType === 'Fully Funded') score += 10;
    return Math.max(0, Math.min(100, score + 30));
  };

  const handleMatch = () => {
    if (loading) return;
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      const matches = scholarships
        .map(s => ({ scholarship: s, score: calculateMatch(s) }))
        .sort((a, b) => b.score - a.score)
        .filter(m => m.score > 30)
        .slice(0, 6);
      setResults(matches);
      setLoading(false);
    }, 1500);
  };

  const reset = () => { setLevel(''); setField(''); setCountries([]); setNeedFullyFunded(true); setBudget(''); setResults([]); };

  return (
    <section id="scholarship-matcher" className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-5xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Award className="w-4 h-4 text-accent-300" />
            <span className="text-sm text-accent-300 font-medium">AI Scholarship Engine</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Find Scholarships <span className="text-gradient">For Me</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Tell us your profile and our AI will find the scholarship opportunities most relevant to you.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-dark-400 font-medium uppercase tracking-wider mb-1.5">Degree Level</label>
                <select value={level} onChange={e => setLevel(e.target.value)} className="matcher-select">
                  <option value="">Select...</option>
                  {levelOptions.map(l => <option key={l} value={l} className="bg-dark-900">{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-dark-400 font-medium uppercase tracking-wider mb-1.5">Field of Interest</label>
                <select value={field} onChange={e => setField(e.target.value)} className="matcher-select">
                  <option value="">Select...</option>
                  {fieldOptions.map(f => <option key={f} value={f} className="bg-dark-900">{f}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-400 font-medium uppercase tracking-wider mb-1.5">Preferred Countries</label>
              <div className="flex flex-wrap gap-2">
                {countryOptions.map(c => (
                  <button key={c} onClick={() => toggleCountry(c)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${countries.includes(c) ? 'bg-accent-500 text-white' : 'glass-light text-dark-200 hover:text-white'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-dark-400 font-medium uppercase tracking-wider mb-1.5">Budget Situation</label>
              <select value={budget} onChange={e => setBudget(e.target.value)} className="matcher-select">
                <option value="">Select...</option>
                {budgetOptions.map(b => <option key={b} value={b} className="bg-dark-900">{b}</option>)}
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={needFullyFunded} onChange={e => setNeedFullyFunded(e.target.checked)} className="w-5 h-5 rounded accent-accent-500" />
              <span className="text-sm text-dark-100">I need a fully funded scholarship</span>
            </label>

            <button onClick={handleMatch} disabled={!level} className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-accent-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Brain className="w-5 h-5" /> Find Matching Scholarships
            </button>
            {!level && <p className="text-xs text-dark-400 text-center">Please select your degree level</p>}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-2xl text-white">Your Scholarship Matches</h3>
                <p className="text-sm text-dark-300 mt-1">Based on the information you provided</p>
              </div>
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2 glass-light text-white text-sm rounded-xl hover:bg-white/10 transition-all"><RefreshCw className="w-4 h-4" /> New Search</button>
            </div>

            <div className="glass-light rounded-2xl p-4 mb-6 flex items-start gap-3 border border-warning-500/20">
              <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
              <p className="text-xs text-dark-200 leading-relaxed">Match scores show alignment with your profile, NOT probability of winning the scholarship. Always verify eligibility on the official provider website.</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin mb-4" />
                <p className="text-dark-200 text-sm">AI is finding scholarships for you...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {results.map((match) => (
                  <div key={match.scholarship.id} className="glass-card rounded-2xl p-6 hover:border-accent-400/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{match.scholarship.flag}</span>
                        <h4 className="font-display font-bold text-sm text-white">{match.scholarship.name}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-display font-bold text-gradient">{match.score}%</div>
                        <div className="text-[9px] text-dark-400 uppercase">Match</div>
                      </div>
                    </div>
                    <p className="text-xs text-dark-300 mb-3">{match.scholarship.provider}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {match.scholarship.level.map(l => <span key={l} className="px-2 py-0.5 text-xs bg-secondary-500/15 text-secondary-300 rounded-full">{l}</span>)}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${match.scholarship.fundingType === 'Fully Funded' ? 'bg-success-500/20 text-success-600' : 'bg-warning-500/20 text-warning-600'}`}>{match.scholarship.fundingType}</span>
                      {match.scholarship.pakistanEligible && <span className="px-2 py-0.5 text-xs bg-success-500/15 text-success-600 rounded-full flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />PK Eligible</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-300 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match.scholarship.countries.join(', ')}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{match.scholarship.deadline}</span>
                    </div>
                    <a href={match.scholarship.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 glass-light text-white font-medium rounded-xl hover:bg-accent-500/20 transition-all text-sm">
                      <ExternalLink className="w-3.5 h-3.5" /> View Official Page
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
