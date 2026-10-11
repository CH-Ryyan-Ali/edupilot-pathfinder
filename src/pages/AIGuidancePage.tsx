import { MessageSquare } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import AIAssistant from '@/components/AIAssistant';

export default function AIGuidancePage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={MessageSquare}
        label="AI Pathfinder Assistant"
        title={<>Chat with <span className="text-gradient-primary">EduPilot AI</span></>}
        description="Your 24/7 guide for admissions, merit calculations, course selection, and career roadmaps. Ask anything — or try a quick example."
      />
      <AIAssistant />
    </div>
  );
}
