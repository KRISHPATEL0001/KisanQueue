import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileKey, 
  Server, 
  CheckCircle2, 
  X, 
  AlertTriangle,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { SECURITY_PROTOCOLS } from '../../lib/security';
import { GovEmblem } from '../government/Emblem';

interface SecurityProtocolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityProtocolsModal: React.FC<SecurityProtocolsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xl max-w-2xl w-full p-6 space-y-5 text-xs animate-in fade-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <GovEmblem size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#123B5D]">
                  Security Architecture & Cyber Protocols
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  CERT-In Compliant
                </span>
              </div>
              <p className="text-gray-500 text-[11px]">
                National Procurement & Food Security Infrastructure Standards (सुरक्षा नियम एवं नीतियां)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Diagnostics Card */}
        <div className="bg-[#123B5D] text-white p-4 rounded-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 p-2.5 rounded-xs space-y-1">
            <div className="text-[10px] uppercase text-gray-300 font-bold">Transport Layer</div>
            <div className="font-mono font-bold text-xs text-emerald-400 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS 1.3 / 256-Bit</span>
            </div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xs space-y-1">
            <div className="text-[10px] uppercase text-gray-300 font-bold">Input Sanitizer</div>
            <div className="font-mono font-bold text-xs text-emerald-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active (XSS/SQLi)</span>
            </div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xs space-y-1">
            <div className="text-[10px] uppercase text-gray-300 font-bold">Bot Protection</div>
            <div className="font-mono font-bold text-xs text-emerald-400 flex items-center justify-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Distorted Captcha</span>
            </div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xs space-y-1">
            <div className="text-[10px] uppercase text-gray-300 font-bold">Audit Integrity</div>
            <div className="font-mono font-bold text-xs text-emerald-400 flex items-center justify-center gap-1">
              <FileKey className="w-3.5 h-3.5" />
              <span>Digital Sealed</span>
            </div>
          </div>
        </div>

        {/* Protocols Detailed Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-[#E87524]">
            Statutory Compliance & Security Mandates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Rule 1 */}
            <div className="p-3 border border-[#CBD5E1] rounded-xs bg-[#F8FAFC] space-y-1">
              <div className="font-bold text-[#123B5D] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#123B5D]" />
                <span>1. Aadhaar Data Masking (Sec. 29)</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                In strict compliance with Aadhaar Act 2016, all 12-digit UID numbers are truncated and masked (XXXX-XXXX-1234). No core biometric records are ever stored on procurement yard databases.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-3 border border-[#CBD5E1] rounded-xs bg-[#F8FAFC] space-y-1">
              <div className="font-bold text-[#123B5D] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>2. Brute-Force Rate Limiting</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Client login attempts and OTP requests are capped at 4 sequential trials. Exceeding triggers an automated 60-second cool-down lock to defeat credential-stuffing and automated bots.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-3 border border-[#CBD5E1] rounded-xs bg-[#F8FAFC] space-y-1">
              <div className="font-bold text-[#123B5D] flex items-center gap-1.5">
                <FileKey className="w-3.5 h-3.5 text-[#E87524]" />
                <span>3. Tamper-Evident J-Form Seals</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Every weighment record and purchase receipt is timestamped and stamped with an authentic cryptographic HMAC verification seal (<code className="text-[10px] bg-gray-200 px-1 py-0.5 rounded-xs">SEAL-GOV-XXXXXXXX</code>).
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-3 border border-[#CBD5E1] rounded-xs bg-[#F8FAFC] space-y-1">
              <div className="font-bold text-[#123B5D] flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-700" />
                <span>4. Immutable Audit Trail</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Every administrative action—including gate check-in, moisture grading, weight tare adjustments, and DBT authorizations—generates a non-repudiable audit event log entry with role verification.
              </p>
            </div>
          </div>
        </div>

        {/* DPDP Act 2023 Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xs flex items-start gap-2 text-[11px]">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
          <div>
            <span className="font-bold">Digital Personal Data Protection (DPDP) Act 2023 Notice:</span>{' '}
            Farmer bank details and land survey numbers are used solely for direct MSP subsidy disbursements into Aadhaar-linked accounts via PFMS/NPCI.
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-[10px] text-gray-500 font-mono">
            Audit Ref: {SECURITY_PROTOCOLS.AUDIT_REF}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#123B5D] hover:bg-[#0e2c45] text-white rounded-xs font-bold text-xs transition-colors cursor-pointer"
          >
            Close Security Briefing
          </button>
        </div>
      </div>
    </div>
  );
};
