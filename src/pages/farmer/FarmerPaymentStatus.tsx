import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { PaymentRecord, PurchaseRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Landmark,
  Building2
} from 'lucide-react';
import { formatCurrencyINR, formatIndianDate } from '../../lib/formatters';

export const FarmerPaymentStatus: React.FC = () => {
  const { activeFarmer } = useApp();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (!activeFarmer) return;
    setPayments(StorageService.getPaymentsByFarmer(activeFarmer.id));
  }, [activeFarmer]);

  // Payment 5-step timeline logic
  const getTimelineSteps = (pay: PaymentRecord) => {
    const verifiedTime = pay.stageTimestamps.credited || pay.verifiedAt || pay.creditedAt;
    const isCredited = pay.status === 'credited' && Boolean(pay.paymentRef && verifiedTime);
    const isBankVerif = pay.status === 'processing' || isCredited;
    const isInstructionSubmitted = pay.status === 'submitted' || isBankVerif;
    const isApproved = pay.status !== 'awaiting_approval';

    return [
      {
        title: 'Purchase Recorded',
        desc: 'Mandi digital weighbridge slip issued.',
        isDone: true,
      },
      {
        title: 'Treasury Sanction',
        desc: 'Verified by District Procurement Officer.',
        isDone: isApproved,
      },
      {
        title: 'Payment Instruction Submitted',
        desc: 'Electronic file pushed to PFMS portal.',
        isDone: isInstructionSubmitted,
      },
      {
        title: 'Bank Verification',
        desc: 'Aadhaar mapper & IFSC routing clearance.',
        isDone: isBankVerif,
      },
      {
        title: 'Direct Amount Credited',
        desc: isCredited ? `Ref: ${pay.paymentRef} on ${verifiedTime}` : 'Awaiting Central Bank credit confirmation.',
        isDone: isCredited,
        isStrictCredited: isCredited,
      },
    ];
  };

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Title */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Public Financial Management System (PFMS) Integration
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Direct Benefit Transfer (DBT) Payment Status (भुगतान स्थिति)
        </h1>
        <p className="text-gray-600 text-xs">
          Direct bank transfer tracking adhering to government standards. Amount is marked credited only upon receipt of official UTR bank reference.
        </p>
      </div>

      {/* Masked Bank Account Dossier Card */}
      {activeFarmer && (
        <div className="bg-[#EAF4EA] border border-[#18794E]/40 p-4 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#18794E] text-white flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#18794E] uppercase tracking-wider block">
                Aadhaar Seeded DBT Receiving Account
              </span>
              <div className="font-bold text-sm text-[#123B5D]">
                State Bank of India (SBI) • Account No: <span className="font-mono">•••• •••• {activeFarmer.bankAccountMasked}</span>
              </div>
              <div className="text-[11px] text-gray-600">
                IFSC: <strong className="font-mono">{activeFarmer.ifscMasked}</strong> • Verification Status: <strong className="text-[#18794E]">Verified (Active)</strong>
              </div>
            </div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xs border border-[#18794E]/30 text-[#18794E] font-bold text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Intermediary Mandate</span>
          </div>
        </div>
      )}

      {/* Payment Transactions List */}
      {payments.length === 0 ? (
        <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
          <CreditCard className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-semibold">No DBT payment records generated yet.</p>
          <p className="text-gray-500 text-[11px]">Payments are initiated automatically after digital procurement weighment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((pay) => {
            const steps = getTimelineSteps(pay);
            const isCredited = pay.status === 'credited' && Boolean(pay.paymentRef);
            return (
              <div
                key={pay.id}
                className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden space-y-4"
              >
                {/* Header */}
                <div className="bg-[#123B5D] text-white p-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#E87524] uppercase font-bold tracking-wider">
                      Purchase Order: {pay.purchaseRef}
                    </span>
                    <h3 className="font-bold text-sm">
                      Sanctioned Amount: {formatCurrencyINR(pay.amount)}
                    </h3>
                  </div>
                  <div>
                    <Badge variant={isCredited ? 'success' : 'warning'} size="md">
                      {isCredited ? 'AMOUNT CREDITED TO BANK' : 'PAYMENT INSTRUCTION SUBMITTED'}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-6">
                  {/* Strict 5-Step Payment Timeline */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Government DBT Clearance Progression
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                      {steps.map((st, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xs border text-left space-y-1 ${
                            st.isDone
                              ? 'bg-[#EAF4EA] border-[#18794E]/40 text-[#18794E]'
                              : 'bg-[#F5F7F9] border-[#D6DDE5] text-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {st.isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-[#18794E] shrink-0" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                            )}
                            <span className="font-bold text-[11px] leading-tight">{st.title}</span>
                          </div>
                          <p className="text-[10px] text-gray-600 leading-snug">{st.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transaction Metadata Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F7F9] p-3.5 border border-[#D6DDE5] rounded-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Bank Transaction Reference (UTR)</span>
                      <span className="font-bold text-[#123B5D] text-xs font-mono block">
                        {pay.paymentRef || 'Pending Bank Confirmation'}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Initiated Timestamp</span>
                      <span className="font-medium text-[#1F2933] text-xs block">
                        {pay.initiatedAt || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Bank Credit Timestamp</span>
                      <span className="font-bold text-[#18794E] text-xs block">
                        {pay.creditedAt || 'Processing in Treasury'}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Commodity</span>
                      <span className="font-bold text-[#1F2933] text-xs block">
                        Wheat ({pay.amount > 0 ? (pay.amount / 2275).toFixed(1) : 0} qtl)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
