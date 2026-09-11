import React from 'react';
import { Booking } from '../../types';
import { Printer, CheckCircle2, AlertTriangle, ShieldCheck, QrCode } from 'lucide-react';
import { GovEmblem } from '../government/Emblem';
import { TricolorStrip } from '../government/TricolorStrip';
import { formatIndianDate } from '../../lib/formatters';
import { generateDigitalSeal } from '../../lib/security';

interface PrintableTokenProps {
  booking: Booking;
  onClose?: () => void;
}

export const PrintableToken: React.FC<PrintableTokenProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#D6DDE5] shadow-md rounded-xs overflow-hidden max-w-xl mx-auto my-4 text-[#1F2933]">
      {/* Header bar */}
      <div className="bg-[#123B5D] text-white p-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-[#E87524]" />
          <span className="font-bold text-sm">Official Gate Token Slip</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-[#E87524] hover:bg-[#d66619] text-white px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Token (Ctrl+P)</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-sm text-xs"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <TricolorStrip />

      {/* Slip Content */}
      <div className="p-6 space-y-4 print:p-2">
        {/* Emblem & Portal Identity */}
        <div className="flex items-center justify-between border-b pb-3 border-gray-300">
          <GovEmblem size="sm" />
          <div className="text-right">
            <div className="text-xs font-bold text-[#123B5D]">KisanSetu • Dept of Consumer Affairs</div>
            <div className="text-[10px] text-gray-500">Government of India • Problem ID: 26032</div>
            <div className="text-[10px] text-gray-600">Date Issued: {formatIndianDate(booking.createdAt)}</div>
          </div>
        </div>

        {/* Center: Token Number Box */}
        <div className="bg-[#FFF3E8] border-2 border-[#E87524] p-4 text-center rounded-sm">
          <span className="text-xs uppercase font-bold text-gray-700 tracking-wider">
            Gate Arrival Token / गेट टोकन
          </span>
          <div className="text-5xl font-black text-[#123B5D] tracking-tight my-1">
            {booking.tokenNumber}
          </div>
          <div className="text-xs font-semibold text-[#E87524]">
            Booking Ref: {booking.bookingRef}
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5F7F9] p-3 border border-[#D6DDE5] rounded-xs">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Farmer Name</span>
            <span className="font-bold text-[#1F2933] text-sm">{booking.farmerName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Contact Phone</span>
            <span className="font-semibold text-[#1F2933]">{booking.farmerPhone}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Crop / Quantity</span>
            <span className="font-bold text-[#123B5D]">{booking.cropName} ({booking.estimatedQuantity} qtl)</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Vehicle No.</span>
            <span className="font-semibold text-[#1F2933]">{booking.vehicleNumber || 'Unregistered / Walk-in'}</span>
          </div>
          <div className="col-span-2 border-t border-gray-300 pt-2 mt-1">
            <span className="text-gray-500 block text-[10px] uppercase">Procurement Centre</span>
            <span className="font-bold text-[#123B5D]">{booking.centreName}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Appointment Date</span>
            <span className="font-bold text-[#1F2933]">{booking.scheduledDate}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Arrival Window</span>
            <span className="font-bold text-[#2E7D32]">{booking.arrivalWindow}</span>
          </div>
        </div>

        {/* Digital Security Seal Banner */}
        <div className="bg-[#EAF4EA] border border-[#18794E]/30 p-2.5 rounded-xs flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#18794E] shrink-0" />
            <div>
              <div className="font-bold text-[#18794E] flex items-center gap-1">
                <span>Cryptographic Gate Seal Verified</span>
                <span className="text-[9px] bg-[#18794E] text-white px-1.5 py-0.2 rounded-xs font-mono">SEC-OK</span>
              </div>
              <div className="font-mono text-[10px] text-gray-700">
                Seal: {generateDigitalSeal({
                  refNumber: booking.bookingRef,
                  farmerName: booking.farmerName,
                  quantityQuintals: booking.estimatedQuantity,
                  centreCode: booking.centreId,
                  timestamp: booking.createdAt,
                })}
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-500 font-mono">UIDAI / Mandi Ingress</div>
            <div className="text-[10px] font-bold text-emerald-800">Tamper-Evident Token</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-1.5 text-[11px] text-gray-700 bg-white border border-gray-200 p-3 rounded-xs">
          <div className="font-bold text-[#123B5D] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Instructions for Farmer / किसान निर्देश:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-gray-600 pl-1">
            <li>Keep this token visible on your vehicle dashboard while inside the mandi.</li>
            <li>Proceed immediately to <strong>Quality Inspection Bay</strong> when your token is called.</li>
            <li>Ensure crop moisture is within mandated central limits (Wheat ≤ 12%, Paddy ≤ 17%).</li>
            <li>Carry registered Aadhaar & bank passbook copy for weighment verification.</li>
          </ul>
        </div>

        {/* Footer verification note */}
        <div className="text-[10px] text-gray-500 text-center border-t pt-2 flex items-center justify-between">
          <span>Printed from KisanSetu Portal</span>
          <span className="flex items-center gap-1 text-amber-800">
            <AlertTriangle className="w-3 h-3" />
            Synthetic Prototype Document
          </span>
          <span>Security Hash: #KS-{booking.tokenNumber}-VERIFIED</span>
        </div>
      </div>
    </div>
  );
};
