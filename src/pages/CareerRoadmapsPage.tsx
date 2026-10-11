import { Briefcase } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Careers from '@/components/Careers';
import JobMarket from '@/components/JobMarket';

export default function CareerRoadmapsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={Briefcase}
        label="Career Roadmaps"
        title={<>Plan Your <span className="text-gradient-primary">Career Path</span></>}
        description="Salary benchmarks in PKR and USD, required skills, and step-by-step education paths from high school to your first job."
        iconColor="text-secondary-300"
      />
      <Careers />
      <JobMarket />
    </div>
  );
}
