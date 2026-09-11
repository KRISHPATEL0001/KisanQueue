import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  calculateLiveQueue, 
  LiveQueueResult, 
  QueueTokenItem 
} from '../../lib/queueService';
import { 
  Clock, 
  Truck, 
  Users, 
  RefreshCw, 
  PhoneCall, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2,
  Building2,
  Radio,
  Search,
  Scale,
  Microscope,
  ArrowRight,
  ArrowDown,
  Volume2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { formatTimeOnly } from '../../lib/formatters';

export const FarmerQueueStatus: React.FC = () => {
  const { activeFarmer, language } = useApp();
  const [farmerBookings, setFarmerBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [selectedCentreId, setSelectedCentreId] = useState<string>('centre-1');
  const [customTokenInput, setCustomTokenInput] = useState<string>('');
  const [activeTokenQuery, setActiveTokenQuery] = useState<string>('');
  const [queueTab, setQueueTab] = useState<'ALL' | 'AHEAD' | 'MINE' | 'BEHIND'>('ALL');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [audioAnnouncement, setAudioAnnouncement] = useState<string | null>(null);

  const centres = useMemo(() => StorageService.getCentres(), []);

  // Load farmer bookings on mount
  useEffect(() => {
    if (!activeFarmer) return;
    const bookings = StorageService.getBookingsByFarmer(activeFarmer.id);
    setFarmerBookings(bookings);

    const activeOrFirst = bookings.find(b => b.status === 'in_progress' || b.status === 'checked_in') ||
                          bookings.find(b => b.status === 'upcoming') ||
                          bookings[0];
    if (activeOrFirst) {
      setSelectedBookingId(activeOrFirst.id);
      setSelectedCentreId(activeOrFirst.centreId);
      setActiveTokenQuery(activeOrFirst.tokenNumber);
    } else {
      setActiveTokenQuery('T-038');
    }
  }, [activeFarmer]);

  // When farmer selects one of their bookings from dropdown
  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    const b = farmerBookings.find(x => x.id === bookingId);
    if (b) {
      setSelectedCentreId(b.centreId);
      setActiveTokenQuery(b.tokenNumber);
      setCustomTokenInput('');
    }
  };

  // When user enters custom token search
  const handleApplyCustomToken = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customTokenInput.trim()) {
      setActiveTokenQuery(customTokenInput.trim().toUpperCase());
    }
  };

  // Live queue calculations
  const liveQueue: LiveQueueResult = useMemo(() => {
    return calculateLiveQueue(selectedCentreId, activeTokenQuery);
  }, [selectedCentreId, activeTokenQuery, lastRefreshed]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 350);
  };

  // Play audio PA announcement
  const handlePlayPAAnnouncement = () => {
    const text = `Attention in Mandi Yard: Token ${liveQueue.activeServingToken}, farmer ${liveQueue.activeServingBooking?.farmerName || 'Vehicle'}, please proceed to ${liveQueue.activeFacilityStage}.`;
    setAudioAnnouncement(text);
    
    // Web Speech API if supported
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis not available', err);
      }
    }

    setTimeout(() => setAudioAnnouncement(null), 7000);
  };

  // Filter queue items based on tab
  const filteredQueue = useMemo(() => {
    if (queueTab === 'AHEAD') {
      return liveQueue.queueList.filter(item => 
        (item.differenceFromUser !== null && item.differenceFromUser < 0) || item.isNowServing
      );
    }
    if (queueTab === 'MINE') {
      return liveQueue.queueList.filter(item => item.isUserToken);
    }
    if (queueTab === 'BEHIND') {
      return liveQueue.queueList.filter(item => 
        item.differenceFromUser !== null && item.differenceFromUser > 0
      );
    }
    return liveQueue.queueList;
  }, [liveQueue, queueTab]);

  // Stages detailed progression
  const queueStages = [
    { key: 'GATE_ENTRY', title: '1. Gate Entry & Token Slip', titleHi: 'गेट प्रवेश एवं टोकन', desc: 'Aadhaar verification, token gate pass confirmed, vehicle logged.' },
    { key: 'QUALITY_CHECK', title: '2. Quality & Moisture Assay', titleHi: 'गुणवत्ता परीक्षण प्रयोगशाला', desc: 'Grain sampling against Fair Average Quality (FAQ ≤ 12% moisture).' },
    { key: 'WEIGHING', title: '3. Electronic Weighbridge', titleHi: 'इलेक्ट्रॉनिक तौल कांटा', desc: 'Loaded vehicle gross weight measured on calibrated weighbridge.' },
    { key: 'UNLOADING', title: '4. Mandi Storage Bay Offloading', titleHi: 'अनाज खाली करना', desc: 'Grain unloading into designated warehouse lot apron.' },
    { key: 'PURCHASE_RECEIPT', title: '5. Tare Weight & J-Form Slip', titleHi: 'खाली वाहन तौल एवं रसीद', desc: 'Vehicle tare weighed; digital purchase receipt generated.' },
    { key: 'PAYMENT_CREDIT', title: '6. Direct Bank Settlement (DBT)', titleHi: 'खाते में भुगतान (PFMS)', desc: 'Treasury PFMS digital sanction dispatched for direct credit.' },
  ];

  const getStageNumber = (stage?: string) => {
    switch (stage) {
      case 'BOOKING_CONFIRMED': return 1;
      case 'CHECKED_IN': return 2;
      case 'QUALITY_INSPECTION': return 3;
      case 'WEIGHING': return 4;
      case 'PURCHASE_RECORDED': return 5;
      case 'COMPLETED': return 6;
      default: return 1;
    }
  };

  const currentStageNum = getStageNumber(liveQueue.userBooking?.currentStage);

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-xs pb-12">
      {/* Header & Controls Bar */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#E87524] animate-pulse" />
              Live Mandi Queue & Token Tracking System
            </span>
            <Badge variant="success" size="sm">Active Stream</Badge>
          </div>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Live Token Tracker & Queue Difference (कतार व टोकन अंतर)
          </h1>
          <p className="text-gray-600 text-xs">
            See exactly which token is currently active on the weighbridge, how many vehicles are ahead of your token, and the full sequence.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePlayPAAnnouncement}
            className="bg-[#FFF3E8] border border-[#E87524] hover:bg-[#ffe7d1] text-[#123B5D] px-3.5 py-2 rounded-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
            title="Listen to synthesized yard loudspeaker broadcast"
          >
            <Volume2 className="w-4 h-4 text-[#E87524]" />
            <span>PA Announcement</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white border border-[#D6DDE5] hover:bg-gray-50 text-[#123B5D] px-3.5 py-2 rounded-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#E87524]' : ''}`} />
            <span>Refresh Queue</span>
            <span className="text-[10px] text-gray-400 font-normal">({formatTimeOnly(lastRefreshed)})</span>
          </button>
        </div>
      </div>

      {/* Audio Announcement Alert if active */}
      {audioAnnouncement && (
        <div className="p-3.5 bg-[#123B5D] text-white border-l-4 border-[#E87524] rounded-xs shadow-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-[#E87524] animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#E87524] tracking-wider block">
                Mandi Loudspeaker Announcement
              </span>
              <span className="text-xs font-semibold">{audioAnnouncement}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAudioAnnouncement(null)}
            className="text-gray-300 hover:text-white text-xs px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Selector Toolbar: Choose Procurement Centre & Choose / Search Token */}
      <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Centre Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#123B5D] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#E87524]" />
              Select Mandi / Procurement Centre (उपार्जन केंद्र चुनें)
            </label>
            <select
              value={selectedCentreId}
              onChange={(e) => setSelectedCentreId(e.target.value)}
              className="w-full bg-white border border-[#D6DDE5] text-[#1F2933] font-semibold text-xs rounded-xs px-3 py-2 focus:ring-1 focus:ring-[#123B5D] outline-none"
            >
              {centres.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district}) — Cap: {c.dailyCapacityQuintals} qtl/day
                </option>
              ))}
            </select>
          </div>

          {/* Token Selector & Search */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#123B5D] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#2E7D32]" />
              Track Token Number (अपना टोकन नंबर चुनें या दर्ज करें)
            </label>
            <div className="flex items-center gap-2">
              {farmerBookings.length > 0 ? (
                <select
                  value={selectedBookingId}
                  onChange={(e) => handleBookingSelect(e.target.value)}
                  className="bg-white border border-[#D6DDE5] text-[#1F2933] font-semibold text-xs rounded-xs px-2.5 py-2 focus:ring-1 focus:ring-[#123B5D] outline-none flex-1"
                >
                  {farmerBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.tokenNumber} ({b.cropName}, {b.estimatedQuantity} qtl) - {b.scheduledDate}
                    </option>
                  ))}
                </select>
              ) : null}

              {/* Custom Token Input */}
              <form onSubmit={handleApplyCustomToken} className="flex items-center gap-1.5 flex-1">
                <input
                  type="text"
                  placeholder="Or enter Token (e.g. T-038)"
                  value={customTokenInput}
                  onChange={(e) => setCustomTokenInput(e.target.value)}
                  className="w-full bg-white border border-[#D6DDE5] text-xs px-2.5 py-2 rounded-xs font-mono font-bold uppercase focus:ring-1 focus:ring-[#E87524] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#123B5D] hover:bg-[#0e2f4b] text-white px-3 py-2 rounded-xs font-bold shrink-0 cursor-pointer"
                >
                  Check
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick chip buttons for easy demo testing */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#D6DDE5]/60 text-[11px]">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Test Tokens:
          </span>
          {['T-035', 'T-036', 'T-037', 'T-038', 'T-039', 'T-040', 'T-041'].map(tok => {
            const isSelected = activeTokenQuery === tok;
            return (
              <button
                key={tok}
                type="button"
                onClick={() => {
                  setActiveTokenQuery(tok);
                  setCustomTokenInput(tok);
                }}
                className={`px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#123B5D] text-white border-[#123B5D] shadow-xs scale-105' 
                    : tok === liveQueue.activeServingToken
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {tok} {tok === liveQueue.activeServingToken ? '(Serving Now)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Hero Section: Live Token Going On Right Now vs Farmer's Token & Difference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: What token is going right now on centre */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#123B5D] to-[#0A2540] text-white p-5 rounded-xs shadow-md space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E87524] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#E87524] animate-ping" />
                Active at Mandi Centre Now
              </span>
              <span className="text-[11px] text-gray-300">{liveQueue.centreName}</span>
            </div>

            <div className="my-4 text-center bg-white/10 p-4 rounded-xs border border-white/15">
              <span className="text-xs uppercase text-emerald-300 font-bold tracking-wider block mb-1">
                Currently Serving Token (वर्तमान सेवा में)
              </span>
              <div className="text-5xl font-black font-mono tracking-tight text-white animate-pulse">
                {liveQueue.activeServingToken}
              </div>
              <div className="text-xs text-amber-200 mt-1 font-semibold flex items-center justify-center gap-1.5">
                <Scale className="w-4 h-4 text-[#E87524]" />
                <span>Facility: <strong>{liveQueue.activeFacilityStage}</strong></span>
              </div>
              {liveQueue.activeServingBooking && (
                <div className="text-[11px] text-gray-300 mt-2 border-t border-white/10 pt-2 flex items-center justify-around">
                  <span>Farmer: <strong className="text-white">{liveQueue.activeServingBooking.farmerName}</strong></span>
                  <span>Vehicle: <strong className="text-white font-mono">{liveQueue.activeServingBooking.vehicleNumber || 'Tractor'}</strong></span>
                </div>
              )}
            </div>

            {/* Stage-wise Active Token Breakdown */}
            <div className="space-y-1.5 text-[11px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block mb-1">
                Tokens Active Across Facilities:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/10 p-2 rounded-xs border border-white/10 flex items-center justify-between">
                  <span className="text-gray-300">Weighbridge:</span>
                  <span className="font-mono font-black text-amber-300">{liveQueue.stageBreakdown.weighbridgeToken || 'Idle'}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xs border border-white/10 flex items-center justify-between">
                  <span className="text-gray-300">Quality Lab:</span>
                  <span className="font-mono font-black text-sky-300">{liveQueue.stageBreakdown.qualityCheckToken || 'Testing'}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xs border border-white/10 flex items-center justify-between">
                  <span className="text-gray-300">Gate Ingress:</span>
                  <span className="font-mono font-black text-emerald-300">{liveQueue.stageBreakdown.gateEntryToken || 'Clear'}</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xs border border-white/10 flex items-center justify-between">
                  <span className="text-gray-300">Unloading Bay:</span>
                  <span className="font-mono font-black text-purple-300">{liveQueue.stageBreakdown.unloadingToken || 'Offloading'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] text-gray-300">
            <span>Total vehicles in yard: <strong className="text-white">{liveQueue.totalInQueue}</strong></span>
            <span>Completed today: <strong className="text-emerald-300">{liveQueue.stageBreakdown.completedCountToday}</strong></span>
          </div>
        </div>

        {/* Right Column: Difference by his token, how many ahead */}
        <div className="lg:col-span-7 bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#123B5D] block">
                  Token Comparison & Waiting Difference
                </span>
                <h3 className="text-sm font-bold text-[#123B5D]">
                  Your Position Relative to Current Serving Token
                </h3>
              </div>
              <Badge 
                variant={
                  liveQueue.statusTone === 'serving' ? 'success' :
                  liveQueue.statusTone === 'next' ? 'saffron' :
                  liveQueue.statusTone === 'completed' ? 'neutral' : 'info'
                }
                size="md"
              >
                {liveQueue.statusTone === 'serving' ? '🟢 SERVING RIGHT NOW' :
                 liveQueue.statusTone === 'next' ? '🟡 YOUR TURN NEXT' :
                 liveQueue.statusTone === 'completed' ? '✅ COMPLETED' :
                 `⏳ ${liveQueue.tokensAheadCount} VEHICLES AHEAD`}
              </Badge>
            </div>

            {/* 4 Big Difference Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {/* Token Number Card */}
              <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-3 rounded-xs text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Your Token</span>
                <span className="text-2xl font-black font-mono text-[#123B5D] block mt-0.5">
                  {liveQueue.userToken || 'T-038'}
                </span>
                <span className="text-[10px] text-gray-500">
                  {liveQueue.userBooking ? liveQueue.userBooking.cropName : 'Wheat'}
                </span>
              </div>

              {/* Difference Number Card */}
              <div className={`p-3 rounded-xs text-center border ${
                liveQueue.tokensAheadCount === 0 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : liveQueue.tokensAheadCount === 1
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-[#FFF3E8] border-[#E87524] text-[#123B5D]'
              }`}>
                <span className="text-[10px] font-bold uppercase block opacity-80">Token Difference</span>
                <span className="text-2xl font-black font-mono block mt-0.5">
                  {liveQueue.differenceNumber !== null ? (liveQueue.differenceNumber >= 0 ? `+${liveQueue.differenceNumber}` : `${liveQueue.differenceNumber}`) : '0'}
                </span>
                <span className="text-[10px] font-semibold">
                  {liveQueue.tokensAheadCount === 0 ? 'Exact Match (0)' : `${liveQueue.tokensAheadCount} Slots in Queue`}
                </span>
              </div>

              {/* How Many Ahead Card */}
              <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-3 rounded-xs text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Tokens Ahead</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <Truck className="w-4 h-4 text-[#E87524]" />
                  <span className="text-2xl font-black text-[#123B5D]">
                    {liveQueue.tokensAheadCount}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500">Tractors Ahead in Line</span>
              </div>

              {/* Est. Wait Time */}
              <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-3 rounded-xs text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Est. Wait Time</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4 text-[#2E7D32]" />
                  <span className="text-2xl font-black text-[#2E7D32]">
                    {liveQueue.estimatedWaitMinutes}m
                  </span>
                </div>
                <span className="text-[10px] text-gray-500">~10 min / vehicle</span>
              </div>
            </div>

            {/* Dynamic Advisory Box */}
            <div className={`p-4 rounded-xs border flex items-start gap-3 ${
              liveQueue.statusTone === 'serving'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : liveQueue.statusTone === 'next'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : liveQueue.statusTone === 'completed'
                ? 'bg-gray-100 border-gray-300 text-gray-800'
                : 'bg-[#FFF3E8] border-[#E87524]/60 text-[#123B5D]'
            }`}>
              <div className="mt-0.5 shrink-0">
                {liveQueue.statusTone === 'serving' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-bounce" />
                ) : liveQueue.statusTone === 'next' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
                ) : (
                  <Info className="w-5 h-5 text-[#E87524]" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-bold text-xs">
                  {liveQueue.recommendedAction}
                </div>
                <div className="text-[11px] opacity-85">
                  {liveQueue.recommendedActionHi}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guidance Tips */}
          <div className="bg-[#F5F7F9] p-3 rounded-xs border border-[#D6DDE5] text-[11px] text-gray-600 flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>
                Tokens are served sequentially strictly according to biometric check-in order and Fair Quality validation.
              </span>
            </div>
            <a
              href="tel:18001801551"
              className="text-[#123B5D] font-bold hover:underline shrink-0 flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#2E7D32]" />
              Yard Control
            </a>
          </div>
        </div>
      </div>

      {/* Sequential Tokens Queue List Section ("its list") */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#123B5D]">
                Mandi Yard Sequential Queue List (कतार सूची व टोकन क्रम)
              </h2>
              <span className="bg-[#123B5D] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                {liveQueue.queueList.length} Vehicles
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Live ordered queue of all arriving tractors, showing their exact distance and status ahead or behind you.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F5F7F9] p-1 rounded-xs border border-[#D6DDE5]">
            <button
              type="button"
              onClick={() => setQueueTab('ALL')}
              className={`px-3 py-1 rounded-xs font-bold text-xs transition-colors cursor-pointer ${
                queueTab === 'ALL' ? 'bg-[#123B5D] text-white shadow-xs' : 'text-gray-600 hover:text-[#123B5D]'
              }`}
            >
              All Yard ({liveQueue.queueList.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('AHEAD')}
              className={`px-3 py-1 rounded-xs font-bold text-xs transition-colors cursor-pointer ${
                queueTab === 'AHEAD' ? 'bg-[#E87524] text-white shadow-xs' : 'text-gray-600 hover:text-[#E87524]'
              }`}
            >
              Ahead of You ({liveQueue.tokensAheadCount + 1})
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('MINE')}
              className={`px-3 py-1 rounded-xs font-bold text-xs transition-colors cursor-pointer ${
                queueTab === 'MINE' ? 'bg-[#18794E] text-white shadow-xs' : 'text-gray-600 hover:text-[#18794E]'
              }`}
            >
              Your Token
            </button>
            <button
              type="button"
              onClick={() => setQueueTab('BEHIND')}
              className={`px-3 py-1 rounded-xs font-bold text-xs transition-colors cursor-pointer ${
                queueTab === 'BEHIND' ? 'bg-sky-700 text-white shadow-xs' : 'text-gray-600 hover:text-sky-700'
              }`}
            >
              Behind You
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto border border-[#D6DDE5] rounded-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F7F9] text-[#123B5D] border-b border-[#D6DDE5] font-bold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Token #</th>
                <th className="py-2.5 px-3">Queue Position & Difference</th>
                <th className="py-2.5 px-3">Farmer & Vehicle</th>
                <th className="py-2.5 px-3">Commodity & Quantity</th>
                <th className="py-2.5 px-3">Current Yard Stage</th>
                <th className="py-2.5 px-3 text-right">Est. Calling Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6DDE5]">
              {filteredQueue.map((item, idx) => {
                const isUser = item.isUserToken;
                const isServing = item.isNowServing;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-[#FFF8F2] border-y-2 border-[#E87524] font-semibold'
                        : isServing
                        ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                        : idx % 2 === 0
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-[#FAFCFD] hover:bg-gray-50'
                    }`}
                  >
                    {/* Token Number */}
                    <td className="py-3 px-3 font-mono font-black text-sm text-[#123B5D] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isServing && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                        <span>{item.tokenNumber}</span>
                        {isUser && (
                          <span className="bg-[#E87524] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal block font-sans">
                        Ref: {item.bookingRef}
                      </span>
                    </td>

                    {/* Position Label & Difference */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isServing ? (
                        <Badge variant="success" size="sm">
                          🟢 NOW SERVING
                        </Badge>
                      ) : isUser ? (
                        <Badge variant="saffron" size="sm">
                          ⭐ YOUR TOKEN ({item.differenceFromServing > 0 ? `+${item.differenceFromServing} diff` : 'Current'})
                        </Badge>
                      ) : item.differenceFromUser !== null && item.differenceFromUser < 0 ? (
                        <div className="flex items-center gap-1 text-amber-700 font-bold">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                          <span>{item.positionLabel}</span>
                        </div>
                      ) : item.differenceFromUser !== null && item.differenceFromUser > 0 ? (
                        <div className="flex items-center gap-1 text-gray-500 font-medium">
                          <span>{item.positionLabel}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">{item.positionLabel}</span>
                      )}
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {item.positionLabelHi}
                      </span>
                    </td>

                    {/* Farmer Name & Vehicle Plate */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#1F2933]">
                        {item.farmerName}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-gray-400" />
                        <span>{item.vehicleNumber}</span>
                      </div>
                    </td>

                    {/* Commodity & Quantity */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#123B5D]">
                        {item.cropName}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {item.quantityQuintals} Quintals
                      </div>
                    </td>

                    {/* Stage Badge */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[11px] text-[#123B5D]">
                          {item.stageLabel}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.stageLabelHi}
                        </span>
                      </div>
                    </td>

                    {/* Estimated Calling Time */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-700 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 text-xs">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.estimatedServiceTime}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-sans block">
                        Slot: {item.arrivalWindow.split(' - ')[0]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6 Stages Progression Cards (Overall Pipeline) */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-base font-bold text-[#123B5D]">
            Official Mandi Processing Pipeline (कार्यवाही के 6 चरण)
          </h2>
          <p className="text-xs text-gray-500">
            Mandatory sequence followed by all vehicles upon entering the procurement yard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {queueStages.map((st, idx) => {
            const stageNum = idx + 1;
            const isCompleted = stageNum < currentStageNum;
            const isCurrent = stageNum === currentStageNum;

            return (
              <div
                key={st.key}
                className={`p-3.5 rounded-xs border flex items-start gap-3 transition-colors ${
                  isCurrent
                    ? 'bg-[#FFF3E8] border-[#E87524] shadow-xs'
                    : isCompleted
                    ? 'bg-[#EAF4EA] border-[#18794E]/40'
                    : 'bg-[#F5F7F9] border-[#D6DDE5]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#18794E]" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-[#E87524] text-white text-xs font-bold flex items-center justify-center animate-pulse">
                      {stageNum}
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs flex items-center justify-center font-semibold">
                      {stageNum}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-xs ${isCurrent ? 'text-[#123B5D]' : isCompleted ? 'text-[#18794E]' : 'text-gray-600'}`}>
                      {st.title}
                    </h3>
                  </div>
                  <div className="text-[10px] text-[#E87524] font-semibold">{st.titleHi}</div>
                  <div className="text-[11px] text-gray-600 mt-1">{st.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Assistance Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="tel:18001801551"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] p-3 rounded-xs text-center flex items-center justify-center gap-2 font-bold text-[#123B5D] shadow-2xs cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-green-700" />
          <span>Call Centre Help Desk (टोल फ्री)</span>
        </a>

        <button
          type="button"
          onClick={() => alert(`Directions: ${liveQueue.centreName}, Gate No. 2, APMC Mandi Complex.`)}
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] p-3 rounded-xs text-center flex items-center justify-center gap-2 font-bold text-[#123B5D] shadow-2xs cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#E87524]" />
          <span>Mandi Yard Gate Navigation</span>
        </button>

        <a
          href="/farmer/complaints"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] p-3 rounded-xs text-center flex items-center justify-center gap-2 font-bold text-red-700 shadow-2xs cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Queue Issue (शिकायत)</span>
        </a>
      </div>
    </div>
  );
};
