import React from 'react';
import { PurchaseRecord, PaymentRecord } from '../../types';
import { Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { GovEmblem } from '../government/Emblem';
import { TricolorStrip } from '../government/TricolorStrip';
import { formatCurrencyINR, formatIndianDate } from '../../lib/formatters';

interface PrintableReceiptProps {
  purchase: PurchaseRecord;
  payment?: PaymentRecord;
  onClose?: () => void;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ purchase, payment, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#D6DDE5] shadow-lg rounded-xs overflow-hidden max-w-2xl mx-auto my-4 text-[#1F2933]">
      {/* Control bar */}
      <div className="bg-[#123B5D] text-white p-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-[#E87524]" />
          <span className="font-bold text-sm">Official Procurement Purchase Receipt</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-[#2E7D32] hover:bg-[#236327] text-white px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
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

      <div className="p-6 space-y-5 print:p-2">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-4 border-gray-300">
          <GovEmblem size="md" />
          <div className="text-right">
            <h2 className="text-base font-bold text-[#123B5D]">DEPARTMENT OF CONSUMER AFFAIRS</h2>
            <div className="text-xs text-gray-700">Central Agricultural MSP Procurement Scheme</div>
            <div className="text-xs font-semibold text-[#E87524] mt-0.5">
              Receipt No: {purchase.purchaseRef}
            </div>
            <div className="text-[11px] text-gray-500">
              Generated: {formatIndianDate(purchase.recordedAt)}
            </div>
          </div>
        </div>

        {/* Farmer & Centre Meta */}
        <div className="grid grid-cols-2 gap-4 bg-[#F5F7F9] p-4 border border-[#D6DDE5] rounded-xs text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Farmer Name</span>
            <span className="font-bold text-[#1F2933] text-sm">{purchase.farmerName}</span>
            <span className="block text-gray-600 mt-1">Booking Ref: {purchase.bookingRef}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase">Procurement Centre</span>
            <span className="font-bold text-[#123B5D] text-sm">{purchase.centreName}</span>
            <span className="block text-gray-600 mt-1">Weighing Operator: {purchase.operatorName}</span>
          </div>
        </div>

        {/* Weighment & MSP Table */}
        <div className="border border-[#D6DDE5] rounded-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#123B5D] text-white">
              <tr>
                <th className="p-2.5 font-semibold">Parameter / विवरण</th>
                <th className="p-2.5 font-semibold text-right">Recorded Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-2.5 font-medium">Commodity (Crop)</td>
                <td className="p-2.5 text-right font-bold text-[#123B5D]">{purchase.cropName}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2.5 font-medium">Gross Weight (Loaded Vehicle)</td>
                <td className="p-2.5 text-right font-mono">{purchase.grossWeightKg.toLocaleString()} kg</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Tare Weight (Empty Vehicle)</td>
                <td className="p-2.5 text-right font-mono">{purchase.tareWeightKg.toLocaleString()} kg</td>
              </tr>
              <tr className="bg-[#EAF4EA]">
                <td className="p-2.5 font-bold text-[#18794E]">Net Weight (Procured Grain)</td>
                <td className="p-2.5 text-right font-mono font-bold text-[#18794E]">
                  {purchase.netWeightKg.toLocaleString()} kg ({purchase.netQuantityQuintals} qtl)
                </td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium">Government Mandated MSP Rate</td>
                <td className="p-2.5 text-right font-bold">{formatCurrencyINR(purchase.ratePerQuintal)} / quintal</td>
              </tr>
              <tr className="bg-[#FFF3E8] text-[#123B5D] text-sm">
                <td className="p-3 font-bold">Total Procurement Value (Gross Amount)</td>
                <td className="p-3 text-right font-extrabold text-[#E87524] text-base">
                  {formatCurrencyINR(purchase.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Transfer Information */}
        <div className="bg-[#EAF4EA] border border-[#18794E]/40 p-3.5 rounded-xs text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#18794E]">
            <CheckCircle className="w-4 h-4" />
            <span>Direct Benefit Transfer (DBT) Status:</span>
          </div>
          <p className="text-gray-700">
            Payment has been initiated towards the registered bank account of {purchase.farmerName}.
            {payment?.paymentRef && (
              <span className="block font-semibold mt-0.5 text-[#123B5D]">
                Treasury Reference: {payment.paymentRef}
              </span>
            )}
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs border-t border-gray-200">
          <div className="space-y-1">
            <div className="h-12 border-b border-dashed border-gray-400 flex items-end justify-center pb-1">
              <span className="text-gray-400 italic text-[11px]">[Digital Weighbridge Stamp]</span>
            </div>
            <div className="font-semibold text-gray-800">{purchase.operatorName}</div>
            <div className="text-[10px] text-gray-500">Authorized Weighment Officer</div>
          </div>
          <div className="space-y-1">
            <div className="h-12 border-b border-dashed border-gray-400 flex items-end justify-center pb-1">
              <span className="text-gray-400 italic text-[11px]">[Farmer Signature / Thumb]</span>
            </div>
            <div className="font-semibold text-gray-800">{purchase.farmerName}</div>
            <div className="text-[10px] text-gray-500">Beneficiary Farmer</div>
          </div>
        </div>

        {/* Watermark notice */}
        <div className="text-center text-[10px] text-gray-500 border-t pt-2 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Valid for Mandi Gate Pass & Bank Reconciliation • KisanSetu System Generated</span>
        </div>
      </div>
    </div>
  );
};
