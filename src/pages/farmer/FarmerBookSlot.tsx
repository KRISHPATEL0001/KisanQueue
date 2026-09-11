import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { CropInfo, ProcurementCentre, Booking } from '../../types';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { GovCaptcha } from '../../components/security/GovCaptcha';
import { 
  CalendarCheck, 
  Building2, 
  Scale, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  Info,
  Calendar,
  Truck,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';
import { 
  validateVehicleNumber, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetRateLimit,
  generateDigitalSeal,
  sanitizeInput 
} from '../../lib/security';

export const FarmerBookSlot: React.FC = () => {
  const { activeFarmer } = useApp();
  const navigate = useNavigate();

  const [crops, setCrops] = useState<CropInfo[]>([]);
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);

  const [selectedCropId, setSelectedCropId] = useState('crop-wheat');
  const [quantity, setQuantity] = useState<number>(20);
  const [selectedCentreId, setSelectedCentreId] = useState('centre-1');
  const [selectedDate, setSelectedDate] = useState('2026-09-10');
  const [selectedWindow, setSelectedWindow] = useState('09:00 AM - 11:00 AM');
  const [vehicleNumber, setVehicleNumber] = useState('MH12AB4321');

  // Security Captcha & Rate Limiting
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [digitalSeal, setDigitalSeal] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    setCrops(StorageService.getCrops());
    setCentres(StorageService.getCentres());
  }, []);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];
  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];

  // Capacity Math
  const dailyCap = selectedCentre?.dailyCapacityQuintals || 400;
  const reserveCap = selectedCentre?.operationalReserveQuintals || 80;
  const bookableCap = dailyCap - reserveCap; // e.g. 320
  const bookedToday = selectedCentre?.bookedTodayQuintals || 245;
  const remainingCap = Math.max(0, bookableCap - bookedToday); // e.g. 75
  const utilizationPct = Math.round((bookedToday / bookableCap) * 100);

  // Real-time capacity check
  useEffect(() => {
    setError(null);
    setWarning(null);

    if (selectedCentre?.isBookingPaused) {
      setError(`Bookings at ${selectedCentre.name} are currently paused: ${selectedCentre.pauseReason || 'Operational delay'}. Please choose an alternate centre.`);
      return;
    }

    if (quantity > remainingCap) {
      setError(`Requested quantity (${quantity} qtl) exceeds available bookable capacity (${remainingCap} qtl) for ${selectedCentre?.name}. Please reduce quantity or select an alternate centre.`);
    } else if (remainingCap <= 50 || utilizationPct >= 80) {
      setWarning(`Capacity nearing maximum threshold (${utilizationPct}% booked). Early arrival recommended.`);
    }
  }, [selectedCentre, quantity, remainingCap, utilizationPct]);

  const arrivalWindows = [
    { window: '08:00 AM - 10:00 AM', crowd: 'Moderate', available: true },
    { window: '10:00 AM - 12:00 PM', crowd: 'High (Peak)', available: true },
    { window: '12:00 PM - 02:00 PM', crowd: 'Low', available: remainingCap > 30 },
    { window: '02:00 PM - 04:00 PM', crowd: 'Low', available: remainingCap > 20 },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!activeFarmer) {
      setError('No active farmer account detected. Please register or log in.');
      return;
    }

    // Rate Limiting (Prevent automated slot reservation spam)
    const rateCheck = checkRateLimit(`book_slot_${activeFarmer.id}`, 6, 10, 2);
    if (!rateCheck.allowed) {
      setError(`Booking frequency limit reached. Please wait ${rateCheck.retryAfterSeconds} seconds before reserving another slot.`);
      return;
    }

    // Vehicle validation
    const cleanVehicle = vehicleNumber.replace(/\s/g, '').toUpperCase();
    const vCheck = validateVehicleNumber(cleanVehicle);
    if (!vCheck.isValid) {
      setFieldErrors({ vehicleNumber: vCheck.message || 'Invalid vehicle registration format.' });
      return;
    }

    if (quantity <= 0 || quantity > 500) {
      setError('Please enter a valid quantity between 1 and 500 Quintals.');
      return;
    }

    if (quantity > remainingCap) {
      setError(`Cannot confirm booking: Requested quantity exceeds remaining bookable capacity (${remainingCap} qtl).`);
      return;
    }

    // Mandatory Captcha check
    if (!isCaptchaValid) {
      setError('Please solve the visual/audio Captcha verification before confirming your arrival slot.');
      return;
    }

    setIsSubmitting(true);

    const res = StorageService.bookSlot({
      farmerId: activeFarmer.id,
      farmerName: activeFarmer.name,
      farmerPhone: activeFarmer.mobile,
      centreId: selectedCentre.id,
      cropId: selectedCrop.id,
      cropName: selectedCrop.name,
      estimatedQuantity: quantity,
      scheduledDate: formatIndianDate(selectedDate),
      arrivalWindow: selectedWindow,
      vehicleNumber: cleanVehicle,
    });

    setIsSubmitting(false);

    if (res.success && res.booking) {
      const seal = generateDigitalSeal({
        refNumber: res.booking.bookingRef,
        farmerName: res.booking.farmerName,
        quantityQuintals: res.booking.estimatedQuantity,
        centreCode: res.booking.centreId,
        timestamp: new Date().toISOString(),
      });

      setDigitalSeal(seal);
      setConfirmedBooking(res.booking);
      resetRateLimit(`book_slot_${activeFarmer.id}`);

      StorageService.addAuditLog({
        userName: activeFarmer.name,
        userRole: 'farmer',
        action: 'SLOT_BOOKED',
        recordRef: res.booking.bookingRef,
        reason: `Capacity slot booked for ${res.booking.cropName} (${res.booking.estimatedQuantity} qtl) with vehicle ${cleanVehicle}. Digital Seal: ${seal}`,
      });
    } else {
      recordFailedAttempt(`book_slot_${activeFarmer.id}`, 6, 10, 2);
      setError(res.message || 'Slot booking failed.');
    }
  };

  // Confirmation screen with full summary & token
  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
        <div className="bg-[#EAF4EA] border-2 border-[#18794E] p-6 rounded-xs shadow-md space-y-4 text-center">
          <div className="w-12 h-12 bg-[#18794E] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#18794E]">
              Procurement Slot Confirmed! / स्लॉट सफलतापूर्वक आरक्षित
            </h1>
            <p className="text-gray-700 mt-1">
              Your appointment has been registered at {confirmedBooking.centreName}.
            </p>
          </div>

          <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs text-left grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Booking Reference</span>
              <span className="font-bold text-[#123B5D] text-sm">{confirmedBooking.bookingRef}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Arrival Gate Token</span>
              <span className="font-black text-[#E87524] text-base">{confirmedBooking.tokenNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Date & Window</span>
              <span className="font-bold">{confirmedBooking.scheduledDate} ({confirmedBooking.arrivalWindow})</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Commodity / Quantity</span>
              <span className="font-bold">{confirmedBooking.cropName} – {confirmedBooking.estimatedQuantity} qtl</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Transport Vehicle</span>
              <span className="font-mono font-bold text-gray-800">{confirmedBooking.vehicleNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Security Digital Seal</span>
              <span className="font-mono text-[11px] font-bold text-emerald-800">{digitalSeal}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Token Slip</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer/queue-status')}
              className="bg-[#E87524] hover:bg-[#d66619] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Clock className="w-4 h-4" />
              <span>Go to Live Queue Tracker →</span>
            </button>
          </div>
        </div>

        <PrintableToken booking={confirmedBooking} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs pb-8">
      {/* Page Title Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            Capacity-Regulated Mandi Allocation
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono border border-emerald-300">
            <ShieldCheck className="w-3 h-3" />
            <span>Anti-Bot Shield Active</span>
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Book Procurement Slot (उपार्जन स्लॉट बुकिंग)
        </h1>
        <p className="text-gray-600 text-xs">
          Select crop, quantity, vehicle, and arrival time. Real-time capacity checks prevent yard congestion and vehicle demurrage.
        </p>
      </div>

      {error && (
        <NoticeBanner
          type="error"
          title="Booking Constraint Notice"
          message={error}
        />
      )}

      {warning && (
        <NoticeBanner
          type="warning"
          title="High Mandi Occupancy Alert"
          message={warning}
        />
      )}

      <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-5">
          {/* Step 1: Crop Selection & Quantity */}
          <div className="space-y-3 border-b border-gray-200 pb-4">
            <h2 className="font-bold text-[#123B5D] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#E87524]" />
              <span>1. Crop & Estimated Quantity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 block">Select Crop *</label>
                <select
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white font-medium focus:outline-hidden focus:border-[#123B5D]"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (MSP ₹{c.mspRatePerQuintal}/qtl)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 block">Quantity (Quintals) *</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Centre Selection */}
          <div className="space-y-3 border-b border-gray-200 pb-4">
            <h2 className="font-bold text-[#123B5D] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#2E7D32]" />
              <span>2. Eligible Procurement Centre</span>
            </h2>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">Choose Mandi Centre *</label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white font-medium focus:outline-hidden focus:border-[#123B5D]"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district}) – {c.isBookingPaused ? 'PAUSED' : `Cap: ${c.dailyCapacityQuintals} qtl`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Date, Arrival Window & Transport Vehicle */}
          <div className="space-y-3 border-b border-gray-200 pb-4">
            <h2 className="font-bold text-[#123B5D] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#123B5D]" />
              <span>3. Scheduled Date & Transport</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 block">Scheduled Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 block">
                  Carrier Vehicle Reg. (RTO No.) *
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={vehicleNumber}
                    maxLength={10}
                    onChange={(e) => {
                      const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      setVehicleNumber(v);
                      if (v.length >= 8) {
                        const check = validateVehicleNumber(v);
                        setFieldErrors(prev => ({ ...prev, vehicleNumber: check.isValid ? '' : (check.message || '') }));
                      }
                    }}
                    placeholder="MH12AB4321"
                    required
                    className={`w-full pl-9 pr-3 py-2 border rounded-xs font-mono uppercase font-bold focus:outline-hidden ${
                      fieldErrors.vehicleNumber ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                    }`}
                  />
                </div>
                {fieldErrors.vehicleNumber && <p className="text-[11px] text-red-600">{fieldErrors.vehicleNumber}</p>}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="font-semibold text-gray-700 block">
                Select 2-Hour Arrival Slot (आगमन समय) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {arrivalWindows.map((w) => (
                  <button
                    key={w.window}
                    type="button"
                    disabled={!w.available}
                    onClick={() => setSelectedWindow(w.window)}
                    className={`p-2.5 rounded-xs border text-left transition-colors cursor-pointer ${
                      selectedWindow === w.window
                        ? 'bg-[#123B5D] text-white border-[#123B5D] shadow-xs'
                        : w.available
                        ? 'bg-[#F5F7F9] hover:bg-gray-100 border-[#D6DDE5] text-gray-800'
                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-bold text-xs">{w.window}</div>
                    <div className="text-[10px] opacity-80">
                      Crowd Estimate: {w.crowd}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accessible Government Captcha Guard */}
          <GovCaptcha
            id="book-slot-captcha"
            onValidate={(valid) => setIsCaptchaValid(valid)}
          />

          <button
            type="submit"
            disabled={quantity > remainingCap || selectedCentre?.isBookingPaused || !isCaptchaValid || isSubmitting}
            className={`w-full py-3 rounded-xs font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              quantity > remainingCap || selectedCentre?.isBookingPaused || !isCaptchaValid || isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#E87524] hover:bg-[#d66619] text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>
              {isSubmitting 
                ? 'Securing Slot...' 
                : !isCaptchaValid 
                ? 'Enter Captcha to Confirm Slot' 
                : 'Confirm Capacity Slot & Generate Token'}
            </span>
          </button>
        </div>

        {/* Right Column: Capacity Transparency Meter */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
            <div className="border-b pb-2 border-gray-200">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Live Centre Capacity Status
              </span>
              <h3 className="font-bold text-sm text-[#123B5D]">
                {selectedCentre?.name}
              </h3>
              <div className="text-[11px] text-gray-500">{selectedCentre?.address}</div>
            </div>

            {/* Visual Capacity Meter Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold">
                <span>Booked: {bookedToday} qtl</span>
                <span>Limit: {bookableCap} qtl</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-xs overflow-hidden flex">
                <div 
                  className={`h-full transition-all ${
                    utilizationPct > 85 ? 'bg-red-600' : utilizationPct > 70 ? 'bg-amber-500' : 'bg-[#2E7D32]'
                  }`}
                  style={{ width: `${Math.min(100, utilizationPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>{utilizationPct}% Utilized</span>
                <span className="font-bold text-[#18794E]">{remainingCap} qtl Remaining</span>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="bg-[#F5F7F9] border border-[#D6DDE5] p-3 rounded-xs space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Mandi Capacity:</span>
                <span className="font-bold">{dailyCap} qtl</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Operational Reserve (Buffer):</span>
                <span>- {reserveCap} qtl</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-1 font-semibold text-[#123B5D]">
                <span>Public Bookable Capacity:</span>
                <span>{bookableCap} qtl</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Currently Booked:</span>
                <span>{bookedToday} qtl</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-1 font-bold text-[#18794E]">
                <span>Remaining Available:</span>
                <span className="text-sm">{remainingCap} qtl</span>
              </div>
            </div>

            {/* Alternate Centre Recommendation if full */}
            {(remainingCap < quantity || selectedCentre?.isBookingPaused) && (
              <div className="bg-[#FFF9DB] border border-[#B7791F]/40 p-3 rounded-xs space-y-1.5 text-[11px]">
                <div className="font-bold text-[#8C5815] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Recommended Alternate Mandis:</span>
                </div>
                {centres.filter(c => c.id !== selectedCentre.id && !c.isBookingPaused).slice(0, 2).map(alt => (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => setSelectedCentreId(alt.id)}
                    className="w-full text-left bg-white p-2 border border-amber-200 rounded-xs hover:border-[#123B5D] cursor-pointer mt-1"
                  >
                    <div className="font-bold text-[#123B5D]">{alt.name}</div>
                    <div className="text-gray-500">Available: {alt.dailyCapacityQuintals - alt.operationalReserveQuintals - alt.bookedTodayQuintals} qtl open</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
