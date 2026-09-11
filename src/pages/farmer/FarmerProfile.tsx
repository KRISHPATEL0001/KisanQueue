import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { GovEmblem } from '../../components/government/Emblem';
import { 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Sprout, 
  Landmark, 
  CheckCircle2 
} from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  const { activeFarmer } = useApp();

  if (!activeFarmer) {
    return (
      <div className="p-8 text-center bg-white border border-[#D6DDE5] rounded-xs text-xs text-gray-500">
        No active profile found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Farmer Master Registration Record
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Farmer Profile & Identity Credentials (किसान विवरण)
        </h1>
        <p className="text-gray-600 text-xs">
          Verified agricultural credentials, Aadhaar seeding, registered land crops, and bank DBT parameters.
        </p>
      </div>

      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        {/* Profile Card Header */}
        <div className="bg-[#123B5D] text-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-white text-xl font-black">
              {activeFarmer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{activeFarmer.name}</h2>
              <div className="text-xs text-gray-300">
                Farmer ID: <strong className="font-mono text-white">{activeFarmer.refNumber}</strong>
              </div>
              <div className="text-[11px] text-[#E87524] font-medium">
                {activeFarmer.village}, {activeFarmer.block}, {activeFarmer.district} ({activeFarmer.state})
              </div>
            </div>
          </div>

          <div>
            <Badge variant="success" size="lg">
              AADHAAR & DBT SEEDED
            </Badge>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Personal & Contact */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#123B5D] uppercase tracking-wider text-xs border-b pb-1.5 border-gray-200 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#E87524]" />
              <span>Personal & Contact Particulars</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F7F9] p-4 border border-[#D6DDE5] rounded-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Registered Mobile</span>
                <span className="font-bold font-mono text-[#1F2933]">+91 {activeFarmer.mobile}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Preferred Language</span>
                <span className="font-bold text-[#1F2933]">
                  {activeFarmer.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Tehsil / Block</span>
                <span className="font-bold text-[#1F2933]">{activeFarmer.block}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">District & State</span>
                <span className="font-bold text-[#1F2933]">{activeFarmer.district}, {activeFarmer.state}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Bank DBT Account Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#123B5D] uppercase tracking-wider text-xs border-b pb-1.5 border-gray-200 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-[#2E7D32]" />
              <span>Bank Account & Direct Benefit Transfer (DBT)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#EAF4EA] p-4 border border-[#18794E]/30 rounded-xs">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Bank Entity</span>
                <span className="font-bold text-[#123B5D]">State Bank of India</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Account Number</span>
                <span className="font-bold font-mono text-[#1F2933]">•••• •••• {activeFarmer.bankAccountMasked}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">IFSC Code</span>
                <span className="font-bold font-mono text-[#1F2933]">{activeFarmer.ifscMasked}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Verification Status</span>
                <span className="font-bold text-[#18794E] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified via PFMS
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Registered Crops */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#123B5D] uppercase tracking-wider text-xs border-b pb-1.5 border-gray-200 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#123B5D]" />
              <span>Registered Crop Declarations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeFarmer.registeredCrops.map((c) => (
                <div key={c.cropId} className="p-3.5 bg-white border border-[#D6DDE5] rounded-xs space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-[#123B5D]">{c.cropName}</h4>
                    <Badge variant="neutral">Estimated: {c.estimatedQuintals} qtl</Badge>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Expected Harvest Date: <strong className="text-gray-700">{c.harvestDate}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
