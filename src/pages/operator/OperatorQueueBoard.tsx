import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from '../../services/storageService';
import { Booking, QueueStage } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { calculateLiveQueue, LiveQueueResult } from '../../lib/queueService';
import { 
  Clock, 
  Megaphone, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Microscope, 
  Scale, 
  Building2, 
  RefreshCw,
  Radio,
  Volume2
} from 'lucide-react';

export const OperatorQueueBoard: React.FC = () => {
  const [selectedCentreId, setSelectedCentreId] = useState<string>('centre-1');
  const [stageFilter, setStageFilter] = useState<'ALL' | QueueStage>('ALL');
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const centres = useMemo(() => StorageService.getCentres(), []);

  const liveQueue: LiveQueueResult = useMemo(() => {
    return calculateLiveQueue(selectedCentreId);
  }, [selectedCentreId, lastRefreshed]);

  const loadData = () => {
    setLastRefreshed(new Date());
  };

  const stages: { stage: QueueStage; label: string; icon: any }[] = [
    { stage: 'CHECKED_IN', label: 'Gate Ingress', icon: Truck },
    { stage: 'QUALITY_INSPECTION', label: 'Quality Check', icon: Microscope },
    { stage: 'WEIGHING', label: 'Weighbridge', icon: Scale },
    { stage: 'PURCHASE_RECORDED', label: 'Unloading / Receipt', icon: Building2 },
  ];

  const handleCallToken = (tokenNumber: string, farmerName: string, vehicle?: string) => {
    const text = `Attention in Mandi Yard: Paging Token ${tokenNumber}, Farmer ${farmerName} with vehicle ${vehicle || 'Tractor'} to Bay 1.`;
    setAnnouncement(text);

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error', err);
      }
    }

    setTimeout(() => setAnnouncement(null), 6000);
  };

  const handleAdvanceStage = (bookingId: string, currentStage: QueueStage) => {
    let nextStage: QueueStage = 'QUALITY_INSPECTION';
    if (currentStage === 'BOOKING_CONFIRMED') nextStage = 'CHECKED_IN';
    else if (currentStage === 'CHECKED_IN') nextStage = 'QUALITY_INSPECTION';
    else if (currentStage === 'QUALITY_INSPECTION') nextStage = 'WEIGHING';
    else if (currentStage === 'WEIGHING') nextStage = 'PURCHASE_RECORDED';
    else if (currentStage === 'PURCHASE_RECORDED') nextStage = 'COMPLETED';

    StorageService.updateQueueStage(bookingId, nextStage);
    loadData();
  };

  const filteredQueue = useMemo(() => {
    if (stageFilter === 'ALL') return liveQueue.queueList;
    return liveQueue.queueList.filter(b => b.currentStage === stageFilter);
  }, [liveQueue, stageFilter]);

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#E87524] animate-pulse" />
              Real-Time Yard Operations
            </span>
            <Badge variant="success" size="sm">Live Feed</Badge>
          </div>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Live Queue Management & Dispatch Board (कतार नियंत्रण कक्ष)
          </h1>
          <p className="text-gray-600 text-xs">
            Monitor which token is being processed right now, queue distance, and call vehicles to active inspection & weighbridge bays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="bg-white border border-[#D6DDE5] text-[#1F2933] font-semibold text-xs rounded-xs px-3 py-1.5 focus:ring-1 focus:ring-[#123B5D] outline-none"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadData}
            className="bg-white border border-[#D6DDE5] hover:bg-gray-50 text-[#123B5D] px-3.5 py-1.5 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Live Active Token on Centre Banner */}
      <div className="bg-[#123B5D] text-white p-5 rounded-xs shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
              <Scale className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                Currently Serving on Mandi Centre Right Now
              </span>
              <div className="text-2xl font-black font-mono tracking-tight flex items-center gap-2">
                <span>Token {liveQueue.activeServingToken}</span>
                <Badge variant="success" size="sm">ACTIVE WEIGHBRIDGE</Badge>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-300 block">Current Facility</span>
            <strong className="text-white text-sm">{liveQueue.activeFacilityStage}</strong>
          </div>
        </div>

        {/* Counter Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 p-2.5 rounded-xs border border-white/15">
            <span className="text-[10px] text-gray-300 block uppercase">Gate Ingress</span>
            <span className="text-lg font-mono font-bold text-emerald-300">
              {liveQueue.stageBreakdown.gateEntryToken || 'Clear'}
            </span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xs border border-white/15">
            <span className="text-[10px] text-gray-300 block uppercase">Quality Lab Bay</span>
            <span className="text-lg font-mono font-bold text-sky-300">
              {liveQueue.stageBreakdown.qualityCheckToken || 'Testing'}
            </span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xs border border-white/15">
            <span className="text-[10px] text-gray-300 block uppercase">Electronic Weighbridge</span>
            <span className="text-lg font-mono font-bold text-amber-300">
              {liveQueue.stageBreakdown.weighbridgeToken || 'Weighing'}
            </span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xs border border-white/15">
            <span className="text-[10px] text-gray-300 block uppercase">Unloading Apron</span>
            <span className="text-lg font-mono font-bold text-purple-300">
              {liveQueue.stageBreakdown.unloadingToken || 'Offloading'}
            </span>
          </div>
        </div>
      </div>

      {/* Audio/Public Announcement Banner */}
      {announcement && (
        <div className="p-4 bg-[#FFF3E8] border-2 border-[#E87524] rounded-xs flex items-center gap-3 animate-pulse text-[#123B5D]">
          <Megaphone className="w-6 h-6 text-[#E87524] shrink-0" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E87524] block">
              Live Mandi Audio Broadcast Paged
            </span>
            <span className="font-bold text-sm">{announcement}</span>
          </div>
        </div>
      )}

      {/* Stage Filter Buttons */}
      <div className="bg-white border border-[#D6DDE5] p-3 rounded-xs shadow-2xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStageFilter('ALL')}
          className={`px-3 py-1.5 rounded-xs font-bold cursor-pointer transition-colors ${
            stageFilter === 'ALL'
              ? 'bg-[#123B5D] text-white shadow-2xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Yard Tokens ({liveQueue.queueList.length})
        </button>

        {stages.map((st) => {
          const count = liveQueue.queueList.filter(b => b.currentStage === st.stage).length;
          const Icon = st.icon;
          return (
            <button
              key={st.stage}
              type="button"
              onClick={() => setStageFilter(st.stage)}
              className={`px-3 py-1.5 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                stageFilter === st.stage
                  ? 'bg-[#123B5D] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{st.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active Tokens Cards Grid */}
      {filteredQueue.length === 0 ? (
        <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
          <Clock className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-semibold">No tokens in this queue stage currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQueue.map((item) => (
            <div
              key={item.id}
              className={`bg-white border-2 rounded-xs shadow-2xs p-4 space-y-3 transition-colors flex flex-col justify-between ${
                item.isNowServing 
                  ? 'border-emerald-500 bg-emerald-50/20' 
                  : 'border-[#D6DDE5] hover:border-[#123B5D]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={item.isNowServing ? 'success' : 'saffron'} size="lg">
                      Token {item.tokenNumber}
                    </Badge>
                    {item.isNowServing && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-xs">
                        NOW SERVING
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-gray-500 text-[11px]">{item.bookingRef}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#123B5D]">{item.farmerName}</h3>
                  <div className="text-[11px] text-gray-500">
                    Phone: <span className="font-mono text-gray-800">{item.farmerPhone || 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-[#F5F7F9] p-2.5 rounded-xs border border-[#D6DDE5] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commodity:</span>
                    <span className="font-bold">{item.cropName} ({item.quantityQuintals} qtl)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle:</span>
                    <span className="font-mono font-bold text-[#123B5D]">{item.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Queue Difference:</span>
                    <span className={`font-mono font-bold ${item.differenceFromServing === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {item.differenceFromServing === 0 ? 'Active Now (0)' : `+${item.differenceFromServing} in line`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current Stage:</span>
                    <span className="font-bold text-[#123B5D]">{item.stageLabel}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCallToken(item.tokenNumber, item.farmerName, item.vehicleNumber)}
                  className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-1.5 rounded-xs font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Call Token</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAdvanceStage(item.id, item.currentStage)}
                  className="flex-1 bg-[#123B5D] hover:bg-[#0e2c45] text-white py-1.5 rounded-xs font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Advance Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
