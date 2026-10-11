import { ShieldCheck, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const sources = [
  { name: 'Higher Education Commission Pakistan', url: 'https://www.hec.gov.pk', desc: 'Official HEC scholarships, university recognition, and degree verification' },
  { name: 'QS World University Rankings', url: 'https://www.topuniversities.com', desc: 'Global university rankings and comparison data' },
  { name: 'Times Higher Education', url: 'https://www.timeshighereducation.com', desc: 'World university rankings and higher education news' },
  { name: 'DAAD — German Academic Exchange Service', url: 'https://www.daad.de/en/', desc: 'Scholarships and study information for Germany' },
  { name: 'Erasmus+ — European Union', url: 'https://erasmus-plus.ec.europa.eu', desc: 'EU-funded scholarship and exchange programs including Erasmus Mundus' },
  { name: 'Chevening Scholarships', url: 'https://www.chevening.org', desc: 'UK government international scholarship programme' },
  { name: 'Stipendium Hungaricum', url: 'https://stipendiumhungaricum.hu', desc: 'Hungarian government scholarship for international students' },
  { name: 'Study in Korea', url: 'https://www.studyinkorea.go.kr', desc: 'Korean government scholarships and university information' },
  { name: 'Türkiye Scholarships', url: 'https://www.turkiyeburslari.gov.tr', desc: 'Turkish government scholarship programme for international students' },
  { name: 'Cambridge Assessment English', url: 'https://www.cambridgeenglish.org', desc: 'IELTS and English language proficiency test information' },
  { name: 'ETS — TOEFL', url: 'https://www.ets.org/toefl', desc: 'TOEFL English proficiency test registration and preparation' },
  { name: 'British Council Pakistan', url: 'https://www.britishcouncil.pk', desc: 'IELTS test centers and UK study information in Pakistan' },
];

export default function TrustedOfficialSources() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <ShieldCheck className="w-4 h-4 text-success-600" />
            <span className="text-sm text-success-600 font-medium">Verified & Trusted</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Trusted <span className="text-gradient-primary">Official Sources</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            We link only to official university websites, government scholarship portals, and recognized education authorities. No blogs, no unofficial pages.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map(s => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-5 hover:border-success-600/20 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-success-600 shrink-0" />
                <ExternalLink className="w-4 h-4 text-dark-400 group-hover:text-primary-300 transition-colors" />
              </div>
              <h4 className="font-display font-bold text-sm text-white mb-1 group-hover:text-primary-300 transition-colors">{s.name}</h4>
              <p className="text-xs text-dark-300 leading-relaxed">{s.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
