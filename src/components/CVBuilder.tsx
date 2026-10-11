import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  FileText, Download, Plus, Trash2, Eye,
  Star, CheckCircle2, XCircle,
  Loader2, Search, ChevronUp, ChevronDown, EyeOff,
  Layout as LayoutIcon,
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SKILLS_LIST } from '@/data/skills';
import {
  CV_TEMPLATES, getTemplateById,
  type CVTemplate, type TemplateCategory,
} from '@/data/cvTemplates';
import { CVPreview } from '@/components/CVPreview';
import { useCVDraft } from '@/hooks/useCVDraft';

export type CVSection =
  | 'personal' | 'summary' | 'education' | 'experience' | 'projects'
  | 'skills' | 'certifications' | 'languages' | 'achievements'
  | 'volunteering' | 'references' | 'social';

export type SectionConfig = {
  id: CVSection;
  label: string;
  icon: string;
  visible: boolean;
};

export type CVData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  education: { degree: string; institution: string; year: string; gpa: string }[];
  experience: { role: string; company: string; duration: string; description: string }[];
  projects: { name: string; tech: string; link: string; description: string }[];
  skills: string[];
  certifications: { name: string; issuer: string; year: string }[];
  languages: { name: string; proficiency: string }[];
  achievements: string[];
  volunteering: { role: string; organization: string; duration: string; description: string }[];
  references: { name: string; position: string; contact: string }[];
  social: { platform: string; url: string }[];
};

const SECTION_DEFS: { id: CVSection; label: string; icon: string }[] = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'summary', label: 'Summary', icon: 'FileText' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'experience', label: 'Work Experience', icon: 'Briefcase' },
  { id: 'projects', label: 'Projects', icon: 'Code2' },
  { id: 'skills', label: 'Skills', icon: 'Wrench' },
  { id: 'certifications', label: 'Certifications', icon: 'Award' },
  { id: 'languages', label: 'Languages', icon: 'Languages' },
  { id: 'achievements', label: 'Achievements', icon: 'Star' },
  { id: 'volunteering', label: 'Volunteering', icon: 'Heart' },
  { id: 'references', label: 'References', icon: 'Users' },
  { id: 'social', label: 'Social Links', icon: 'Globe' },
];

