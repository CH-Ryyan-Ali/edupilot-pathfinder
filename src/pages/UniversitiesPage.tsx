import { GraduationCap } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Universities from '@/components/Universities';
import CountryExplorer from '@/components/CountryExplorer';

export default function UniversitiesPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={GraduationCap}
        label="World Universities"
        title={<>Explore <span className="text-gradient-primary">1,500+ Universities Worldwide</span></>}
        description="Browse universities across 50+ countries. Filter by continent, country, degree level, and field of study."
      />
      <Universities />
      <CountryExplorer />
    </div>
  );
}
