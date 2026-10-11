import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingButtons from '@/components/FloatingButtons';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard | Pathfinder',
  '/universities': 'Universities | Pathfinder',
  '/scholarships': 'Scholarships | Pathfinder',
  '/assessment': 'Assessment | Pathfinder',
  '/career-roadmaps': 'Career Roadmaps | Pathfinder',
  '/cv-builder': 'CV Builder | Pathfinder',
  '/ai-guidance': 'AI Guidance | Pathfinder',
};

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titles[pathname] || 'Pathfinder | EduPilot AI';
  }, [pathname]);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
