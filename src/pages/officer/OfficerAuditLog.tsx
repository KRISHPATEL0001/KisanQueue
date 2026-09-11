import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storageService';
import { AuditLogEntry } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Lock, 
  Clock, 
  History, 
  RefreshCw,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { formatIndianDateTime } from '../../lib/formatters';

export const OfficerAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadLogs = () => {
    const data = StorageService.getAuditLogs();
    setLogs(data);
    setLastRefreshed(new Date().toLocaleTimeString('en-IN'));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getSeverity = (action: string): 'normal' | 'security' | 'financial' => {
    const act = action.toUpperCase();
    if (act.includes('WEIGHMENT') || act.includes('PAYMENT') || act.includes('PURCHASE') || act.includes('FINANCIAL') || act.includes('RECONCILED')) {
      return 'financial';
    }
    if (act.includes('AUTH') || act.includes('SECURITY') || act.includes('RATE_LIMIT') || act.includes('SEAL') || act.includes('STATUS_CHANGED') || act.includes('DISRUPTION')) {
      return 'security';
    }
    return 'normal';
  };

  const filtered = logs.filter(l => {
    if (roleFilter !== 'all' && l.userRole !== roleFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (l.userName && l.userName.toLowerCase().includes(q)) ||
      (l.action && l.action.toLowerCase().includes(q)) ||
      (l.recordRef && l.recordRef.toLowerCase().includes(q)) ||
      (l.reason && l.reason.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 text-xs pb-8">
      {/* Header */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
              Immutable System Governance & Compliance (Section 12, DPDP Act 2023)
            </span>
            <h1 className="text-xl font-bold text-[#123B5D]">
              Regulatory Audit Trail & Tamper-Proof Logs (ऑडिट ट्रेल)
            </h1>
            <p className="text-gray-600 text-xs">
              Verifiable chronological ledger of every booking, gate check-in, authentication event, moisture assessment, and DBT bank transaction.
            </p>
          </div>
          <button
            type="button"
            onClick={loadLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xs cursor-pointer text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Ledger ({lastRefreshed})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#D6DDE5] p-4 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action code, actor name, entity reference, or digital seal..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-[#D6DDE5] rounded-xs bg-white text-xs font-medium"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmer</option>
            <option value="operator">Operator</option>
            <option value="helpdesk">Helpdesk</option>
            <option value="officer">Supervising Officer</option>
          </select>

          <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px] pl-3 border-l border-gray-200">
            <Lock className="w-3.5 h-3.5 text-[#18794E]" />
            <span className="text-[#18794E]">Cryptographically Sealed</span>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#123B5D] text-white text-[11px] font-semibold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Role</th>
                <th className="py-2.5 px-3">Action Code</th>
                <th className="py-2.5 px-3">Record Ref</th>
                <th className="py-2.5 px-3">Audit Details & Digital Seal</th>
                <th className="py-2.5 px-3 text-right">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-sans">
                    No matching audit records found for search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => {
                  const severity = getSeverity(l.action);
                  return (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-gray-500 text-[10px] whitespace-nowrap font-mono">
                        {formatIndianDateTime(l.timestamp)}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <div className="font-bold text-[#123B5D]">{l.userName || 'System / Batch'}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          {l.userRole || 'anonymous'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#1F2933] text-[11px] font-mono">
                        {l.action}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#E87524] font-mono text-[11px]">
                        {l.recordRef}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-gray-700 text-xs max-w-lg break-words">
                        <div>{l.reason || 'Routine operation logged'}</div>
                        {l.previousStatus && l.newStatus && (
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                            Status: <span className="line-through text-gray-400">{l.previousStatus}</span> → <span className="font-bold text-[#18794E]">{l.newStatus}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans whitespace-nowrap">
                        <Badge
                          variant={
                            severity === 'financial' ? 'success' :
                            severity === 'security' ? 'danger' : 'neutral'
                          }
                        >
                          {severity.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
