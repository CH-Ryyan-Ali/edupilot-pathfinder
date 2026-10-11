import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, GraduationCap, Award, Globe, ArrowRight } from 'lucide-react';
import { universities } from '@/data/universities';
import { scholarships } from '@/data/scholarships';

type SearchResult = {
  type: 'university' | 'scholarship' | 'country';
  id: string;
  title: string;
  subtitle: string;
  flag: string;
  route: string;
  icon: typeof GraduationCap;
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const uniResults: SearchResult[] = universities
      .filter((u) =>
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.fields.some((f) => f.toLowerCase().includes(q)) ||
        u.programs.some((p) => p.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map((u) => ({
        type: 'university' as const,
        id: u.id,
        title: u.shortName,
        subtitle: `${u.flag} ${u.city}, ${u.country}`,
        flag: u.flag,
        route: '/universities',
        icon: GraduationCap,
      }));

    const schResults: SearchResult[] = scholarships
      .filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.level.some((l) => l.toLowerCase().includes(q)) ||
        s.eligibilitySummary.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((s) => ({
        type: 'scholarship' as const,
        id: s.id,
        title: s.name,
        subtitle: `${s.flag} ${s.fundingType} — ${s.level.join(', ')}`,
        flag: s.flag,
        route: '/scholarships',
        icon: Award,
      }));

    const countrySet = new Set(universities.map((u) => u.country));
    const countryResults: SearchResult[] = [...countrySet]
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => {
        const u = universities.find((u) => u.country === c);
        return {
          type: 'country' as const,
          id: `country-${c}`,
          title: c,
          subtitle: `${universities.filter((u) => u.country === c).length} universities`,
          flag: u?.flag || '',
          route: '/universities',
          icon: Globe,
        };
      });

    return [...uniResults, ...schResults, ...countryResults].slice(0, 12);
  }, [query]);

  const goTo = (route: string) => {
    setShowResults(false);
    setQuery('');
    navigate(route);
  };

  const typeColors: Record<string, string> = {
    university: 'text-primary-300 bg-primary-500/15',
    scholarship: 'text-accent-300 bg-accent-500/15',
    country: 'text-secondary-300 bg-secondary-500/15',
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={containerRef} className="max-w-3xl mx-auto relative">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-400" />
          <input
            type="text"
            placeholder="Search universities, programs & scholarships..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            className="w-full pl-14 pr-12 py-4 bg-dark-900/60 border border-white/10 rounded-2xl text-white text-lg placeholder-dark-400 focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20 transition-all"
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowResults(false); }} className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {showResults && query.trim() && (
          <div className="absolute top-full mt-2 w-full glass rounded-2xl p-3 z-50 max-h-[70vh] overflow-y-auto scrollbar-thin shadow-2xl">
            {results.length === 0 ? (
              <div className="text-center py-8 text-dark-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results for "{query}"</p>
              </div>
            ) : (
              <>
                {results.some((r) => r.type === 'university') && (
                  <div className="text-xs text-dark-400 font-medium uppercase tracking-wider px-2 py-1.5">Universities</div>
                )}
                {results.filter((r) => r.type === 'university').map((r) => (
                  <button key={r.id} onClick={() => goTo(r.route)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[r.type]}`}><r.icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.title}</div>
                      <div className="text-xs text-dark-300 truncate">{r.subtitle}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-dark-400 shrink-0" />
                  </button>
                ))}

                {results.some((r) => r.type === 'scholarship') && (
                  <div className="text-xs text-dark-400 font-medium uppercase tracking-wider px-2 py-1.5 mt-1">Scholarships</div>
                )}
                {results.filter((r) => r.type === 'scholarship').map((r) => (
                  <button key={r.id} onClick={() => goTo(r.route)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[r.type]}`}><r.icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.title}</div>
                      <div className="text-xs text-dark-300 truncate">{r.subtitle}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-dark-400 shrink-0" />
                  </button>
                ))}

                {results.some((r) => r.type === 'country') && (
                  <div className="text-xs text-dark-400 font-medium uppercase tracking-wider px-2 py-1.5 mt-1">Countries</div>
                )}
                {results.filter((r) => r.type === 'country').map((r) => (
                  <button key={r.id} onClick={() => goTo(r.route)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[r.type]}`}><r.icon className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.flag} {r.title}</div>
                      <div className="text-xs text-dark-300 truncate">{r.subtitle}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-dark-400 shrink-0" />
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
