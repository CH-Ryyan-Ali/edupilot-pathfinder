import Hero from '@/components/Hero';
import GlobalSearch from '@/components/GlobalSearch';
import Features from '@/components/Features';
import MyDashboard from '@/components/MyDashboard';
import ApplicationChecklist from '@/components/ApplicationChecklist';
import TrustedOfficialSources from '@/components/TrustedOfficialSources';

export default function DashboardPage() {
  return (
    <div>
      <Hero />
      <GlobalSearch />
      <Features />
      <MyDashboard />
      <ApplicationChecklist />
      <TrustedOfficialSources />
    </div>
  );
}
