import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { NotificationItem } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Bell, Check, Clock, AlertTriangle, ShieldCheck, CheckCheck } from 'lucide-react';
import { formatIndianDate } from '../../lib/formatters';

export const FarmerNotifications: React.FC = () => {
  const { activeFarmer } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!activeFarmer) return;
    setNotifications(StorageService.getNotifications(activeFarmer.id));
  }, [activeFarmer]);

  const handleMarkAllRead = () => {
    if (!activeFarmer) return;
    StorageService.markAllNotificationsRead(activeFarmer.id);
    setNotifications(StorageService.getNotifications(activeFarmer.id));
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'slot': return <Badge variant="info">SLOT</Badge>;
      case 'queue': return <Badge variant="warning">QUEUE</Badge>;
      case 'payment': return <Badge variant="success">PAYMENT</Badge>;
      case 'disruption': return <Badge variant="danger">ALERT</Badge>;
      default: return <Badge variant="neutral">GENERAL</Badge>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs pb-8">
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            Communication History
          </span>
          <h1 className="text-xl font-bold text-[#123B5D]">
            Official SMS & Portal Notifications (सूचनाएं)
          </h1>
          <p className="text-gray-600 text-xs">
            SMS alerts dispatched to your registered mobile number and recorded in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="bg-white border border-[#D6DDE5] hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#18794E]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-[#D6DDE5] p-8 text-center rounded-xs space-y-2">
          <Bell className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-600 font-semibold">No notifications available.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xs border transition-colors ${
                !n.isRead
                  ? 'bg-[#FFF9F3] border-[#E87524]/60 shadow-2xs'
                  : 'bg-white border-[#D6DDE5]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(n.category)}
                  <h3 className="font-bold text-xs text-[#123B5D]">{n.title}</h3>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  {formatIndianDate(n.timestamp)}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
