import React, { useState } from 'react';
import { StorageService } from '../../services/storageService';
import { MessageSquareWarning, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sanitizeInput, validateMobile } from '../../lib/security';

export const HelpdeskComplaints: React.FC = () => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [centreName, setCentreName] = useState('Greenfield Procurement Centre');
  const [category, setCategory] = useState<'queue' | 'weighment' | 'quality' | 'payment' | 'staff' | 'other'>('queue');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketRef, setTicketRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const centres = StorageService.getCentres();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = sanitizeInput(farmerName).trim();
    const cleanPhone = farmerPhone.replace(/\D/g, '').slice(0, 10);
    const cleanSubject = sanitizeInput(subject).trim();
    const cleanDesc = sanitizeInput(description).trim();

    if (!cleanName || cleanName.length < 3) {
      setError('Farmer full name must be at least 3 characters.');
      return;
    }

    const phoneCheck = validateMobile(cleanPhone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.message || 'Invalid farmer contact phone.');
      return;
    }

    if (!cleanSubject || cleanSubject.length < 5) {
      setError('Subject summary must be at least 5 characters.');
      return;
    }

    const g = StorageService.submitGrievance({
      farmerId: 'assisted-walkin',
      farmerName: cleanName,
      farmerPhone: cleanPhone,
      centreName,
      category,
      subject: cleanSubject,
      description: `[Filed via Citizen Help Desk Counter]: ${cleanDesc}`,
    });

    StorageService.addAuditLog({
      userName: 'Helpdesk Officer #HD-02',
      userRole: 'helpdesk',
      action: 'GRIEVANCE_FILED',
      recordRef: g.ticketRef,
      reason: `Assisted grievance filed for ${cleanName} (${cleanPhone}). Category: ${category}. Subject: ${cleanSubject}`,
    });

    setTicketRef(g.ticketRef);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
          Citizen Rights & Redressal Desk
        </span>
        <h1 className="text-xl font-bold text-[#123B5D]">
          Lodge Assisted Grievance (सहायता शिकायत पंजीकरण)
        </h1>
        <p className="text-gray-600 text-xs">
          Register official CPGRAMS complaints for visiting farmers unable to navigate the mobile portal.
        </p>
      </div>

      {ticketRef ? (
        <div className="bg-[#EAF4EA] border-2 border-[#18794E] p-6 rounded-xs shadow-md space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#18794E] text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#18794E]">Grievance Registered Successfully!</h2>
            <p className="text-gray-700 mt-1">
              Complaint Ticket Number: <strong className="font-mono text-base text-[#123B5D]">{ticketRef}</strong>
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              SMS acknowledgment has been sent to farmer mobile {farmerPhone}.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setTicketRef(null);
                setSubject('');
                setDescription('');
                setFarmerName('');
                setFarmerPhone('');
              }}
              className="bg-[#123B5D] hover:bg-[#0e2c45] text-white px-5 py-2 rounded-xs font-bold shadow-xs cursor-pointer"
            >
              Lodge Another Grievance
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Farmer Full Name *</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Farmer Contact Phone *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono text-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Procurement Mandi *</label>
                <select
                  value={centreName}
                  onChange={(e) => setCentreName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
                >
                  {centres.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs bg-white text-xs focus:outline-hidden focus:border-[#123B5D]"
                >
                  <option value="queue">Queue Congestion / Out-of-turn Entry</option>
                  <option value="weighment">Weighment Discrepancy</option>
                  <option value="quality">Moisture Assessment Dispute</option>
                  <option value="payment">Payment Delay / DBT Issue</option>
                  <option value="staff">Staff Misconduct</option>
                  <option value="other">Other Operational Concern</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Subject Summary *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of grievance"
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#1F2933] block">Detailed Farmer Statement *</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Record exact facts, tractor number, time, and witness details..."
                required
                className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Grievance to Supervising Officer</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
