import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  Clock, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Truck, 
  Scale, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface DelayedItem {
  id: string;
  bookingRef: string;
  tokenNumber: string;
  farmerName: string;
  cropName: string;
  vehicleNumber: string;
  currentStage: string;
  waitTimeMins: number;
  bottleneckReason: string;
  centreName: string;
}

export const OfficerDelayedTransactions: React.FC = () => {
  const [delayedList, setDelayedList] = useState<DelayedItem[]>([
    {
      id: 'del-1',
      bookingRef: 'KS-WHT-1002',
      tokenNumber: 'T-002',
      farmerName: 'Balwant Singh Deshmukh',
      cropName: 'Wheat',
      vehicleNumber: 'MH-14-GH-9912',
      currentStage: 'QUALITY_INSPECTION',
      waitTimeMins: 94,
      bottleneckReason: 'Moisture tested 12.8% (marginal FAQ). Farmer requested secondary sun-drying cycle on apron.',
      centreName: 'Greenfield Procurement Centre',
    },
    {
      id: 'del-2',
      bookingRef: 'KS-PDY-1088',
      tokenNumber: 'T-015',
      farmerName: 'Rameshwar Pawar',
      cropName: 'Paddy',
      vehicleNumber: 'MH-12-PQ-4411',
      currentStage: 'WEIGHING',
      waitTimeMins: 108,
      bottleneckReason: 'Loaded tractor hydraulic trailer sensor malfunction during gross weighbridge measurement.',
      centreName: 'Hadapsar Agricultural Mandi Yard',
    },
  ]);

  const [resolvedMsg, setResolvedMsg] = useState<string | null>(null);

  const handleExpedite = (item: DelayedItem) => {
    setDelayedList(delayedList.filter(d => d.id !== item.id));
    setResolvedMsg(`Expedited Token ${item.tokenNumber} (${item.farmerName}). Mandi supervisor notified to prioritize bay clearance.`);
    setTimeout(() => setResolvedMsg(null), 4000);
  };

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Queue Bottleneck Intervention
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Delayed Transactions & Bottleneck Audit (विलंबित प्रक्रिया निवारण)
        </h1>
        <p className="text-gray-600 text-xs">
          Automatic flagging of vehicles in yard exceeding the 90-minute turnaround benchmark.
        </p>
      </div>

      {resolvedMsg && (
        <div className="p-4 bg-[#EAF4EA] border border-[#18794E] rounded-xs flex items-center gap-2 text-[#18794E]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold">{resolvedMsg}</span>
        </div>
      )}

      {/* Flagged Delays */}
      <div className="space-y-4">
        {delayedList.length === 0 ? (
          <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#18794E] mx-auto" />
            <h3 className="font-bold text-sm text-[#18794E]">Mandi Flow Optimal</h3>
            <p className="text-gray-600">No active vehicles are currently exceeding the 90-minute turnaround threshold.</p>
          </div>
        ) : (
          delayedList.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-amber-300 rounded-xs shadow-2xs p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <Badge variant="saffron" size="lg">Token {item.tokenNumber}</Badge>
                  <span className="font-mono font-bold text-[#123B5D] text-xs">{item.bookingRef}</span>
                  <span className="text-gray-500 text-[11px]">• {item.centreName}</span>
                </div>

                <div className="flex items-center gap-2 text-red-700 bg-red-50 px-2.5 py-1 rounded-xs border border-red-200 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Wait Time: {item.waitTimeMins} Mins (Flagged &gt; 90m)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F7F9] p-3 rounded-xs text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Farmer Name</span>
                  <span className="font-bold text-[#1F2933]">{item.farmerName}</span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Commodity</span>
                  <span className="font-bold text-[#123B5D]">{item.cropName}</span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Vehicle Plate</span>
                  <span className="font-mono font-bold text-[#1F2933]">{item.vehicleNumber}</span>
                </div>

                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Stalled Stage</span>
                  <span className="font-bold text-amber-800">{item.currentStage.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="bg-[#FFF9DB] p-3 rounded-xs border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C5815] block">
                  Root Cause Diagnostics
                </span>
                <p className="text-gray-800 text-xs leading-relaxed">{item.bottleneckReason}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleExpedite(item)}
                  className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-2 rounded-xs font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#E87524]" />
                  <span>Issue Priority Clearance Order</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
