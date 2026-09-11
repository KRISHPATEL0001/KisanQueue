import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { PurchaseRecord, PaymentRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { PrintableReceipt } from '../../components/ui/PrintableReceipt';
import { 
  FileCheck2, 
  Printer, 
  Scale, 
  Microscope, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Building2 
} from 'lucide-react';
import { formatCurrencyINR, formatIndianDate } from '../../lib/formatters';

export const FarmerProcurementStatus: React.FC = () => {
  const { activeFarmer } = useApp();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<PurchaseRecord | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  useEffect(() => {
    if (!activeFarmer) return;
    const records = StorageService.getPurchasesByFarmer(activeFarmer.id);
    setPurchases(records);
  }, [activeFarmer]);

  const handleOpenReceipt = (p: PurchaseRecord) => {
    const pay = StorageService.getPaymentByPurchaseId(p.id);
    setSelectedPurchaseWithPayment(p, pay || null);
  };

  const setSelectedPurchaseWithPayment = (p: PurchaseRecord, pay: PaymentRecord | null) => {
    setSelectedReceipt(p);
    setSelectedPayment(pay);
  };

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Page Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Official Weighment & Purchase Records
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Procurement Status & Digital Receipts (उपार्जन रसीदें)
        </h1>
        <p className="text-gray-600 text-xs">
          Verify certified quality moisture levels, gross and tare weighbridge metrics, and download signed electronic procurement receipts.
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
          <FileCheck2 className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-semibold">No procurement records recorded yet for this season.</p>
          <p className="text-gray-500 text-[11px]">Records appear automatically after mandi weighment completion.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((p) => {
            const pay = StorageService.getPaymentByPurchaseId(p.id);
            const isApproved = p.qualityStatus === 'approved';
            return (
              <div
                key={p.id}
                className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden"
              >
                {/* Header */}
                <div className="bg-[#F5F7F9] border-b border-[#D6DDE5] px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#123B5D] font-mono">
                      {p.purchaseRef}
                    </span>
                    <Badge variant={isApproved ? 'success' : 'warning'}>
                      {p.qualityStatus.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPurchaseWithPayment(p, pay || null)}
                      className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-3 py-1 rounded-xs font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Download Receipt (J-Form)</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Commodity</span>
                      <span className="font-bold text-xs text-[#123B5D]">{p.cropName}</span>
                      <span className="text-[10px] text-gray-500 block">Date: {p.date}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Weighbridge Net Weight</span>
                      <span className="font-bold text-xs text-[#1F2933]">{p.netQuantityQuintals} Quintals</span>
                      <span className="text-[10px] text-gray-500 block">Gross: {p.grossWeightKg}kg / Tare: {p.tareWeightKg}kg</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Government MSP Rate</span>
                      <span className="font-bold text-xs text-[#1F2933]">₹{p.ratePerQuintal} / qtl</span>
                      <span className="text-[10px] text-gray-500 block">Zero deductions applied</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Total Sanctioned Value</span>
                      <span className="font-bold text-sm text-[#18794E]">{formatCurrencyINR(p.totalAmount)}</span>
                      <span className="text-[10px] text-gray-500 block">DBT Instruction Created</span>
                    </div>
                  </div>

                  {/* Quality Inspection Breakdown Card */}
                  <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-3 rounded-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#123B5D]">
                      <span className="flex items-center gap-1.5">
                        <Microscope className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Certified Quality Parameters (गुणवत्ता रिपोर्ट)</span>
                      </span>
                      <span className="font-normal text-gray-500">Inspector ID: {p.inspectorName}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                      <div className="bg-white p-2 border border-gray-200 rounded-xs">
                        <span className="text-gray-500 block text-[10px]">Moisture Percentage</span>
                        <span className="font-bold text-xs text-[#123B5D]">{p.moisturePercent}%</span>
                        <span className="text-[9px] text-green-700 block">Max Permitted: 12.0%</span>
                      </div>
                      <div className="bg-white p-2 border border-gray-200 rounded-xs">
                        <span className="text-gray-500 block text-[10px]">Foreign Matter / Chaff</span>
                        <span className="font-bold text-xs text-[#123B5D]">{p.foreignMatterPercent}%</span>
                        <span className="text-[9px] text-green-700 block">Max Permitted: 0.75%</span>
                      </div>
                      <div className="bg-white p-2 border border-gray-200 rounded-xs">
                        <span className="text-gray-500 block text-[10px]">Quality Grade</span>
                        <span className="font-bold text-xs text-[#2E7D32]">Grade {p.qualityGrade} (FAQ)</span>
                        <span className="text-[9px] text-gray-500 block">Standard Quality</span>
                      </div>
                      <div className="bg-white p-2 border border-gray-200 rounded-xs">
                        <span className="text-gray-500 block text-[10px]">Moisture Meter ID</span>
                        <span className="font-bold text-xs font-mono text-gray-700">MM-PUNE-04</span>
                        <span className="text-[9px] text-gray-500 block">Calibrated 28-08-2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Digital Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedReceipt(null)}>
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <PrintableReceipt
              purchase={selectedReceipt}
              payment={selectedPayment || undefined}
              onClose={() => setSelectedReceipt(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
