import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { Farmer } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Search, User, Phone, MapPin, Landmark, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpdeskSearchFarmer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Farmer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    const all = StorageService.getFarmers();
    const filtered = all.filter(
      f => f.name.toLowerCase().includes(q) ||
           f.mobile.includes(q) ||
           f.refNumber.toLowerCase().includes(q) ||
           f.village.toLowerCase().includes(q)
    );

    setResults(filtered);
    setHasSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Citizen Master Search
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Farmer Profile & Identity Verification (किसान खोजें)
        </h1>
        <p className="text-gray-600 text-xs">
          Locate registered farmer profiles by mobile number, Aadhaar reference, or full name.
        </p>
      </div>

      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs">
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="font-bold text-[#123B5D] block">
            Enter Farmer Name, 10-Digit Mobile, or Reference Number *
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Ramesh or 9876543210 or FRM-MH-2026-8891"
                required
                className="w-full pl-9 pr-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold shadow-xs cursor-pointer"
            >
              Search Master
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="space-y-3">
          <h2 className="font-bold text-xs text-gray-700">Search Results ({results.length})</h2>
          {results.length === 0 ? (
            <div className="p-6 bg-white border border-[#D6DDE5] rounded-xs text-center text-gray-500">
              No registered farmer found matching "{query}".
            </div>
          ) : (
            results.map((f) => (
              <div key={f.id} className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-gray-100">
                  <div>
                    <h3 className="font-bold text-sm text-[#123B5D]">{f.name}</h3>
                    <span className="font-mono text-gray-500 text-[11px]">{f.refNumber}</span>
                  </div>
                  <Badge variant="success">AADHAAR VERIFIED</Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Mobile Number</span>
                    <span className="font-bold font-mono text-[#1F2933]">+91 {f.mobile}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Location</span>
                    <span className="font-semibold text-gray-800">{f.village}, {f.district}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Bank Account</span>
                    <span className="font-mono text-gray-700">•••• •••• {f.bankAccountMasked}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">IFSC</span>
                    <span className="font-mono text-gray-700">{f.ifscMasked}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <Link
                    to="/helpdesk/book-slot"
                    className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-1.5 rounded-xs font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Book Procurement Slot for Farmer →</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
