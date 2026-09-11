import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { Booking } from '../../types';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { Printer, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const HelpdeskPrintToken: React.FC = () => {
  const [query, setQuery] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const q = query.trim().toLowerCase();
    if (!q) return;

    const all = StorageService.getBookings();
    const match = all.find(
      b => b.bookingRef.toLowerCase() === q ||
           b.tokenNumber.toLowerCase() === q ||
           b.farmerPhone.includes(q)
    );

    if (match) {
      setBooking(match);
    } else {
      setError(`No appointment found for "${query}". Check token number or farmer mobile.`);
      setBooking(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Token Re-Issuance Service
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Print Appointment Token Slip (टोकन पर्ची प्रिंट)
        </h1>
        <p className="text-gray-600 text-xs">
          Retrieve and print digital barcode entry slips for farmers who lost their SMS confirmation.
        </p>
      </div>

      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs">
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="font-bold text-[#123B5D] block">
            Enter Token (e.g. T-038) or Booking Reference (e.g. KS-WHT-1001) *
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. T-038 or KS-WHT-1001"
                required
                className="w-full pl-9 pr-3 py-2 border border-[#D6DDE5] rounded-xs text-xs font-mono focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold shadow-xs cursor-pointer"
            >
              Retrieve Slip
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {booking && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Send to Thermal Slip Printer</span>
            </button>
          </div>

          <PrintableToken booking={booking} />
        </div>
      )}
    </div>
  );
};
