import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { GovEmblem } from '../../components/government/Emblem';
import { Printer, Download, FileSpreadsheet, Calendar, Building2, TrendingUp } from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';

export const OfficerReports: React.FC = () => {
  const centres = StorageService.getCentres();
  const purchases = StorageService.getPurchases();
  const payments = StorageService.getPayments();

  const totalQuintals = purchases.reduce((acc, p) => acc + p.netQuantityQuintals, 0);
  const totalSpend = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

  const handleDownloadCSV = () => {
    const headers = ['PurchaseRef', 'FarmerName', 'Crop', 'NetQuintals', 'MSP_Rate', 'TotalAmount', 'QualityGrade', 'Centre'];
    const rows = purchases.map(p => [
      p.purchaseRef,
      `"${p.farmerName}"`,
      p.cropName,
      p.netQuantityQuintals,
      p.ratePerQuintal,
      p.totalAmount,
      p.qualityGrade,
      `"${p.centreName}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'KisanSetu_Procurement_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Action Bar */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            Official Agricultural Gazette & Data Export
          </span>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Procurement Reports & Gazette Statements (विभागीय रिपोर्ट)
          </h1>
          <p className="text-gray-600 text-xs">
            Export comprehensive season tallies, mandi efficiency indices, and Treasury DBT settlements.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="bg-[#2E7D32] hover:bg-[#236327] text-white px-3.5 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-3.5 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Gazette Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-white border-2 border-gray-300 p-8 rounded-xs shadow-md space-y-6 max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="text-center space-y-2 border-b-2 border-gray-300 pb-4">
          <GovEmblem size="md" className="mx-auto" />
          <div>
            <div className="text-[11px] uppercase font-bold tracking-widest text-[#123B5D]">
              GOVERNMENT OF MAHARASHTRA • DEPARTMENT OF AGRICULTURE
            </div>
            <h2 className="text-lg font-black text-[#123B5D]">
              RABI / KHARIF PROCUREMENT CONSOLIDATED DIVISIONAL STATEMENT
            </h2>
            <div className="text-[10px] text-gray-500 font-mono">
              Report Generated: 10 September 2026 • Reference: GOM/AGR/DIV-PUNE/2026-99
            </div>
          </div>
        </div>

        {/* High-Level Executive Summary */}
        <div className="grid grid-cols-3 gap-4 bg-[#F5F7F9] p-4 border border-[#D6DDE5] rounded-xs text-center">
          <div>
            <span className="text-gray-500 uppercase text-[10px] font-bold block">Total Procurement Volume</span>
            <div className="text-lg font-black text-[#123B5D]">{totalQuintals} Quintals</div>
          </div>
          <div>
            <span className="text-gray-500 uppercase text-[10px] font-bold block">Total Sanctioned Payables</span>
            <div className="text-lg font-black text-[#18794E]">{formatCurrencyINR(totalSpend)}</div>
          </div>
          <div>
            <span className="text-gray-500 uppercase text-[10px] font-bold block">Participating Mandis</span>
            <div className="text-lg font-black text-[#123B5D]">{centres.length} APMC Yards</div>
          </div>
        </div>

        {/* Commodity Breakdown */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#123B5D] uppercase tracking-wider text-xs border-b pb-1">
            1. Procurement Intake by Commodity
          </h3>
          <table className="w-full text-left border-collapse border border-gray-300 text-[11px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Commodity</th>
                <th className="border border-gray-300 p-2">Central MSP Rate</th>
                <th className="border border-gray-300 p-2">Net Intake (qtl)</th>
                <th className="border border-gray-300 p-2">Gross Outlay (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-bold">Wheat (FAQ Grade)</td>
                <td className="border border-gray-300 p-2">₹2,275 / qtl</td>
                <td className="border border-gray-300 p-2 font-mono">22.40 qtl</td>
                <td className="border border-gray-300 p-2 font-mono font-bold text-[#18794E]">₹50,960</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-bold">Paddy (Common)</td>
                <td className="border border-gray-300 p-2">₹2,300 / qtl</td>
                <td className="border border-gray-300 p-2 font-mono">0.00 qtl</td>
                <td className="border border-gray-300 p-2 font-mono">₹0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Centre Efficiency Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-[#123B5D] uppercase tracking-wider text-xs border-b pb-1">
            2. Mandi Capacity & Yard Buffer Audit
          </h3>
          <table className="w-full text-left border-collapse border border-gray-300 text-[11px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Mandi Centre</th>
                <th className="border border-gray-300 p-2">District</th>
                <th className="border border-gray-300 p-2">Daily Cap</th>
                <th className="border border-gray-300 p-2">Safety Buffer</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {centres.map((c) => (
                <tr key={c.id}>
                  <td className="border border-gray-300 p-2 font-bold text-[#123B5D]">{c.name}</td>
                  <td className="border border-gray-300 p-2">{c.district}</td>
                  <td className="border border-gray-300 p-2 font-mono">{c.dailyCapacityQuintals} qtl</td>
                  <td className="border border-gray-300 p-2 font-mono">{c.operationalReserveQuintals} qtl (20%)</td>
                  <td className="border border-gray-300 p-2">
                    <span className={`font-bold ${c.isBookingPaused ? 'text-red-700' : 'text-[#18794E]'}`}>
                      {c.isBookingPaused ? 'Intake Paused' : 'Operational'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verification Signatures */}
        <div className="pt-8 border-t-2 border-gray-300 flex justify-between items-end text-center">
          <div className="space-y-1">
            <div className="border-b border-gray-400 w-44 mx-auto mb-1"></div>
            <span className="font-bold text-gray-700 block">District Quality Controller</span>
            <span className="text-[10px] text-gray-500 block">Pune Division</span>
          </div>

          <div className="space-y-1">
            <div className="border-b border-gray-400 w-44 mx-auto mb-1"></div>
            <span className="font-bold text-gray-700 block">Supervising Officer (IAS)</span>
            <span className="text-[10px] text-gray-500 block">Director of Agricultural Marketing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
