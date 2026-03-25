import { Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-fade-in">
        <div className="size-14 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-6">
          <Activity size={26} className="text-white" />
        </div>
        <p className="text-7xl font-bold text-slate-900 mb-2">404</p>
        <h1 className="text-xl font-semibold text-slate-700 mb-2">Page not found</h1>
        <p className="text-sm text-slate-400 mb-8">
          This page doesn't exist or was moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
