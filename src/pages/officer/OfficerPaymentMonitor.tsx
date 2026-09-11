import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { PaymentRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  CreditCard, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Landmark,
  FileSpreadsheet
} from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';

export const OfficerPaymentMonitor: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState('all');
  const [reconciledMsg, setReconciledMsg] = useState<string | null>(null);

  useEffect(() => {
    setPayments(StorageService.getPayments());
  }, []);

  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const creditedAmount = payments.filter(p => p.status === 'credited').reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status !== 'credited').reduce((acc, p) => acc + p.amount, 0);

  const handleForceReconcile = (p: PaymentRecord) => {
    // Reconcile pending payment
    const updated = StorageService.reconcilePayment(p.id);
    setPayments(StorageService.getPayments());
    setReconciledMsg(`Payment ${p.purchaseRef} verified and marked credited with bank UTR.`);
    setTimeout(() => setReconciledMsg(null), 4000);
  };

  const filtered = payments.filter(p => {
    if (filter === 'credited') return p.status === 'credited';
    if (filter === 'pending') return p.status !== 'credited';
    return true;
  });

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Public Financial Management System (PFMS) Direct Settlement
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          DBT Payment Audit & Treasury Reconciliation (भुगतान निगरानी)
        </h1>
        <p className="text-gray-600 text-xs">
          Direct verification of farmer account transfers, UTR receipts, and Treasury electronic files.
        </p>
      </div>

      {reconciledMsg && (
        <div className="p-4 bg-[#EAF4EA] border border-[#18794E] rounded-xs flex items-center gap-2 text-[#18794E]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold">{reconciledMsg}</span>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-1">
          <span className="text-gray-500 uppercase text-[10px] font-bold">Total Sanctioned Payables</span>
          <div className="text-lg font-black text-[#123B5D]">{formatCurrencyINR(totalAmount)}</div>
          <span className="text-gray-400 text-[10px]">{payments.length} electronic payment batches</span>
        </div>

        <div className="bg-[#EAF4EA] border border-[#18794E]/40 p-4 rounded-xs shadow-2xs space-y-1">
          <span className="text-[#18794E] uppercase text-[10px] font-bold">Credited to Farmers (UTR Verified)</span>
          <div className="text-lg font-black text-[#18794E]">{formatCurrencyINR(creditedAmount)}</div>
          <span className="text-gray-600 text-[10px]">Zero intermediary deduction</span>
        </div>

        <div className="bg-[#FFF9DB] border border-amber-300 p-4 rounded-xs shadow-2xs space-y-1">
          <span className="text-amber-900 uppercase text-[10px] font-bold">In Bank Clearance Pipeline</span>
          <div className="text-lg font-black text-amber-900">{formatCurrencyINR(pendingAmount)}</div>
          <span className="text-gray-600 text-[10px]">Awaiting RBI / SBI host confirmation</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#D6DDE5] p-3 rounded-xs shadow-2xs flex gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xs font-bold ${
            filter === 'all' ? 'bg-[#123B5D] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All Transactions ({payments.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('credited')}
          className={`px-3 py-1.5 rounded-xs font-bold ${
            filter === 'credited' ? 'bg-[#18794E] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Credited (UTR Verified)
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-xs font-bold ${
            filter === 'pending' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Pending Treasury Clearance
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Purchase Ref</th>
                <th className="py-2.5 px-3">Farmer ID</th>
                <th className="py-2.5 px-3">Gross Amount</th>
                <th className="py-2.5 px-3">Bank UTR Reference</th>
                <th className="py-2.5 px-3">Initiation Timestamp</th>
                <th className="py-2.5 px-3">Clearance Status</th>
                <th className="py-2.5 px-3 text-right">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const isCredited = p.status === 'credited' && Boolean(p.paymentRef);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#123B5D]">
                      {p.purchaseRef}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-gray-600">
                      {p.farmerId}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#18794E]">
                      {formatCurrencyINR(p.amount)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs">
                      {p.paymentRef || <span className="text-gray-400 italic">Pending Bank Response</span>}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">
                      {p.initiatedAt}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={isCredited ? 'success' : 'warning'}>
                        {isCredited ? 'CREDITED (VERIFIED)' : 'PFMS PROCESSING'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {!isCredited ? (
                        <button
                          type="button"
                          onClick={() => handleForceReconcile(p)}
                          className="bg-[#18794E] hover:bg-[#13623f] text-white px-2.5 py-1 rounded-xs font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reconcile UTR</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#18794E] font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Settled</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
