import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Props = {
  icon: LucideIcon;
  label: string;
  title: ReactNode;
  description: string;
  iconColor?: string;
};

export default function PageHeader({ icon: Icon, label, title, description, iconColor = 'text-primary-300' }: Props) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`max-w-7xl mx-auto reveal ${visible ? 'visible' : ''}`}>
      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass-light rounded-full mb-4">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className={`text-sm ${iconColor} font-medium`}>{label}</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-white mb-4">
          {title}
        </h1>
        <p className="text-dark-200 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