const defaultSections: SectionConfig[] = SECTION_DEFS.map(s => ({
  ...s,
  visible: ['personal', 'summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'languages', 'achievements', 'social'].includes(s.id),
}));

const defaultCV: CVData = {
  fullName: 'Ahmed Khan',
  title: 'Computer Science Student',
  email: 'ahmed.khan@example.com',
  phone: '+92 300 1234567',
  location: 'Lahore, Pakistan',
  linkedin: 'linkedin.com/in/ahmedkhan',
  github: 'github.com/ahmedkhan',
  website: '',
  summary: 'Final-year CS student at FAST-NUCES with a passion for full-stack development and AI. Seeking internship opportunities to apply my skills in real-world projects.',
  education: [
    { degree: 'BS Computer Science', institution: 'FAST-NUCES, Lahore', year: '2022 - 2026', gpa: '3.8/4.0' },
    { degree: 'FSc Pre-Engineering', institution: 'Govt. College Lahore', year: '2020 - 2022', gpa: '92%' },
  ],
  experience: [
    { role: 'Web Development Intern', company: 'Systems Limited', duration: 'Jun 2024 - Aug 2024', description: 'Built React components for internal dashboard. Improved page load time by 30%.' },
  ],
  projects: [
    { name: 'EduPilot AI', tech: 'React, TypeScript, Supabase', link: 'github.com/ahmedkhan/edupilot', description: 'Career guidance platform for Pakistani students with AI-powered university and scholarship matching.' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'AWS'],
  certifications: [
    { name: 'Google TensorFlow Developer Certificate', issuer: 'Google', year: '2024' },
  ],
  languages: [
    { name: 'English', proficiency: 'Fluent' },
    { name: 'Urdu', proficiency: 'Native' },
  ],
  achievements: ['Dean\'s List (3 consecutive semesters)', '1st Place - NUST Hackathon 2024'],
  volunteering: [
    { role: 'Teaching Assistant', organization: 'CodEforChange', duration: '2023 - Present', description: 'Teaching coding to underprivileged students weekly.' },
  ],
  references: [],
  social: [],
};

type ATSCheck = { label: string; passed: boolean; tip: string };

function calculateATSScore(data: CVData): { score: number; checks: ATSCheck[] } {
  const checks: ATSCheck[] = [
    { label: 'Full name provided', passed: data.fullName.trim().length > 0, tip: 'Add your full legal name' },
    { label: 'Professional title', passed: data.title.trim().length > 0, tip: 'Add a target job title' },
    { label: 'Email address', passed: /\S+@\S+\.\S+/.test(data.email), tip: 'Add a professional email address' },
    { label: 'Phone number', passed: data.phone.trim().length >= 7, tip: 'Add a contact phone number' },
    { label: 'Location', passed: data.location.trim().length > 0, tip: 'Add your city and country' },
    { label: 'Professional summary (30+ words)', passed: data.summary.trim().split(/\s+/).length >= 30, tip: 'Write a summary with at least 30 words' },
    { label: 'At least 1 education entry', passed: data.education.length > 0 && data.education.some(e => e.degree && e.institution), tip: 'Add at least one education entry' },
    { label: 'At least 1 work experience', passed: data.experience.length > 0 && data.experience.some(e => e.role && e.company), tip: 'Add at least one work experience entry' },
    { label: 'Experience has quantified impact', passed: data.experience.some(e => /\d+%|\d+x|\d+ users|\d+ projects/i.test(e.description)), tip: 'Add numbers like "Improved X by 30%"' },
    { label: 'At least 5 skills', passed: data.skills.length >= 5, tip: 'Add at least 5 relevant skills' },
    { label: 'At least 1 achievement', passed: data.achievements.length >= 1, tip: 'Add awards or notable achievements' },
    { label: 'LinkedIn profile', passed: data.linkedin.trim().length > 0, tip: 'Add your LinkedIn profile URL' },
  ];
  const passedCount = checks.filter(c => c.passed).length;
  return { score: Math.round((passedCount / checks.length) * 100), checks };
}

const TEMPLATE_CATEGORIES: (TemplateCategory | 'All')[] = ['All', 'ATS-Friendly', 'Modern', 'Creative', 'Minimal', 'Professional'];
const TEMPLATES_PER_PAGE = 12;

export default function CVBuilder() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [templateId, setTemplateId] = useState('tpl-001');
  const [data, setData] = useState<CVData>(defaultCV);
  const { save: saveDraft } = useCVDraft(data, setData);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(data), 1500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [data, saveDraft]);
  const [sections, setSections] = useState<SectionConfig[]>(defaultSections);
  const [skillInput, setSkillInput] = useState('');
  const [skillHighlight, setSkillHighlight] = useState(-1);
  const [skillFocusOpen, setSkillFocusOpen] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const [achievementInput, setAchievementInput] = useState('');
  const [showATSCheck, setShowATSCheck] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory | 'All'>('All');
  const [templatePage, setTemplatePage] = useState(0);
  const [activeEditorTab, setActiveEditorTab] = useState<CVSection>('personal');

  const template = useMemo(() => getTemplateById(templateId) || CV_TEMPLATES[0], [templateId]);
  const atsResult = useMemo(() => calculateATSScore(data), [data]);

  // Skills autocomplete
  const skillSuggestions = useMemo(() => {
    if (!skillInput.trim()) return [];
    const lower = skillInput.toLowerCase();
    return SKILLS_LIST
      .filter(s => s.toLowerCase().includes(lower) && !data.skills.includes(s))
      .slice(0, 8);
  }, [skillInput, data.skills]);

  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      setData(d => ({ ...d, skills: [...d.skills, trimmed] }));
    }
    setSkillInput('');
    setSkillHighlight(-1);
    setSkillFocusOpen(false);
  }, [data.skills]);

  const removeSkill = (idx: number) => {
    setData(d => ({ ...d, skills: d.skills.filter((_, i) => i !== idx) }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSkillHighlight(h => Math.min(h + 1, skillSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSkillHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (skillHighlight >= 0 && skillSuggestions[skillHighlight]) {
        addSkill(skillSuggestions[skillHighlight]);
      } else if (skillInput.trim()) {
        addSkill(skillInput);
      }
    } else if (e.key === 'Escape') {
      setSkillFocusOpen(false);
      setSkillHighlight(-1);
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setData(d => ({ ...d, achievements: [...d.achievements, achievementInput.trim()] }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (idx: number) => {
    setData(d => ({ ...d, achievements: d.achievements.filter((_, i) => i !== idx) }));
  };

  // Section management
  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections(prev => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const toggleSectionVisible = (id: CVSection) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  // Template filtering
  const filteredTemplates = useMemo(() => {
    return CV_TEMPLATES.filter(t => {
      if (templateCategory !== 'All' && t.category !== templateCategory) return false;
      if (templateSearch && !t.name.toLowerCase().includes(templateSearch.toLowerCase())) return false;
      return true;
    });
  }, [templateCategory, templateSearch]);

  const pagedTemplates = filteredTemplates.slice(templatePage * TEMPLATES_PER_PAGE, (templatePage + 1) * TEMPLATES_PER_PAGE);
  const totalPages = Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 300);
  };

  const atsColor = atsResult.score >= 80 ? 'text-success-600' : atsResult.score >= 60 ? 'text-warning-600' : 'text-error-500';
  const atsBg = atsResult.score >= 80 ? 'bg-success-500/15' : atsResult.score >= 60 ? 'bg-warning-500/15' : 'bg-error-500/15';
  const visibleSections = sections.filter(s => s.visible);

  return (
    <section id="cv-builder" className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
            <FileText className="w-4 h-4 text-accent-300" />
            <span className="text-sm text-accent-300 font-medium">CV Builder</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
            Build an <span className="text-gradient">ATS-Optimized CV</span>
          </h2>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">
            {CV_TEMPLATES.length}+ templates, 12 sections, skills autocomplete, and real-time preview. Built to pass Applicant Tracking Systems.
          </p>
        </div>

        {/* Template gallery toggle + current template */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <LayoutIcon className="w-5 h-5 text-primary-300" />
            <div>
              <div className="text-sm font-semibold text-white">{template.name}</div>
              <div className="text-xs text-dark-300">{template.category} - {template.layout.replace(/-/g, ' ')}</div>
            </div>
          </div>
          <button
            onClick={() => setShowTemplateGallery(s => !s)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white text-sm rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> {showTemplateGallery ? 'Hide Gallery' : `Browse ${CV_TEMPLATES.length}+ Templates`}
          </button>
        </div>

        {/* Template Gallery */}
        {showTemplateGallery && (
          <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={e => { setTemplateSearch(e.target.value); setTemplatePage(0); }}
                  className="cv-input pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setTemplateCategory(cat); setTemplatePage(0); }}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                      templateCategory === cat ? 'bg-primary-500 text-white' : 'glass-light text-dark-200 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-dark-400 mb-3">{filteredTemplates.length} templates found</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {pagedTemplates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => { setTemplateId(tpl.id); setShowTemplateGallery(false); }}
                  className={`glass-light rounded-xl p-3 text-left hover:scale-[1.03] hover:border-primary-400/40 transition-all ${
                    templateId === tpl.id ? 'border-primary-500/50 ring-1 ring-primary-500/30' : ''
                  }`}
                >
                  <TemplateThumbnail template={tpl} />
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-white truncate">{tpl.name}</div>
                    <div className="text-[10px] text-dark-400 mt-0.5">{tpl.category}</div>
                  </div>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setTemplatePage(p => Math.max(0, p - 1))}
                  disabled={templatePage === 0}
                  className="px-3 py-1.5 glass-light text-white text-xs rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-dark-300">Page {templatePage + 1} of {totalPages}</span>
                <button
                  onClick={() => setTemplatePage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={templatePage >= totalPages - 1}
                  className="px-3 py-1.5 glass-light text-white text-xs rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* ATS Score Banner */}
        <div className="glass-card rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${atsBg} flex flex-col items-center justify-center shrink-0`}>
              <span className={`text-2xl font-display font-bold ${atsColor}`}>{atsResult.score}</span>
              <span className="text-[9px] text-dark-400 uppercase">ATS Score</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm mb-1">ATS Compatibility</h4>
              <p className="text-xs text-dark-300">
                {atsResult.score >= 80 ? 'Excellent! Your CV is well-optimized for ATS systems.' : atsResult.score >= 60 ? 'Good start. A few improvements will boost your ATS score.' : 'Needs work. Address the items below.'}
              </p>
            </div>
          </div>
          <button onClick={() => setShowATSCheck(s => !s)} className="px-4 py-2 glass-light text-white text-sm rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 shrink-0">
            {showATSCheck ? 'Hide' : 'Show'} Checklist
          </button>
        </div>

        {showATSCheck && (
          <div className="glass-card rounded-2xl p-5 mb-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-2">
              {atsResult.checks.map((check, i) => (
                <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg ${check.passed ? 'bg-success-500/5' : 'bg-error-500/5'}`}>
                  {check.passed ? <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-error-500 shrink-0 mt-0.5" />}
                  <div>
                    <span className="text-sm text-white font-medium">{check.label}</span>
                    {!check.passed && <p className="text-xs text-dark-400 mt-0.5">{check.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="glass-card rounded-2xl p-6 space-y-5 max-h-[800px] overflow-y-auto scrollbar-thin">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-300" /> Edit Your CV
            </h3>

            {/* Section tabs */}
            <div className="flex flex-wrap gap-1.5">
              {SECTION_DEFS.map(sec => {
                const cfg = sections.find(s => s.id === sec.id);
                const isVisible = cfg?.visible ?? true;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveEditorTab(sec.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                      activeEditorTab === sec.id ? 'bg-primary-500 text-white' : 'glass-light text-dark-200 hover:text-white'
                    }`}
                  >
                    {sec.label}
                    {!isVisible && <EyeOff className="w-3 h-3 opacity-60" />}
                  </button>
                );
              })}
            </div>

            {/* Section content based on active tab */}
            {activeEditorTab === 'personal' && (
              <div className="space-y-3 animate-fade-in">
                <input type="text" placeholder="Full Name" value={data.fullName} onChange={e => setData({ ...data, fullName: e.target.value })} className="cv-input" />
                <input type="text" placeholder="Professional Title" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} className="cv-input" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="email" placeholder="Email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} className="cv-input" />
                  <input type="text" placeholder="Phone" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} className="cv-input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Location" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} className="cv-input" />
                  <input type="text" placeholder="LinkedIn" value={data.linkedin} onChange={e => setData({ ...data, linkedin: e.target.value })} className="cv-input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="GitHub" value={data.github} onChange={e => setData({ ...data, github: e.target.value })} className="cv-input" />
                  <input type="text" placeholder="Website" value={data.website} onChange={e => setData({ ...data, website: e.target.value })} className="cv-input" />
                </div>
              </div>
            )}

            {activeEditorTab === 'summary' && (
              <div className="space-y-3 animate-fade-in">
                <textarea placeholder="Professional Summary (aim for 30+ words)" value={data.summary} onChange={e => setData({ ...data, summary: e.target.value })} rows={5} className="cv-input resize-none" />
                <p className="text-xs text-dark-400">{data.summary.trim().split(/\s+/).filter(Boolean).length} words</p>
              </div>
            )}

            {activeEditorTab === 'education' && (
              <SectionWrapper label="Education" onAdd={() => setData(d => ({ ...d, education: [...d.education, { degree: '', institution: '', year: '', gpa: '' }] }))}>
                {data.education.map((edu, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, education: d.education.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={e => { const a = [...data.education]; a[i] = { ...a[i], degree: e.target.value }; setData({ ...data, education: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Institution" value={edu.institution} onChange={e => { const a = [...data.education]; a[i] = { ...a[i], institution: e.target.value }; setData({ ...data, education: a }); }} className="cv-input text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Year" value={edu.year} onChange={e => { const a = [...data.education]; a[i] = { ...a[i], year: e.target.value }; setData({ ...data, education: a }); }} className="cv-input text-sm" />
                      <input type="text" placeholder="GPA/Score" value={edu.gpa} onChange={e => { const a = [...data.education]; a[i] = { ...a[i], gpa: e.target.value }; setData({ ...data, education: a }); }} className="cv-input text-sm" />
                    </div>
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {activeEditorTab === 'experience' && (
              <SectionWrapper label="Work Experience" onAdd={() => setData(d => ({ ...d, experience: [...d.experience, { role: '', company: '', duration: '', description: '' }] }))}>
                {data.experience.map((exp, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Role" value={exp.role} onChange={e => { const a = [...data.experience]; a[i] = { ...a[i], role: e.target.value }; setData({ ...data, experience: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Company" value={exp.company} onChange={e => { const a = [...data.experience]; a[i] = { ...a[i], company: e.target.value }; setData({ ...data, experience: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Duration" value={exp.duration} onChange={e => { const a = [...data.experience]; a[i] = { ...a[i], duration: e.target.value }; setData({ ...data, experience: a }); }} className="cv-input text-sm" />
                    <textarea placeholder="Description (use numbers like 'Improved by 30%')" value={exp.description} onChange={e => { const a = [...data.experience]; a[i] = { ...a[i], description: e.target.value }; setData({ ...data, experience: a }); }} rows={2} className="cv-input text-sm resize-none" />
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {activeEditorTab === 'projects' && (
              <SectionWrapper label="Projects" onAdd={() => setData(d => ({ ...d, projects: [...d.projects, { name: '', tech: '', link: '', description: '' }] }))}>
                {data.projects.map((proj, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, projects: d.projects.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Project Name" value={proj.name} onChange={e => { const a = [...data.projects]; a[i] = { ...a[i], name: e.target.value }; setData({ ...data, projects: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Tech Stack" value={proj.tech} onChange={e => { const a = [...data.projects]; a[i] = { ...a[i], tech: e.target.value }; setData({ ...data, projects: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Link" value={proj.link} onChange={e => { const a = [...data.projects]; a[i] = { ...a[i], link: e.target.value }; setData({ ...data, projects: a }); }} className="cv-input text-sm" />
                    <textarea placeholder="Description" value={proj.description} onChange={e => { const a = [...data.projects]; a[i] = { ...a[i], description: e.target.value }; setData({ ...data, projects: a }); }} rows={2} className="cv-input text-sm resize-none" />
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {activeEditorTab === 'skills' && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Skills (type to search 300+ skills)</label>
                <div className="relative">
                  <input
                    ref={skillInputRef}
                    type="text"
                    placeholder="Type a skill, e.g. 'ai' or 'python'..."
                    value={skillInput}
                    onChange={e => { setSkillInput(e.target.value); setSkillHighlight(-1); setSkillFocusOpen(true); }}
                    onKeyDown={handleSkillKeyDown}
                    onFocus={() => setSkillFocusOpen(true)}
                    onBlur={() => setTimeout(() => setSkillFocusOpen(false), 150)}
                    className="cv-input"
                  />
                  {skillFocusOpen && skillSuggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 glass-card rounded-xl overflow-hidden shadow-xl max-h-64 overflow-y-auto">
                      {skillSuggestions.map((s, i) => (
                        <button
                          key={s}
                          onClick={() => addSkill(s)}
                          onMouseEnter={() => setSkillHighlight(i)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            i === skillHighlight ? 'bg-primary-500/20 text-white' : 'text-dark-100 hover:bg-white/5'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {data.skills.length === 0 ? (
                  <p className="text-xs text-dark-400 italic">No skills added yet. Add at least 5 for a strong CV.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 text-sm bg-secondary-500/15 text-secondary-200 rounded-lg flex items-center gap-1.5">
                        {skill}
                        <button onClick={() => removeSkill(i)} className="text-dark-400 hover:text-error-500"><Trash2 className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeEditorTab === 'certifications' && (
              <SectionWrapper label="Certifications" onAdd={() => setData(d => ({ ...d, certifications: [...d.certifications, { name: '', issuer: '', year: '' }] }))}>
                {data.certifications.map((cert, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, certifications: d.certifications.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Certification Name" value={cert.name} onChange={e => { const a = [...data.certifications]; a[i] = { ...a[i], name: e.target.value }; setData({ ...data, certifications: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Issued By" value={cert.issuer} onChange={e => { const a = [...data.certifications]; a[i] = { ...a[i], issuer: e.target.value }; setData({ ...data, certifications: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Year" value={cert.year} onChange={e => { const a = [...data.certifications]; a[i] = { ...a[i], year: e.target.value }; setData({ ...data, certifications: a }); }} className="cv-input text-sm" />
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {activeEditorTab === 'languages' && (
              <SectionWrapper label="Languages" onAdd={() => setData(d => ({ ...d, languages: [...d.languages, { name: '', proficiency: 'Fluent' }] }))}>
                {data.languages.map((lang, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, languages: d.languages.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Language" value={lang.name} onChange={e => { const a = [...data.languages]; a[i] = { ...a[i], name: e.target.value }; setData({ ...data, languages: a }); }} className="cv-input text-sm" />
                    <select value={lang.proficiency} onChange={e => { const a = [...data.languages]; a[i] = { ...a[i], proficiency: e.target.value }; setData({ ...data, languages: a }); }} className="cv-input text-sm">
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Beginner">Beginner</option>
                    </select>
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {activeEditorTab === 'achievements' && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Achievements</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Add an achievement..." value={achievementInput} onChange={e => setAchievementInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAchievement())} className="cv-input flex-1" />
                  <button onClick={addAchievement} className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all"><Plus className="w-5 h-5" /></button>
                </div>
                {data.achievements.length === 0 ? (
                  <p className="text-xs text-dark-400 italic">No achievements yet.</p>
                ) : (
                  <div className="space-y-2">
                    {data.achievements.map((ach, i) => (
                      <div key={i} className="flex items-center justify-between glass-light rounded-lg px-3 py-2">
                        <span className="text-sm text-dark-100 flex items-center gap-2"><Star className="w-3.5 h-3.5 text-accent-400" /> {ach}</span>
                        <button onClick={() => removeAchievement(i)} className="text-dark-400 hover:text-error-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeEditorTab === 'volunteering' && (
              <SectionWrapper label="Volunteering" onAdd={() => setData(d => ({ ...d, volunteering: [...d.volunteering, { role: '', organization: '', duration: '', description: '' }] }))}>
                {data.volunteering.map((vol, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, volunteering: d.volunteering.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Role" value={vol.role} onChange={e => { const a = [...data.volunteering]; a[i] = { ...a[i], role: e.target.value }; setData({ ...data, volunteering: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Organization" value={vol.organization} onChange={e => { const a = [...data.volunteering]; a[i] = { ...a[i], organization: e.target.value }; setData({ ...data, volunteering: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Duration" value={vol.duration} onChange={e => { const a = [...data.volunteering]; a[i] = { ...a[i], duration: e.target.value }; setData({ ...data, volunteering: a }); }} className="cv-input text-sm" />
                    <textarea placeholder="Description" value={vol.description} onChange={e => { const a = [...data.volunteering]; a[i] = { ...a[i], description: e.target.value }; setData({ ...data, volunteering: a }); }} rows={2} className="cv-input text-sm resize-none" />
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {activeEditorTab === 'references' && (
              <SectionWrapper label="References" onAdd={() => setData(d => ({ ...d, references: [...d.references, { name: '', position: '', contact: '' }] }))}>
                {data.references.map((ref, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, references: d.references.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Name" value={ref.name} onChange={e => { const a = [...data.references]; a[i] = { ...a[i], name: e.target.value }; setData({ ...data, references: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Position/Company" value={ref.position} onChange={e => { const a = [...data.references]; a[i] = { ...a[i], position: e.target.value }; setData({ ...data, references: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="Email/Phone" value={ref.contact} onChange={e => { const a = [...data.references]; a[i] = { ...a[i], contact: e.target.value }; setData({ ...data, references: a }); }} className="cv-input text-sm" />
                  </EntryCard>
                ))}
                {data.references.length === 0 && <p className="text-xs text-dark-400 italic">Available upon request by default.</p>}
              </SectionWrapper>
            )}

            {activeEditorTab === 'social' && (
              <SectionWrapper label="Social Links" onAdd={() => setData(d => ({ ...d, social: [...d.social, { platform: '', url: '' }] }))}>
                {data.social.map((soc, i) => (
                  <EntryCard key={i} onRemove={() => setData(d => ({ ...d, social: d.social.filter((_, j) => j !== i) }))}>
                    <input type="text" placeholder="Platform (e.g. Twitter, Dribbble)" value={soc.platform} onChange={e => { const a = [...data.social]; a[i] = { ...a[i], platform: e.target.value }; setData({ ...data, social: a }); }} className="cv-input text-sm" />
                    <input type="text" placeholder="URL" value={soc.url} onChange={e => { const a = [...data.social]; a[i] = { ...a[i], url: e.target.value }; setData({ ...data, social: a }); }} className="cv-input text-sm" />
                  </EntryCard>
                ))}
              </SectionWrapper>
            )}

            {/* Section visibility & reorder controls */}
            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">Section Order & Visibility</label>
              {sections.map((sec, idx) => (
                <div key={sec.id} className="flex items-center gap-2">
                  <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} className="text-dark-400 hover:text-white disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                  <button onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1} className="text-dark-400 hover:text-white disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  <span className="text-sm text-dark-100 flex-1">{sec.label}</span>
                  <button onClick={() => toggleSectionVisible(sec.id)} className={`px-2 py-1 text-xs rounded-lg transition-all ${sec.visible ? 'bg-primary-500/15 text-primary-300' : 'glass-light text-dark-400'}`}>
                    {sec.visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleDownload} disabled={downloading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-60">
              {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {downloading ? 'Preparing PDF...' : 'Export as PDF (Print)'}
            </button>
            <p className="text-xs text-dark-400 text-center -mt-2">Tip: Use your browser's print dialog to "Save as PDF"</p>
          </div>

          {/* Live Preview */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-primary-300" /> Live Preview
            </h3>
            <div id="cv-print-area" className="cv-preview-container bg-white rounded-xl p-6 sm:p-8 text-gray-800 max-h-[750px] overflow-y-auto" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
              <CVPreview data={data} template={template} sections={visibleSections} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cv-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: rgba(15, 20, 38, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.625rem;
          color: white;
          font-size: 0.875rem;
        }
        .cv-input::placeholder { color: #56638a; }
        .cv-input:focus {
          outline: none;
          border-color: rgba(52, 220, 193, 0.4);
          box-shadow: 0 0 0 2px rgba(52, 220, 193, 0.15);
        }
        @media print {
          body * { visibility: hidden; }
          #cv-print-area, #cv-print-area * { visibility: visible; }
          #cv-print-area {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            max-height: none;
            overflow: visible;
            box-shadow: none;
            border-radius: 0;
            padding: 0.5in 0.6in;
          }
          @page { size: A4; margin: 0.4in; }
          #cv-print-area h2, #cv-print-area .cv-section {
            page-break-after: avoid;
            break-after: avoid;
          }
          #cv-print-area .cv-entry {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </section>
  );
}

function SectionWrapper({ label, onAdd, children }: { label: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">{label}</label>
        <button onClick={onAdd} className="text-primary-300 hover:text-primary-200 text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
      {children}
    </div>
  );
}

function EntryCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="glass-light rounded-xl p-3 space-y-2 relative">
      <button onClick={onRemove} className="absolute top-2 right-2 text-dark-400 hover:text-error-500 z-10">
        <Trash2 className="w-4 h-4" />
      </button>
      <div className="pr-6 space-y-2">{children}</div>
    </div>
  );
}

function TemplateThumbnail({ template }: { template: CVTemplate }) {
  const { theme, layout, sectionStyle } = template;
  const isSidebar = layout === 'sidebar-left' || layout === 'sidebar-right';
  const isTwoCol = layout === 'two-column';
  const isBanner = layout === 'header-banner';
  const isCreative = layout === 'creative';

  return (
    <div className="bg-white rounded-lg overflow-hidden" style={{ height: '120px', border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter, sans-serif' }}>
        {isSidebar && layout === 'sidebar-left' && (
          <div style={{ width: '32%', background: theme.light, padding: '6px 4px' }}>
            <div style={{ height: '20px', background: theme.primary, borderRadius: '2px', marginBottom: '4px', opacity: 0.3 }} />
            <div style={{ height: '3px', background: theme.muted, borderRadius: '1px', marginBottom: '2px', opacity: 0.3 }} />
            <div style={{ height: '3px', background: theme.muted, borderRadius: '1px', marginBottom: '2px', opacity: 0.3 }} />
            <div style={{ height: '3px', background: theme.muted, borderRadius: '1px', width: '60%', opacity: 0.3 }} />
          </div>
        )}
        <div style={{ flex: 1, padding: '6px 6px' }}>
          {isBanner && <div style={{ height: '18px', background: theme.primary, borderRadius: '2px', marginBottom: '4px', opacity: 0.2 }} />}
          <div style={{ fontSize: '7px', fontWeight: 700, color: theme.text, marginBottom: '2px' }}>John Doe</div>
          <div style={{ fontSize: '5px', color: theme.primary, marginBottom: '4px' }}>Software Engineer</div>
          {sectionStyle === 'accent-bar' && <div style={{ height: '1.5px', background: theme.primary, marginBottom: '3px' }} />}
          {sectionStyle === 'underlined' && <div style={{ height: '1px', background: theme.border, marginBottom: '3px' }} />}
          {sectionStyle === 'boxed' && <div style={{ background: theme.light, borderRadius: '2px', padding: '2px', marginBottom: '3px' }}>
            <div style={{ fontSize: '4px', fontWeight: 700, color: theme.primary }}>EXPERIENCE</div>
          </div>}
          {(sectionStyle === 'plain' || sectionStyle === 'pill') && <div style={{ fontSize: '4px', fontWeight: 700, color: theme.primary, marginBottom: '3px' }}>EXPERIENCE</div>}
          <div style={{ height: '2px', background: theme.muted, borderRadius: '1px', marginBottom: '2px', opacity: 0.3 }} />
          <div style={{ height: '2px', background: theme.muted, borderRadius: '1px', marginBottom: '2px', opacity: 0.3 }} />
          <div style={{ height: '2px', background: theme.muted, borderRadius: '1px', width: '70%', opacity: 0.3 }} />
        </div>
        {isSidebar && layout === 'sidebar-right' && (
          <div style={{ width: '32%', background: theme.light, padding: '6px 4px' }}>
            <div style={{ height: '20px', background: theme.primary, borderRadius: '2px', marginBottom: '4px', opacity: 0.3 }} />
            <div style={{ height: '3px', background: theme.muted, borderRadius: '1px', marginBottom: '2px', opacity: 0.3 }} />
            <div style={{ height: '3px', background: theme.muted, borderRadius: '1px', marginBottom: '2px', opacity: 0.3 }} />
          </div>
        )}
        {isTwoCol && (
          <div style={{ width: '40%', padding: '6px 4px' }}>
            <div style={{ fontSize: '4px', fontWeight: 700, color: theme.primary, marginBottom: '3px' }}>SKILLS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
              <div style={{ fontSize: '3px', background: theme.light, color: theme.primary, borderRadius: '2px', padding: '1px 3px' }}>React</div>
              <div style={{ fontSize: '3px', background: theme.light, color: theme.primary, borderRadius: '2px', padding: '1px 3px' }}>JS</div>
            </div>
          </div>
        )}
        {isCreative && (
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: theme.primary, margin: '6px 4px 0 0', opacity: 0.3 }} />
        )}
      </div>
    </div>
  );
}
