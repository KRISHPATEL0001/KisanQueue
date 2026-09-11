import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { ProcurementCentre } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Building2, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

export const OperatorCapacity: React.FC = () => {
  const [centre, setCentre] = useState<ProcurementCentre | null>(null);
  const [dailyCapacity, setDailyCapacity] = useState<number>(300);
  const [operationalBuffer, setOperationalBuffer] = useState<number>(60);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const centres = StorageService.getCentres();
    const c = centres[0];
    setCentre(c);
    setDailyCapacity(c.dailyCapacityQuintals);
    setOperationalBuffer(c.operationalReserveQuintals);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centre) return;
    StorageService.updateCentreCapacity(centre.id, dailyCapacity, operationalBuffer);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const bookable = Math.max(0, dailyCapacity - operationalBuffer);

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Mandi Yard Resource Calibration
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Capacity & Safety Buffer Controls (क्षमता एवं बफर समायोजन)
        </h1>
        <p className="text-gray-600 text-xs">
          Configure daily intake ceilings and maintain the 20% operational safety margin to prevent vehicle gridlock.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-[#EAF4EA] border border-[#18794E] rounded-xs flex items-center gap-2 text-[#18794E]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">Centre operational parameters calibrated successfully!</span>
        </div>
      )}

      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] block">Total Daily Physical Intake (Quintals) *</label>
            <input
              type="number"
              step="10"
              min="50"
              max="2000"
              value={dailyCapacity}
              onChange={(e) => setDailyCapacity(Number(e.target.value) || 0)}
              required
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D] focus:outline-hidden focus:border-[#123B5D]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] block">Operational Reserve Buffer (Quintals) *</label>
            <input
              type="number"
              step="5"
              min="10"
              max="500"
              value={operationalBuffer}
              onChange={(e) => setOperationalBuffer(Number(e.target.value) || 0)}
              required
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#E87524] focus:outline-hidden focus:border-[#123B5D]"
            />
            <span className="text-[10px] text-gray-500 block">
              Government Mandate recommends 15%–20% ({Math.round(dailyCapacity * 0.2)} qtl recommended).
            </span>
          </div>

          <div className="bg-[#F5F7F9] p-3.5 border border-[#D6DDE5] rounded-xs space-y-1">
            <div className="flex justify-between font-bold text-xs text-[#123B5D]">
              <span>Publicly Bookable Capacity:</span>
              <span className="font-mono text-sm text-[#18794E]">{bookable} Quintals / Day</span>
            </div>
            <p className="text-[10px] text-gray-500">
              Slots shown on farmer booking portal will automatically cap at this bookable limit.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Update Centre Quota</span>
          </button>
        </form>
      </div>
    </div>
  );
};
