import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { ProcurementCentre } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  PlayCircle,
  Settings
} from 'lucide-react';

export const OfficerCentres: React.FC = () => {
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  useEffect(() => {
    setCentres(StorageService.getCentres());
  }, []);

  const handleTogglePause = (centre: ProcurementCentre) => {
    const nextPaused = !centre.isBookingPaused;
    const reason = nextPaused ? 'Supervising Officer mandated intake pause' : 'Operations resumed';
    StorageService.toggleCentreBookingPause(centre.id, nextPaused, reason, 'Supervising Officer');
    setCentres(StorageService.getCentres());
  };

  const filtered = centres.filter(c => {
    if (districtFilter !== 'all' && c.district !== districtFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Divisional Mandi Infrastructure Management
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Procurement Centres Directory & Status (उपार्जन केंद्र प्रबंधन)
        </h1>
        <p className="text-gray-600 text-xs">
          Regulate daily capacities, manage 20% operational reserve buffers, and oversee intake status across 24 centres.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-[10px] text-gray-500 uppercase font-bold">Filter District:</label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden"
          >
            <option value="all">All Districts (Pune Division)</option>
            <option value="Pune">Pune</option>
            <option value="Satara">Satara</option>
            <option value="Solapur">Solapur</option>
            <option value="Kolhapur">Kolhapur</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search centre name or address..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden"
          />
        </div>
      </div>

      {/* Centres List Table */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Centre Name</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Total Daily Cap</th>
                <th className="py-2.5 px-3">Reserve Buffer</th>
                <th className="py-2.5 px-3">Bookable Limit</th>
                <th className="py-2.5 px-3">Booked Today</th>
                <th className="py-2.5 px-3">Available Open</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => {
                const bookable = c.dailyCapacityQuintals - c.operationalReserveQuintals;
                const remaining = Math.max(0, bookable - c.bookedTodayQuintals);
                const pct = Math.round((c.bookedTodayQuintals / bookable) * 100);
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-bold text-[#123B5D]">
                      {c.name}
                      <span className="text-[10px] text-gray-500 font-normal block">{c.address}</span>
                    </td>
                    <td className="py-2.5 px-3">{c.district}</td>
                    <td className="py-2.5 px-3 font-mono">{c.dailyCapacityQuintals} qtl</td>
                    <td className="py-2.5 px-3 font-mono text-gray-500">{c.operationalReserveQuintals} qtl</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-gray-800">{bookable} qtl</td>
                    <td className="py-2.5 px-3 font-bold text-[#1F2933]">
                      {c.bookedTodayQuintals} qtl
                      <span className="text-[10px] text-gray-400 block font-normal">({pct}% booked)</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#18794E]">
                      {remaining} qtl
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={c.isBookingPaused ? 'danger' : 'success'}>
                        {c.isBookingPaused ? 'PAUSED' : 'ACTIVE'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleTogglePause(c)}
                        className={`px-2.5 py-1 rounded-xs font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                          c.isBookingPaused
                            ? 'bg-[#EAF4EA] text-[#18794E] hover:bg-[#d4edd4] border border-[#18794E]/40'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-300'
                        }`}
                      >
                        {c.isBookingPaused ? (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume Intake</span>
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Pause Intake</span>
                          </>
                        )}
                      </button>
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
