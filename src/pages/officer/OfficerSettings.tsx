import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';

export const OfficerSettings: React.FC = () => {
  const [bufferPct, setBufferPct] = useState(20);
  const [turnaroundLimitMins, setTurnaroundLimitMins] = useState(90);
  const [maxMoistureTolerance, setMaxMoistureTolerance] = useState(12.0);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          State Administrative Policies
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Divisional Thresholds & Governance Controls (प्रशासनिक नियम)
        </h1>
        <p className="text-gray-600 text-xs">
          Regulate district-wide queue alert benchmarks, maximum moisture tolerance, and default buffer reserves.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[#EAF4EA] border border-[#18794E]/40 text-[#18794E] rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Divisional policy parameters updated successfully.</span>
        </div>
      )}

      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] block">
              Default Centre Operational Reserve Buffer (%) *
            </label>
            <input
              type="number"
              min="10"
              max="30"
              value={bufferPct}
              onChange={(e) => setBufferPct(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D]"
            />
            <span className="text-[10px] text-gray-500">Default: 20% reserved for walk-ins and emergencies.</span>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] block">
              Turnaround Delay Flag Threshold (Minutes) *
            </label>
            <input
              type="number"
              min="30"
              max="180"
              value={turnaroundLimitMins}
              onChange={(e) => setTurnaroundLimitMins(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D]"
            />
            <span className="text-[10px] text-gray-500">Vehicles in mandi yard longer than this are flagged as delayed.</span>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] block">
              Fair Average Quality (FAQ) Moisture Limit (%) *
            </label>
            <input
              type="number"
              step="0.1"
              min="10"
              max="16"
              value={maxMoistureTolerance}
              onChange={(e) => setMaxMoistureTolerance(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono font-bold text-sm text-[#123B5D]"
            />
            <span className="text-[10px] text-gray-500">Wheat procurement ceiling per Food Corporation of India.</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs shadow-xs cursor-pointer"
          >
            Apply Divisional Rules
          </button>
        </form>
      </div>
    </div>
  );
};
