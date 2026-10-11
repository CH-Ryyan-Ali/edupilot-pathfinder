import { useState } from 'react';
import { Brain, Sparkles, DollarSign, Award, CheckCircle2, AlertCircle, RefreshCw, Target } from 'lucide-react';
import { universities } from '@/data/universities';
import type { University, MatcherInput } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const emptyInput: MatcherInput = {
  educationLevel: '',
  gpa: '',
  intendedDegree: '',
  preferredField: '',
  preferredCountries: [],
  budget: '',
  scholarshipNeeded: false,
  englishTest: '',
  careerGoal: '',
};

const degreeOptions = ["Bachelor's", "Master's", 'PhD'];
const fieldOptions = ['Computer Science', 'AI', 'Data Science', 'Engineering', 'Software Engineering', 'Cyber Security', 'Business', 'Medicine', 'Law', 'Economics', 'Natural Sciences', 'Social Sciences', 'Arts & Design'];
const countryOptions = ['Pakistan', 'UK', 'USA', 'Canada', 'Australia', 'Germany', 'Switzerland', 'Netherlands', 'Turkey', 'Hungary', 'China', 'South Korea', 'Singapore', 'Hong Kong'];
const educationLevels = ['High School / FSc / A-Levels', "Bachelor's (ongoing/completed)", "Master's (ongoing/completed)"];
const englishTests = ['Not taken yet', 'IELTS 6.0+', 'IELTS 6.5+', 'IELTS 7.0+', 'IELTS 7.5+', 'TOEFL 80+', 'TOEFL 90+', 'TOEFL 100+'];
const budgetOptions = ['< $5,000/year', '$5,000 - $15,000/year', '$15,000 - $30,000/year', '$30,000 - $50,000/year', '$50,000+/year', 'Need full scholarship'];

