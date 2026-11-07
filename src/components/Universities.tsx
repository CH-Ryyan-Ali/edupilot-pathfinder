import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Globe, Award, Building2, GraduationCap, X, ExternalLink, Layers, CheckCircle2, GraduationCap as GradIcon, DollarSign, Languages, Sparkles, GitCompare, Star, Bookmark } from 'lucide-react';
import { universities, countryList, degreeLevelList, fieldList, continentList } from '@/data/universities';
import type { University } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSavedItems } from '@/hooks/useSavedItems';
import UniversityLogo from '@/components/UniversityLogo';

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'qs-asc', label: 'QS Rank (Lowest = Best)' },
  { value: 'country', label: 'Country A-Z' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Universities() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const { isUniSaved, saveUni } = useSavedItems();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('All');
  const [continent, setContinent] = useState('All');
  const [degree, setDegree] = useState('All');
  const [field, setField] = useState('All');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState<University | null>(null);
  const [compareList, setCompareList] = useState<University[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [onlyScholarships, setOnlyScholarships] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [search, country, continent, degree, field, sort, onlyScholarships]);

  const filtered = useMemo(() => {
    let result = universities.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.shortName.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase()) ||
        u.programs.some((p) => p.toLowerCase().includes(search.toLowerCase()));
      const matchCountry = country === 'All' || u.country === country;
      const matchContinent = continent === 'All' || (u.continent || u.region) === continent;
      const matchDegree = degree === 'All' || u.degreeLevels.includes(degree);
      const matchField = field === 'All' || u.fields.some((f) => f.toLowerCase().includes(field.toLowerCase()));
      const matchScholarship = !onlyScholarships || u.scholarshipAvailable;
      return matchSearch && matchCountry && matchContinent && matchDegree && matchField && matchScholarship;
    });

    if (sort === 'qs-asc') {
      result = [...result].sort((a, b) => (a.qsWorld ?? 9999) - (b.qsWorld ?? 9999));
    } else if (sort === 'country') {
      result = [...result].sort((a, b) => a.country.localeCompare(b.country));
    } else if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return result;
  }, [search, country, continent, degree, field, sort, onlyScholarships]);

  const visibleUnis = filtered.slice(0, visibleCount);

  const toggleCompare = (uni: University) => {
    setCompareList((prev) => {
      const exists = prev.find((u) => u.id === uni.id);
      if (exists) return prev.filter((u) => u.id !== uni.id);
      if (prev.length >= 3) return prev;
      return [...prev, uni];
    });
  };

  const isComparing = (uni: University) => compareList.some((u) => u.id === uni.id);

  return (
    <section id="universities" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">World Universities</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Explore <span className="text-gradient-primary">1,500+ Universities Worldwide</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            {universities.length}+ universities across {new Set(universities.map(u => u.country)).size} countries. Filter by continent, country, degree level, and field of study.
          </p>
        </div>

        {/* Featured Universities */}
        {country === 'All' && continent === 'All' && degree === 'All' && field === 'All' && !search && !onlyScholarships && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-accent-400" />
              <h3 className="font-display font-bold text-lg text-white">Featured Universities</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {universities.filter(u => u.featured).slice(0, 8).map((uni) => (
                <button key={uni.id} onClick={() => setSelected(uni)} className="glass-card rounded-2xl p-4 text-left hover:border-primary-400/30 transition-all hover:scale-105">
                  <div className="flex items-center gap-3 mb-3">
                    <UniversityLogo uni={uni} size="sm" />
                    <div>
                      <div className="font-bold text-white text-sm">{uni.shortName}</div>
                      <div className="text-xs text-dark-300">{uni.flag} {uni.country}</div>
                    </div>
                  </div>
                  {uni.qsWorld && <div className="text-xs text-primary-300 flex items-center gap-1"><Award className="w-3 h-3" /> QS #{uni.qsWorld}</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="glass-card rounded-2xl p-5 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search university, country, city or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-dark-900/50 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterSelect label="Continent" value={continent} options={continentList} onChange={setContinent} />
            <FilterSelect label="Country" value={country} options={countryList} onChange={setCountry} />
            <FilterSelect label="Degree Level" value={degree} options={degreeLevelList} onChange={setDegree} />
            <FilterSelect label="Field" value={field} options={fieldList} onChange={setField} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-dark-200 cursor-pointer">
              <input type="checkbox" checked={onlyScholarships} onChange={(e) => setOnlyScholarships(e.target.checked)} className="w-4 h-4 rounded accent-primary-500" />
              Scholarships available
            </label>
            <FilterSelect label="Sort" value={sort} options={sortOptions.map(o => o.value)} optionLabels={sortOptions.map(o => o.label)} onChange={setSort} compact />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-dark-300">
            Showing <span className="text-white font-semibold">{visibleUnis.length}</span> of {filtered.length} universities
          </div>
          {compareList.length > 0 && (
            <button onClick={() => setShowCompare(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all">
              <GitCompare className="w-4 h-4" /> Compare ({compareList.length})
            </button>
          )}
        </div>

        {/* University Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleUnis.map((uni) => (
            <div key={uni.id} className="group relative">
              <button onClick={() => setSelected(uni)} className="w-full text-left glass-card rounded-2xl p-6 hover:border-primary-400/30 transition-all hover:scale-[1.02] h-full">
                {uni.featured && <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent-500 text-white text-[10px] font-bold rounded-full z-10">FEATURED</div>}
                <div className="flex items-start justify-between mb-4">
                  <UniversityLogo uni={uni} size="md" />
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xl">{uni.flag}</span>
                    {uni.qsWorld && <span className="text-xs text-dark-400 flex items-center gap-0.5"><Award className="w-3 h-3" />QS #{uni.qsWorld}</span>}
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-primary-300 transition-colors">{uni.shortName}</h3>
                <p className="text-xs text-dark-300 mb-3 line-clamp-1">{uni.name}</p>
                <div className="flex items-center gap-2 text-sm text-dark-200 mb-3"><MapPin className="w-4 h-4 text-primary-400" />{uni.city}</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {uni.fields.slice(0, 3).map((f) => (<span key={f} className="px-2 py-1 text-xs bg-white/5 text-dark-200 rounded-md">{f}</span>))}
                  {uni.fields.length > 3 && <span className="px-2 py-1 text-xs text-dark-400">+{uni.fields.length - 3}</span>}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  {uni.scholarshipAvailable && <span className="text-xs text-success-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Scholarships</span>}
                  {uni.internationalStudents && <span className="text-xs text-secondary-300 flex items-center gap-1"><Globe className="w-3 h-3" />Intl. Students</span>}
                  <div className="ml-auto flex gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleCompare(uni); }}
                      disabled={!isComparing(uni) && compareList.length >= 3}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isComparing(uni) ? 'bg-primary-500 text-white' : 'glass-light text-dark-300 hover:text-white hover:bg-primary-500/20'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      title={isComparing(uni) ? 'Remove from comparison' : 'Add to comparison'}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); saveUni(uni.id); }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isUniSaved(uni.id) ? 'bg-accent-500 text-white' : 'glass-light text-dark-300 hover:text-white hover:bg-accent-500/20'
                      }`}
                      title={isUniSaved(uni.id) ? 'Remove from saved' : 'Save university'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="text-center mt-8">
            <button onClick={() => setVisibleCount(prev => prev + 12)} className="px-8 py-3 glass-light text-white font-medium rounded-xl hover:bg-white/10 transition-all">
              Load More ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-dark-700/50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-2">No universities found</h3>
            <p className="text-dark-300 text-sm mb-4">No universities match your current filters. Try adjusting your search or clearing all filters.</p>
            <button
              onClick={() => { setSearch(''); setCountry('All'); setContinent('All'); setDegree('All'); setField('All'); setOnlyScholarships(false); setSort('featured'); }}
              className="px-5 py-2.5 glass-light text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {selected && <UniversityModal uni={selected} onClose={() => setSelected(null)} />}
      {showCompare && <CompareModal unis={compareList} onClose={() => setShowCompare(false)} onClear={() => { setCompareList([]); setShowCompare(false); }} />}
    </section>
  );
}

function FilterSelect({ label, value, options, optionLabels, onChange, compact }: { label: string; value: string; options: string[]; optionLabels?: string[]; onChange: (v: string) => void; compact?: boolean }) {
  return (
    <div>
      <label className={`block ${compact ? 'text-xs' : 'text-xs'} text-dark-400 font-medium uppercase tracking-wider mb-1.5`}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-dark-900/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-400/50 transition-all cursor-pointer">
        {options.map((opt, i) => (<option key={opt} value={opt} className="bg-dark-900">{optionLabels ? optionLabels[i] : opt}</option>))}
      </select>
    </div>
  );
}

function UniversityModal({ uni, onClose }: { uni: University; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin glass rounded-3xl p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:bg-white/10 transition-all z-10">
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-start gap-4 mb-6">
          <UniversityLogo uni={uni} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-2xl text-white">{uni.shortName}</h3>
              <span className="text-2xl">{uni.flag}</span>
            </div>
            <p className="text-sm text-dark-200">{uni.name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-dark-300 flex items-center gap-1"><MapPin className="w-3 h-3" />{uni.city}, {uni.country}</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${uni.type === 'Public' ? 'bg-primary-500/20 text-primary-300' : 'bg-accent-500/20 text-accent-300'}`}>{uni.type}</span>
            </div>
          </div>
        </div>

        <p className="text-dark-100 text-sm leading-relaxed mb-6">{uni.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatBox icon={Award} label="QS World" value={uni.qsWorld ? `#${uni.qsWorld}` : 'N/A'} />
          <StatBox icon={Globe} label="QS Asia" value={uni.qsAsia ? `#${uni.qsAsia}` : 'N/A'} />
          <StatBox icon={Building2} label="Established" value={String(uni.established)} />
          <StatBox icon={Layers} label="Campuses" value={String(uni.campuses)} />
        </div>

        <div className="space-y-3 mb-6">
          <InfoRow icon={DollarSign} label="Tuition" value={uni.tuitionPerSemester} />
          <InfoRow icon={GradIcon} label="Admission Test" value={uni.admissionTest} />
          <InfoRow icon={Award} label="Merit Formula" value={uni.meritWeight} />
          <InfoRow icon={Languages} label="Language Requirements" value={uni.languageRequirements} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Degree Levels</h4>
            <div className="flex flex-wrap gap-2">{uni.degreeLevels.map((d) => (<span key={d} className="px-3 py-1.5 text-sm bg-secondary-500/15 text-secondary-300 rounded-lg">{d}</span>))}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Fields of Study</h4>
            <div className="flex flex-wrap gap-2">{uni.fields.map((f) => (<span key={f} className="px-3 py-1.5 text-sm bg-primary-500/15 text-primary-200 rounded-lg">{f}</span>))}</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Popular Programs</h4>
          <div className="flex flex-wrap gap-2">{uni.programs.map((p) => (<span key={p} className="px-3 py-1.5 text-sm glass-light text-dark-100 rounded-lg">{p}</span>))}</div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {uni.internationalStudents && <Badge icon={Globe} text="International Students Welcome" color="text-secondary-300" />}
          {uni.scholarshipAvailable && <Badge icon={CheckCircle2} text="Scholarships Available" color="text-success-600" />}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">
            <ExternalLink className="w-4 h-4" /> Official Website
          </a>
          {uni.admissionsLink && (
            <a href={uni.admissionsLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 glass-light text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm">
              <GraduationCap className="w-4 h-4" /> Admissions
            </a>
          )}
          {uni.scholarshipLink && (
            <a href={uni.scholarshipLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 glass-light text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm">
              <Sparkles className="w-4 h-4" /> Scholarships
            </a>
          )}
        </div>

        <div className="glass-light rounded-xl p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-dark-400">Official Source: <span className="text-white">{uni.shortName}</span></span>
            <span className="text-dark-400">Last Verified: <span className="text-primary-300">{uni.lastVerified}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareModal({ unis, onClose, onClear }: { unis: University[]; onClose: () => void; onClear: () => void }) {
  if (unis.length === 0) return null;
  const rows: { label: string; key: (u: University) => string }[] = [
    { label: 'Country', key: (u) => `${u.flag} ${u.country}` },
    { label: 'City', key: (u) => u.city },
    { label: 'Type', key: (u) => u.type },
    { label: 'QS World Rank', key: (u) => u.qsWorld ? `#${u.qsWorld}` : 'N/A' },
    { label: 'Established', key: (u) => String(u.established) },
    { label: 'Tuition', key: (u) => u.tuitionPerSemester },
    { label: 'Degree Levels', key: (u) => u.degreeLevels.join(', ') },
    { label: 'Fields', key: (u) => u.fields.slice(0, 4).join(', ') },
    { label: 'International Students', key: (u) => u.internationalStudents ? 'Yes' : 'No' },
    { label: 'Scholarships', key: (u) => u.scholarshipAvailable ? 'Available' : 'Check website' },
    { label: 'Language Requirements', key: (u) => u.languageRequirements },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin glass rounded-3xl p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-2xl text-white flex items-center gap-2"><GitCompare className="w-6 h-6 text-primary-300" /> University Comparison</h3>
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
                {unis.map((u) => (
                  <th key={u.id} className="text-left p-3 min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1">
                      <UniversityLogo uni={u} size="xs" />
                      <div><div className="text-white font-bold text-sm">{u.shortName}</div><div className="text-xs text-dark-300">{u.flag} {u.country}</div></div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white/[0.02]' : ''}>
                  <td className="p-3 text-dark-400 font-medium text-xs uppercase tracking-wider sticky left-0 bg-dark-900 whitespace-nowrap">{row.label}</td>
                  {unis.map((u) => (<td key={u.id} className="p-3 text-dark-100">{row.key(u)}</td>))}
                </tr>
              ))}
              <tr>
                <td className="p-3 text-dark-400 font-medium text-xs uppercase tracking-wider sticky left-0 bg-dark-900">Website</td>
                {unis.map((u) => (<td key={u.id} className="p-3"><a href={u.website} target="_blank" rel="noopener noreferrer" className="text-primary-300 hover:text-primary-200 flex items-center gap-1 text-xs"><ExternalLink className="w-3 h-3" /> Visit</a></td>))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (<div className="glass-light rounded-xl p-3 text-center"><Icon className="w-5 h-5 text-primary-300 mx-auto mb-1" /><div className="text-lg font-bold text-white">{value}</div><div className="text-[10px] text-dark-400 uppercase tracking-wider">{label}</div></div>);
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (<div className="flex items-start justify-between glass-light rounded-xl px-4 py-3 gap-3"><span className="text-sm text-dark-300 flex items-center gap-2 shrink-0"><Icon className="w-4 h-4" />{label}</span><span className="text-sm text-white font-medium text-right">{value}</span></div>);
}

function Badge({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (<span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium glass-light rounded-lg ${color}`}><Icon className="w-3.5 h-3.5" />{text}</span>);
}
