import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Scale, Printer, Wifi } from 'lucide-react';

export const OperatorSettings: React.FC = () => {
  const [weighbridgePort, setWeighbridgePort] = useState('COM3 (Avery India Digital 50T)');
  const [thermalPrinter, setThermalPrinter] = useState('Epson TM-T88VI (USB001)');
  const [offlineSync, setOfflineSync] = useState(true);
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
          Mandi Terminal Configuration
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Hardware & Weighbridge Settings (उपकरण सेटिंग्स)
        </h1>
        <p className="text-gray-600 text-xs">
          Interface settings for electronic weighbridge serial ports, receipt printers, and offline local cache.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[#EAF4EA] border border-[#18794E]/40 text-[#18794E] rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Hardware terminal configuration saved.</span>
        </div>
      )}

      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#123B5D]" />
              <span>Weighbridge Electronic Indicator Interface *</span>
            </label>
            <input
              type="text"
              value={weighbridgePort}
              onChange={(e) => setWeighbridgePort(e.target.value)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono text-xs focus:outline-hidden focus:border-[#123B5D]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#1F2933] flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-[#E87524]" />
              <span>Token Slip & J-Form Thermal Printer *</span>
            </label>
            <input
              type="text"
              value={thermalPrinter}
              onChange={(e) => setThermalPrinter(e.target.value)}
              className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono text-xs focus:outline-hidden focus:border-[#123B5D]"
            />
          </div>

          <div className="pt-2 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={offlineSync}
                onChange={(e) => setOfflineSync(e.target.checked)}
                className="w-4 h-4 text-[#123B5D] rounded-xs"
              />
              <span className="font-semibold text-gray-800">
                Enable Offline Mandi Queue Cache (Processes tokens during cellular connectivity dropouts)
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs shadow-xs cursor-pointer"
          >
            Save Hardware Configuration
          </button>
        </form>
      </div>
    </div>
  );
};
