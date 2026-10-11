export type LayoutType =
  | 'single-column'
  | 'two-column'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'header-banner'
  | 'minimal'
  | 'creative'
  | 'ats-friendly';

export type TemplateCategory = 'ATS-Friendly' | 'Modern' | 'Creative' | 'Minimal' | 'Professional';

export type FontPairing = {
  heading: string;
  body: string;
  headingClass: string;
  bodyClass: string;
};

export type ColorTheme = {
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  border: string;
  light: string;
};

export type SectionStyle = 'boxed' | 'underlined' | 'plain' | 'pill' | 'accent-bar';

export type CVTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  layout: LayoutType;
  theme: ColorTheme;
  fonts: FontPairing;
  sectionStyle: SectionStyle;
  hasPhoto: boolean;
  hasIcons: boolean;
  sidebarBg: string;
  headerBg: string;
  rating: number;
};

const layouts: LayoutType[] = [
  'single-column', 'two-column', 'sidebar-left', 'sidebar-right',
  'header-banner', 'minimal', 'creative', 'ats-friendly',
];



const colorThemes: { name: string; theme: ColorTheme }[] = [
  { name: 'Teal', theme: { primary: '#16bfa0', secondary: '#0d9488', text: '#1a2138', muted: '#6b7280', border: '#e5e7eb', light: '#f0fdfa' } },
  { name: 'Blue', theme: { primary: '#3b82f6', secondary: '#2563eb', text: '#1e293b', muted: '#64748b', border: '#e2e8f0', light: '#eff6ff' } },
  { name: 'Navy', theme: { primary: '#1e3a5f', secondary: '#172554', text: '#1a2138', muted: '#6b7280', border: '#e5e7eb', light: '#f1f5f9' } },
  { name: 'Slate', theme: { primary: '#475569', secondary: '#334155', text: '#1e293b', muted: '#64748b', border: '#e2e8f0', light: '#f8fafc' } },
  { name: 'Emerald', theme: { primary: '#059669', secondary: '#047857', text: '#064e3b', muted: '#6b7280', border: '#e5e7eb', light: '#ecfdf5' } },
  { name: 'Indigo', theme: { primary: '#4f46e5', secondary: '#4338ca', text: '#1e1b4b', muted: '#6b7280', border: '#e5e7eb', light: '#eef2ff' } },
  { name: 'Rose', theme: { primary: '#e11d48', secondary: '#be123c', text: '#881337', muted: '#6b7280', border: '#e5e7eb', light: '#fff1f2' } },
  { name: 'Amber', theme: { primary: '#d97706', secondary: '#b45309', text: '#78350f', muted: '#6b7280', border: '#e5e7eb', light: '#fffbeb' } },
  { name: 'Cyan', theme: { primary: '#0891b2', secondary: '#0e7490', text: '#164e63', muted: '#6b7280', border: '#e5e7eb', light: '#ecfeff' } },
  { name: 'Purple', theme: { primary: '#7c3aed', secondary: '#6d28d9', text: '#4c1d95', muted: '#6b7280', border: '#e5e7eb', light: '#f5f3ff' } },
  { name: 'Coral', theme: { primary: '#f97316', secondary: '#ea580c', text: '#7c2d12', muted: '#6b7280', border: '#e5e7eb', light: '#fff7ed' } },
  { name: 'Forest', theme: { primary: '#166534', secondary: '#14532d', text: '#14532d', muted: '#6b7280', border: '#e5e7eb', light: '#f0fdf4' } },
  { name: 'Crimson', theme: { primary: '#dc2626', secondary: '#b91c1c', text: '#7f1d1d', muted: '#6b7280', border: '#e5e7eb', light: '#fef2f2' } },
  { name: 'Mono', theme: { primary: '#1f2937', secondary: '#111827', text: '#111827', muted: '#6b7280', border: '#d1d5db', light: '#f9fafb' } },
  { name: 'Steel', theme: { primary: '#64748b', secondary: '#475569', text: '#1e293b', muted: '#64748b', border: '#e2e8f0', light: '#f8fafc' } },
  { name: 'Maroon', theme: { primary: '#9f1239', secondary: '#881337', text: '#500724', muted: '#6b7280', border: '#e5e7eb', light: '#fff1f2' } },
];

