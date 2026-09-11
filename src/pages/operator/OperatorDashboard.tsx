import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { Booking, ProcurementCentre } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { 
  Users, 
  Truck, 
  Microscope, 
  Scale, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [centre, setCentre] = useState<ProcurementCentre | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const centres = StorageService.getCentres();
    const c = centres[0]; // Greenfield Procurement Centre
    setCentre(c);
    setBookings(StorageService.getBookings());
  }, []);

  const todayBookings = bookings.filter(b => b.scheduledDate.includes('2026') || b.status !== 'cancelled');
  const checkedInCount = todayBookings.filter(b => b.status === 'in_progress' || b.status === 'completed').length;
  const qualityPassedCount = todayBookings.filter(b => b.currentStage === 'WEIGHING' || b.currentStage === 'PURCHASE_RECORDED' || b.status === 'completed').length;
  const completedCount = todayBookings.filter(b => b.status === 'completed').length;
  const activeQueueCount = todayBookings.filter(b => b.status === 'in_progress').length;

  const handleTogglePause = () => {
    if (!centre) return;
    const newPause = !centre.isBookingPaused;
    const reason = newPause ? 'Weighbridge annual calibration & rain buffer' : 'Operations resumed';
    StorageService.toggleCentreBookingPause(centre.id, newPause, reason, 'Procurement Operator');
    setCentre({ ...centre, isBookingPaused: newPause, pauseReason: newPause ? reason : undefined });
  };

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Operating Header & Centre Status */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="saffron">MANDI OPERATOR CONSOLE</Badge>
            <span className="text-[11px] text-gray-500 font-mono">Terminal ID: T-PUNE-01</span>
          </div>
          <h1 className="text-xl font-bold text-[#123B5D]">
            {centre?.name || 'Greenfield Procurement Centre'}
          </h1>
          <p className="text-gray-600 text-xs">
            Daily Capacity: <strong>{centre?.dailyCapacityQuintals} qtl</strong> • Operational Buffer: <strong>{centre?.operationalReserveQuintals} qtl</strong> • District: <strong>{centre?.district}</strong>
          </p>
        </div>

        {/* Status Toggle Button */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 block uppercase font-bold">Intake Status</span>
            <span className={`font-bold text-xs ${centre?.isBookingPaused ? 'text-red-700' : 'text-[#18794E]'}`}>
              {centre?.isBookingPaused ? '● BOOKINGS PAUSED' : '● NORMAL INTAKE'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePause}
            className={`px-3 py-2 rounded-xs font-bold text-xs border transition-colors cursor-pointer shadow-2xs ${
              centre?.isBookingPaused
                ? 'bg-[#EAF4EA] border-[#18794E] text-[#18794E] hover:bg-[#d9ecd9]'
                : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
            }`}
          >
            {centre?.isBookingPaused ? 'Resume Bookings' : 'Pause Intake Bookings'}
          </button>
        </div>
      </div>

      {centre?.isBookingPaused && (
        <NoticeBanner
          type="error"
          title="Mandi Intake Paused Notice"
          message={`Public slot booking for this centre is currently paused: ${centre.pauseReason}. Active arrivals in queue are being processed.`}
        />
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Total Scheduled Today"
          labelHi="आज निर्धारित किसान"
          value={String(todayBookings.length)}
          subtext="Booked slot appointments"
          icon={<Calendar className="w-5 h-5 text-[#123B5D]" />}
        />
        <StatCard
          label="Checked In at Gate"
          labelHi="गेट चेक-इन"
          value={String(checkedInCount)}
          subtext="Vehicles logged on premises"
          icon={<Truck className="w-5 h-5 text-[#2E7D32]" />}
          variant="success"
        />
        <StatCard
          label="Quality Approved"
          labelHi="गुणवत्ता स्वीकृत"
          value={String(qualityPassedCount)}
          subtext="Moisture standard verified"
          icon={<Microscope className="w-5 h-5 text-[#E87524]" />}
          variant="highlight"
        />
        <StatCard
          label="Weighed & Slips Issued"
          labelHi="तौल पर्ची जारी"
          value={String(completedCount)}
          subtext="Payment files submitted"
          icon={<Scale className="w-5 h-5 text-indigo-700" />}
          variant="default"
        />
        <StatCard
          label="Active in Queue"
          labelHi="वर्तमान सक्रिय कतार"
          value={String(activeQueueCount)}
          subtext="Processing in Mandi yard"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          variant="warning"
        />
      </div>

      {/* Operational Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/operator/check-in"
          className="bg-white border-t-4 border-[#123B5D] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#123B5D] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#123B5D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Gate Entry & Check-In</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Verify farmer token reference, log vehicle number, and issue printed arrival slip.
          </p>
          <span className="text-[#123B5D] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Open Gate Console →
          </span>
        </Link>

        <Link
          to="/operator/queue"
          className="bg-white border-t-4 border-amber-600 border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-amber-600 space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Live Queue Control</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Call next token, advance stages, and manage vehicle turnaround inside mandi yard.
          </p>
          <span className="text-amber-800 font-bold text-xs inline-flex items-center gap-1 pt-1">
            Manage Queue Board →
          </span>
        </Link>

        <Link
          to="/operator/quality-check"
          className="bg-white border-t-4 border-[#2E7D32] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#2E7D32] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-green-50 text-[#2E7D32] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Microscope className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Quality Inspection</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Sample grains, log digital moisture percentage, foreign matter, and grade certificates.
          </p>
          <span className="text-[#2E7D32] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Log Quality Data →
          </span>
        </Link>

        <Link
          to="/operator/weighing"
          className="bg-white border-t-4 border-[#E87524] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#E87524] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-orange-50 text-[#E87524] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Electronic Weighbridge</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Record Gross & Tare weights, calculate net quintals, and emit digital purchase slip.
          </p>
          <span className="text-[#E87524] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Generate Weighment Slip →
          </span>
        </Link>
      </div>

      {/* Live Active Queue Snapshot Table */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-gray-200">
          <h2 className="font-bold text-[#123B5D] text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Active Arrivals in Yard (सक्रिय कतार)</span>
          </h2>
          <Link to="/operator/queue" className="font-bold text-xs text-[#123B5D] hover:underline">
            View Full Queue Board →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7F9] border-b border-[#D6DDE5] text-gray-600 text-[11px]">
                <th className="py-2 px-3">Token</th>
                <th className="py-2 px-3">Farmer Name</th>
                <th className="py-2 px-3">Commodity / Qty</th>
                <th className="py-2 px-3">Vehicle</th>
                <th className="py-2 px-3">Current Mandi Stage</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {todayBookings.filter(b => b.status === 'in_progress').map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <Badge variant="saffron">{b.tokenNumber}</Badge>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#123B5D]">
                    {b.farmerName}
                  </td>
                  <td className="py-2.5 px-3">
                    {b.cropName} ({b.estimatedQuantity} qtl)
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {b.vehicleNumber || 'Unassigned'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200 text-[10px]">
                      {b.currentStage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to="/operator/queue"
                      className="bg-[#123B5D] text-white px-2.5 py-1 rounded-xs font-semibold text-[11px] hover:bg-[#0e2c45]"
                    >
                      Advance Stage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
