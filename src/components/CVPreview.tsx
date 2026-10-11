import {
  Mail, Phone, MapPin, Linkedin, Github, Globe, GraduationCap,
  Briefcase, Award, Wrench, Star, Code2, Languages as LangIcon,
  Heart, Users, FileText,
} from 'lucide-react';
import type { CVData, CVSection, SectionConfig } from '@/components/CVBuilder';
import type { CVTemplate } from '@/data/cvTemplates';

type Props = {
  data: CVData;
  template: CVTemplate;
  sections: SectionConfig[];
};

export function CVPreview({ data, template, sections }: Props) {
  const { theme, layout, sectionStyle, fonts, hasPhoto, hasIcons } = template;
  const isSidebar = layout === 'sidebar-left' || layout === 'sidebar-right';
  const isMinimal = layout === 'minimal';
  const isATS = layout === 'ats-friendly';
  const isCreative = layout === 'creative';
  const isBanner = layout === 'header-banner';

  const fontFam = `${fonts.body}`;
  const headingFont = `${fonts.heading}`;

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: isMinimal ? theme.text : theme.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    fontFamily: headingFont,
  };

  const wrapSectionTitle = (title: string, icon?: React.ReactNode) => {
    if (sectionStyle === 'boxed') {
      return (
        <div style={{ background: theme.light, borderRadius: '4px', padding: '4px 8px', marginBottom: '8px' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>{hasIcons && icon}{title}</h2>
        </div>
      );
    }
    if (sectionStyle === 'underlined' || isMinimal) {
      return <h2 style={{ ...sectionTitleStyle, borderBottom: `1px solid ${theme.border}`, paddingBottom: '4px' }}>{hasIcons && icon}{title}</h2>;
    }
    if (sectionStyle === 'accent-bar') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '3px', height: '16px', background: theme.primary, borderRadius: '2px' }} />
          <h2 style={{ ...sectionTitleStyle, marginBottom: 0 }}>{hasIcons && icon}{title}</h2>
        </div>
      );
    }
    if (sectionStyle === 'pill') {
      return (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ ...sectionTitleStyle, display: 'inline-block', background: theme.primary, color: '#fff', borderRadius: '12px', padding: '2px 10px', marginBottom: 0, fontSize: '11px' }}>{hasIcons && icon}{title}</span>
        </div>
      );
    }
    return <h2 style={sectionTitleStyle}>{hasIcons && icon}{title}</h2>;
  };

  const renderSection = (sec: SectionConfig): React.ReactNode | null => {
    if (!sec.visible) return null;
    switch (sec.id) {
      case 'personal': return null;
      case 'summary':
        return data.summary ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Summary')}
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#4b5563', fontFamily: fontFam }}>{data.summary}</p>
          </div>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Education', <GraduationCap style={{ width: '14px', height: '14px' }} />)}
            {data.education.map((edu, i) => (
              <div key={i} className="cv-entry" style={{ marginBottom: '8px', borderLeft: !isATS && !isMinimal ? `2px solid ${theme.primary}40` : 'none', paddingLeft: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: theme.text, fontFamily: headingFont }}>{edu.degree || 'Degree'}</span>
                  <span style={{ fontSize: '11px', color: theme.muted }}>{edu.year}</span>
                </div>
                <div style={{ fontSize: '12px', color: theme.primary }}>{edu.institution}</div>
                {edu.gpa && <div style={{ fontSize: '11px', color: theme.muted }}>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'experience':
        return data.experience.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Experience', <Briefcase style={{ width: '14px', height: '14px' }} />)}
            {data.experience.map((exp, i) => (
              <div key={i} className="cv-entry" style={{ marginBottom: '10px', borderLeft: !isATS && !isMinimal ? `2px solid ${theme.primary}40` : 'none', paddingLeft: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: theme.text, fontFamily: headingFont }}>{exp.role || 'Role'}</span>
                  <span style={{ fontSize: '11px', color: theme.muted }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: '12px', color: theme.primary, marginBottom: '3px' }}>{exp.company}</div>
                <p style={{ fontSize: '11px', lineHeight: 1.5, color: '#4b5563', fontFamily: fontFam }}>{exp.description}</p>
              </div>
            ))}
          </div>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Projects', <Code2 style={{ width: '14px', height: '14px' }} />)}
            {data.projects.map((proj, i) => (
              <div key={i} className="cv-entry" style={{ marginBottom: '8px', borderLeft: !isATS && !isMinimal ? `2px solid ${theme.primary}40` : 'none', paddingLeft: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: theme.text, fontFamily: headingFont }}>{proj.name || 'Project'}</span>
                  {proj.link && <span style={{ fontSize: '11px', color: theme.primary }}>{proj.link}</span>}
                </div>
                {proj.tech && <div style={{ fontSize: '11px', color: theme.primary }}>{proj.tech}</div>}
                {proj.description && <p style={{ fontSize: '11px', lineHeight: 1.5, color: '#4b5563', fontFamily: fontFam }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case 'skills':
        return data.skills.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Skills', <Wrench style={{ width: '14px', height: '14px' }} />)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {data.skills.map((skill, i) => (
                <span key={i} style={{ fontSize: '11px', padding: '3px 8px', background: isMinimal ? '#f3f4f6' : `${theme.primary}15`, color: isMinimal ? theme.text : theme.primary, borderRadius: '4px', fontWeight: 500, fontFamily: fontFam }}>{skill}</span>
              ))}
            </div>
          </div>
        ) : null;
      case 'certifications':
        return data.certifications.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Certifications', <Award style={{ width: '14px', height: '14px' }} />)}
            {data.certifications.map((cert, i) => (
              <div key={i} className="cv-entry" style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: theme.text, fontFamily: fontFam }}>{cert.name}</span>
                  <span style={{ fontSize: '11px', color: theme.muted }}>{cert.year}</span>
                </div>
                {cert.issuer && <div style={{ fontSize: '11px', color: theme.primary }}>{cert.issuer}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'languages':
        return data.languages.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Languages', <LangIcon style={{ width: '14px', height: '14px' }} />)}
            {data.languages.map((lang, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontFamily: fontFam }}>
                <span style={{ color: theme.text, fontWeight: 500 }}>{lang.name}</span>
                <span style={{ color: theme.muted }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        ) : null;
      case 'achievements':
        return data.achievements.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Achievements', <Star style={{ width: '14px', height: '14px' }} />)}
            {data.achievements.map((ach, i) => (
              <div key={i} className="cv-entry" style={{ fontSize: '12px', color: '#4b5563', marginBottom: '4px', display: 'flex', alignItems: 'start', gap: '6px', fontFamily: fontFam }}>
                <span style={{ color: theme.primary, marginTop: '2px' }}>&#8226;</span> {ach}
              </div>
            ))}
          </div>
        ) : null;
      case 'volunteering':
        return data.volunteering.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Volunteering', <Heart style={{ width: '14px', height: '14px' }} />)}
            {data.volunteering.map((vol, i) => (
              <div key={i} className="cv-entry" style={{ marginBottom: '8px', borderLeft: !isATS && !isMinimal ? `2px solid ${theme.primary}40` : 'none', paddingLeft: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: theme.text, fontFamily: headingFont }}>{vol.role}</span>
                  <span style={{ fontSize: '11px', color: theme.muted }}>{vol.duration}</span>
                </div>
                <div style={{ fontSize: '12px', color: theme.primary }}>{vol.organization}</div>
                {vol.description && <p style={{ fontSize: '11px', lineHeight: 1.5, color: '#4b5563', fontFamily: fontFam }}>{vol.description}</p>}
              </div>
            ))}
          </div>
        ) : null;
      case 'references':
        return data.references.length > 0 ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('References', <Users style={{ width: '14px', height: '14px' }} />)}
            {data.references.map((ref, i) => (
              <div key={i} className="cv-entry" style={{ marginBottom: '6px', fontSize: '12px', fontFamily: fontFam }}>
                <div style={{ fontWeight: 600, color: theme.text }}>{ref.name}</div>
                <div style={{ color: theme.primary, fontSize: '11px' }}>{ref.position}</div>
                <div style={{ color: theme.muted, fontSize: '11px' }}>{ref.contact}</div>
              </div>
            ))}
          </div>
        ) : data.references.length === 0 && sections.find(s => s.id === 'references')?.visible ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('References')}
            <p style={{ fontSize: '12px', color: '#4b5563', fontStyle: 'italic', fontFamily: fontFam }}>Available upon request.</p>
          </div>
        ) : null;
      case 'social':
        return data.social.length > 0 || data.github || data.website ? (
          <div className="cv-section" key={sec.id} style={{ marginBottom: '16px' }}>
            {wrapSectionTitle('Social Links', <Globe style={{ width: '14px', height: '14px' }} />)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', fontFamily: fontFam }}>
              {data.github && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: theme.muted }}><Github style={{ width: '12px', height: '12px' }} /> {data.github}</span>}
              {data.website && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: theme.muted }}><Globe style={{ width: '12px', height: '12px' }} /> {data.website}</span>}
              {data.social.map((soc, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px', color: theme.muted }}>{soc.platform}: {soc.url}</span>
              ))}
            </div>
          </div>
        ) : null;
      default: return null;
    }
  };

  // Build header
  const header = (
    <div className="cv-section" style={{
      borderBottom: isMinimal ? '1px solid #d1d5db' : isBanner ? 'none' : `3px solid ${theme.primary}`,
      paddingBottom: isBanner ? '0' : '16px',
      marginBottom: '20px',
      background: isBanner ? theme.light : 'transparent',
      borderRadius: isBanner ? '8px' : '0',
      padding: isBanner ? '16px' : '0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isCreative || hasPhoto ? '16px' : '0' }}>
        {(isCreative || hasPhoto) && (
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '22px', fontWeight: 700, fontFamily: headingFont, flexShrink: 0,
          }}>
            {(data.fullName || 'Y').charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: isMinimal ? '22px' : isCreative ? '24px' : '26px', fontWeight: 700, color: theme.text, marginBottom: '4px', fontFamily: headingFont }}>
            {data.fullName || 'Your Name'}
          </h1>
          <p style={{ fontSize: '15px', color: theme.primary, fontWeight: 600, marginBottom: '8px', fontFamily: fontFam }}>{data.title || 'Professional Title'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: theme.muted, fontFamily: fontFam }}>
            {data.email && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{hasIcons && <Mail style={{ width: '12px', height: '12px' }} />} {data.email}</span>}
            {data.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{hasIcons && <Phone style={{ width: '12px', height: '12px' }} />} {data.phone}</span>}
            {data.location && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{hasIcons && <MapPin style={{ width: '12px', height: '12px' }} />} {data.location}</span>}
            {data.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{hasIcons && <Linkedin style={{ width: '12px', height: '12px' }} />} {data.linkedin}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar content (skills, languages, certifications, social)
  const sidebarSections: CVSection[] = ['skills', 'languages', 'certifications', 'social'];
  const mainSections = sections.filter(s => s.visible && !sidebarSections.includes(s.id) && s.id !== 'personal');
  const sideSections = sections.filter(s => s.visible && sidebarSections.includes(s.id));

  // Sidebar layout
  if (isSidebar) {
    const sideContent = sideSections.map(s => renderSection(s)).filter(Boolean);
    const mainContent = mainSections.map(s => renderSection(s)).filter(Boolean);
    const isLeft = layout === 'sidebar-left';

    return (
      <div style={{ fontFamily: fontFam, color: theme.text, display: 'flex', gap: '20px' }}>
        {isLeft && (
          <div style={{ width: '34%', background: theme.light, borderRadius: '8px', padding: '14px' }}>
            {sideContent}
          </div>
        )}
        <div style={{ flex: 1 }}>
          {header}
          {mainContent}
        </div>
        {!isLeft && (
          <div style={{ width: '34%', background: theme.light, borderRadius: '8px', padding: '14px' }}>
            {sideContent}
          </div>
        )}
      </div>
    );
  }

  // Two column layout
  if (layout === 'two-column') {
    const leftSections = sections.filter(s => s.visible && ['summary', 'experience', 'projects'].includes(s.id));
    const rightSections = sections.filter(s => s.visible && ['education', 'skills', 'certifications', 'languages', 'achievements', 'volunteering', 'references', 'social'].includes(s.id));
    return (
      <div style={{ fontFamily: fontFam, color: theme.text }}>
        {header}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1.2 }}>
            {leftSections.map(s => renderSection(s)).filter(Boolean)}
          </div>
          <div style={{ flex: 1 }}>
            {rightSections.map(s => renderSection(s)).filter(Boolean)}
          </div>
        </div>
      </div>
    );
  }

  // All other layouts: single column flow
  const allContent = sections.filter(s => s.visible && s.id !== 'personal').map(s => renderSection(s)).filter(Boolean);

  const isEmpty = !data.summary && data.education.length === 0 && data.experience.length === 0 && data.skills.length === 0;

  return (
    <div style={{ fontFamily: fontFam, color: theme.text }}>
      {header}
      {allContent}
      {isEmpty && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <FileText style={{ width: '48px', height: '48px', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '14px', fontFamily: fontFam }}>Start filling in your details to see your CV preview</p>
        </div>
      )}
    </div>
  );
}
