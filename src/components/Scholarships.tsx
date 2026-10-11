import { useState, useMemo } from 'react';
import { Award, ExternalLink, GraduationCap, X, MapPin, Clock, CheckCircle2, AlertCircle, FileText, ListChecks, ShieldCheck, Sparkles, Bookmark, Star, GitCompare } from 'lucide-react';
import { scholarships } from '@/data/scholarships';
import type { Scholarship } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSavedItems } from '@/hooks/useSavedItems';

const statusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  open: { color: 'text-success-600', bg: 'bg-success-500/15', dot: 'bg-success-500', label: 'OPEN' },
  upcoming: { color: 'text-warning-600', bg: 'bg-warning-500/15', dot: 'bg-warning-500', label: 'UPCOMING' },
  closed: { color: 'text-error-500', bg: 'bg-error-500/15', dot: 'bg-error-500', label: 'CLOSED' },
  check: { color: 'text-dark-200', bg: 'bg-white/5', dot: 'bg-dark-400', label: 'CHECK OFFICIAL WEBSITE' },
};

const fundingTypeConfig: Record<string, string> = {
  'Fully Funded': 'bg-success-500/20 text-success-600',
  'Partially Funded': 'bg-warning-500/20 text-warning-600',
  'Tuition Only': 'bg-secondary-500/20 text-secondary-300',
};

const levelFilters = ['All', 'Undergraduate', "Master's", 'PhD'];
const fundingFilters = ['All', 'Fully Funded', 'Partially Funded'];
const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'pakistan', label: 'Pakistan Eligible' },
  { value: 'level', label: 'Degree Level' },
  { value: 'country', label: 'Country A-Z' },
];

