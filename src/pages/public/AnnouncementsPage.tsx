import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { CentreDisruption } from '../../types';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { Badge } from '../../components/ui/Badge';
import { Bell, AlertTriangle, FileText, Calendar, Building2 } from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';

export const AnnouncementsPage: React.FC = () => {
  const [disruptions, setDisruptions] = useState<CentreDisruption[]>([]);

  useEffect(() => {
    setDisruptions(StorageService.getDisruptions());
  }, []);

  const circulars = [
    {
      id: 'circ-1',
      title: 'Kharif & Rabi Season Central Minimum Support Price (MSP) Rate Schedule',
      dept: 'Department of Agriculture & Farmers Welfare',
      date: '01-09-2026',
      summary: 'Central Government notifies fair average quality (FAQ) MSP: Wheat ₹2,275/qtl, Common Paddy ₹2,183/qtl, Mustard ₹5,650/qtl, Maize ₹2,090/qtl.',
      ref: 'CIRC/DAFW/2026/MSP-08',
    },
    {
      id: 'circ-2',
      title: 'Mandatory Digital Weighbridge Calibration and Inspection Circular',
      dept: 'Bureau of Indian Standards & Weights & Measures Directorate',
      date: '28-08-2026',
      summary: 'All electronic weighbridges across 24 regional procurement centres must undergo bi-weekly calibration tests using standard test weights.',
      ref: 'WM/INSP/PUNE/2026/142',
    },
    {
      id: 'circ-3',
      title: 'Operational Guidelines for Monsoonal Storage & Tarpaulin Protection',
      dept: 'Central Warehousing Corporation',
      date: '20-08-2026',
      summary: 'Mandatory installation of high-density polyethylene (HDPE) tarpaulin covers across all open platform storage facilities during unloading hours.',
      ref: 'CWC/OPS/2026/RAIN-09',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Page Title Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-[#E87524] text-xs font-bold uppercase tracking-wider">
          <Bell className="w-4 h-4" />
          <span>Official Bulletins & Notices (आधिकारिक सूचनाएं)</span>
        </div>
        <h1 className="text-2xl font-bold text-[#123B5D]">
          Procurement Season Announcements & Live Mandi Alerts
        </h1>
        <p className="text-xs text-gray-600">
          Timely advisories regarding mandi operating status, weather alerts, capacity revisions, and central circulars.
        </p>
      </div>

      {/* Live Disruption / Operating Status Alerts */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[#123B5D] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Active Centre Disruptions & Operational Changes</span>
        </h2>

        {disruptions.length === 0 ? (
          <div className="p-4 bg-white border border-[#D6DDE5] rounded-xs text-xs text-gray-500">
            All 24 procurement centres are operating normally with zero active operational disruptions.
          </div>
        ) : (
          <div className="space-y-3">
            {disruptions.map((d) => (
              <div 
                key={d.id}
                className="bg-white border-l-4 border-amber-500 border-y border-r border-[#D6DDE5] p-4 rounded-r-xs shadow-2xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={d.status === 'active' ? 'warning' : 'success'}>
                      {d.status === 'active' ? 'Active Disruption' : 'Resolved'}
                    </Badge>
                    <span className="font-bold text-xs text-[#123B5D]">{d.centreName}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Date: {d.affectedDate}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#8C5815]">{d.title}</h3>
                <p className="text-xs text-gray-700 leading-relaxed">{d.description}</p>

                <div className="bg-[#FFF9DB] p-2.5 rounded-xs text-xs text-[#8C5815] border border-amber-200">
                  <strong>Suggested Action for Farmers:</strong> {d.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Official Government Circulars Table */}
      <section className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-[#123B5D] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#123B5D]" />
          <span>Departmental Gazettes & Procurement Circulars</span>
        </h2>

        <div className="divide-y divide-gray-200">
          {circulars.map((c) => (
            <div key={c.id} className="py-3.5 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-xs text-[10px]">
                  {c.ref}
                </span>
                <span className="text-gray-500 text-[11px]">{c.date}</span>
              </div>
              <h3 className="font-bold text-xs text-[#123B5D] hover:underline cursor-pointer">
                {c.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{c.summary}</p>
              <div className="text-[11px] text-[#E87524] font-medium pt-0.5">
                Issuing Authority: {c.dept}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
