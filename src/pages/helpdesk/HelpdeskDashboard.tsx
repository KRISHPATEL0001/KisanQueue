import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { 
  Users, 
  CalendarCheck, 
  Search, 
  Printer, 
  MessageSquareWarning, 
  Headphones, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HelpdeskDashboard: React.FC = () => {
  const farmers = StorageService.getFarmers();
  const bookings = StorageService.getBookings();

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="warning">ASSISTED CITIZEN SERVICE DESK</Badge>
          <span className="text-[11px] text-gray-500 font-mono">Terminal: HD-PUNE-CENTRAL</span>
        </div>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Kisan Sahayata Kendra Console (किसान सहायता केंद्र)
        </h1>
        <p className="text-gray-600 text-xs">
          Assisting non-digital farmers, elder agriculturalists, and walk-in citizens with registrations, token printing, and slot reservations.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Registered Farmers in Master"
          labelHi="कुल पंजीकृत किसान"
          value={String(farmers.length)}
          subtext="Aadhaar-seeded profiles"
          icon={<Users className="w-5 h-5 text-[#123B5D]" />}
        />
        <StatCard
          label="Assisted Bookings Issued"
          labelHi="सहायता से स्लॉट जारी"
          value={String(bookings.length)}
          subtext="Direct tokens printed"
          icon={<CalendarCheck className="w-5 h-5 text-[#2E7D32]" />}
          variant="success"
        />
        <StatCard
          label="Slips Printed Today"
          labelHi="आज मुद्रित टोकन"
          value="42 Slips"
          subtext="Counter print transactions"
          icon={<Printer className="w-5 h-5 text-[#E87524]" />}
          variant="highlight"
        />
        <StatCard
          label="Citizen Inquiries Handled"
          labelHi="नागरिक सहायता"
          value="118"
          subtext="Average resolution: 3 mins"
          icon={<Headphones className="w-5 h-5 text-indigo-700" />}
          variant="default"
        />
      </div>

      {/* Operational Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/helpdesk/register-farmer"
          className="bg-white border-t-4 border-[#123B5D] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#123B5D] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#123B5D] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">New Farmer Assisted Registration</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Enroll a new farmer on spot using Aadhaar, bank passbook, and land 7/12 record.
          </p>
          <span className="text-[#123B5D] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Open Registration Form →
          </span>
        </Link>

        <Link
          to="/helpdesk/book-slot"
          className="bg-white border-t-4 border-[#2E7D32] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#2E7D32] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-green-50 text-[#2E7D32] flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Assisted Slot Booking</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Select preferred mandi and time window on behalf of a visiting farmer and print token.
          </p>
          <span className="text-[#2E7D32] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Book Slot for Farmer →
          </span>
        </Link>

        <Link
          to="/helpdesk/search-farmer"
          className="bg-white border-t-4 border-[#E87524] border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-[#E87524] space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-orange-50 text-[#E87524] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Farmer & Token Lookup</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Search farmer database by mobile number, Aadhaar reference, or vehicle plate.
          </p>
          <span className="text-[#E87524] font-bold text-xs inline-flex items-center gap-1 pt-1">
            Search Directory →
          </span>
        </Link>

        <Link
          to="/helpdesk/print-token"
          className="bg-white border-t-4 border-indigo-600 border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-indigo-600 space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">Re-Print Token Slip</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Re-issue lost or crumpled barcode slips for gate entry.
          </p>
          <span className="text-indigo-700 font-bold text-xs inline-flex items-center gap-1 pt-1">
            Print Token Slip →
          </span>
        </Link>

        <Link
          to="/helpdesk/complaints"
          className="bg-white border-t-4 border-red-600 border-x border-b border-[#D6DDE5] p-5 rounded-xs shadow-2xs hover:border-red-600 space-y-2 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-red-50 text-red-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#123B5D]">File Assisted Grievance</h3>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Lodge official complaints on behalf of illiterate or aggrieved farmers.
          </p>
          <span className="text-red-700 font-bold text-xs inline-flex items-center gap-1 pt-1">
            Lodge Citizen Complaint →
          </span>
        </Link>
      </div>
    </div>
  );
};
