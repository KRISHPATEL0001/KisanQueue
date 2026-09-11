import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Eye,
  ArrowRight
} from 'lucide-react';

export const OperatorSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedWindow, setSelectedWindow] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setBookings(StorageService.getBookings());
  }, []);

  const filtered = bookings.filter((b) => {
    if (selectedWindow !== 'all' && b.arrivalWindow !== selectedWindow) return false;
    if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.bookingRef.toLowerCase().includes(q) ||
        b.farmerName.toLowerCase().includes(q) ||
        b.tokenNumber.toLowerCase().includes(q) ||
        b.cropName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Page Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            Daily Operational Roster
          </span>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Today's Scheduled Appointments (दैनिक कार्यतालिका)
          </h1>
          <p className="text-gray-600 text-xs">
            Review time-window allocations and process arrivals at the gate.
          </p>
        </div>

        <Link
          to="/operator/check-in"
          className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <Truck className="w-4 h-4" />
          <span>Gate Check-In Console →</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Time Window</label>
            <select
              value={selectedWindow}
              onChange={(e) => setSelectedWindow(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
            >
              <option value="all">All Windows</option>
              <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
              <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
              <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="in_progress">In Mandi Yard</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Search Roster</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Farmer name, token, ref..."
                className="w-full pl-8 pr-3 py-1.5 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Booking Ref</th>
                <th className="py-2.5 px-3">Farmer Name</th>
                <th className="py-2.5 px-3">Crop / Qty</th>
                <th className="py-2.5 px-3">Window</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3">
                    <Badge variant="saffron">{b.tokenNumber}</Badge>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#123B5D]">
                    {b.bookingRef}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-[#1F2933]">{b.farmerName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{b.farmerPhone}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-gray-800">{b.cropName}</span>
                    <span className="text-gray-500 text-[11px]"> ({b.estimatedQuantity} qtl)</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-[#2E7D32]">{b.arrivalWindow}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge
                      variant={
                        b.status === 'completed' ? 'success' :
                        b.status === 'in_progress' ? 'warning' : 'neutral'
                      }
                    >
                      {b.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {b.status === 'upcoming' ? (
                      <Link
                        to={`/operator/check-in?ref=${b.bookingRef}`}
                        className="bg-[#2E7D32] hover:bg-[#236327] text-white px-2.5 py-1 rounded-xs font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Check In</span>
                      </Link>
                    ) : (
                      <Link
                        to="/operator/queue"
                        className="bg-gray-100 hover:bg-gray-200 text-[#123B5D] px-2.5 py-1 rounded-xs font-semibold text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View in Queue</span>
                      </Link>
                    )}
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