export default function AIUniversityMatcher() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [input, setInput] = useState<MatcherInput>(emptyInput);
  const [results, setResults] = useState<{ uni: University; score: number; reasons: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleCountry = (c: string) => {
    setInput(prev => ({ ...prev, preferredCountries: prev.preferredCountries.includes(c) ? prev.preferredCountries.filter(x => x !== c) : [...prev.preferredCountries, c] }));
  };

  const calculateMatch = (uni: University, inp: MatcherInput): { score: number; reasons: string[] } => {
    let score = 0;
    const reasons: string[] = [];

    if (inp.intendedDegree && uni.degreeLevels.includes(inp.intendedDegree)) { score += 25; reasons.push(`Offers ${inp.intendedDegree} programs`); }
    else if (inp.intendedDegree) { score -= 10; }

    if (inp.preferredField && uni.fields.some(f => f.toLowerCase().includes(inp.preferredField.toLowerCase()))) { score += 20; reasons.push(`Strong in ${inp.preferredField}`); }

    if (inp.preferredCountries.length > 0) {
      if (inp.preferredCountries.includes(uni.country)) { score += 20; reasons.push(`Located in your preferred country: ${uni.country}`); }
      else { score -= 5; }
    } else { score += 5; }

    if (inp.scholarshipNeeded && uni.scholarshipAvailable) { score += 15; reasons.push('Scholarships available for international students'); }

    if (uni.internationalStudents) { score += 10; reasons.push('Welcomes international students'); }

    if (inp.budget) {
      const isLowBudget = inp.budget.includes('<') || inp.budget.includes('Need full');
      const isMidBudget = inp.budget.includes('$15,000') || inp.budget.includes('$5,000');
      if (isLowBudget && (uni.country === 'Pakistan' || uni.country === 'Germany' || uni.country === 'Switzerland' || uni.country === 'Hungary' || uni.country === 'Turkey')) { score += 15; reasons.push('Affordable tuition for your budget'); }
      else if (isMidBudget && (uni.country === 'Pakistan' || uni.country === 'Hungary' || uni.country === 'Turkey' || uni.country === 'China' || uni.country === 'Germany')) { score += 10; }
    }

    if (inp.englishTest && inp.englishTest !== 'Not taken yet') {
      const hasHighScore = inp.englishTest.includes('7.0') || inp.englishTest.includes('7.5') || inp.englishTest.includes('100');
      if (hasHighScore && uni.qsWorld && uni.qsWorld < 100) { score += 10; reasons.push('Your English score meets top university requirements'); }
      else { score += 5; }
    }

    if (uni.featured) { score += 5; }
    if (uni.qsWorld && uni.qsWorld < 50) { score += 5; reasons.push(`World-class: QS #${uni.qsWorld}`); }

    score = Math.max(0, Math.min(100, score + 30));
    return { score, reasons: reasons.slice(0, 4) };
  };

  const handleMatch = () => {
    if (loading) return;
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      const matches = universities
        .map(u => ({ uni: u, ...calculateMatch(u, input) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      setResults(matches);
      setLoading(false);
    }, 1500);
  };

  const reset = () => { setInput(emptyInput); setResults([]); };

  return (
    <section id="ai-matcher" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div ref={ref} className={`relative max-w-5xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Brain className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">AI-Powered Matching</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Find My Best <span className="text-gradient-primary">University</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Answer a few questions and our AI engine will match you with universities that fit your profile, budget, and goals.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Current Education Level">
                <select value={input.educationLevel} onChange={e => setInput({ ...input, educationLevel: e.target.value })} className="matcher-select">
                  <option value="">Select...</option>
                  {educationLevels.map(l => <option key={l} value={l} className="bg-dark-900">{l}</option>)}
                </select>
              </Field>
              <Field label="GPA / Grades">
                <input type="text" placeholder="e.g. 3.5/4.0 or 85%" value={input.gpa} onChange={e => setInput({ ...input, gpa: e.target.value })} className="matcher-input" />
              </Field>
              <Field label="Intended Degree">
                <select value={input.intendedDegree} onChange={e => setInput({ ...input, intendedDegree: e.target.value })} className="matcher-select">
                  <option value="">Select...</option>
                  {degreeOptions.map(d => <option key={d} value={d} className="bg-dark-900">{d}</option>)}
                </select>
              </Field>
              <Field label="Preferred Field">
                <select value={input.preferredField} onChange={e => setInput({ ...input, preferredField: e.target.value })} className="matcher-select">
                  <option value="">Select...</option>
                  {fieldOptions.map(f => <option key={f} value={f} className="bg-dark-900">{f}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Preferred Countries (select multiple)">
              <div className="flex flex-wrap gap-2">
                {countryOptions.map(c => (
                  <button key={c} onClick={() => toggleCountry(c)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${input.preferredCountries.includes(c) ? 'bg-primary-500 text-white' : 'glass-light text-dark-200 hover:text-white'}`}>{c}</button>
                ))}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Budget">
                <select value={input.budget} onChange={e => setInput({ ...input, budget: e.target.value })} className="matcher-select">
                  <option value="">Select...</option>
                  {budgetOptions.map(b => <option key={b} value={b} className="bg-dark-900">{b}</option>)}
                </select>
              </Field>
              <Field label="English Test Status">
                <select value={input.englishTest} onChange={e => setInput({ ...input, englishTest: e.target.value })} className="matcher-select">
                  <option value="">Select...</option>
                  {englishTests.map(t => <option key={t} value={t} className="bg-dark-900">{t}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Career Goal (optional)">
              <input type="text" placeholder="e.g. AI Researcher, Software Engineer, Doctor" value={input.careerGoal} onChange={e => setInput({ ...input, careerGoal: e.target.value })} className="matcher-input" />
            </Field>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={input.scholarshipNeeded} onChange={e => setInput({ ...input, scholarshipNeeded: e.target.checked })} className="w-5 h-5 rounded accent-primary-500" />
              <span className="text-sm text-dark-100">I need a scholarship / financial aid</span>
            </label>

            <button onClick={handleMatch} disabled={!input.intendedDegree || !input.preferredField} className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> Find My Matches
            </button>
            {(!input.intendedDegree || !input.preferredField) && <p className="text-xs text-dark-400 text-center">Please select at least your intended degree and preferred field</p>}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2"><Target className="w-6 h-6 text-primary-300" /> Your Top Matches</h3>
                <p className="text-sm text-dark-300 mt-1">Based on the information you provided</p>
              </div>
              <button onClick={reset} className="flex items-center gap-2 px-4 py-2 glass-light text-white text-sm rounded-xl hover:bg-white/10 transition-all"><RefreshCw className="w-4 h-4" /> New Search</button>
            </div>

            <div className="glass-light rounded-2xl p-4 mb-6 flex items-start gap-3 border border-warning-500/20">
              <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
              <p className="text-xs text-dark-200 leading-relaxed">These are AI-generated potential matches based on your inputs. Match scores indicate alignment with your profile, NOT probability of admission. Always verify final eligibility with the university.</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
                <p className="text-dark-200 text-sm">AI is analyzing your profile...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((match) => (
                  <div key={match.uni.id} className="glass-card rounded-2xl p-6 hover:border-primary-400/20 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg text-white shrink-0" style={{ backgroundColor: match.uni.logoColor }}>{match.uni.shortName.substring(0, 2)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display font-bold text-lg text-white">{match.uni.shortName}</h4>
                              <span className="text-lg">{match.uni.flag}</span>
                            </div>
                            <p className="text-xs text-dark-300">{match.uni.city}, {match.uni.country}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-display font-bold text-gradient-primary">{match.score}%</div>
                            <div className="text-[10px] text-dark-400 uppercase tracking-wider">Match Score</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {match.reasons.map((r, j) => (
                            <span key={j} className="text-xs px-2.5 py-1 bg-primary-500/10 text-primary-200 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{r}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-dark-300">
                          {match.uni.qsWorld && <span className="flex items-center gap-1"><Award className="w-3 h-3" />QS #{match.uni.qsWorld}</span>}
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{match.uni.tuitionPerSemester}</span>
                          {match.uni.scholarshipAvailable && <span className="flex items-center gap-1 text-success-600"><CheckCircle2 className="w-3 h-3" />Scholarships available</span>}
                        </div>
                      </div>
                    </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="block text-xs text-dark-400 font-medium uppercase tracking-wider mb-1.5">{label}</label>{children}</div>);
}
