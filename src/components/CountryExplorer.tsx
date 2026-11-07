import { useState } from 'react';
import { Globe2, GraduationCap, DollarSign, Languages, ExternalLink, Award, X, Plane, Users } from 'lucide-react';
import { countries } from '@/data/countries';
import { universities } from '@/data/universities';
import { scholarships } from '@/data/scholarships';
import UniversityLogo from '@/components/UniversityLogo';
import type { Country } from '@/types';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function CountryExplorer() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [selected, setSelected] = useState<Country | null>(null);

  return (
    <section id="country-explorer" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Globe2 className="w-4 h-4 text-secondary-300" />
            <span className="text-sm text-secondary-300 font-medium">Study Destinations</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Study Around the <span className="text-gradient-primary">World</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            Explore {countries.length}+ study destinations with detailed guides. Compare tuition, language requirements, visa options, and scholarship availability — with universities from {new Set(universities.map(u => u.country)).size} countries worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {countries.map((country) => {
            const uniCount = universities.filter(u => u.country === country.name || u.country === country.id.toUpperCase()).length;
            const schCount = scholarships.filter(s => s.countries.some(c => c.includes(country.name)) || s.country === country.name).length;
            return (
              <button
                key={country.id}
                onClick={() => setSelected(country)}
                className="group glass-card rounded-2xl p-5 text-center hover:border-secondary-400/30 transition-all hover:scale-105"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{country.flag}</div>
                <div className="font-display font-bold text-sm text-white mb-1">{country.name}</div>
                <div className="flex items-center justify-center gap-3 text-xs text-dark-400">
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{uniCount} unis</span>
                  {schCount > 0 && <span className="flex items-center gap-1"><Award className="w-3 h-3" />{schCount} sch.</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && <CountryModal country={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function CountryModal({ country, onClose }: { country: Country; onClose: () => void }) {
  const countryUnis = universities.filter(u => u.country === country.name || u.country === country.id.toUpperCase());
  const countryScholarships = scholarships.filter(s => s.countries.some(c => c.includes(country.name)) || s.country === country.name);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin glass rounded-3xl p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 glass-light rounded-xl flex items-center justify-center hover:bg-white/10 transition-all z-10"><X className="w-5 h-5 text-white" /></button>

        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">{country.flag}</div>
          <div>
            <h3 className="font-display font-bold text-2xl text-white">{country.name}</h3>
            <p className="text-sm text-dark-300 mt-1">{country.description}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <InfoCard icon={DollarSign} label="Avg Tuition" value={country.avgTuitionRange} />
          <InfoCard icon={Languages} label="Language Requirement" value={country.languageRequirement} />
          <InfoCard icon={Plane} label="Visa Information" value={country.visaInfo} />
          <InfoCard icon={Users} label="International Students" value={country.internationalStudents ? 'Welcome' : 'Limited'} />
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Popular Fields</h4>
          <div className="flex flex-wrap gap-2">{country.popularFields.map((f) => <span key={f} className="px-3 py-1.5 text-sm bg-primary-500/15 text-primary-200 rounded-lg">{f}</span>)}</div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Degree Levels</h4>
          <div className="flex flex-wrap gap-2">{country.degreeLevels.map((d) => <span key={d} className="px-3 py-1.5 text-sm bg-secondary-500/15 text-secondary-300 rounded-lg">{d}</span>)}</div>
        </div>

        {countryUnis.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary-300" /> Universities ({countryUnis.length})</h4>
            <div className="space-y-2">
              {countryUnis.map((u) => (
                <a key={u.id} href={u.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between glass-light rounded-xl px-4 py-3 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-2">
                    <UniversityLogo uni={u} size="xs" />
                    <span className="text-sm text-white font-medium">{u.shortName}</span>
                  </div>
                  {u.qsWorld && <span className="text-xs text-primary-300">QS #{u.qsWorld}</span>}
                </a>
              ))}
            </div>
          </div>
        )}

        {countryScholarships.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider flex items-center gap-2"><Award className="w-4 h-4 text-accent-300" /> Scholarships ({countryScholarships.length})</h4>
            <div className="space-y-2">
              {countryScholarships.map((s) => (
                <a key={s.id} href={s.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between glass-light rounded-xl px-4 py-3 hover:bg-white/10 transition-all">
                  <span className="text-sm text-white font-medium">{s.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.fundingType === 'Fully Funded' ? 'bg-success-500/20 text-success-600' : 'bg-warning-500/20 text-warning-600'}`}>{s.fundingType}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <a href={country.officialResource} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-secondary-500 to-primary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">
          <ExternalLink className="w-4 h-4" /> Official Study Resources
        </a>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="glass-light rounded-xl p-4">
      <Icon className="w-5 h-5 text-secondary-300 mb-2" />
      <div className="text-xs text-dark-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  );
}
