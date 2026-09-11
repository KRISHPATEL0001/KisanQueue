import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { Sprout, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';

export const FarmerRegisterCrop: React.FC = () => {
  const { activeFarmer } = useApp();
  const navigate = useNavigate();

  const crops = StorageService.getCrops();

  const [cropId, setCropId] = useState('crop-paddy');
  const [estimatedQuintals, setEstimatedQuintals] = useState('30');
  const [harvestDate, setHarvestDate] = useState('2026-10-15');
  const [submitted, setSubmitted] = useState(false);

  const selectedCrop = crops.find(c => c.id === cropId) || crops[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarmer) return;

    StorageService.addCropToFarmer(activeFarmer.id, {
      cropId,
      cropName: selectedCrop.name,
      estimatedQuintals: parseFloat(estimatedQuintals) || 0,
      harvestDate: formatIndianDate(harvestDate),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-4 text-center text-xs">
        <div className="w-10 h-10 bg-[#EAF4EA] text-[#18794E] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-base font-bold text-[#123B5D]">Crop Registered Successfully!</h1>
        <p className="text-gray-600">
          <strong>{selectedCrop.name}</strong> ({estimatedQuintals} quintals) has been added to your eligible procurement declaration.
        </p>
        <div className="pt-2 flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate('/farmer/book-slot')}
            className="bg-[#E87524] hover:bg-[#d66619] text-white px-4 py-2 rounded-xs font-bold"
          >
            Book Slot for this Crop →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Harvest Declaration
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Register Additional Crop (अतिरिक्त फसल पंजीकरण)
        </h1>
        <p className="text-gray-600 text-xs">
          Declare secondary crops cultivated on your registered land parcels to unlock procurement booking.
        </p>
      </div>

      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] block">Select Commodity *</label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white font-medium focus:outline-hidden focus:border-[#123B5D]"
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
              <label className="font-bold text-[#1F2933] block">Estimated Harvest (Quintals) *</label>
              <input
                type="number"
                min="1"
                max="500"
                value={estimatedQuintals}
                onChange={(e) => setEstimatedQuintals(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Expected Harvest Readiness *</label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold shadow-xs cursor-pointer"
          >
            Confirm Crop Registration
          </button>
        </form>
      </div>
    </div>
  );
};
