import { FileText } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CVBuilder from '@/components/CVBuilder';
import TextSummarizer from '@/components/TextSummarizer';

export default function CVBuilderPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        icon={FileText}
        label="CV Builder & Tools"
        title={<>Build an <span className="text-gradient">ATS-Optimized CV</span></>}
        description="Choose a template, fill in your details, and preview your resume in real-time. Plus a text summarizer for your application materials."
        iconColor="text-accent-300"
      />
      <CVBuilder />
      <TextSummarizer />
    </div>
  );
}
