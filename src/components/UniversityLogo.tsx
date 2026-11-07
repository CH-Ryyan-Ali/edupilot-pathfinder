import { useState } from 'react';
import type { University } from '@/types';

const sizeClasses = {
  xs: 'w-8 h-8 rounded-lg text-xs',
  sm: 'w-10 h-10 rounded-xl text-xs',
  md: 'w-12 h-12 rounded-xl text-lg',
  lg: 'w-14 h-14 rounded-2xl text-lg',
  xl: 'w-16 h-16 rounded-2xl text-2xl',
} as const;

type LogoSize = keyof typeof sizeClasses;

function getLogoSrc(website: string) {
  try {
    const host = new URL(website).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
  } catch {
    return null;
  }
}

export default function UniversityLogo({ uni, size = 'sm', className = '' }: { uni: University; size?: LogoSize; className?: string }) {
  const [failed, setFailed] = useState(false);
  const src = getLogoSrc(uni.website);
  const base = `${sizeClasses[size]} flex items-center justify-center shrink-0 overflow-hidden ${className}`;

  if (!src || failed) {
    return (
      <div className={`${base} font-display font-bold text-white`} style={{ backgroundColor: uni.logoColor }}>
        {uni.shortName.substring(0, 2)}
      </div>
    );
  }

  return (
    <div className={`${base} bg-white p-1.5`}>
      <img
        src={src}
        alt={`${uni.shortName} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
