import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, Linkedin, Mail, Heart, Globe, Award, Brain, GraduationCap, FileText, MessageSquare, Briefcase, ClipboardList, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-dark-950 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <Link to="/dashboard" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white">Pathfinder</div>
                <div className="text-[10px] text-primary-300 font-medium tracking-wider uppercase">EduPilot AI</div>
              </div>
            </Link>
            <p className="text-sm text-dark-300 leading-relaxed mb-5">
              AI-powered global university and scholarship discovery platform. Built for Pakistani students and international applicants.
            </p>
            <div className="flex gap-2">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 glass-light rounded-lg flex items-center justify-center text-dark-200 hover:text-white hover:bg-primary-500/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Dashboard', to: '/dashboard', icon: GraduationCap },
                { label: 'World Universities', to: '/universities', icon: Globe },
                { label: 'Scholarships', to: '/scholarships', icon: Award },
                { label: 'Career Roadmaps', to: '/career-roadmaps', icon: Briefcase },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-dark-300 hover:text-primary-300 transition-colors flex items-center gap-2">
                    <link.icon className="w-3.5 h-3.5" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">AI Tools</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'AI Guidance', to: '/ai-guidance', icon: MessageSquare },
                { label: 'Career Diagnostic', to: '/assessment', icon: Brain },
                { label: 'CV Builder', to: '/cv-builder', icon: FileText },
                { label: 'Application Checklist', to: '/dashboard', icon: ClipboardList },
                { label: 'Text Summarizer', to: '/cv-builder', icon: Sparkles },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-dark-300 hover:text-primary-300 transition-colors flex items-center gap-2">
                    <link.icon className="w-3.5 h-3.5" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wider">For Pakistani Students</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'HEC Scholarships', to: '/scholarships' },
                { label: 'Study Abroad', to: '/universities' },
                { label: 'Application Guidance', to: '/scholarships' },
                { label: 'Trusted Sources', to: '/dashboard' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-dark-300 hover:text-primary-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-dark-400">
            {new Date().getFullYear()} Pathfinder by EduPilot AI. All rights reserved.
          </p>
          <p className="text-xs text-dark-400 flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-error-500 fill-current" /> for students in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
