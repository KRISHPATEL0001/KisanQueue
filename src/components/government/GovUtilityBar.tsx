import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Globe, PhoneCall, RotateCcw, ShieldCheck } from 'lucide-react';
import { SecurityProtocolsModal } from '../security/SecurityProtocolsModal';

export const GovUtilityBar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    highContrast, 
    setHighContrast, 
    largeFont, 
    setLargeFont,
    resetDemoData
  } = useApp();

  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  return (
    <div className="bg-[#0e2c45] text-white text-xs border-b border-white/10 px-4 py-1.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: National Identity & Skip link */}
        <div className="flex items-center gap-4">
          <span className="font-medium tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E87524]" />
            भारत सरकार | Government of India
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <a 
            href="#main-content" 
            className="text-white/80 hover:text-white underline underline-offset-2 hidden sm:inline focus:outline-hidden focus:ring-2 focus:ring-[#E87524]"
          >
            Skip to main content
          </a>
        </div>

        {/* Right: Accessibility, Language, Help, Reset */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Accessibility controls */}
          <div className="flex items-center gap-1 bg-white/10 rounded-sm px-1.5 py-0.5" aria-label="Accessibility options">
            <button 
              type="button"
              onClick={() => setLargeFont(false)}
              className={`px-1 rounded-sm text-[11px] font-bold ${!largeFont ? 'bg-[#E87524] text-white' : 'text-white/80 hover:text-white'}`}
              title="Standard Font Size"
            >
              A
            </button>
            <button 
              type="button"
              onClick={() => setLargeFont(true)}
              className={`px-1 rounded-sm text-xs font-bold ${largeFont ? 'bg-[#E87524] text-white' : 'text-white/80 hover:text-white'}`}
              title="Larger Font Size"
            >
              A+
            </button>
            <span className="text-white/30 text-[10px]">|</span>
            <button
              type="button"
              onClick={() => setHighContrast(prev => !prev)}
              className={`px-1.5 rounded-sm text-[11px] font-medium ${highContrast ? 'bg-amber-400 text-black font-bold' : 'text-white/80 hover:text-white'}`}
              title="Toggle High Contrast"
            >
              {highContrast ? 'Normal' : 'High Contrast'}
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-white/70" />
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded-sm text-[11px] ${language === 'en' ? 'bg-[#E87524] font-semibold text-white' : 'text-white/80 hover:text-white'}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded-sm text-[11px] ${language === 'hi' ? 'bg-[#E87524] font-semibold text-white' : 'text-white/80 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          <span className="text-white/40 hidden sm:inline">|</span>

          {/* Helpline Link */}
          <a 
            href="tel:18001801551" 
            className="flex items-center gap-1 text-white/90 hover:text-white hover:underline text-xs"
            title="Call KisanSetu Helpline (1800-180-1551)"
          >
            <PhoneCall className="w-3 h-3 text-[#E87524]" />
            <span className="hidden sm:inline">Toll-Free: 1800-180-1551</span>
            <span className="sm:hidden">1800-180-1551</span>
          </a>

          {/* Security Protocols Link */}
          <button
            type="button"
            onClick={() => setSecurityModalOpen(true)}
            className="hidden sm:flex items-center gap-1 text-emerald-300 hover:text-emerald-200 text-xs px-1.5 py-0.5 rounded-sm bg-emerald-950/40 border border-emerald-500/30 transition-colors cursor-pointer"
            title="CERT-In & Aadhaar Act Cyber Security Protocols"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Security Protocols</span>
          </button>

          {/* Reset Demo button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo bookings, queues, and test data back to default initial state?')) {
                resetDemoData();
              }
            }}
            className="hidden md:flex items-center gap-1 text-[10px] bg-white/10 hover:bg-white/20 text-white/90 px-1.5 py-0.5 rounded-sm border border-white/20 cursor-pointer"
            title="Restore default synthetic data"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      <SecurityProtocolsModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />
    </div>
  );
};
