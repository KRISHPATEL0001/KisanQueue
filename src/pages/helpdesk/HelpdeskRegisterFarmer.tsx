import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { User, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, Building } from 'lucide-react';
import { 
  sanitizeInput, 
  validateMobile, 
  validateIFSC, 
  validateBankAccount, 
  maskBankAccount, 
  generateDigitalSeal 
} from '../../lib/security';

export const HelpdeskRegisterFarmer: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [block, setBlock] = useState('Haveli');
  const [village, setVillage] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0001234');
  const [detectedBank, setDetectedBank] = useState('State Bank of India');
  const [cropName, setCropName] = useState('Wheat');
  const [estimatedQuintals, setEstimatedQuintals] = useState('40');

  const [registeredRef, setRegisteredRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const cleanName = sanitizeInput(name).trim();
    const cleanMobile = mobile.replace(/\D/g, '').slice(0, 10);
    const cleanVillage = sanitizeInput(village).trim();
    const cleanBlock = sanitizeInput(block).trim();
    const cleanDistrict = sanitizeInput(district).trim();
    const cleanAccount = bankAccount.replace(/\D/g, '');
    const cleanIfsc = ifsc.trim().toUpperCase();

    const errs: Record<string, string> = {};

    if (!cleanName || cleanName.length < 3) {
      errs.name = 'Farmer name must be at least 3 characters.';
    }

    const mCheck = validateMobile(cleanMobile);
    if (!mCheck.isValid) {
      errs.mobile = mCheck.message || 'Invalid 10-digit mobile.';
    }

    if (!cleanVillage) {
      errs.village = 'Village is required.';
    }

    const bCheck = validateBankAccount(cleanAccount);
    if (!bCheck.isValid) {
      errs.bankAccount = bCheck.message || 'Bank account must be 9-18 digits.';
    }

    const ifscCheck = validateIFSC(cleanIfsc);
    if (!ifscCheck.isValid) {
      errs.ifsc = ifscCheck.message || 'Invalid RBI IFSC code.';
    } else if (ifscCheck.bankName) {
      setDetectedBank(ifscCheck.bankName);
    }

    const qty = parseFloat(estimatedQuintals);
    if (isNaN(qty) || qty <= 0 || qty > 500) {
      errs.estimatedQuintals = 'Estimated volume must be between 1 and 500 Quintals.';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Please resolve all validation errors before completing enrollment.');
      return;
    }

    const newFarmer = StorageService.registerFarmer({
      name: cleanName,
      mobile: cleanMobile,
      village: cleanVillage,
      block: cleanBlock,
      district: cleanDistrict,
      state: 'Maharashtra',
      preferredLanguage: 'hi',
      bankAccountMasked: maskBankAccount(cleanAccount),
      ifscMasked: cleanIfsc,
      bankVerificationStatus: 'verified',
      registeredCrops: [
        {
          cropId: `crop-${cropName.toLowerCase()}`,
          cropName,
          estimatedQuintals: qty,
          harvestDate: '2026-09-01',
        },
      ],
    });

    const seal = generateDigitalSeal({
      refNumber: newFarmer.refNumber,
      farmerName: cleanName,
      quantityQuintals: qty,
      centreCode: 'HELPDESK-COUNTER',
      timestamp: new Date().toISOString(),
    });

    StorageService.addAuditLog({
      userName: 'Helpdesk Counter Operator #01',
      userRole: 'helpdesk',
      action: 'FARMER_REGISTRATION',
      recordRef: newFarmer.refNumber,
      reason: `Assisted farmer enrollment completed. Bank: ${detectedBank} (${maskBankAccount(cleanAccount)}). Seal: ${seal}`,
    });

    setRegisteredRef(newFarmer.refNumber);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Assisted Counter Service
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Assisted Farmer Master Registration (सहायक किसान पंजीकरण)
        </h1>
        <p className="text-gray-600 text-xs">
          Enroll visiting farmers without smartphones directly into the KisanSetu central database with validated DBT credentials.
        </p>
      </div>

      {registeredRef ? (
        <div className="bg-[#EAF4EA] border-2 border-[#18794E] p-6 rounded-xs shadow-md space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#18794E] text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#18794E]">Farmer Registered Successfully!</h2>
            <p className="text-gray-700 mt-1">
              Farmer Reference ID: <strong className="font-mono text-base text-[#123B5D]">{registeredRef}</strong>
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Profile has been verified with validated DBT bank account credentials.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/helpdesk/book-slot')}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Proceed to Book Slot for this Farmer →</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Farmer Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tukaram Shankar Shinde"
                  required
                  className={`w-full px-3 py-2 border rounded-xs text-xs focus:outline-hidden ${
                    fieldErrors.name ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.name && <p className="text-[11px] text-red-600">{fieldErrors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Mobile Number *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile"
                  required
                  className={`w-full px-3 py-2 border rounded-xs font-mono text-xs focus:outline-hidden ${
                    fieldErrors.mobile ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.mobile && <p className="text-[11px] text-red-600">{fieldErrors.mobile}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">District *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Block / Tehsil *</label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Village Name *</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Baramati Rural"
                  required
                  className={`w-full px-3 py-2 border rounded-xs text-xs focus:outline-hidden ${
                    fieldErrors.village ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.village && <p className="text-[11px] text-red-600">{fieldErrors.village}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Bank Account Number (9-18 Digits) *</label>
                <input
                  type="text"
                  maxLength={18}
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 300129491823"
                  required
                  className={`w-full px-3 py-2 border rounded-xs font-mono text-xs focus:outline-hidden ${
                    fieldErrors.bankAccount ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.bankAccount && <p className="text-[11px] text-red-600">{fieldErrors.bankAccount}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#1F2933] block">Bank IFSC Code *</label>
                  {detectedBank && (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{detectedBank}</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength={11}
                  value={ifsc}
                  onChange={(e) => {
                    const clean = e.target.value.toUpperCase();
                    setIfsc(clean);
                    const res = validateIFSC(clean);
                    if (res.isValid && res.bankName) {
                      setDetectedBank(res.bankName);
                    }
                  }}
                  required
                  className={`w-full px-3 py-2 border rounded-xs font-mono uppercase text-xs focus:outline-hidden ${
                    fieldErrors.ifsc ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.ifsc && <p className="text-[11px] text-red-600">{fieldErrors.ifsc}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Primary Commodity *</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
                >
                  <option value="Wheat">Wheat (गेंहू)</option>
                  <option value="Paddy">Paddy (धान)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Gram">Gram / Chana (चना)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Estimated Harvest (Quintals) *</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={estimatedQuintals}
                  onChange={(e) => setEstimatedQuintals(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-xs font-mono text-xs focus:outline-hidden ${
                    fieldErrors.estimatedQuintals ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.estimatedQuintals && <p className="text-[11px] text-red-600">{fieldErrors.estimatedQuintals}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs shadow-xs cursor-pointer"
            >
              Enroll Farmer & Generate Master ID
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