export default function Scholarships() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const { isScholarshipSaved, saveScholarship } = useSavedItems();
  const [level, setLevel] = useState('All');
  const [funding, setFunding] = useState('All');
  const [sort, setSort] = useState('featured');
  const [onlyPak, setOnlyPak] = useState(false);
  const [selected, setSelected] = useState<Scholarship | null>(null);
  const [compareList, setCompareList] = useState<Scholarship[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (s: Scholarship) => {
    setCompareList((prev) => {
      const exists = prev.find((x) => x.id === s.id);
      if (exists) return prev.filter((x) => x.id !== s.id);
      if (prev.length >= 3) return prev;
      return [...prev, s];
    });
  };

  const isComparing = (s: Scholarship) => compareList.some((x) => x.id === s.id);

  const filtered = useMemo(() => {
    let result = scholarships.filter((s) => {
      const matchLevel = level === 'All' || s.level.some(l => l.includes(level));
      const matchFunding = funding === 'All' || s.fundingType === funding;
      const matchPak = !onlyPak || s.pakistanEligible;
      return matchLevel && matchFunding && matchPak;
    });

    if (sort === 'pakistan') result = [...result].sort((a, b) => Number(b.pakistanEligible) - Number(a.pakistanEligible));
    else if (sort === 'country') result = [...result].sort((a, b) => a.country.localeCompare(b.country));
    else if (sort === 'level') result = [...result].sort((a, b) => a.level[0].localeCompare(b.level[0]));
    else result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
    return result;
  }, [level, funding, sort, onlyPak]);

  return (
    <section id="scholarships" className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`relative max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        {/* Featured Fully Funded Opportunities */}
        {level === 'All' && funding === 'All' && !onlyPak && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-success-600" />
              <h3 className="font-display font-bold text-lg text-white">Featured Fully Funded Opportunities</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {scholarships.filter(s => s.featured && s.fundingType === 'Fully Funded').slice(0, 8).map((s) => (
                <button key={s.id} onClick={() => setSelected(s)} className="glass-card rounded-2xl p-4 text-left hover:border-success-600/30 transition-all hover:scale-105">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{s.flag}</span>
                    <span className="font-bold text-white text-sm truncate">{s.name}</span>
                  </div>
                  <div className="text-xs text-dark-300 mb-2">{s.provider}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] bg-success-500/20 text-success-600 rounded-full font-medium">FULLY FUNDED</span>
                    {s.pakistanEligible && <span className="px-1.5 py-0.5 text-[10px] bg-success-500/15 text-success-600 rounded">PK</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card rounded-2xl p-5 mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-dark-400 font-medium uppercase tracking-wider">Level:</span>
              {levelFilters.map((l) => (
                <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${level === l ? 'bg-accent-500 text-white' : 'glass-light text-dark-200 hover:text-white'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-dark-400 font-medium uppercase tracking-wider">Funding:</span>
              {fundingFilters.map((f) => (
                <button key={f} onClick={() => setFunding(f)} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${funding === f ? 'bg-secondary-600 text-white' : 'glass-light text-dark-200 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-dark-200 cursor-pointer">
              <input type="checkbox" checked={onlyPak} onChange={(e) => setOnlyPak(e.target.checked)} className="w-4 h-4 rounded accent-accent-500" />
              Pakistan eligible only
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-dark-400 font-medium uppercase tracking-wider">Sort:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-1.5 bg-dark-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-accent-400/50 cursor-pointer">
                {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-dark-900">{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-dark-300">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of {scholarships.length} scholarships
          </div>
          {compareList.length > 0 && (
            <button onClick={() => setShowCompare(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
              <GitCompare className="w-4 h-4" /> Compare ({compareList.length})
            </button>
          )}
        </div>

        {/* Scholarship Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((scholarship) => {
            const status = statusConfig[scholarship.status];
            return (
              <div key={scholarship.id} className="glass-card rounded-2xl p-6 hover:border-accent-400/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{scholarship.flag}</span>
                      <h3 className="font-display font-bold text-lg text-white">{scholarship.name}</h3>
                    </div>
                    <p className="text-xs text-dark-300">{scholarship.provider}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ${fundingTypeConfig[scholarship.fundingType]}`}>{scholarship.fundingType}</span>
                </div>

                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full mb-3 ${status.bg} ${status.color}`}>
                  <span className={`w-2 h-2 rounded-full ${status.dot} ${scholarship.status === 'open' || scholarship.status === 'upcoming' ? 'animate-pulse' : ''}`} />
                  {status.label}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {scholarship.level.map((l) => (<span key={l} className="px-2.5 py-1 text-xs bg-secondary-500/15 text-secondary-300 rounded-full flex items-center gap-1"><GraduationCap className="w-3 h-3" />{l}</span>))}
                  {scholarship.pakistanEligible && <span className="px-2.5 py-1 text-xs bg-success-500/15 text-success-600 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Pakistan Eligible</span>}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Country</span>
                    <span className="text-white font-medium text-xs">{scholarship.countries.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Deadline</span>
                    <span className="text-white font-medium text-xs">{scholarship.deadline}</span>
                  </div>
                  <div className="flex items-start justify-between text-sm gap-2">
                    <span className="text-dark-400 flex items-center gap-1.5 shrink-0"><Award className="w-3.5 h-3.5" /> Covers</span>
                    <span className="text-white font-medium text-xs text-right">{scholarship.whatItCovers.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelected(scholarship)} className="flex-1 min-w-[120px] py-2.5 glass-light text-white font-medium rounded-xl hover:bg-accent-500/20 transition-all text-sm flex items-center justify-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> View
                  </button>
                  <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px] py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Official
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveScholarship(scholarship.id)}
                      className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                        isScholarshipSaved(scholarship.id) ? 'bg-accent-500 text-white' : 'glass-light text-dark-300 hover:text-white hover:bg-accent-500/20'
                      }`}
                      title={isScholarshipSaved(scholarship.id) ? 'Remove from saved' : 'Save scholarship'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleCompare(scholarship)}
                      disabled={!isComparing(scholarship) && compareList.length >= 3}
                      className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                        isComparing(scholarship) ? 'bg-primary-500 text-white' : 'glass-light text-dark-300 hover:text-white hover:bg-primary-500/20'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      title={isComparing(scholarship) ? 'Remove from comparison' : 'Add to comparison'}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">No scholarships found</h3>
            <p className="text-dark-300 text-sm mb-4">No scholarships match your current filters. Try adjusting your level or funding type.</p>
            <button
              onClick={() => { setLevel('All'); setFunding('All'); setOnlyPak(false); setSort('featured'); }}
              className="px-5 py-2.5 glass-light text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 glass-light rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
          <p className="text-xs text-dark-200 leading-relaxed">
            Scholarship information can change. Always verify eligibility, deadlines, and coverage on the official provider website before applying. Deadlines shown are indicative — actual dates may vary by year and program.
          </p>
        </div>
      </div>

      {selected && <ScholarshipModal scholarship={selected} onClose={() => setSelected(null)} />}
      {showCompare && <ScholarshipCompareModal items={compareList} onClose={() => setShowCompare(false)} onClear={() => { setCompareList([]); setShowCompare(false); }} />}
    </section>
  );
}