const fontPairings: { name: string; fonts: FontPairing }[] = [
  { name: 'Inter', fonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif', headingClass: '', bodyClass: '' } },
  { name: 'Grotesk', fonts: { heading: '"Space Grotesk", sans-serif', body: 'Inter, sans-serif', headingClass: '', bodyClass: '' } },
  { name: 'Serif', fonts: { heading: 'Georgia, serif', body: '"Times New Roman", serif', headingClass: '', bodyClass: '' } },
  { name: 'Modern', fonts: { heading: '"Segoe UI", sans-serif', body: 'Arial, sans-serif', headingClass: '', bodyClass: '' } },
  { name: 'Classic', fonts: { heading: '"Palatino Linotype", serif', body: '"Book Antiqua", serif', headingClass: '', bodyClass: '' } },
  { name: 'Clean', fonts: { heading: '"Helvetica Neue", sans-serif', body: 'Helvetica, sans-serif', headingClass: '', bodyClass: '' } },
  { name: 'Tech', fonts: { heading: '"Segoe UI", sans-serif', body: 'Consolas, monospace', headingClass: '', bodyClass: '' } },
  { name: 'Elegant', fonts: { heading: '"Playfair Display", serif', body: 'Inter, sans-serif', headingClass: '', bodyClass: '' } },
];

const sectionStyles: SectionStyle[] = ['boxed', 'underlined', 'plain', 'pill', 'accent-bar'];

function generateTemplates(): CVTemplate[] {
  const templates: CVTemplate[] = [];
  let counter = 1;

  const layoutCategoryMap: Partial<Record<LayoutType, TemplateCategory>> = {
    'ats-friendly': 'ATS-Friendly',
    'minimal': 'Minimal',
    'sidebar-left': 'Modern',
    'sidebar-right': 'Modern',
    'two-column': 'Modern',
    'header-banner': 'Professional',
    'single-column': 'Professional',
    'creative': 'Creative',
  };

  for (const layout of layouts) {
    const baseCategory = layoutCategoryMap[layout] || 'Professional';
    const themePool = baseCategory === 'ATS-Friendly'
      ? colorThemes.slice(3, 6).concat(colorThemes.slice(13, 15))
      : baseCategory === 'Minimal'
      ? colorThemes.slice(3, 5).concat(colorThemes.slice(13, 16))
      : baseCategory === 'Creative'
      ? colorThemes.slice(0, 8)
      : colorThemes;

    const fontPool = baseCategory === 'ATS-Friendly'
      ? fontPairings.slice(0, 2).concat(fontPairings.slice(3, 5))
      : baseCategory === 'Creative'
      ? fontPairings.slice(1, 4).concat(fontPairings.slice(6, 8))
      : fontPairings;

    const stylePool = baseCategory === 'ATS-Friendly'
      ? ['plain', 'underlined'] as SectionStyle[]
      : baseCategory === 'Minimal'
      ? ['plain', 'underlined'] as SectionStyle[]
      : sectionStyles;

    let variantCount = 0;
    const maxVariants = baseCategory === 'Creative' ? 18 : baseCategory === 'ATS-Friendly' ? 16 : 20;

    outer:
    for (const themeItem of themePool) {
      for (const fontItem of fontPool) {
        for (const style of stylePool) {
          if (variantCount >= maxVariants) break outer;
          if (variantCount >= 7 && baseCategory !== 'Creative' && baseCategory !== 'Modern') break;

          const id = `tpl-${String(counter).padStart(3, '0')}`;
          const hasPhoto = baseCategory === 'Creative' || (baseCategory === 'Modern' && variantCount % 3 === 0);
          const hasIcons = baseCategory !== 'ATS-Friendly' && baseCategory !== 'Minimal';
          const sidebarBg = layout === 'sidebar-left' || layout === 'sidebar-right' ? themeItem.theme.light : '';
          const headerBg = layout === 'header-banner' ? themeItem.theme.light : '';

          templates.push({
            id,
            name: `${themeItem.name} ${fontItem.name} ${baseCategory}`,
            category: baseCategory,
            layout,
            theme: themeItem.theme,
            fonts: fontItem.fonts,
            sectionStyle: style,
            hasPhoto,
            hasIcons,
            sidebarBg,
            headerBg,
            rating: 4 + (counter % 2 === 0 ? 0.5 : 0),
          });
          counter++;
          variantCount++;
        }
      }
    }
  }

  return templates;
}

export const CV_TEMPLATES = generateTemplates();

export function getTemplateById(id: string): CVTemplate | undefined {
  return CV_TEMPLATES.find(t => t.id === id);
}
