import React from 'react';
import { GovEmblem } from '../../components/government/Emblem';
import { ShieldCheck, Target, CheckCircle2, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <GovEmblem size="md" />
          <div>
            <span className="text-xs font-bold text-[#E87524] uppercase tracking-wider">
              Department of Consumer Affairs • Problem ID: 26032
            </span>
            <h1 className="text-2xl font-bold text-[#123B5D]">
              About KisanSetu – Agricultural Procurement & Queue Management
            </h1>
          </div>
        </div>

        <div className="prose text-xs text-gray-700 space-y-3 leading-relaxed">
          <p>
            <strong>KisanSetu</strong> is a digital public goods platform conceptualised by the 
            <strong> Ministry of Consumer Affairs, Food & Public Distribution</strong> to bring transparency, predictability, and dignity to farmers arriving at central procurement centres across India.
          </p>
          <p>
            Historically, agricultural harvest seasons witnessed severe mandi congestion, with tractors queued up for days outside procurement yards. Farmers suffered from physical exhaustion, uncertainty over whether their crop would be accepted, arbitrary delay in weighment, and lack of real-time visibility into their Direct Benefit Transfer (DBT) payment clearance.
          </p>
          <p>
            KisanSetu replaces manual chaotic arrivals with mathematical, <strong>capacity-based slot reservation</strong>, automated moisture and quality logging, synchronized weighbridge records, and transparent stage-by-stage SMS and portal tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="p-4 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#123B5D] text-xs">
              <Target className="w-4 h-4 text-[#E87524]" />
              <span>Zero-Wait Mandi Operations</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Procurement centres process only within verified daily capacity buffers, capping farmer waiting time under 68 minutes.
            </p>
          </div>

          <div className="p-4 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#123B5D] text-xs">
              <Award className="w-4 h-4 text-[#2E7D32]" />
              <span>Fair Minimum Support Price (MSP)</span>
            </div>
            <p className="text-[11px] text-gray-600">
              100% adherence to Central MSP rates without unverified quality deductions or broker cuts.
            </p>
          </div>

          <div className="p-4 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#123B5D] text-xs">
              <ShieldCheck className="w-4 h-4 text-[#123B5D]" />
              <span>PFMS Direct Benefit Transfer</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Payment files generated immediately upon digital weighment, submitted straight to State and Central treasuries.
            </p>
          </div>
        </div>

        <div className="bg-[#FFF3E8] p-4 border border-[#E87524]/40 rounded-xs text-xs space-y-2">
          <h3 className="font-bold text-[#123B5D]">
            Official Prototype Declaration
          </h3>
          <p className="text-gray-700 leading-relaxed text-[11px]">
            This portal represents a digital architecture prototype designed for demonstration purposes. It adheres strictly to modern accessibility guidelines, Indian date and number formatting standards, and high-contrast readable visual layouts suitable for low-bandwidth rural operations.
          </p>
        </div>
      </div>
    </div>
  );
};
