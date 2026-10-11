import { Flag, FileText, GraduationCap, ExternalLink, Languages, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';
import { scholarships } from '@/data/scholarships';

export default function PakistaniOpportunities() {
  const pakScholarships = scholarships.filter(s => s.pakistanEligible);

  const guides = [
    { icon: FileText, title: 'Required Documents', items: ['Valid passport', 'Attested academic transcripts', 'Degree certificates', 'Recommendation letters', 'Statement of purpose', 'CNIC / B-Form'] },
    { icon: Languages, title: 'English Proficiency', items: ['IELTS: most universities require 6.5+', 'TOEFL: typically 80-90+', 'Some programs accept Duolingo English Test', 'Check specific university requirements', 'Some universities waive for English-medium instruction'] },
  ];

  return (
    <section id="pak-opportunities" className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <Flag className="w-4 h-4 text-primary-300" />
            <span className="text-sm text-primary-300 font-medium">Dedicated Section</span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white mb-2">
            <span className="text-2xl sm:text-3xl">🇵🇰</span> Opportunities for <span className="text-gradient-primary">Pakistani Students</span>
          </h2>
          <p className="text-dark-200 max-w-2xl text-base">
            Scholarships and application guidance specifically curated for students from Pakistan.
          </p>
        </div>

        {/* Scholarship Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {pakScholarships.map(s => (
            <a key={s.id} href={s.link} target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-5 hover:border-primary-400/20 transition-all group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.flag}</span>
                <h4 className="font-bold text-sm text-white group-hover:text-primary-300 transition-colors">{s.name}</h4>
              </div>
              <p className="text-xs text-dark-300 mb-2">{s.provider}</p>
              <div className="flex items-center gap-3 text-xs text-dark-400 mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.countries.join(', ')}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.deadline}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.level.slice(0, 2).map(l => <span key={l} className="px-2 py-0.5 text-xs bg-secondary-500/15 text-secondary-300 rounded-full flex items-center gap-1"><GraduationCap className="w-2.5 h-2.5" />{l}</span>)}
                <span className={`px-2 py-0.5 text-xs rounded-full ${s.fundingType === 'Fully Funded' ? 'bg-success-500/20 text-success-600' : 'bg-warning-500/20 text-warning-600'}`}>{s.fundingType}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Application Guidance */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {guides.map(g => (
            <div key={g.title} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center"><g.icon className="w-5 h-5 text-primary-300" /></div>
                <h4 className="font-display font-bold text-sm text-white">{g.title}</h4>
              </div>
              <ul className="space-y-2">
                {g.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-dark-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Official Resources */}
        <div className="glass-light rounded-2xl p-6 mb-4">
          <h4 className="font-display font-bold text-sm text-white mb-4 flex items-center gap-2"><ExternalLink className="w-4 h-4 text-primary-300" /> Official Resources</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'HEC Pakistan — Scholarships & Grants', url: 'https://www.hec.gov.pk/english/scholarshipsgrants/Pages/default.aspx' },
              { label: 'HEC — Learning Opportunities Abroad', url: 'https://www.hec.gov.pk/english/scholarshipsgrants/lao/Pages/default.aspx' },
              { label: 'HEC — Chinese Government Scholarship', url: 'https://www.hec.gov.pk/Site/CGSP/default.aspx' },
              { label: 'Stipendium Hungaricum (via HEC)', url: 'https://stipendiumhungaricum.hu' },
              { label: 'Chevening Scholarship (Pakistan)', url: 'https://www.chevening.org' },
              { label: 'DAAD — Study in Germany', url: 'https://www.daad.de/en/' },
            ].map(r => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between glass-light rounded-xl px-4 py-3 hover:bg-white/10 transition-all group">
                <span className="text-sm text-dark-100 group-hover:text-white transition-colors">{r.label}</span>
                <ExternalLink className="w-4 h-4 text-dark-400 group-hover:text-primary-300 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

        <div className="glass-light rounded-2xl p-4 flex items-start gap-3 border border-warning-500/20">
          <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
          <p className="text-xs text-dark-200 leading-relaxed">Always verify scholarship deadlines, eligibility criteria, and required documents on official websites. Application processes and requirements may change annually.</p>
        </div>
      </div>
    </section>
  );
}
