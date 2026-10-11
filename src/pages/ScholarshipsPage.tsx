import { Award } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Scholarships from '@/components/Scholarships';
import AIScholarshipMatcher from '@/components/AIScholarshipMatcher';
import PakistaniOpportunities from '@/components/PakistaniOpportunities';

export default function ScholarshipsPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={Award}
        label="International Scholarships"
        title={<><span className="text-gradient">Scholarships</span> for Pakistani Students</>}
        description="Verified international and domestic scholarship opportunities. Always verify deadlines on official provider websites."
        iconColor="text-accent-300"
      />
      <Scholarships />
      <AIScholarshipMatcher />
      <PakistaniOpportunities />
    </div>
  );
}
