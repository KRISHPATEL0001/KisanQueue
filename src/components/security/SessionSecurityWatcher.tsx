import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { ShieldAlert, LogOut, CheckCircle2, Clock } from 'lucide-react';

interface SessionSecurityWatcherProps {
  idleMinutes?: number; // Total idle duration before logout (e.g. 15 mins)
  warningSeconds?: number; // Countdown warning duration (e.g. 120 secs)
}

export const SessionSecurityWatcher: React.FC<SessionSecurityWatcherProps> = ({
  idleMinutes = 15,
  warningSeconds = 120,
}) => {
  const { role, setRole } = useApp();
  const navigate = useNavigate();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [remainingCountdown, setRemainingCountdown] = useState(warningSeconds);
  const lastActiveRef = useRef<number>(Date.now());
  const timerCheckRef = useRef<any>(null);

  // User activity reset
  const registerActivity = useCallback(() => {
    lastActiveRef.current = Date.now();
    if (isWarningOpen) {
      setIsWarningOpen(false);
      setRemainingCountdown(warningSeconds);
    }
  }, [isWarningOpen, warningSeconds]);

  // Handle explicit logout
  const handleForceLogout = useCallback(() => {
    setIsWarningOpen(false);
    StorageService.addAuditLog({
      userName: 'Session Security Watchdog',
      userRole: role,
      action: 'SESSION_AUTO_TIMEOUT',
      recordRef: 'TIMEOUT_CERT_IN',
      reason: `Automatic security logout triggered after ${idleMinutes} minutes of terminal inactivity (CERT-In Policy).`,
    });
    setRole('farmer'); // Revert role
    navigate('/login?timeout=1');
  }, [idleMinutes, navigate, role, setRole]);

  // Bind activity listeners
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleEvent = () => {
      // Only throttle updates if warning modal is not active
      if (!isWarningOpen) {
        lastActiveRef.current = Date.now();
      }
    };

    events.forEach((ev) => window.addEventListener(ev, handleEvent, { passive: true }));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleEvent));
    };
  }, [isWarningOpen]);

  // Idle check ticker
  useEffect(() => {
    const totalIdleMs = idleMinutes * 60 * 1000;
    const warningThresholdMs = totalIdleMs - warningSeconds * 1000;

    timerCheckRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActiveRef.current;

      if (elapsed >= totalIdleMs) {
        handleForceLogout();
      } else if (elapsed >= warningThresholdMs && !isWarningOpen) {
        setIsWarningOpen(true);
        const timeLeftSec = Math.max(1, Math.ceil((totalIdleMs - elapsed) / 1000));
        setRemainingCountdown(timeLeftSec);
      } else if (isWarningOpen) {
        const timeLeftSec = Math.max(0, Math.ceil((totalIdleMs - elapsed) / 1000));
        setRemainingCountdown(timeLeftSec);
        if (timeLeftSec <= 0) {
          handleForceLogout();
        }
      }
    }, 1000);

    return () => {
      if (timerCheckRef.current) clearInterval(timerCheckRef.current);
    };
  }, [idleMinutes, warningSeconds, isWarningOpen, handleForceLogout]);

  if (!isWarningOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#E87524] rounded-xs shadow-2xl max-w-md w-full p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF3E8] text-[#E87524] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#123B5D]">
              Security Inactivity Warning / सत्र समाप्ति चेतावनी
            </h2>
            <p className="text-gray-500 text-[11px]">
              Govt. Cyber Security Directive • Inactivity Lock
            </p>
          </div>
        </div>

        <div className="bg-[#FFF3E8] border border-[#E87524]/40 p-3 rounded-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-800 text-[11px]">Time remaining before auto-lock:</span>
            <span className="font-mono font-black text-red-600 text-sm flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{remainingCountdown} seconds</span>
            </span>
          </div>
          <p className="text-[11px] text-gray-700 leading-relaxed">
            Due to extended inactivity on this terminal, your portal session will be locked automatically to protect agricultural records and personal data.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleForceLogout}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out Now</span>
          </button>
          <button
            type="button"
            onClick={registerActivity}
            className="px-4 py-2 bg-[#123B5D] hover:bg-[#0e2c45] text-white rounded-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stay Logged In / जारी रखें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
