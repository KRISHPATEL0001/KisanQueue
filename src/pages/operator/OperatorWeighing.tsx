import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { Booking, PurchaseRecord } from '../../types';
import { PrintableReceipt } from '../../components/ui/PrintableReceipt';
import { 
  Scale, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  FileText, 
  CreditCard,
  Building2,
  AlertCircle,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';
import { validateWeight, generateDigitalSeal } from '../../lib/security';

export const OperatorWeighing: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  const [grossWeightKg, setGrossWeightKg] = useState<number>(5400);
  const [tareWeightKg, setTareWeightKg] = useState<number>(3150);

  const [generatedPurchase, setGeneratedPurchase] = useState<PurchaseRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const all = StorageService.getBookings();
    const readyForWeighing = all.filter(b => b.status === 'in_progress');
    setBookings(readyForWeighing);
    if (readyForWeighing.length > 0 && !selectedBookingId) {
      setSelectedBookingId(readyForWeighing[0].id);
    }
  }, []);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Calculations
  const netWeightKg = Math.max(0, grossWeightKg - tareWeightKg);
  const netQuintals = parseFloat((netWeightKg / 100).toFixed(2));

  // MSP Rate
  const crops = StorageService.getCrops();
  const cropInfo = crops.find(c => c.name.toLowerCase() === selectedBooking?.cropName.toLowerCase()) || crops[0];
  const mspRate = cropInfo ? cropInfo.mspRatePerQuintal : 2275;
  const totalAmount = Math.round(netQuintals * mspRate);

  const handleRecordWeighment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedBooking) return;

    // Strict Legal Metrology & Sanity Validation
    const wCheck = validateWeight(grossWeightKg, tareWeightKg);
    if (!wCheck.isValid) {
      setError(wCheck.message || 'Weighment validation failed.');
      return;
    }

    const res = StorageService.recordPurchase({
      bookingId: selectedBooking.id,
      farmerId: selectedBooking.farmerId,
      farmerName: selectedBooking.farmerName,
      farmerPhone: selectedBooking.farmerPhone,
      cropName: selectedBooking.cropName,
      grossWeightKg,
      tareWeightKg,
      netQuantityQuintals: netQuintals,
      ratePerQuintal: mspRate,
      moisturePercent: 11.4,
      foreignMatterPercent: 0.4,
      qualityGrade: 'A',
      qualityStatus: 'approved',
      inspectorName: 'Devendra Patil (Cert. #402)',
      centreName: selectedBooking.centreName,
      centreCode: 'PUNE-01',
    });

    if (res.success && res.purchase) {
      const seal = generateDigitalSeal({
        refNumber: res.purchase.purchaseRef,
        farmerName: res.purchase.farmerName,
        quantityQuintals: res.purchase.netQuantityQuintals,
        centreCode: 'PUNE-01',
        timestamp: new Date().toISOString(),
      });

      StorageService.addAuditLog({
        userName: 'Devendra Patil (Weighbridge Operator)',
        userRole: 'operator',
        action: 'WEIGHMENT_COMMITTED',
        recordRef: res.purchase.purchaseRef,
        reason: `Gross: ${grossWeightKg}kg, Tare: ${tareWeightKg}kg -> Net: ${netQuintals}qtl. MSP Total: ₹${totalAmount}. Security Seal: ${seal}`,
      });

      setGeneratedPurchase(res.purchase);
    } else {
      setError(res.message || 'Failed to record weighment.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Electronic Weighbridge Terminal
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Electronic Weighment & Digital Purchase Slip (इलेक्ट्रॉनिक तौल पर्ची)
        </h1>
        <p className="text-gray-600 text-xs">
          Automatic gross and tare weighbridge integration. Emits official Government Purchase Slip and creates Treasury DBT payment file.
        </p>
      </div>

      {generatedPurchase ? (
        <div className="bg-[#EAF4EA] border-2 border-[#18794E] p-6 rounded-xs shadow-md space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#18794E] text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#18794E]">
              Weighment Complete – Purchase Slip {generatedPurchase.purchaseRef} Issued
            </h2>
            <p className="text-gray-700 mt-1">
              Net Weight: <strong>{generatedPurchase.netQuantityQuintals} qtl</strong> • Sanctioned Total: <strong>{formatCurrencyINR(generatedPurchase.totalAmount)}</strong>
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Payment instruction file has been generated and dispatched to Treasury PFMS.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Purchase Slip (J-Form)</span>
            </button>
          </div>

          <div className="pt-4 text-left">
            <PrintableReceipt purchase={generatedPurchase} />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-5">
          {bookings.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Scale className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-gray-600 font-semibold">No vehicles queued for weighment.</p>
              <p className="text-gray-400 text-[11px]">Vehicles must complete quality inspection before weighbridge entry.</p>
            </div>
          ) : (
            <form onSubmit={handleRecordWeighment} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Select Token */}
              <div className="space-y-1">
                <label className="font-bold text-[#123B5D] block">
                  Select Active Vehicle on Weighbridge *
                </label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white font-bold text-xs text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      Token {b.tokenNumber} – {b.farmerName} ({b.cropName}) – Plate: {b.vehicleNumber || 'Unassigned'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBooking && (
                <div className="bg-[#F5F7F9] p-3.5 rounded-xs border border-[#D6DDE5] grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Farmer</span>
                    <span className="font-bold text-[#1F2933]">{selectedBooking.farmerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Commodity</span>
                    <span className="font-bold text-[#123B5D]">{selectedBooking.cropName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Government MSP</span>
                    <span className="font-bold text-[#18794E]">₹{mspRate} / qtl</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase">Vehicle Plate</span>
                    <span className="font-mono font-bold text-[#123B5D]">{selectedBooking.vehicleNumber || 'Gate Entry'}</span>
                  </div>
                </div>
              )}

              {/* Weight Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Gross Weight (Loaded Vehicle in Kg) *
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="500"
                    value={grossWeightKg}
                    onChange={(e) => setGrossWeightKg(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-gray-500 block">Weighed upon ingress</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Tare Weight (Empty Vehicle in Kg) *
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="100"
                    value={tareWeightKg}
                    onChange={(e) => setTareWeightKg(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-gray-500 block">Weighed after offloading</span>
                </div>
              </div>

              {/* Auto Calculated Net Metrics Box */}
              <div className="bg-[#EAF4EA] border border-[#18794E]/40 p-4 rounded-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-gray-600 block text-[10px] uppercase">Net Weight</span>
                  <span className="font-black text-base text-[#123B5D] font-mono">{netWeightKg} Kg</span>
                </div>

                <div>
                  <span className="text-gray-600 block text-[10px] uppercase">Accepted Volume</span>
                  <span className="font-black text-base text-[#18794E] font-mono">{netQuintals} Quintals</span>
                </div>

                <div>
                  <span className="text-gray-600 block text-[10px] uppercase">Total Payment Payable</span>
                  <span className="font-black text-base text-[#18794E]">{formatCurrencyINR(totalAmount)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#18794E] hover:bg-[#13623f] text-white py-3 rounded-xs font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Issue Government Purchase Receipt & Generate Treasury DBT File</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
