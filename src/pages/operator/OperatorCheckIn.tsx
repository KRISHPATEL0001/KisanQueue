import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { Badge } from '../../components/ui/Badge';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  AlertCircle,
  Clock
} from 'lucide-react';

export const OperatorCheckIn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('MH-12-AB-4321');
  const [driverName, setDriverName] = useState('');

  const [checkedInBooking, setCheckedInBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setSearchQuery(refParam);
      const all = StorageService.getBookings();
      const match = all.find(b => b.bookingRef.toLowerCase() === refParam.toLowerCase());
      if (match) {
        setSelectedBooking(match);
        setDriverName(match.farmerName);
      }
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const all = StorageService.getBookings();
    const match = all.find(
      b => b.bookingRef.toLowerCase() === q ||
           b.tokenNumber.toLowerCase() === q ||
           b.farmerPhone.includes(q) ||
           b.farmerName.toLowerCase().includes(q)
    );

    if (match) {
      setSelectedBooking(match);
      setDriverName(match.farmerName);
    } else {
      setError(`No booking found matching "${searchQuery}". Please check booking reference or phone number.`);
    }
  };

  const handlePerformCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    if (!vehicleNumber.trim()) {
      setError('Vehicle registration number is mandatory for gate entry.');
      return;
    }

    const res = StorageService.checkInBooking(selectedBooking.id, vehicleNumber.trim().toUpperCase());
    if (res.success && res.booking) {
      setCheckedInBooking(res.booking);
    } else {
      setError(res.message || 'Check-in failed.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs pb-8">
      {/* Page Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Mandi Ingress Gate Terminal
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Gate Entry & Physical Token Issuance (गेट चेक-इन)
        </h1>
        <p className="text-gray-600 text-xs">
          Verify scheduled booking credentials, record vehicle tractor plate, and activate queue position.
        </p>
      </div>

      {checkedInBooking ? (
        <div className="bg-[#EAF4EA] border-2 border-[#18794E] p-6 rounded-xs shadow-md space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#18794E] text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#18794E]">
              Gate Entry Confirmed – Token {checkedInBooking.tokenNumber} Activated
            </h2>
            <p className="text-gray-700 mt-1">
              Vehicle <strong>{checkedInBooking.vehicleNumber}</strong> has been logged into the Mandi Queue Board.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Token Slip for Driver</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/operator/queue')}
              className="bg-[#E87524] hover:bg-[#d66619] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Clock className="w-4 h-4" />
              <span>Proceed to Queue Board →</span>
            </button>
          </div>

          <div className="pt-4 text-left">
            <PrintableToken booking={checkedInBooking} />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-5">
          {/* Step 1: Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="font-bold text-[#123B5D] block text-xs">
              Search Booking (Reference / Token / Mobile Number) *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. KS-WHT-1001 or 9876543210 or T-038"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-[#D6DDE5] rounded-xs text-xs font-mono focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Find Booking</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected Booking Verification Box */}
          {selectedBooking && (
            <form onSubmit={handlePerformCheckIn} className="space-y-4 pt-3 border-t border-gray-200">
              <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-4 rounded-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-gray-300">
                  <div>
                    <span className="font-bold text-sm text-[#123B5D]">
                      {selectedBooking.bookingRef}
                    </span>
                    <span className="text-[11px] text-gray-500 ml-2">
                      Scheduled: {selectedBooking.scheduledDate} ({selectedBooking.arrivalWindow})
                    </span>
                  </div>
                  <Badge variant="saffron">Token {selectedBooking.tokenNumber}</Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Farmer Name</span>
                    <span className="font-bold text-[#1F2933]">{selectedBooking.farmerName}</span>
                    <span className="text-[10px] text-gray-500 font-mono block">{selectedBooking.farmerPhone}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Crop / Quantity</span>
                    <span className="font-bold text-[#123B5D]">{selectedBooking.cropName}</span>
                    <span className="text-[10px] text-gray-500 block">{selectedBooking.estimatedQuantity} Quintals</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Status</span>
                    <Badge variant={selectedBooking.status === 'upcoming' ? 'neutral' : 'warning'}>
                      {selectedBooking.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Stage</span>
                    <span className="font-semibold text-gray-700 block">{selectedBooking.currentStage}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Entry Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Vehicle Number (Tractor / Trolley Plate) *
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. MH-12-AB-4321"
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono uppercase font-bold text-sm text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Driver / Representative Name
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Same as farmer if self-driven"
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#236327] text-white py-3 rounded-xs font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm Gate Ingress & Activate Token {selectedBooking.tokenNumber}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
