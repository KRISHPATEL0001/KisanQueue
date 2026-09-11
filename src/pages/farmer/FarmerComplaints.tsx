import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { Grievance } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  MessageSquareWarning, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';

export const FarmerComplaints: React.FC = () => {
  const { activeFarmer } = useApp();
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  // Form State
  const [centreName, setCentreName] = useState('Greenfield Procurement Centre');
  const [category, setCategory] = useState<'queue' | 'weighment' | 'quality' | 'payment' | 'staff' | 'other'>('queue');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const centres = StorageService.getCentres();

  useEffect(() => {
    if (!activeFarmer) return;
    setGrievances(StorageService.getGrievancesByFarmer(activeFarmer.id));
  }, [activeFarmer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarmer) return;

    const newGrievance = StorageService.submitGrievance({
      farmerId: activeFarmer.id,
      farmerName: activeFarmer.name,
      farmerPhone: activeFarmer.mobile,
      centreName,
      category,
      subject,
      description,
    });

    setGrievances(StorageService.getGrievancesByFarmer(activeFarmer.id));
    setSuccessMsg(`Grievance registered successfully with reference: ${newGrievance.ticketRef}`);
    setSubject('');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs pb-8">
      {/* Page Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Centralized Public Grievance Redress And Monitoring System (CPGRAMS)
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Farmer Grievance Redressal (शिकायत एवं समाधान)
        </h1>
        <p className="text-gray-600 text-xs">
          Raise operational concerns regarding mandi queues, weighbridge calibration, moisture tests, or delayed payment disbursement directly to Supervising Officers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grievance Submission Form */}
        <div className="lg:col-span-6 bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-4">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-bold text-[#123B5D] text-sm flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-[#E87524]" />
              <span>Lodge a New Grievance</span>
            </h2>
          </div>

          {successMsg && (
            <div className="p-3 bg-[#EAF4EA] border border-[#18794E]/40 text-[#18794E] rounded-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">Select Procurement Centre *</label>
              <select
                value={centreName}
                onChange={(e) => setCentreName(e.target.value)}
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white focus:outline-hidden focus:border-[#123B5D]"
              >
                {centres.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">Grievance Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white focus:outline-hidden focus:border-[#123B5D]"
              >
                <option value="queue">Queue Congestion / Out-of-turn Entry</option>
                <option value="weighment">Weighment Bridge Discrepancy</option>
                <option value="quality">Quality / Moisture Testing Dispute</option>
                <option value="payment">Payment Delay / DBT Reconciliation</option>
                <option value="staff">Staff Conduct / Misbehavior</option>
                <option value="other">Other Operational Matter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">Subject Summary *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Weighbridge delay exceeding 2 hours"
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 block">Detailed Description *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide specific details including vehicle number, token number, or time of occurrence..."
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Official Grievance</span>
            </button>
          </form>
        </div>

        {/* Right Column: Historical Grievances */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-3">
            <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
              <h2 className="font-bold text-[#123B5D] text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#123B5D]" />
                <span>My Submitted Grievances ({grievances.length})</span>
              </h2>
            </div>

            {grievances.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center">
                You have not registered any grievances.
              </p>
            ) : (
              <div className="space-y-3">
                {grievances.map((g) => (
                  <div key={g.id} className="p-3.5 border border-[#D6DDE5] rounded-xs bg-[#F5F7F9] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold font-mono text-[#123B5D] text-xs">
                        {g.ticketRef}
                      </span>
                      <Badge 
                        variant={
                          g.status === 'resolved' ? 'success' : 
                          g.status === 'in_progress' ? 'warning' : 'info'
                        }
                      >
                        {g.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-xs text-[#1F2933]">{g.subject}</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{g.description}</p>

                    <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-200 flex justify-between">
                      <span>Centre: {g.centreName}</span>
                      <span>Lodged: {g.createdAt}</span>
                    </div>

                    {g.resolutionNotes && (
                      <div className="bg-[#EAF4EA] p-2 rounded-xs text-[10px] text-[#18794E] border border-green-200">
                        <strong>Official Resolution:</strong> {g.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
