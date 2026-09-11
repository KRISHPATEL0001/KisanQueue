import React from 'react';
import { Link } from 'react-router-dom';
import { GovEmblem } from './Emblem';
import { TricolorStrip } from './TricolorStrip';
import { Phone, Mail, Clock, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GovFooter: React.FC = () => {
  const { lastUpdated } = useApp();

  return (
    <footer className="bg-[#123B5D] text-white mt-auto">
      <TricolorStrip />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Organization */}
          <div className="space-y-3">
            <GovEmblem size="md" className="[&_span]:text-white [&_span.text-gray-600]:text-gray-300" />
            <div className="text-xs text-gray-200 leading-relaxed">
              <p className="font-semibold text-white">KisanSetu Agricultural Procurement Portal</p>
              <p>Department of Consumer Affairs</p>
              <p>Ministry of Consumer Affairs, Food & Public Distribution</p>
              <p>Krishi Bhawan, New Delhi - 110001</p>
            </div>
            <div className="pt-2 text-[11px] text-gray-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E87524]" />
              <span>Portal Sync Time: Today, {lastUpdated}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#E87524] mb-3 pb-1 border-b border-white/20">
              Useful Portals & Links
            </h2>
            <ul className="space-y-1.5 text-xs text-gray-200">
              <li>
                <Link to="/" className="hover:text-white hover:underline">
                  National Procurement Portal Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline">
                  About Central MSP & Buffer Scheme
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white hover:underline">
                  Farmer 7-Step Procurement Journey
                </Link>
              </li>
              <li>
                <Link to="/announcements" className="hover:text-white hover:underline">
                  Official Procurement Circulars
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white hover:underline">
                  Grievance & Redressal Mechanism
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#E87524] mb-3 pb-1 border-b border-white/20">
              Assisted Farmer Helpline
            </h2>
            <div className="space-y-2.5 text-xs text-gray-200">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#E87524] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">1800-180-1551</div>
                  <div className="text-[11px] text-gray-300">Toll-free Kisan Call Centre (24x7)</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#E87524] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">support-kisansetu@gov.in</div>
                  <div className="text-[11px] text-gray-300">Official email for mandis & farmers</div>
                </div>
              </div>
              <div className="text-[11px] bg-white/10 p-2 rounded-sm border border-white/15">
                <span className="font-semibold text-amber-300">Mandi Help Desk Hours:</span>
                <br />07:00 AM – 07:00 PM (Monday to Saturday)
              </div>
            </div>
          </div>

          {/* Column 4: Compliance & Prototype Notice */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#E87524] mb-3 pb-1 border-b border-white/20">
              Compliance & Safety
            </h2>
            <div className="bg-[#0e2c45] p-3 rounded-sm border border-white/20 text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Synthetic Prototype Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This is a prototype using synthetic data created for Problem Statement ID: 26032. 
                No real Aadhaar, personal banking, or government records are accessed or stored.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-8 pt-4 border-t border-white/15 flex flex-col md:flex-row items-center justify-between text-xs text-gray-300 gap-3">
          <div className="flex flex-wrap gap-4 text-[11px]">
            <Link to="/help" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/help" className="hover:underline">Accessibility Statement</Link>
            <span>•</span>
            <Link to="/help" className="hover:underline">Terms of Use</Link>
            <span>•</span>
            <Link to="/help" className="hover:underline">Hyperlinking Policy</Link>
            <span>•</span>
            <Link to="/help" className="hover:underline">Copyright Policy</Link>
          </div>
          <div className="text-[11px] text-gray-400 text-center md:text-right">
            Designed for Department of Consumer Affairs • Last Updated: {lastUpdated}
          </div>
        </div>
      </div>
    </footer>
  );
};
