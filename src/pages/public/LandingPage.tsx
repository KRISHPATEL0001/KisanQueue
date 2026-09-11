import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { StorageService } from '../../services/storageService';
import { calculateLiveQueue, LiveQueueResult } from '../../lib/queueService';
import { 
  CalendarCheck, 
  Clock, 
  CreditCard, 
  FileCheck2, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  ArrowRight, 
  Building2, 
  Users, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Search,
  Scale,
  Radio,
  Truck,
  Sparkles,
  Volume2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, setRole } = useApp();
  const navigate = useNavigate();

  const [trackerCentreId, setTrackerCentreId] = useState<string>('centre-1');
  const [trackerTokenInput, setTrackerTokenInput] = useState<string>('T-038');
  const [activeQueryToken, setActiveQueryToken] = useState<string>('T-038');

  const centres = useMemo(() => StorageService.getCentres(), []);

  const liveQueue: LiveQueueResult = useMemo(() => {
    return calculateLiveQueue(trackerCentreId, activeQueryToken);
  }, [trackerCentreId, activeQueryToken]);

  const handleQuickRole = (role: 'farmer' | 'operator' | 'officer' | 'helpdesk', dest: string) => {
    setRole(role);
    navigate(dest);
  };

  const handleTrackerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackerTokenInput.trim()) {
      setActiveQueryToken(trackerTokenInput.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="bg-[#123B5D] text-white py-12 px-4 border-b-4 border-[#E87524]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#0e2c45] border border-white/20 text-xs text-[#E87524] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              <span>National Agricultural Procurement Initiative</span>
              <span>•</span>
              <span>Problem Statement ID: 26032</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Know your slot. <br className="hidden sm:inline" />
              <span className="text-[#E87524]">Track your queue.</span> <br className="hidden sm:inline" />
              Receive your payment.
            </h1>

            <p className="text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed">
              KisanSetu helps farmers book capacity-based procurement slots, track mandi arrival queues in real-time, receive operational disruption alerts, and monitor direct bank payment transfer status transparently.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickRole('farmer', '/farmer/book-slot')}
                className="bg-[#E87524] hover:bg-[#d66619] text-white text-sm font-bold px-5 py-3 rounded-xs shadow-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book a Procurement Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('farmer', '/farmer/queue-status')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-bold px-5 py-3 rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>Track My Status</span>
              </button>
            </div>
          </div>

          {/* Right Hero Card: Demo Quick Access Box */}
          <div className="lg:col-span-4 bg-white text-[#1F2933] p-5 rounded-xs border-2 border-gray-200 shadow-xl space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E87524] block">
                Instant Demo Navigation
              </span>
              <h2 className="text-base font-bold text-[#123B5D]">
                Select User Role to Experience
              </h2>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickRole('farmer', '/farmer/dashboard')}
                className="w-full text-left p-2.5 rounded-xs border border-gray-200 hover:border-[#123B5D] hover:bg-[#FFF3E8] flex items-center justify-between transition-colors text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-[#123B5D]">Farmer (Ramesh Kumar)</div>
                  <div className="text-[11px] text-gray-500">Book slot, view token T-038, track DBT payment</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E87524] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('operator', '/operator/dashboard')}
                className="w-full text-left p-2.5 rounded-xs border border-gray-200 hover:border-[#123B5D] hover:bg-[#EAF4EA] flex items-center justify-between transition-colors text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-[#123B5D]">Procurement Centre Operator</div>
                  <div className="text-[11px] text-gray-500">Check-in, quality inspection, weighment slip</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#2E7D32] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('officer', '/officer/dashboard')}
                className="w-full text-left p-2.5 rounded-xs border border-gray-200 hover:border-[#123B5D] hover:bg-sky-50 flex items-center justify-between transition-colors text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-[#123B5D]">Supervising Officer</div>
                  <div className="text-[11px] text-gray-500">Capacity utilization, delays, grievance audit</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#123B5D] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('helpdesk', '/helpdesk/dashboard')}
                className="w-full text-left p-2.5 rounded-xs border border-gray-200 hover:border-[#123B5D] hover:bg-amber-50 flex items-center justify-between transition-colors text-xs cursor-pointer"
              >
                <div>
                  <div className="font-bold text-[#123B5D]">Help Desk Operator</div>
                  <div className="text-[11px] text-gray-500">Assisted registration & token re-printing</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-800 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Government Notice Banner */}
        <NoticeBanner
          type="warning"
          title="Important Procurement Advisory"
          message="Procurement schedules and centre capacity may change because of weather, equipment, storage, transport, or operational conditions. Real-time alerts will be delivered via SMS and on this portal."
        />

        {/* Key Statistics Cards */}
        <section aria-labelledby="stats-heading">
          <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-2">
            <h2 id="stats-heading" className="text-base font-bold text-[#123B5D] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Current Season Key Metrics (Official Demo Data)</span>
            </h2>
            <span className="text-xs text-gray-500">Updated Daily at 08:00 AM</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Procurement Centres"
              labelHi="सक्रिय उपार्जन केंद्र"
              value="24"
              subtext="Covering 5 districts in division"
              icon={<Building2 className="w-5 h-5 text-[#123B5D]" />}
            />
            <StatCard
              label="Farmers Served This Season"
              labelHi="लाभान्वित किसान"
              value="3,840"
              subtext="Recorded with Aadhaar/DBT"
              icon={<Users className="w-5 h-5 text-[#2E7D32]" />}
              variant="success"
            />
            <StatCard
              label="Appointments Within Slot"
              labelHi="निर्धारित समय पालन"
              value="92%"
              subtext="Arrived in booked 2-hour window"
              icon={<CheckCircle2 className="w-5 h-5 text-[#E87524]" />}
              variant="highlight"
            />
            <StatCard
              label="Average Mandi Waiting Time"
              labelHi="औसत प्रतीक्षा समय"
              value="68 Mins"
              subtext="Gate entry to final weighment"
              icon={<Clock className="w-5 h-5 text-amber-600" />}
              variant="warning"
            />
          </div>
        </section>

        {/* Live Mandi Yard Token Tracker & Queue Difference Section */}
        <section className="bg-white border-2 border-[#123B5D]/20 p-6 rounded-xs shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-[#E87524] animate-pulse" />
                  Public Queue Stream
                </span>
                <Badge variant="success" size="sm">Live Feed</Badge>
              </div>
              <h2 className="text-xl font-bold text-[#123B5D]">
                Live Mandi Token Tracker & Queue Difference (लाइव टोकन व कतार अंतर)
              </h2>
              <p className="text-xs text-gray-600">
                Check which token is being processed right now on the weighbridge and see how many vehicles are ahead of your token.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleQuickRole('farmer', '/farmer/queue-status')}
              className="bg-[#123B5D] hover:bg-[#0e2f4b] text-white px-4 py-2 rounded-xs text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Full Farmer Queue Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls: Select Centre & Search Token */}
          <div className="bg-[#F5F7F9] p-4 rounded-xs border border-[#D6DDE5] grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6 space-y-1">
              <label className="text-[11px] font-bold text-[#123B5D] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#E87524]" />
                Select Mandi / Procurement Centre
              </label>
              <select
                value={trackerCentreId}
                onChange={(e) => setTrackerCentreId(e.target.value)}
                className="w-full bg-white border border-[#D6DDE5] text-xs font-semibold px-3 py-2 rounded-xs outline-none focus:ring-1 focus:ring-[#123B5D]"
              >
                {centres.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="text-[11px] font-bold text-[#123B5D] flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-[#2E7D32]" />
                Check Your Token Number (e.g. T-038)
              </label>
              <form onSubmit={handleTrackerSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Token (e.g. T-038)"
                  value={trackerTokenInput}
                  onChange={(e) => setTrackerTokenInput(e.target.value)}
                  className="flex-1 bg-white border border-[#D6DDE5] text-xs font-mono font-bold uppercase px-3 py-2 rounded-xs outline-none focus:ring-1 focus:ring-[#E87524]"
                />
                <button
                  type="submit"
                  className="bg-[#E87524] hover:bg-[#d66619] text-white px-4 py-2 rounded-xs text-xs font-bold cursor-pointer"
                >
                  Track Difference
                </button>
              </form>
            </div>
          </div>

          {/* Key Metrics: Serving Right Now vs Your Token Difference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Serving Token on Centre */}
            <div className="bg-[#123B5D] text-white p-4 rounded-xs border border-[#123B5D] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                Active on Centre Now
              </span>
              <div className="text-3xl font-black font-mono tracking-tight text-white">
                {liveQueue.activeServingToken}
              </div>
              <span className="text-[11px] text-gray-300 block font-medium">
                Facility: {liveQueue.activeFacilityStage}
              </span>
            </div>

            {/* Selected / Query Token */}
            <div className="bg-[#F5F7F9] p-4 rounded-xs border border-[#D6DDE5] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                Your Token Number
              </span>
              <div className="text-3xl font-black font-mono tracking-tight text-[#123B5D]">
                {liveQueue.userToken || 'T-038'}
              </div>
              <span className="text-[11px] text-gray-500 block">
                {liveQueue.userBooking ? `${liveQueue.userBooking.farmerName}` : 'Tractor/Trolley'}
              </span>
            </div>

            {/* Numerical Difference & How Many Ahead */}
            <div className={`p-4 rounded-xs border text-center space-y-1 ${
              liveQueue.tokensAheadCount === 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : liveQueue.tokensAheadCount === 1
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-[#FFF3E8] border-[#E87524] text-[#123B5D]'
            }`}>
              <span className="text-[10px] uppercase font-bold tracking-wider block opacity-80">
                Difference & Position
              </span>
              <div className="text-3xl font-black font-mono tracking-tight">
                {liveQueue.differenceNumber !== null ? (liveQueue.differenceNumber >= 0 ? `+${liveQueue.differenceNumber}` : `${liveQueue.differenceNumber}`) : '0'}
              </div>
              <span className="text-[11px] font-bold block">
                {liveQueue.tokensAheadCount === 0 ? '🟢 Serving Right Now' : `${liveQueue.tokensAheadCount} Vehicles Ahead`}
              </span>
            </div>

            {/* Estimated Wait Time */}
            <div className="bg-[#F5F7F9] p-4 rounded-xs border border-[#D6DDE5] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                Est. Waiting Time
              </span>
              <div className="text-3xl font-black font-mono tracking-tight text-[#2E7D32]">
                {liveQueue.estimatedWaitMinutes}m
              </div>
              <span className="text-[10px] text-gray-500 block">
                ~10 mins per weighment
              </span>
            </div>
          </div>

          {/* Quick List Preview */}
          <div className="border border-[#D6DDE5] rounded-xs overflow-hidden">
            <div className="bg-[#F5F7F9] px-4 py-2 text-[11px] font-bold text-[#123B5D] flex items-center justify-between border-b border-[#D6DDE5]">
              <span>Yard Queue Preview ({liveQueue.queueList.slice(0, 5).length} of {liveQueue.queueList.length} Vehicles)</span>
              <span className="text-gray-500 font-normal">Ordered by Arrival & Biometric Check-In</span>
            </div>
            <div className="divide-y divide-[#D6DDE5] text-xs">
              {liveQueue.queueList.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className={`p-3 flex flex-wrap items-center justify-between gap-3 ${
                    item.isUserToken 
                      ? 'bg-[#FFF3E8] font-bold text-[#123B5D]' 
                      : item.isNowServing 
                      ? 'bg-emerald-50 text-emerald-900' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-[#123B5D]">
                      {item.tokenNumber}
                    </span>
                    <div>
                      <span className="font-bold">{item.farmerName}</span>
                      <span className="text-[11px] text-gray-500 font-mono block">{item.vehicleNumber}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="font-medium">{item.cropName}</span>
                    <span className="text-[11px] text-gray-500 block">{item.quantityQuintals} qtl</span>
                  </div>

                  <div className="text-right">
                    <Badge variant={item.isNowServing ? 'success' : item.isUserToken ? 'saffron' : 'neutral'} size="sm">
                      {item.positionLabel}
                    </Badge>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{item.estimatedServiceTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Farmer 7-Step Procurement Journey Timeline */}
        <section className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <span className="text-xs font-bold text-[#E87524] uppercase tracking-wider">
              Workflow Guide
            </span>
            <h2 className="text-xl font-bold text-[#123B5D]">
              7-Step Transparent Farmer Procurement Journey
            </h2>
            <p className="text-xs text-gray-600">
              End-to-end digitised queue ensuring zero unverified middle-men and rapid DBT bank settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative">
            {[
              { step: '1', title: 'Register', titleHi: 'पंजीकरण', desc: 'Aadhaar & Bank verification' },
              { step: '2', title: 'Select Crop', titleHi: 'फसल चयन', desc: 'Wheat, Paddy, Mustard, etc.' },
              { step: '3', title: 'Book Slot', titleHi: 'स्लॉट बुकिंग', desc: 'Select date & arrival window' },
              { step: '4', title: 'Reach Centre', titleHi: 'केंद्र आगमन', desc: 'Gate verification & Token' },
              { step: '5', title: 'Quality Check', titleHi: 'गुणवत्ता जांच', desc: 'Moisture test & approval' },
              { step: '6', title: 'Purchase Receipt', titleHi: 'तौल व रसीद', desc: 'Weighment & digital slip' },
              { step: '7', title: 'Payment Confirmed', titleHi: 'डीबीटी भुगतान', desc: 'Direct bank credit' },
            ].map((item, index) => (
              <div 
                key={item.step}
                className="bg-[#F5F7F9] border border-[#D6DDE5] p-3 rounded-xs text-center relative group hover:border-[#123B5D] transition-colors"
              >
                <div className="w-7 h-7 bg-[#123B5D] text-white font-bold rounded-full flex items-center justify-center text-xs mx-auto mb-2 group-hover:bg-[#E87524]">
                  {item.step}
                </div>
                <div className="font-bold text-xs text-[#123B5D]">{item.title}</div>
                <div className="text-[10px] text-[#E87524] font-medium">{item.titleHi}</div>
                <div className="text-[10px] text-gray-500 mt-1 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Three Portal Sections: Farmer, Operators, Supervising Officers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: Farmer Services */}
          <div className="bg-white border-t-4 border-[#E87524] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E87524]" />
              <h3 className="font-bold text-base text-[#123B5D]">Farmer Services</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Designed with large text, bilingual labels, and mobile-friendly actions for farmers.
            </p>
            <ul className="space-y-2 text-xs divide-y divide-gray-100">
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/farmer/book-slot" className="hover:text-[#E87524] font-medium">
                  • Book Capacity-Based Slot
                </Link>
                <span className="text-[10px] text-gray-400">Available</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/farmer/queue-status" className="hover:text-[#E87524] font-medium">
                  • Live Token & Waiting Time
                </Link>
                <span className="text-[10px] text-green-700 font-semibold">Live T-038</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/farmer/procurement-status" className="hover:text-[#E87524] font-medium">
                  • Check Procurement & Receipt
                </Link>
                <span className="text-[10px] text-gray-400">Printable</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/farmer/payment-status" className="hover:text-[#E87524] font-medium">
                  • Track Bank Transfer (DBT)
                </Link>
                <span className="text-[10px] text-[#18794E] font-semibold">PFMS</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/farmer/complaints" className="hover:text-[#E87524] font-medium">
                  • Raise Mandi Grievance
                </Link>
                <span className="text-[10px] text-gray-400">Track Ref</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickRole('farmer', '/farmer/dashboard')}
                className="w-full bg-[#E87524] text-white py-2 text-xs font-bold rounded-xs text-center block hover:bg-[#d66619] cursor-pointer"
              >
                Access Farmer Dashboard →
              </button>
            </div>
          </div>

          {/* Section 2: Procurement Centres */}
          <div className="bg-white border-t-4 border-[#2E7D32] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="font-bold text-base text-[#123B5D]">For Procurement Centres</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Operational tools for Mandi Inspectors, weighment bridge operators, and quality officers.
            </p>
            <ul className="space-y-2 text-xs divide-y divide-gray-100">
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/operator/today-schedule" className="hover:text-[#2E7D32] font-medium">
                  • Daily Roster & Farmer Arrivals
                </Link>
                <span className="text-[10px] text-gray-400">Today</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/operator/queue" className="hover:text-[#2E7D32] font-medium">
                  • Live Queue Control Board
                </Link>
                <span className="text-[10px] text-amber-700 font-semibold">Active</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/operator/quality-check" className="hover:text-[#2E7D32] font-medium">
                  • Quality Moisture Parameters
                </Link>
                <span className="text-[10px] text-gray-400">Audit Ready</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/operator/weighing" className="hover:text-[#2E7D32] font-medium">
                  • Gross & Tare Weighment Slip
                </Link>
                <span className="text-[10px] text-gray-400">Automated</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/operator/disruptions" className="hover:text-[#2E7D32] font-medium">
                  • Broadcast Centre Disruptions
                </Link>
                <span className="text-[10px] text-red-700 font-semibold">Alerts</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickRole('operator', '/operator/dashboard')}
                className="w-full bg-[#2E7D32] text-white py-2 text-xs font-bold rounded-xs text-center block hover:bg-[#236327] cursor-pointer"
              >
                Access Operator Console →
              </button>
            </div>
          </div>

          {/* Section 3: Supervising Officers */}
          <div className="bg-white border-t-4 border-[#123B5D] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#123B5D]" />
              <h3 className="font-bold text-base text-[#123B5D]">For Supervising Officers</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              District and State civil supplies monitoring, capacity utilization, and delayed DBT resolution.
            </p>
            <ul className="space-y-2 text-xs divide-y divide-gray-100">
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/officer/centres" className="hover:text-[#123B5D] font-medium">
                  • Mandi Performance Monitoring
                </Link>
                <span className="text-[10px] text-gray-400">24 Centres</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/officer/capacity-monitor" className="hover:text-[#123B5D] font-medium">
                  • Capacity & Buffer Utilization
                </Link>
                <span className="text-[10px] text-gray-400">Mandi yard</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/officer/delayed-transactions" className="hover:text-[#123B5D] font-medium">
                  • Delayed Transactions & Bottlenecks
                </Link>
                <span className="text-[10px] text-amber-700 font-semibold">Actionable</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/officer/payment-monitor" className="hover:text-[#123B5D] font-medium">
                  • Treasury DBT Clearance Monitor
                </Link>
                <span className="text-[10px] text-gray-400">Reconciled</span>
              </li>
              <li className="pt-1.5 flex items-center justify-between">
                <Link to="/officer/audit-log" className="hover:text-[#123B5D] font-medium">
                  • Security & Operation Audit Trail
                </Link>
                <span className="text-[10px] text-gray-400">Immutable</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickRole('officer', '/officer/dashboard')}
                className="w-full bg-[#123B5D] text-white py-2 text-xs font-bold rounded-xs text-center block hover:bg-[#0e2c45] cursor-pointer"
              >
                Access Officer Portal →
              </button>
            </div>
          </div>
        </div>

        {/* Assisted Service Banner */}
        <section className="bg-[#FFF3E8] border-2 border-[#E87524] p-5 rounded-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <PhoneCall className="w-7 h-7 text-[#E87524] shrink-0 mt-1" />
            <div>
              <h3 className="text-base font-bold text-[#123B5D]">
                Do you need assistance using the digital portal?
              </h3>
              <p className="text-xs text-gray-700 mt-0.5">
                Farmers without a smartphone or internet access can visit the Assisted Help Desk at any registered procurement centre, or dial 1800-180-1551.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickRole('helpdesk', '/helpdesk/dashboard')}
            className="bg-[#123B5D] hover:bg-[#0e2c45] text-white text-xs font-bold px-4 py-2.5 rounded-xs whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            Assisted Service Operator View →
          </button>
        </section>

        {/* Official FAQ Section */}
        <section className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-4">
          <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#123B5D] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#E87524]" />
              <span>Frequently Asked Questions (अक्सर पूछे जाने वाले प्रश्न)</span>
            </h2>
            <Link to="/help" className="text-xs text-[#123B5D] font-semibold hover:underline">
              View All FAQs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1">
              <h4 className="font-bold text-[#123B5D]">
                What documents must I carry to the procurement centre?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Carry your KisanSetu Token printout or SMS, original Aadhaar card, registered bank passbook copy, and land/crop registration certificate.
              </p>
            </div>

            <div className="p-3 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1">
              <h4 className="font-bold text-[#123B5D]">
                What happens if my crop moisture exceeds the central limit?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                If moisture exceeds mandated tolerance (e.g. 12% for Wheat), the Inspector will mark "Requires Rechecking". You may dry the grains in the mandi apron and request a re-inspection within 24 hours.
              </p>
            </div>

            <div className="p-3 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1">
              <h4 className="font-bold text-[#123B5D]">
                How long does it take for procurement payment to reach my bank account?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Under the Direct Benefit Transfer (DBT) mandate, verified funds are credited within 48 to 72 bank working hours directly to your Aadhaar-seeded bank account.
              </p>
            </div>

            <div className="p-3 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs space-y-1">
              <h4 className="font-bold text-[#123B5D]">
                Can I reschedule my arrival date if my harvesting is delayed?
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Yes. Slots can be rescheduled up to 12 hours before your booked arrival window directly through the portal or by visiting the mandi helpdesk.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
