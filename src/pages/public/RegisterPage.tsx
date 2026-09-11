import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { useApp } from '../../context/AppContext';
import { Farmer } from '../../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  AlertCircle,
  Lock,
  Building,
  CreditCard,
  FileCheck,
  LayoutDashboard,
  UserCheck,
  LogOut
} from 'lucide-react';
import { GovEmblem } from '../../components/government/Emblem';
import { formatIndianDate } from '../../lib/formatters';
import { GovCaptcha } from '../../components/security/GovCaptcha';
import { 
  sanitizeInput, 
  validateMobile, 
  validateAadhaar, 
  formatAadhaarInput, 
  maskAadhaar, 
  validateIFSC, 
  validateBankAccount, 
  maskBankAccount,
  validateKhasra,
  validatePincode,
  generateDigitalSeal
} from '../../lib/security';

export const RegisterPage: React.FC = () => {
  const { setRole, setActiveFarmerId, isAuthenticated, activeFarmer, role, login } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [submittedFarmer, setSubmittedFarmer] = useState<Farmer | null>(null);
  const [digitalSeal, setDigitalSeal] = useState<string>('');

  // Step 1: Personal & Identity Details
  const [fullName, setFullName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredLang, setPreferredLang] = useState<'en' | 'hi'>('hi');
  const [village, setVillage] = useState('');
  const [block, setBlock] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('412210');
  const [khasraNumber, setKhasraNumber] = useState('104/2B');

  // Step 2: Crop Details
  const [cropId, setCropId] = useState('crop-wheat');
  const [cropName, setCropName] = useState('Wheat');
  const [estimatedQuintals, setEstimatedQuintals] = useState('25');
  const [harvestDate, setHarvestDate] = useState('2026-03-20');
  const [preferredCentre, setPreferredCentre] = useState('Greenfield Procurement Centre');

  // Step 3: Payment DBT Details
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifsc, setIfsc] = useState('SBIN0001420');
  const [detectedBank, setDetectedBank] = useState<string>('State Bank of India');

  // Step 4: Security Captcha & Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [dpdpAccepted, setDpdpAccepted] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // Validation Errors state
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const crops = StorageService.getCrops();
  const centres = StorageService.getCentres();

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    const cleanName = sanitizeInput(fullName).trim();
    if (!cleanName || cleanName.length < 3) {
      errs.fullName = 'Full Name must be at least 3 characters as per Aadhaar.';
    }

    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    if (!cleanAadhaar) {
      errs.aadhaar = '12-digit Aadhaar number is mandatory for DBT linkage.';
    } else {
      const aVal = validateAadhaar(cleanAadhaar);
      if (!aVal.isValid) {
        errs.aadhaar = aVal.message || 'Invalid Aadhaar number.';
      }
    }

    const mVal = validateMobile(mobile);
    if (!mVal.isValid) {
      errs.mobile = mVal.message || 'Invalid 10-digit mobile.';
    }

    if (!sanitizeInput(village).trim()) {
      errs.village = 'Village name is required.';
    }
    if (!sanitizeInput(block).trim()) {
      errs.block = 'Block / Tehsil is required.';
    }

    const pinVal = validatePincode(pincode);
    if (!pinVal.isValid) {
      errs.pincode = pinVal.message || 'Invalid PIN code.';
    }

    const khasraVal = validateKhasra(khasraNumber);
    if (!khasraVal.isValid) {
      errs.khasra = khasraVal.message || 'Invalid Khasra / Survey number.';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please resolve the highlighted validation errors before proceeding.');
      return false;
    }
    return true;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    const qtl = parseFloat(estimatedQuintals);
    if (isNaN(qtl) || qtl <= 0 || qtl > 500) {
      errs.estimatedQuintals = 'Estimated quantity must be between 1 and 500 Quintals.';
    }

    if (!harvestDate) {
      errs.harvestDate = 'Harvest readiness date is required.';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please check crop quantity and harvest date.');
      return false;
    }
    return true;
  };

  // Validate Step 3
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};

    const accVal = validateBankAccount(accountNumber);
    if (!accVal.isValid) {
      errs.accountNumber = accVal.message || 'Invalid bank account number (9-18 digits).';
    }

    if (accountNumber !== confirmAccount) {
      errs.confirmAccount = 'Bank account number and confirmation account number do not match.';
    }

    const ifscVal = validateIFSC(ifsc);
    if (!ifscVal.isValid) {
      errs.ifsc = ifscVal.message || 'Invalid RBI IFSC code.';
    } else if (ifscVal.bankName) {
      setDetectedBank(ifscVal.bankName);
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('Please correct your bank DBT account details.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!declarationAccepted) {
      setError('You must agree to the statutory declaration to submit.');
      return;
    }

    if (!dpdpAccepted) {
      setError('You must consent to Aadhaar seeding and DPDP Act 2023 data usage.');
      return;
    }

    if (!isCaptchaValid) {
      setError('Security verification: Please solve the visual/audio Captcha correctly.');
      return;
    }

    const cleanName = sanitizeInput(fullName).trim();
    const cleanVillage = sanitizeInput(village).trim();
    const cleanBlock = sanitizeInput(block).trim();
    const cleanDistrict = sanitizeInput(district).trim();
    const cleanState = sanitizeInput(state).trim();

    const newFarmer = StorageService.registerFarmer({
      name: cleanName,
      mobile: mobile.replace(/\D/g, '').slice(0, 10),
      preferredLanguage: preferredLang,
      village: cleanVillage,
      block: cleanBlock,
      district: cleanDistrict,
      state: cleanState,
      bankAccountMasked: maskBankAccount(accountNumber),
      ifscMasked: ifsc.trim().toUpperCase(),
      bankVerificationStatus: 'verified',
      registeredCrops: [
        {
          cropId,
          cropName,
          estimatedQuintals: parseFloat(estimatedQuintals),
          harvestDate: formatIndianDate(harvestDate),
        }
      ]
    });

    const seal = generateDigitalSeal({
      refNumber: newFarmer.refNumber,
      farmerName: newFarmer.name,
      quantityQuintals: parseFloat(estimatedQuintals),
      centreCode: 'REG-PORTAL-IN',
      timestamp: new Date().toISOString(),
    });

    StorageService.addAuditLog({
      userName: cleanName,
      userRole: 'farmer',
      action: 'FARMER_REGISTRATION',
      recordRef: newFarmer.refNumber,
      reason: `Digital registration completed with Aadhaar (${maskAadhaar(aadhaar)}), IFSC (${ifsc}), and Captcha seal: ${seal}`,
    });

    setDigitalSeal(seal);
    setSubmittedFarmer(newFarmer);
    login('farmer', newFarmer.id);
  };

  // Success view with print option
  if (submittedFarmer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-md p-6 space-y-5 text-xs">
          <div className="text-center space-y-2 border-b pb-4 border-gray-200">
            <div className="w-12 h-12 rounded-full bg-[#EAF4EA] text-[#18794E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-[#123B5D]">
              Registration Successful / पंजीकरण सफल
            </h1>
            <p className="text-gray-600">
              Your farmer profile has been securely recorded in the central procurement database with UIDAI DBT linkage.
            </p>
          </div>

          <div className="bg-[#FFF3E8] border-2 border-[#E87524] p-4 text-center rounded-xs space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Farmer Reference Number / किसान क्रमांक
            </span>
            <span className="text-2xl font-black text-[#123B5D] font-mono block my-1">
              {submittedFarmer.refNumber}
            </span>
            <span className="text-[11px] text-[#2E7D32] font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aadhaar ({maskAadhaar(aadhaar)}) • PFMS Direct Benefit Transfer Linked</span>
            </span>
            <div className="text-[10px] font-mono text-gray-500 pt-1">
              Tamper-Proof Seal: <strong>{digitalSeal}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#F5F7F9] p-3 border border-[#D6DDE5] rounded-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Farmer Name</span>
              <span className="font-bold text-[#1F2933]">{submittedFarmer.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Mobile Number</span>
              <span className="font-mono text-[#1F2933]">+91 {submittedFarmer.mobile}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Location</span>
              <span>{submittedFarmer.village}, {submittedFarmer.block}, {submittedFarmer.district}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Khasra / PIN</span>
              <span className="font-mono">{khasraNumber} • PIN: {pincode}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Registered Crop</span>
              <span className="font-semibold text-[#123B5D]">{cropName} ({estimatedQuintals} qtl)</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Bank Account (DBT)</span>
              <span className="font-mono">{detectedBank} ({submittedFarmer.bankAccountMasked})</span>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xs text-sky-900 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#123B5D]" />
              <span>Next Recommended Step: Arrival Slot Scheduling</span>
            </div>
            <p>You can now book a capacity-based arrival slot at your nearest procurement centre to avoid waiting in mandi yard queues.</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 bg-white border border-[#D6DDE5] hover:bg-gray-50 text-[#123B5D] py-2.5 rounded-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgement Slip</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer/book-slot')}
              className="flex-1 bg-[#E87524] hover:bg-[#d66619] text-white py-2.5 rounded-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Proceed to Book Slot →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* If already registered and logged in as a farmer */}
      {isAuthenticated && activeFarmer && (
        <div className="bg-[#EAF4EA] border-2 border-[#2E7D32] p-5 rounded-xs shadow-xs space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-base shrink-0">
              {activeFarmer.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#123B5D]">
                  Already Registered Farmer / आप पहले से पंजीकृत हैं
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-bold">
                  Active in Registry
                </span>
              </div>
              <p className="text-gray-700">
                You are currently logged in as <strong>{activeFarmer.name}</strong> (Farmer ID: <span className="font-mono font-bold text-[#123B5D]">{activeFarmer.refNumber}</span>).
                Your agricultural records, crop eligibility, and bank DBT linkages are active.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-2 bg-white/80 p-3 rounded-xs border border-green-200">
            <div>
              <span className="text-gray-500 text-[10px] uppercase block">Location</span>
              <span className="font-semibold text-gray-800">{activeFarmer.village}, {activeFarmer.district}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] uppercase block">Mobile</span>
              <span className="font-mono text-gray-800">+91 {activeFarmer.mobile}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px] uppercase block">Bank Account</span>
              <span className="font-mono text-gray-800">{activeFarmer.bankAccountMasked}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate('/farmer/dashboard')}
              className="flex-1 bg-[#2E7D32] hover:bg-[#236327] text-white py-2.5 px-4 rounded-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Farmer Dashboard (किसान डैशबोर्ड)</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer/profile')}
              className="bg-white hover:bg-gray-50 text-[#123B5D] border border-gray-300 py-2.5 px-3 rounded-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#123B5D]" />
              <span>View Registered Profile</span>
            </button>
          </div>
          <div className="text-[11px] text-gray-500 pt-1 text-center">
            Registering for another family member or new farm holding? Continue with the form below:
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-md overflow-hidden">
        {/* Title */}
        <div className="bg-[#123B5D] text-white p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
              Department of Consumer Affairs • Form 1A
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
              <Lock className="w-3 h-3" />
              <span>UIDAI / DPDP Act Compliant</span>
            </span>
          </div>
          <h1 className="text-xl font-bold">
            Farmer Procurement Registration (किसान पंजीकरण)
          </h1>
          <p className="text-xs text-gray-200">
            Step {step} of 4: {step === 1 ? 'Personal & Land Details' : step === 2 ? 'Crop Declaration' : step === 3 ? 'Bank & DBT Verification' : 'Statutory Review & Captcha'}
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 border-b border-gray-200 text-[11px] font-bold text-center bg-gray-50">
          <div className={`py-2 border-b-2 ${step >= 1 ? 'border-[#E87524] text-[#E87524] bg-white' : 'border-transparent text-gray-400'}`}>
            1. Personal
          </div>
          <div className={`py-2 border-b-2 ${step >= 2 ? 'border-[#E87524] text-[#E87524] bg-white' : 'border-transparent text-gray-400'}`}>
            2. Crop
          </div>
          <div className={`py-2 border-b-2 ${step >= 3 ? 'border-[#E87524] text-[#E87524] bg-white' : 'border-transparent text-gray-400'}`}>
            3. Bank DBT
          </div>
          <div className={`py-2 border-b-2 ${step >= 4 ? 'border-[#E87524] text-[#E87524] bg-white' : 'border-transparent text-gray-400'}`}>
            4. Review
          </div>
        </div>

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Personal Details & Land Verification */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">
                  Full Name (as per Aadhaar / Land Records) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className={`w-full px-3 py-2 border rounded-xs focus:outline-hidden ${
                    fieldErrors.fullName ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.fullName && <p className="text-[11px] text-red-600">{fieldErrors.fullName}</p>}
              </div>

              {/* Aadhaar and Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-[#1F2933] block">
                      Aadhaar Number (12 Digits) *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Sec. 29 Masked</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => {
                      const formatted = formatAadhaarInput(e.target.value);
                      setAadhaar(formatted);
                    }}
                    placeholder="2345 6789 0123"
                    maxLength={14}
                    required
                    className={`w-full px-3 py-2 border rounded-xs font-mono text-sm tracking-wider focus:outline-hidden ${
                      fieldErrors.aadhaar ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                  {fieldErrors.aadhaar && <p className="text-[11px] text-red-600">{fieldErrors.aadhaar}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Mobile Number (SMS token & alerts) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-gray-400 font-medium">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                      className={`w-full pl-10 pr-3 py-2 border rounded-xs font-mono focus:outline-hidden ${
                        fieldErrors.mobile ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                      }`}
                    />
                  </div>
                  {fieldErrors.mobile && <p className="text-[11px] text-red-600">{fieldErrors.mobile}</p>}
                </div>
              </div>

              {/* Village and Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">Village (गाँव) *</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Rampur"
                    required
                    className={`w-full px-3 py-2 border rounded-xs focus:outline-hidden ${
                      fieldErrors.village ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                  {fieldErrors.village && <p className="text-[11px] text-red-600">{fieldErrors.village}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">Block / Tehsil (तहसील) *</label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="e.g. Shirur"
                    required
                    className={`w-full px-3 py-2 border rounded-xs focus:outline-hidden ${
                      fieldErrors.block ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                  {fieldErrors.block && <p className="text-[11px] text-red-600">{fieldErrors.block}</p>}
                </div>
              </div>

              {/* District, State, PIN, and Khasra */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-[#1F2933] block">District *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-[#1F2933] block">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-[#1F2933] block">Postal PIN *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="412210"
                    className={`w-full px-3 py-2 border rounded-xs font-mono focus:outline-hidden ${
                      fieldErrors.pincode ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-[#1F2933] block">Khasra / Survey *</label>
                  <input
                    type="text"
                    value={khasraNumber}
                    onChange={(e) => setKhasraNumber(e.target.value)}
                    required
                    placeholder="104/2B"
                    className={`w-full px-3 py-2 border rounded-xs font-mono uppercase focus:outline-hidden ${
                      fieldErrors.khasra ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Crop Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">
                  Select Crop for Procurement (फसल) *
                </label>
                <select
                  value={cropId}
                  onChange={(e) => {
                    setCropId(e.target.value);
                    const selected = crops.find(c => c.id === e.target.value);
                    if (selected) setCropName(selected.name);
                  }}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D] bg-white font-medium"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.nameHi}) – MSP: ₹{c.mspRatePerQuintal}/qtl
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Estimated Quantity in Quintals (क्विंटल) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={estimatedQuintals}
                    onChange={(e) => setEstimatedQuintals(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded-xs font-mono focus:outline-hidden ${
                      fieldErrors.estimatedQuintals ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                  <span className="text-[10px] text-gray-500">1 Quintal = 100 Kilograms (Max: 500 qtl per registration)</span>
                  {fieldErrors.estimatedQuintals && <p className="text-[11px] text-red-600">{fieldErrors.estimatedQuintals}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Harvest Readiness Date *
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">
                  Preferred Procurement Centre (नज़दीकी मंडी) *
                </label>
                <select
                  value={preferredCentre}
                  onChange={(e) => setPreferredCentre(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D] bg-white"
                >
                  {centres.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.district}) – Daily Cap: {c.dailyCapacityQuintals} qtl
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Masked Bank Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#EAF4EA] p-3 rounded-xs border border-[#18794E]/40 text-[#18794E] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aadhaar-Seeded Direct Benefit Transfer (DBT) via PFMS</span>
                </div>
                <p className="text-[11px] text-gray-700">
                  Subsidies and minimum support price payments will be credited directly to this bank account. No middleman or agent commissions are permitted.
                </p>
              </div>

              {/* IFSC Code with Auto-Detection */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#1F2933] block">
                    Bank IFSC Code *
                  </label>
                  {detectedBank && (
                    <span className="text-[11px] text-[#123B5D] font-bold flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{detectedBank}</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={ifsc}
                  maxLength={11}
                  onChange={(e) => {
                    const clean = e.target.value.toUpperCase();
                    setIfsc(clean);
                    const res = validateIFSC(clean);
                    if (res.isValid && res.bankName) {
                      setDetectedBank(res.bankName);
                      setBankName(res.bankName);
                    }
                  }}
                  placeholder="SBIN0001420"
                  required
                  className={`w-full px-3 py-2 border rounded-xs font-mono uppercase focus:outline-hidden ${
                    fieldErrors.ifsc ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                  }`}
                />
                {fieldErrors.ifsc && <p className="text-[11px] text-red-600">{fieldErrors.ifsc}</p>}
              </div>

              {/* Bank Account Number & Confirmation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Bank Account Number (9-18 Digits) *
                  </label>
                  <input
                    type="password"
                    maxLength={18}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter account number"
                    required
                    className={`w-full px-3 py-2 border rounded-xs font-mono focus:outline-hidden ${
                      fieldErrors.accountNumber ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                  {fieldErrors.accountNumber && <p className="text-[11px] text-red-600">{fieldErrors.accountNumber}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Re-enter Account Number (Confirm) *
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    value={confirmAccount}
                    onChange={(e) => setConfirmAccount(e.target.value.replace(/\D/g, ''))}
                    placeholder="Re-enter to confirm"
                    required
                    className={`w-full px-3 py-2 border rounded-xs font-mono focus:outline-hidden ${
                      fieldErrors.confirmAccount ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                  {fieldErrors.confirmAccount && <p className="text-[11px] text-red-600">{fieldErrors.confirmAccount}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review, Captcha & Statutory Consent */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-4 rounded-xs space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#123B5D] border-b pb-1 border-gray-300">
                  Registration Summary & Verification Review
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Farmer Name</span>
                    <span className="font-bold text-[#1F2933]">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Aadhaar (Masked)</span>
                    <span className="font-mono text-emerald-800 font-bold">{maskAadhaar(aadhaar)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Mobile</span>
                    <span className="font-mono text-[#1F2933]">+91 {mobile}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Location</span>
                    <span>{village}, {block}, {district} ({state})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Khasra / Land Record</span>
                    <span className="font-mono">{khasraNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Crop / Quantity</span>
                    <span className="font-bold text-[#123B5D]">{cropName} – {estimatedQuintals} qtl</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Bank DBT Account</span>
                    <span className="font-mono">{detectedBank} ({maskBankAccount(accountNumber)})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Preferred Centre</span>
                    <span>{preferredCentre}</span>
                  </div>
                </div>
              </div>

              {/* Accessible Government Captcha */}
              <GovCaptcha
                id="register-page-captcha"
                onValidate={(valid) => setIsCaptchaValid(valid)}
              />

              {/* Official Declarations */}
              <div className="space-y-2">
                <div className="p-3 bg-[#FFF3E8] border border-[#E87524]/40 rounded-xs">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#E87524] rounded-xs border-gray-300 focus:ring-[#E87524]"
                    />
                    <span className="text-[11px] text-gray-800 leading-relaxed">
                      I hereby declare that the crop details entered above are true to the best of my knowledge and produced on my cultivated farmland. I consent to receive official SMS notifications for arrival scheduling, token calling, quality inspection, and DBT payment status.
                    </span>
                  </label>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dpdpAccepted}
                      onChange={(e) => setDpdpAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded-xs border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-emerald-950 leading-relaxed">
                      <strong>DPDP Act 2023 & Aadhaar Act Consent:</strong> I voluntarily provide my masked Aadhaar identity and bank details for Aadhaar-linked electronic DBT payment processing in compliance with Section 29 of the Aadhaar Act 2016.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-[#D6DDE5] rounded-xs text-gray-700 font-semibold hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!declarationAccepted || !dpdpAccepted || !isCaptchaValid}
                className="bg-[#E87524] hover:bg-[#d66619] disabled:opacity-50 text-white px-6 py-2.5 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Registration (प्रस्तुत करें)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
