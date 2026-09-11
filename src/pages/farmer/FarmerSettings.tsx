import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Bell, Globe, Eye, CheckCircle2 } from 'lucide-react';

export const FarmerSettings: React.FC = () => {
  const { language, setLanguage, highContrast, setHighContrast } = useApp();
  const [smsAlerts, setSmsAlerts] = useState(true);
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
          Accessibility & Preferences
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Account & Portal Settings (सेटिंग्स)
        </h1>
        <p className="text-gray-600 text-xs">
          Manage display language, high-contrast readability, and real-time SMS notifications.
        </p>
      </div>

      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-5">
        {saved && (
          <div className="p-3 bg-[#EAF4EA] border border-[#18794E]/40 text-[#18794E] rounded-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Language Selection */}
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <label className="font-bold text-[#123B5D] flex items-center gap-1.5 text-xs">
              <Globe className="w-4 h-4 text-[#E87524]" />
              <span>Display Language (भाषा)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`p-3 border rounded-xs font-bold text-center transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#FFF3E8] border-[#E87524] text-[#E87524]'
                    : 'bg-white border-[#D6DDE5] text-gray-700'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 border rounded-xs font-bold text-center transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#123B5D] border-[#123B5D] text-white'
                    : 'bg-white border-[#D6DDE5] text-gray-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <label className="font-bold text-[#123B5D] flex items-center gap-1.5 text-xs">
              <Eye className="w-4 h-4 text-[#2E7D32]" />
              <span>High Contrast Display (उच्च कंट्रास्ट)</span>
            </label>
            <p className="text-[11px] text-gray-600">
              Enhances text contrast and sharpens borders for sunlight visibility on fields.
            </p>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-4 h-4 text-[#123B5D] rounded-xs"
              />
              <span className="font-semibold text-gray-800">Enable High Contrast Accessibility Theme</span>
            </label>
          </div>

          {/* SMS Alerts */}
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <label className="font-bold text-[#123B5D] flex items-center gap-1.5 text-xs">
              <Bell className="w-4 h-4 text-[#123B5D]" />
              <span>Procurement SMS Updates</span>
            </label>
            <p className="text-[11px] text-gray-600">
              Receive automated SMS alerts when your token is called or payment file is created.
            </p>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-[#123B5D] rounded-xs"
              />
              <span className="font-semibold text-gray-800">Receive SMS notifications to registered mobile (+91 9876543210)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs shadow-xs cursor-pointer"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};
