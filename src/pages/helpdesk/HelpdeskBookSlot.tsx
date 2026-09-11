import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { Farmer, ProcurementCentre, Booking } from '../../types';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { CalendarCheck, Printer, CheckCircle2, User, Building2 } from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';

export const HelpdeskBookSlot: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);

  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-09-12');
  const [arrivalWindow, setArrivalWindow] = useState('08:00 AM - 10:00 AM');
  const [estimatedQuantity, setEstimatedQuantity] = useState('25');

  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fList = StorageService.getFarmers();
    const cList = StorageService.getCentres();
    setFarmers(fList);
    setCentres(cList);
    if (fList.length > 0) setSelectedFarmerId(fList[0].id);
    if (cList.length > 0) setSelectedCentreId(cList[0].id);
  }, []);

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);
  const selectedCentre = centres.find(c => c.id === selectedCentreId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmer || !selectedCentre) return;

    const res = StorageService.createBooking({
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.mobile,
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      cropId: 'crop-wheat',
      cropName: 'Wheat',
      estimatedQuantity: Number(estimatedQuantity) || 20,
      scheduledDate: formatIndianDate(scheduledDate),
      arrivalWindow,
    });

    if (res.success && res.booking) {
      setCreatedBooking(res.booking);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Citizen Assistance Service
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Assisted Procurement Slot Reservation (स्लॉट बुकिंग सहायता)
        </h1>
        <p className="text-gray-600 text-xs">
          Select farmer, mandi destination, and time window on counter terminal and emit official printed token.
        </p>
      </div>

      {createdBooking ? (
        <div className="bg-[#EAF4EA] border-2 border-[#18794E] p-6 rounded-xs shadow-md space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#18794E] text-white flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#18794E]">
              Slot Booked – Token {createdBooking.tokenNumber} Assigned
            </h2>
            <p className="text-gray-700 mt-1">
              Booking Ref: <strong className="font-mono text-sm text-[#123B5D]">{createdBooking.bookingRef}</strong> for {createdBooking.farmerName}.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Token Slip for Farmer</span>
            </button>
          </div>

          <div className="pt-4 text-left">
            <PrintableToken booking={createdBooking} />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Select Registered Farmer *</label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.refNumber}) – {f.village}, {f.district} (+91 {f.mobile})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Select Procurement Mandi *</label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district}) – Daily Cap: {c.dailyCapacityQuintals} qtl
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Scheduled Arrival Date *</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Time Window Slot *</label>
                <select
                  value={arrivalWindow}
                  onChange={(e) => setArrivalWindow(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
                >
                  <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM (Early Batch)</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Mid Morning)</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM (Noon Batch)</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon Batch)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Estimated Load (Quintals) *</label>
              <input
                type="number"
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs shadow-xs cursor-pointer"
            >
              Reserve Slot & Issue Barcode Token
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
