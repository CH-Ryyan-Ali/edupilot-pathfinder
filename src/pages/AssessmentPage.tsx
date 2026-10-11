import { Brain } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Quiz from '@/components/Quiz';
import AIUniversityMatcher from '@/components/AIUniversityMatcher';

export default function AssessmentPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={Brain}
        label="Diagnostic Assessment"
        title={<>Find Your <span className="text-gradient-primary">Best Path</span></>}
        description="Take the 50-question career diagnostic to find your best-fit field, then use the AI university matcher to find universities that match your profile."
      />
      <Quiz />
      <AIUniversityMatcher />
    </div>
  );
}
