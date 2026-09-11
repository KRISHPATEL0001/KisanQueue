import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { ProcurementCentre, Booking, Grievance, PaymentRecord } from '../../types';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { 
  ShieldCheck, 
  Building2, 
  Scale, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';

export const OfficerDashboard: React.FC = () => {
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    setCentres(StorageService.getCentres());
    setGrievances(StorageService.getGrievances());
    setPayments(StorageService.getPayments());
  }, []);

  const totalDailyCapacity = centres.reduce((acc, c) => acc + c.dailyCapacityQuintals, 0);
  const totalBookedToday = centres.reduce((acc, c) => acc + c.bookedTodayQuintals, 0);
  const totalBuffers = centres.reduce((acc, c) => acc + c.operationalReserveQuintals, 0);
  const avgUtilization = Math.round((totalBookedToday / (totalDailyCapacity - totalBuffers)) * 100);

  const pendingGrievances = grievances.filter(g => g.status !== 'resolved');
  const creditedPayments = payments.filter(p => p.status === 'credited');
  const totalDisbursed = creditedPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="navy">DIVISIONAL SUPERVISORY CONSOLE</Badge>
            <span className="text-[11px] text-gray-500 font-mono">Pune Division • Maharashtra</span>
          </div>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Procurement Monitoring & Capacity Oversight (विभागीय डैशबोर्ड)
          </h1>
          <p className="text-gray-600 text-xs">
            District-wide real-time tracking of 24 APMC mandi yards, DBT treasury disbursements, and bottleneck resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/officer/reports"
            className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-3.5 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Season Dossier</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Active Procurement Yards"
          labelHi="सक्रिय केंद्र"
          value={String(centres.length)}
          subtext="Covering 5 districts"
          icon={<Building2 className="w-5 h-5 text-[#123B5D]" />}
        />
        <StatCard
          label="Overall Capacity Booked"
          labelHi="क्षमता उपयोगिता"
          value={`${avgUtilization}%`}
          subtext={`${totalBookedToday} of ${totalDailyCapacity - totalBuffers} qtl`}
          icon={<TrendingUp className="w-5 h-5 text-[#2E7D32]" />}
          variant="success"
        />
        <StatCard
          label="DBT Treasury Disbursed"
          labelHi="डीबीटी भुगतान"
          value={formatCurrencyINR(totalDisbursed || 73800000)}
          subtext="Direct bank transfers"
          icon={<CreditCard className="w-5 h-5 text-[#18794E]" />}
          variant="highlight"
        />
        <StatCard
          label="Average Mandi Turnaround"
          labelHi="औसत प्रतीक्षा समय"
          value="68 Mins"
          subtext="Gate entry to final weighment"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          variant="warning"
        />
        <StatCard
          label="Open Public Grievances"
          labelHi="लंबित शिकायतें"
          value={String(pendingGrievances.length)}
          subtext="CPGRAMS portal cases"
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          variant="danger"
        />
      </div>

      {/* Quick Navigation Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/officer/centres"
          className="bg-white border-t-4 border-[#123B5D] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#123B5D] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#123B5D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Mandi Centres Performance</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Monitor intake capacity, pause unruly centres, and calibrate operational buffers.
          </p>
          <span className="text-[#123B5D] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Audit Centres →
          </span>
        </Link>

        <Link
          to="/officer/delayed-transactions"
          className="bg-white border-t-4 border-amber-600 border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-amber-600 space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Delayed Transactions</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Spot tractors waiting over 90 mins, unverified weighments, and resolve bottlenecks.
          </p>
          <span className="text-amber-800 font-bold text-xs inline-flex items-center gap-1 pt-1">
            Resolve Delays →
          </span>
        </Link>

        <Link
          to="/officer/payment-monitor"
          className="bg-white border-t-4 border-[#18794E] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#18794E] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-green-50 text-[#18794E] flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">PFMS Treasury Monitor</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Track bank transaction success rates, UTR generation, and reconciliation logs.
          </p>
          <span className="text-[#18794E] font-bold text-xs inline-flex items-center gap-1 pt-1">
            View Treasury Clearance →
          </span>
        </Link>

        <Link
          to="/officer/grievances"
          className="bg-white border-t-4 border-red-600 border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-red-600 space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-red-50 text-red-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Grievance Redressal</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Adjudicate public farmer complaints, assign inspectors, and log resolutions.
          </p>
          <span className="text-red-700 font-bold text-xs inline-flex items-center gap-1 pt-1">
            Adjudicate Cases ({pendingGrievances.length}) →
          </span>
        </Link>
      </div>

      {/* Centre Capacity Utilization Table */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-gray-200">
          <h2 className="font-bold text-[#123B5D] text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#123B5D]" />
            <span>Procurement Centres Status & Capacity Allocation (केंद्र निगरानी)</span>
          </h2>
          <Link to="/officer/centres" className="font-bold text-xs text-[#123B5D] hover:underline">
            Manage All Centres →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7F9] border-b border-[#D6DDE5] text-gray-600 text-[11px]">
                <th className="py-2.5 px-3">Centre Name</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Daily Limit</th>
                <th className="py-2.5 px-3">Buffer Reserve</th>
                <th className="py-2.5 px-3">Booked / Available</th>
                <th className="py-2.5 px-3">Utilization</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {centres.map((c) => {
                const bookable = c.dailyCapacityQuintals - c.operationalReserveQuintals;
                const remaining = Math.max(0, bookable - c.bookedTodayQuintals);
                const pct = Math.round((c.bookedTodayQuintals / bookable) * 100);
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-bold text-[#123B5D]">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3">{c.district}</td>
                    <td className="py-2.5 px-3 font-mono">{c.dailyCapacityQuintals} qtl</td>
                    <td className="py-2.5 px-3 font-mono text-gray-500">{c.operationalReserveQuintals} qtl</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-gray-800">{c.bookedTodayQuintals} qtl</span>
                      <span className="text-gray-400 text-[10px] block font-mono">({remaining} qtl open)</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 h-2 rounded-xs overflow-hidden">
                          <div
                            className={`h-full ${pct > 85 ? 'bg-red-600' : pct > 70 ? 'bg-amber-500' : 'bg-[#2E7D32]'}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px]">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant={c.isBookingPaused ? 'danger' : 'success'}>
                        {c.isBookingPaused ? 'PAUSED' : 'OPERATIONAL'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
