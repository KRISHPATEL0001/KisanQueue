import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { CentreDisruption } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Radio, 
  Calendar, 
  Building2,
  Clock
} from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';
import { sanitizeInput } from '../../lib/security';

export const OperatorDisruptions: React.FC = () => {
  const [disruptions, setDisruptions] = useState<CentreDisruption[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [centreName, setCentreName] = useState('Greenfield Procurement Centre');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affectedDate, setAffectedDate] = useState('2026-09-10');
  const [suggestedAction, setSuggestedAction] = useState('Farmers with bookings today may arrive during afternoon slots without penalty.');

  useEffect(() => {
    setDisruptions(StorageService.getDisruptions());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(title).trim();
    const cleanDesc = sanitizeInput(description).trim();
    const cleanAction = sanitizeInput(suggestedAction).trim();

    if (!cleanTitle || !cleanDesc) return;

    StorageService.addDisruption({
      centreId: 'centre-1',
      centreName,
      type: 'weighing_machine_failure',
      title: cleanTitle,
      description: cleanDesc,
      affectedDate: formatIndianDate(affectedDate),
      affectedSlots: ['08:00 AM - 12:00 PM', '12:00 PM - 04:00 PM'],
      severity: 'high',
      reportedBy: 'Devendra Patil (OP-04)',
      assignedTo: 'District Civil Supplies Office',
      suggestedAction: cleanAction,
    });

    StorageService.addAuditLog({
      userName: 'Devendra Patil (OP-04)',
      userRole: 'operator',
      action: 'DISRUPTION_BROADCAST',
      recordRef: 'centre-1',
      reason: `Broadcasted: "${cleanTitle}". Advisory: ${cleanAction}`,
    });

    setDisruptions(StorageService.getDisruptions());
    setShowForm(false);
    setTitle('');
    setDescription('');
  };

  const handleResolve = (id: string) => {
    StorageService.resolveDisruption(id);
    setDisruptions(StorageService.getDisruptions());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            Crisis & Operational Continuity
          </span>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Centre Disruption & Advisory Broadcasts (संचालन व्यवधान)
          </h1>
          <p className="text-gray-600 text-xs">
            Notify farmers, portal visitors, and district officials about weather delays, weighbridge calibrations, or storage overflow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="bg-[#E87524] hover:bg-[#d66619] text-white px-4 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast New Advisory</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-[#E87524] p-5 rounded-xs shadow-md space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-bold text-sm text-[#123B5D] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#E87524]" />
              <span>Broadcast Public Operational Advisory</span>
            </h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Affected Centre *</label>
                <input
                  type="text"
                  value={centreName}
                  onChange={(e) => setCentreName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-gray-50 text-xs focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Date of Impact *</label>
                <input
                  type="date"
                  value={affectedDate}
                  onChange={(e) => setAffectedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Advisory Headline *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weighbridge 2 Under Scheduled Sensor Calibration"
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Operational Reason & Context *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the cause (e.g. monsoonal squall, mechanical repair, power feeder tripping)..."
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Suggested Action for Farmers *</label>
              <input
                type="text"
                value={suggestedAction}
                onChange={(e) => setSuggestedAction(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-[#D6DDE5] rounded-xs text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold shadow-xs cursor-pointer"
              >
                Publish Advisory Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Disruption List */}
      <div className="space-y-3">
        {disruptions.map((d) => (
          <div
            key={d.id}
            className={`p-5 rounded-xs border-l-4 shadow-2xs space-y-3 bg-white ${
              d.status === 'active'
                ? 'border-l-amber-500 border-y border-r border-[#D6DDE5]'
                : 'border-l-[#18794E] border-y border-r border-[#D6DDE5]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={d.status === 'active' ? 'warning' : 'success'}>
                  {d.status === 'active' ? 'ACTIVE ADVISORY' : 'RESOLVED'}
                </Badge>
                <span className="font-bold text-xs text-[#123B5D]">{d.centreName}</span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                Impact Date: {d.affectedDate}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-[#1F2933]">{d.title}</h3>
              <p className="text-gray-700 text-xs mt-1 leading-relaxed">{d.description}</p>
            </div>

            <div className="bg-[#FFF9DB] p-2.5 rounded-xs border border-amber-200 text-xs text-[#8C5815]">
              <strong>Farmer Action Guide:</strong> {d.suggestedAction}
            </div>

            {d.status === 'active' && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleResolve(d.id)}
                  className="bg-[#18794E] hover:bg-[#13623f] text-white px-3 py-1.5 rounded-xs font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Situation Resolved</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
