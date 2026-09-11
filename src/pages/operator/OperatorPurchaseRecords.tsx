import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { PurchaseRecord } from '../../types';
import { PrintableReceipt } from '../../components/ui/PrintableReceipt';
import { Badge } from '../../components/ui/Badge';
import { FileText, Printer, Search, CheckCircle2 } from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';

export const OperatorPurchaseRecords: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPurchases(StorageService.getPurchases());
  }, []);

  const filtered = purchases.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.purchaseRef.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      p.cropName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Mandi Procurement Records & J-Forms
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Procurement Receipts Archive (खरीद रसीद अभिलेख)
        </h1>
        <p className="text-gray-600 text-xs">
          Historical log of all issued weighing slips and official Government purchase certificates.
        </p>
      </div>

      {/* Selected Purchase Receipt Preview */}
      {selectedPurchase && (
        <div className="bg-white border-2 border-[#123B5D] p-5 rounded-xs shadow-md space-y-4">
          <div className="flex justify-between items-center border-b pb-2 border-gray-200">
            <h3 className="font-bold text-sm text-[#123B5D]">
              Purchase Receipt Preview: {selectedPurchase.purchaseRef}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedPurchase(null)}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕ Close Preview
            </button>
          </div>

          <PrintableReceipt purchase={selectedPurchase} />
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs shadow-2xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Purchase Ref (e.g. PUR-2026-9041), farmer name, or crop..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Purchase Ref</th>
                <th className="py-2.5 px-3">Farmer</th>
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Net Quantity</th>
                <th className="py-2.5 px-3">MSP Rate</th>
                <th className="py-2.5 px-3">Total Sanctioned</th>
                <th className="py-2.5 px-3">Recorded At</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#123B5D]">
                    {p.purchaseRef}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#1F2933]">
                    {p.farmerName}
                  </td>
                  <td className="py-2.5 px-3">{p.cropName}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">{p.netQuantityQuintals} qtl</td>
                  <td className="py-2.5 px-3 font-mono text-gray-600">₹{p.ratePerQuintal} / qtl</td>
                  <td className="py-2.5 px-3 font-bold text-[#18794E]">
                    {formatCurrencyINR(p.totalAmount)}
                  </td>
                  <td className="py-2.5 px-3 text-gray-400 font-mono text-[10px]">
                    {p.recordedAt}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedPurchase(p)}
                      className="bg-gray-100 hover:bg-gray-200 text-[#123B5D] px-2.5 py-1 rounded-xs font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>View Slip</span>
                    </button>
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
