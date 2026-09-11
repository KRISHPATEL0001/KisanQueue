import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { ProcurementCentre } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Info,
  Scale
} from 'lucide-react';

export const OfficerCapacityMonitor: React.FC = () => {
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);

  useEffect(() => {
    setCentres(StorageService.getCentres());
  }, []);

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Congestion Prevention Engineering
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Operational Capacity & Safety Buffer Monitor (क्षमता व बफर निगरानी)
        </h1>
        <p className="text-gray-600 text-xs">
          Enforce the 15%–20% operational reserve mandate to safeguard mandi weighbridges from tractor gridlocks and unseasonal rain.
        </p>
      </div>

      {/* Educational Buffer Mandate Callout */}
      <div className="bg-[#EAF4EA] border border-[#18794E]/40 p-4 rounded-xs shadow-2xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#18794E] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-[#123B5D]">
            The 20% Operational Reserve Mandate (शासकीय सुरक्षा बफर)
          </h4>
          <p className="text-gray-700 leading-relaxed text-[11px]">
            Each procurement centre holds 20% of its physical daily intake capacity in reserve. This unallocated margin absorbs walk-in emergency farmers, delayed tare-weighment turnarounds, mechanical sensor calibrations, and wet grain re-testing without ever stalling the scheduled queue.
          </p>
        </div>
      </div>

      {/* Visual Capacity Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {centres.map((c) => {
          const total = c.dailyCapacityQuintals;
          const buffer = c.operationalReserveQuintals;
          const bookable = total - buffer;
          const booked = c.bookedTodayQuintals;
          const available = Math.max(0, bookable - booked);

          const bookedPct = Math.round((booked / total) * 100);
          const availablePct = Math.round((available / total) * 100);
          const bufferPct = Math.round((buffer / total) * 100);

          return (
            <div key={c.id} className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                <div>
                  <h3 className="font-bold text-sm text-[#123B5D]">{c.name}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">{c.district} District</span>
                </div>
                <Badge variant={bookedPct > 70 ? 'warning' : 'success'}>
                  {bookedPct > 70 ? 'ELEVATED INTAKE' : 'STABLE'}
                </Badge>
              </div>

              {/* Multi-segment Capacity Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-gray-700">Capacity Distribution ({total} qtl)</span>
                  <span className="font-mono text-gray-500">{bookedPct}% Utilized</span>
                </div>

                <div className="h-4 w-full bg-gray-100 rounded-xs flex overflow-hidden border border-gray-200">
                  {/* Booked segment */}
                  <div
                    className="bg-[#123B5D] h-full"
                    style={{ width: `${bookedPct}%` }}
                    title={`Booked: ${booked} qtl`}
                  />
                  {/* Open bookable segment */}
                  <div
                    className="bg-[#2E7D32] h-full"
                    style={{ width: `${availablePct}%` }}
                    title={`Open for booking: ${available} qtl`}
                  />
                  {/* Buffer reserve segment */}
                  <div
                    className="bg-[#E87524] h-full"
                    style={{ width: `${bufferPct}%` }}
                    title={`Protected Buffer: ${buffer} qtl`}
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-1 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#123B5D] rounded-xs" />
                    <span>Booked: <strong>{booked} qtl</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#2E7D32] rounded-xs" />
                    <span>Open Available: <strong>{available} qtl</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-[#E87524] rounded-xs" />
                    <span>Reserve Buffer: <strong>{buffer} qtl</strong></span>
                  </div>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                <div className="bg-[#F5F7F9] p-2 rounded-xs">
                  <span className="text-gray-400 block text-[9px] uppercase">Yard Ingress</span>
                  <span className="font-bold text-[#1F2933]">2 Lanes</span>
                </div>
                <div className="bg-[#F5F7F9] p-2 rounded-xs">
                  <span className="text-gray-400 block text-[9px] uppercase">Weighbridge</span>
                  <span className="font-bold text-[#18794E]">Calibrated</span>
                </div>
                <div className="bg-[#F5F7F9] p-2 rounded-xs">
                  <span className="text-gray-400 block text-[9px] uppercase">Rain Shelter</span>
                  <span className="font-bold text-[#123B5D]">Available</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
