import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { PaymentRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { CreditCard, CheckCircle2, Clock, Send, ShieldCheck } from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';

export const OperatorPaymentUpdates: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    setPayments(StorageService.getPayments());
  }, []);

  return (
    <div className="space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Mandi PFMS Electronic Gateway
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Electronic Payment File Dispatch (भुगतान संचरण)
        </h1>
        <p className="text-gray-600 text-xs">
          Automatic digital transmission of signed weighbridge purchase records to the Treasury DBT gateway.
        </p>
      </div>

      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Purchase Ref</th>
                <th className="py-2.5 px-3">Farmer</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Bank UTR Ref</th>
                <th className="py-2.5 px-3">Transmission Timestamp</th>
                <th className="py-2.5 px-3 text-right">PFMS Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => {
                const isCredited = p.status === 'credited' && Boolean(p.paymentRef);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#123B5D]">
                      {p.purchaseRef}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#1F2933]">
                      {p.farmerName}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#18794E]">
                      {formatCurrencyINR(p.amount)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      {p.paymentRef || <span className="text-gray-400 italic">Processing with Host Bank</span>}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-gray-500 text-[10px]">
                      {p.initiatedAt}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge variant={isCredited ? 'success' : 'warning'}>
                        {isCredited ? 'CREDITED TO FARMER' : 'TRANSMITTED TO PFMS'}
                      </Badge>
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
