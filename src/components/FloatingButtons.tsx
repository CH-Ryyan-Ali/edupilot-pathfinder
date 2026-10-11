import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUp } from 'lucide-react';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Link
        to="/ai-guidance"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-xl hover:scale-110 transition-all group"
        title="Chat with EduPilot AI"
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <span className="absolute right-full mr-3 px-3 py-1.5 glass text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
          Chat with AI
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-dark-950" />
      </Link>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full glass-light flex items-center justify-center hover:bg-white/10 transition-all animate-fade-in"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </>
  );
}
