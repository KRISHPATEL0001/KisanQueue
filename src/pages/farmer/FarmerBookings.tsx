import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Clock, 
  Printer, 
  FileCheck2, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';

export const FarmerBookings: React.FC = () => {
  const { activeFarmer } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokenBooking, setSelectedTokenBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (activeFarmer) {
      setBookings(StorageService.getBookingsByFarmer(activeFarmer.id));
    }
  }, [activeFarmer]);

  const filteredBookings = bookings.filter((b) => {
    if (selectedTab !== 'all') {
      if (selectedTab === 'upcoming' && b.status !== 'upcoming' && b.status !== 'in_progress') return false;
      if (selectedTab === 'completed' && b.status !== 'completed') return false;
      if (selectedTab === 'cancelled' && b.status !== 'cancelled') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingRef.toLowerCase().includes(q) ||
        b.cropName.toLowerCase().includes(q) ||
        b.centreName.toLowerCase().includes(q) ||
        b.tokenNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this procurement appointment?')) {
      const res = StorageService.cancelBooking(bookingId, 'Farmer requested cancellation');
      if (res.success) {
        if (activeFarmer) setBookings(StorageService.getBookingsByFarmer(activeFarmer.id));
      }
    }
  };

  return (
    <div className="space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            Appointment Records
          </span>
          <h1 className="text-xl font-bold text-[#123B5D]">
            My Procurement Bookings (मेरी बुकिंग सूची)
          </h1>
          <p className="text-gray-600 text-xs">
            Review your slot appointments, download official tokens, or manage arrival schedules.
          </p>
        </div>

        <Link
          to="/farmer/book-slot"
          className="bg-[#E87524] hover:bg-[#d66619] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book New Slot</span>
        </Link>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xs">
            {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 rounded-xs font-bold capitalize transition-colors cursor-pointer ${
                  selectedTab === tab
                    ? 'bg-white text-[#123B5D] shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'all' ? 'All Bookings' : tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ref, token, crop..."
              className="w-full pl-8 pr-3 py-1.5 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-semibold">No booking records found for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#123B5D] transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#123B5D]">{b.bookingRef}</span>
                  <Badge variant="saffron">Token {b.tokenNumber}</Badge>
                  <Badge 
                    variant={
                      b.status === 'completed' ? 'success' : 
                      b.status === 'in_progress' ? 'info' : 
                      b.status === 'cancelled' ? 'neutral' : 'warning'
                    }
                  >
                    {b.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Commodity</span>
                    <span className="font-bold text-[#1F2933]">{b.cropName} ({b.estimatedQuantity} qtl)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Date & Window</span>
                    <span className="font-medium text-[#1F2933]">{b.scheduledDate}</span>
                    <span className="text-[10px] text-gray-500 block">{b.arrivalWindow}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Procurement Centre</span>
                    <span className="font-medium text-[#1F2933]">{b.centreName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Current Queue Stage</span>
                    <span className="font-semibold text-[#E87524]">{b.currentStage.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTokenBooking(b)}
                    className="bg-gray-100 hover:bg-gray-200 text-[#123B5D] px-2.5 py-1.5 rounded-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Token</span>
                  </button>

                  <Link
                    to={`/farmer/bookings/${b.id}`}
                    className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Detail</span>
                  </Link>
                </div>

                {b.status === 'upcoming' && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(b.id)}
                      className="text-red-700 hover:underline cursor-pointer font-medium"
                    >
                      Cancel Slot
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Token Slip */}
      {selectedTokenBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedTokenBooking(null)}>
          <div className="max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
            <PrintableToken booking={selectedTokenBooking} onClose={() => setSelectedTokenBooking(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