function ScholarshipModal({ scholarship, onClose }: { scholarship: Scholarship; onClose: () => void }) {
  const status = statusConfig[scholarship.status];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin glass rounded-3xl p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:bg-white/10 transition-all z-10"><X className="w-5 h-5 text-white" /></button>

        <div className="flex items-start gap-3 mb-6">
          <span className="text-3xl">{scholarship.flag}</span>
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl text-white mb-1">{scholarship.name}</h3>
            <p className="text-sm text-dark-300">{scholarship.provider}</p>
          </div>
        </div>

        {/* Status + Funding */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${status.bg} ${status.color}`}><span className={`w-2 h-2 rounded-full ${status.dot}`} />{status.label}</span>
          <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${fundingTypeConfig[scholarship.fundingType]}`}>{scholarship.fundingType}</span>
          {scholarship.pakistanEligible && <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-success-500/15 text-success-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Pakistan Eligible</span>}
        </div>

        <p className="text-dark-100 text-sm leading-relaxed mb-6">{scholarship.eligibilitySummary}</p>

        {/* Key Info */}
        <div className="space-y-3 mb-6">
          <ModalRow label="Eligible Nationality" value={scholarship.eligibleNationality} />
          <ModalRow label="Degree Level" value={scholarship.level.join(', ')} />
          <ModalRow label="Country" value={scholarship.countries.join(', ')} />
          <ModalRow label="What It Covers" value={scholarship.whatItCovers.join(', ')} />
          <ModalRow label="Deadline" value={scholarship.deadline} />
          <ModalRow label="Amount / Coverage Detail" value={scholarship.amount} />
        </div>

        {/* Eligibility */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2 uppercase tracking-wider"><ShieldCheck className="w-4 h-4 text-primary-300" /> Eligibility</h4>
          <p className="text-sm text-dark-100 leading-relaxed glass-light rounded-xl p-4">{scholarship.eligibility}</p>
        </div>

        {/* Documents Required */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2 uppercase tracking-wider"><FileText className="w-4 h-4 text-accent-300" /> Documents Required</h4>
          <div className="flex flex-wrap gap-2">{scholarship.documentsRequired.map((doc) => (<span key={doc} className="px-3 py-1.5 text-sm glass-light text-dark-100 rounded-lg">{doc}</span>))}</div>
        </div>

        {/* Application Process */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2 uppercase tracking-wider"><ListChecks className="w-4 h-4 text-secondary-300" /> Application Process</h4>
          <p className="text-sm text-dark-100 leading-relaxed glass-light rounded-xl p-4">{scholarship.applicationProcess}</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mb-4">
          <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">
            <ExternalLink className="w-4 h-4" /> Official Scholarship Page
          </a>
          {scholarship.applicationLink && (
            <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 glass-light text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm">
              <Sparkles className="w-4 h-4" /> Apply Now
            </a>
          )}
        </div>

        {/* Warning + Source */}
        <div className="space-y-3">
          <div className="glass-light rounded-xl p-4 flex items-start gap-3 border border-warning-500/20">
            <AlertCircle className="w-4 h-4 text-warning-600 shrink-0 mt-0.5" />
            <p className="text-xs text-dark-200 leading-relaxed">Scholarship information can change. Always verify eligibility and deadlines on the official provider website before applying.</p>
          </div>
          <div className="glass-light rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="text-dark-400">Official Source: <span className="text-white">{scholarship.provider}</span></span>
            <span className="text-dark-400">Last Verified: <span className="text-primary-300">{scholarship.lastVerified}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalRow({ label, value }: { label: string; value: string }) {
  return (<div className="flex items-start justify-between glass-light rounded-xl px-4 py-3 gap-3"><span className="text-sm text-dark-300 shrink-0">{label}</span><span className="text-sm text-white font-medium text-right">{value}</span></div>);
}

function ScholarshipCompareModal({ items, onClose, onClear }: { items: Scholarship[]; onClose: () => void; onClear: () => void }) {
  if (items.length === 0) return null;
  const rows: { label: string; key: (s: Scholarship) => string }[] = [
    { label: 'Provider', key: (s) => s.provider },
    { label: 'Country', key: (s) => `${s.flag} ${s.country}` },
    { label: 'Funding Type', key: (s) => s.fundingType },
    { label: 'Degree Level', key: (s) => s.level.join(', ') },
    { label: 'What It Covers', key: (s) => s.whatItCovers.join(', ') },
    { label: 'Deadline', key: (s) => s.deadline },
    { label: 'Pakistan Eligible', key: (s) => s.pakistanEligible ? 'Yes' : 'Check official website' },
    { label: 'Eligible Nationality', key: (s) => s.eligibleNationality },
    { label: 'Status', key: (s) => s.status.toUpperCase() },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin glass rounded-3xl p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2"><GitCompare className="w-6 h-6 text-accent-300" /> Scholarship Comparison</h3>
          <div className="flex gap-2">
            <button onClick={onClear} className="px-4 py-2 glass-light text-dark-200 hover:text-white rounded-xl text-sm">Clear All</button>
            <button onClick={onClose} className="w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:bg-white/10"><X className="w-5 h-5 text-white" /></button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3 text-dark-400 font-medium uppercase text-xs tracking-wider sticky left-0 bg-dark-900"></th>
                {items.map((s) => (
                  <th key={s.id} className="text-left p-3 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{s.flag}</span>
                      <div><div className="text-white font-bold text-sm">{s.name}</div><div className="text-xs text-dark-300">{s.provider}</div></div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <td className="p-3 text-dark-400 font-medium text-xs uppercase tracking-wider sticky left-0 bg-dark-900 whitespace-nowrap">{row.label}</td>
                  {items.map((s) => (<td key={s.id} className="p-3 text-dark-100">{row.key(s)}</td>))}
                </tr>
              ))}
              <tr>
                <td className="p-3 text-dark-400 font-medium text-xs uppercase tracking-wider sticky left-0 bg-dark-900">Official Link</td>
                {items.map((s) => (<td key={s.id} className="p-3"><a href={s.link} target="_blank" rel="noopener noreferrer" className="text-accent-300 hover:text-accent-200 flex items-center gap-1 text-xs"><ExternalLink className="w-3 h-3" /> Visit</a></td>))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
