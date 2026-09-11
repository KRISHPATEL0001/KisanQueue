import React from 'react';
import { Link } from 'react-router-dom';
import { GovEmblem } from '../../components/government/Emblem';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6 text-xs">
      <div className="flex justify-center">
        <GovEmblem size="lg" />
      </div>

      <div className="space-y-2">
        <div className="text-4xl font-extrabold text-[#123B5D]">404</div>
        <h1 className="text-xl font-bold text-[#1F2933]">
          Page Not Found / पृष्ठ उपलब्ध नहीं है
        </h1>
        <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
          The requested administrative page or service URL could not be located on the KisanSetu portal server. It may have been relocated or updated.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Portal Home</span>
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white border border-[#D6DDE5] hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
