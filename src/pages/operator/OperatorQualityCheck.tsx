import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { Booking, QualityStatus } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  Microscope, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  ShieldCheck, 
  Scale,
  AlertCircle
} from 'lucide-react';
import { sanitizeInput, generateDigitalSeal } from '../../lib/security';

export const OperatorQualityCheck: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  const [moisturePercent, setMoisturePercent] = useState<number>(11.4);
  const [foreignMatterPercent, setForeignMatterPercent] = useState<number>(0.4);
  const [qualityGrade, setQualityGrade] = useState<'A' | 'B' | 'C'>('A');
  const [inspectorNotes, setInspectorNotes] = useState('Standard Fair Average Quality (FAQ) certified.');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const all = StorageService.getBookings();
    // Filter bookings in in_progress or at quality inspection stage
    const inspectable = all.filter(b => b.status === 'in_progress');
    setBookings(inspectable);
    if (inspectable.length > 0 && !selectedBookingId) {
      setSelectedBookingId(inspectable[0].id);
    }
  }, []);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Moisture evaluation logic
  const isMoistureCompliant = moisturePercent <= 12.0;
  const isForeignMatterCompliant = foreignMatterPercent <= 0.75;

  let computedStatus: QualityStatus = 'approved';
  if (!isMoistureCompliant) {
    computedStatus = moisturePercent <= 14.0 ? 'requires_rechecking' : 'rejected';
  } else if (!isForeignMatterCompliant) {
    computedStatus = 'requires_rechecking';
  }

  const [error, setError] = useState<string | null>(null);

  const handleSaveQuality = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedBooking) return;

    if (moisturePercent < 5 || moisturePercent > 35) {
      setError('Moisture percentage must be between 5.0% and 35.0%.');
      return;
    }

    if (foreignMatterPercent < 0 || foreignMatterPercent > 15) {
      setError('Foreign matter percentage must be between 0.0% and 15.0%.');
      return;
    }

    const cleanNotes = sanitizeInput(inspectorNotes).trim();

    // Advance stage to WEIGHING if approved
    if (computedStatus === 'approved') {
      StorageService.updateQueueStage(selectedBooking.id, 'WEIGHING');
    }

    const seal = generateDigitalSeal({
      refNumber: selectedBooking.bookingRef,
      farmerName: selectedBooking.farmerName,
      quantityQuintals: selectedBooking.estimatedQuantity,
      centreCode: selectedBooking.centreId,
      timestamp: new Date().toISOString(),
    });

    StorageService.addAuditLog({
      userName: 'Quality Assay Officer #QA-88',
      userRole: 'operator',
      action: 'QUALITY_CERTIFICATION',
      recordRef: selectedBooking.bookingRef,
      reason: `Status: ${computedStatus.toUpperCase()}, Grade: ${qualityGrade}, Moisture: ${moisturePercent}%, Foreign: ${foreignMatterPercent}%. Remarks: ${cleanNotes}. Seal: ${seal}`,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Fair Average Quality (FAQ) Verification
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Grain Quality & Moisture Inspection (गुणवत्ता परीक्षण)
        </h1>
        <p className="text-gray-600 text-xs">
          Test and log laboratory grain samples according to Central Food Standards (Max 12.0% moisture for Wheat).
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#EAF4EA] border border-[#18794E] rounded-xs flex items-center gap-2 text-[#18794E]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">Quality parameters recorded successfully! Token advanced to weighbridge stage.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
          <Microscope className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-semibold">No active vehicles waiting for quality testing.</p>
          <p className="text-gray-400 text-[11px]">Check in arriving vehicles at the gate first.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-5">
          {/* Booking Selector */}
          <div className="space-y-1">
            <label className="font-bold text-[#123B5D] block">
              Select Vehicle / Token in Mandi Yard *
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white font-bold text-xs text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  Token {b.tokenNumber} – {b.farmerName} ({b.cropName}, {b.estimatedQuantity} qtl) – Vehicle: {b.vehicleNumber || 'Gate Entry'}
                </option>
              ))}
            </select>
          </div>

          {selectedBooking && (
            <form onSubmit={handleSaveQuality} className="space-y-5 pt-3 border-t border-gray-200">
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
                  <span className="text-gray-400 block text-[10px] uppercase">Declared Volume</span>
                  <span className="font-bold">{selectedBooking.estimatedQuantity} Quintals</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Vehicle Plate</span>
                  <span className="font-mono font-bold text-[#123B5D]">{selectedBooking.vehicleNumber || 'Unassigned'}</span>
                </div>
              </div>

              {/* Moisture & Foreign Matter Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Moisture Content (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5"
                    max="30"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-gray-500 block">FAQ Standard: ≤ 12.0%</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Foreign Matter / Chaff (%) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={foreignMatterPercent}
                    onChange={(e) => setForeignMatterPercent(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-gray-500 block">FAQ Standard: ≤ 0.75%</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Assigned Grade *
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white font-bold text-sm focus:outline-hidden focus:border-[#123B5D]"
                  >
                    <option value="A">Grade A (Premium FAQ)</option>
                    <option value="B">Grade B (Acceptable FAQ)</option>
                    <option value="C">Grade C (Marginal)</option>
                  </select>
                </div>
              </div>

              {/* Real-Time Moisture Evaluation Feedback */}
              <div className={`p-4 rounded-xs border space-y-1 ${
                computedStatus === 'approved'
                  ? 'bg-[#EAF4EA] border-[#18794E]/40 text-[#18794E]'
                  : computedStatus === 'requires_rechecking'
                  ? 'bg-[#FFF9DB] border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  {computedStatus === 'approved' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>Computed Quality Status: {computedStatus.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {computedStatus === 'approved'
                    ? 'Sample meets all Central Procurement Standards. Vehicle is approved for electronic weighbridge.'
                    : computedStatus === 'requires_rechecking'
                    ? 'Moisture or foreign matter slightly exceeds 12.0% threshold. Farmer may dry grains on mandi apron for re-testing.'
                    : 'Moisture exceeds permissible safe storage limit. Lot rejected per Food Corporation of India guidelines.'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">
                  Inspector Observation / Certification Remarks
                </label>
                <input
                  type="text"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-3 rounded-xs font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Certify Quality & Authorize Weighbridge Access</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
