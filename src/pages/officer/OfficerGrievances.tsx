import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { Grievance } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquareWarning, 
  Clock, 
  FileText, 
  Search,
  Filter
} from 'lucide-react';

export const OfficerGrievances: React.FC = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setGrievances(StorageService.getGrievances());
  }, []);

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    StorageService.resolveGrievance(selectedGrievance.id, resolutionNotes);
    setGrievances(StorageService.getGrievances());
    setSelectedGrievance(null);
    setResolutionNotes('');
  };

  const filtered = grievances.filter(g => {
    if (filter === 'pending') return g.status !== 'resolved';
    if (filter === 'resolved') return g.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          CPGRAMS Public Redressal Desk
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Farmer Grievance Adjudication & Audit (शिकायत निवारण डेस्क)
        </h1>
        <p className="text-gray-600 text-xs">
          Supervisory adjudication of disputes regarding queue bypass, weighbridge discrepancies, or quality assessments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-[#D6DDE5] p-3 rounded-xs shadow-2xs flex gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xs font-bold ${
            filter === 'all' ? 'bg-[#123B5D] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All Grievances ({grievances.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-xs font-bold ${
            filter === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Pending Resolution
        </button>
        <button
          type="button"
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1.5 rounded-xs font-bold ${
            filter === 'resolved' ? 'bg-[#18794E] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Adjudication Modal / Drawer */}
      {selectedGrievance && (
        <div className="bg-white border-2 border-[#123B5D] p-5 rounded-xs shadow-md space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-gray-200">
            <h3 className="font-bold text-sm text-[#123B5D]">
              Adjudicate Ticket: {selectedGrievance.ticketRef}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedGrievance(null)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F7F9] p-3 rounded-xs text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Farmer</span>
              <span className="font-bold text-[#1F2933]">{selectedGrievance.farmerName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Centre</span>
              <span className="font-bold text-[#123B5D]">{selectedGrievance.centreName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Category</span>
              <span className="font-semibold uppercase">{selectedGrievance.category}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Filed On</span>
              <span>{selectedGrievance.createdAt}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-gray-700 block">Subject & Allegation:</span>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs">
              <strong className="block text-gray-900 mb-1">{selectedGrievance.subject}</strong>
              <p className="text-gray-600 leading-relaxed">{selectedGrievance.description}</p>
            </div>
          </div>

          <form onSubmit={handleResolve} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="font-bold text-[#123B5D] block">
                Official Resolution Finding & Corrective Action *
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Detail verification findings, weighbridge re-calibration or corrective token order..."
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                className="px-4 py-2 border border-[#D6DDE5] rounded-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#18794E] hover:bg-[#13623f] text-white px-5 py-2 rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Official Resolution & Close Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grievance Table */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Ticket Ref</th>
                <th className="py-2.5 px-3">Farmer</th>
                <th className="py-2.5 px-3">Centre</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#123B5D]">
                    {g.ticketRef}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-[#1F2933]">{g.farmerName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{g.farmerPhone}</div>
                  </td>
                  <td className="py-2.5 px-3">{g.centreName}</td>
                  <td className="py-2.5 px-3 uppercase font-semibold text-gray-700 text-[10px]">
                    {g.category}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate">
                    {g.subject}
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge variant={g.status === 'resolved' ? 'success' : 'danger'}>
                      {g.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGrievance(g);
                        setResolutionNotes(g.resolutionNotes || '');
                      }}
                      className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-3 py-1 rounded-xs font-semibold text-[11px] cursor-pointer shadow-2xs"
                    >
                      {g.status === 'resolved' ? 'View Finding' : 'Adjudicate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
