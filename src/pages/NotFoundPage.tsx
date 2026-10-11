import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary-400/20 rounded-3xl blur-2xl" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center mx-auto">
            <Compass className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="font-display font-bold text-6xl sm:text-8xl text-white mb-4">404</h1>
        <h2 className="font-display font-bold text-xl text-white mb-3">Page Not Found</h2>
        <p className="text-dark-300 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
