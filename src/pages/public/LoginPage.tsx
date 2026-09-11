import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { GovEmblem } from '../../components/government/Emblem';
import { GovCaptcha } from '../../components/security/GovCaptcha';
import { 
  ShieldCheck, 
  LogIn, 
  Key, 
  Phone, 
  User, 
  AlertCircle, 
  Lock, 
  Clock,
  Sparkles,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { 
  sanitizeInput, 
  validateMobile, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetRateLimit,
  SECURITY_PROTOCOLS 
} from '../../lib/security';
import { StorageService } from '../../services/storageService';

export const LoginPage: React.FC = () => {
  const { setRole, setActiveFarmerId, isAuthenticated, activeFarmer, role, login, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<UserRole>('farmer');

  // Farmer form state
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');

  // Staff form state
  const [username, setUsername] = useState('operator.demo');
  const [password, setPassword] = useState('demo123');

  // Captcha & Validation State
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Rate Limiting State
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS);

  // Check URL params for session timeout notice
  const isSessionTimedOut = new URLSearchParams(location.search).get('timeout') === '1';

  // Check rate limit on mount and tab change
  const syncRateLimitStatus = (roleKey: string) => {
    const status = checkRateLimit(
      `login_${roleKey}`,
      SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS,
      15,
      SECURITY_PROTOCOLS.COOLDOWN_SECONDS / 60
    );
    setRemainingAttempts(status.remainingAttempts);
    if (!status.allowed) {
      setCooldownSeconds(status.retryAfterSeconds);
    }
  };

  useEffect(() => {
    syncRateLimitStatus(activeTab);
  }, [activeTab]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          syncRateLimitStatus(activeTab);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds, activeTab]);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setError(null);
    setFieldErrors({});
    setIsCaptchaValid(false);

    if (role === 'farmer') {
      setMobile('9876543210');
      setOtp('123456');
    } else if (role === 'operator') {
      setUsername('operator.demo');
      setPassword('demo123');
    } else if (role === 'officer') {
      setUsername('officer.demo');
      setPassword('demo123');
    } else if (role === 'helpdesk') {
      setUsername('helpdesk.demo');
      setPassword('demo123');
    }
    syncRateLimitStatus(role);
  };

  const autofillDemo = () => {
    setError(null);
    setFieldErrors({});
    if (activeTab === 'farmer') {
      setMobile('9876543210');
      setOtp('123456');
    } else if (activeTab === 'operator') {
      setUsername('operator.demo');
      setPassword('demo123');
    } else if (activeTab === 'officer') {
      setUsername('officer.demo');
      setPassword('demo123');
    } else if (activeTab === 'helpdesk') {
      setUsername('helpdesk.demo');
      setPassword('demo123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Check if blocked by rate limiter
    const rateStatus = checkRateLimit(
      `login_${activeTab}`,
      SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS,
      15,
      SECURITY_PROTOCOLS.COOLDOWN_SECONDS / 60
    );
    if (!rateStatus.allowed) {
      setCooldownSeconds(rateStatus.retryAfterSeconds);
      setError(`Security Lockdown: Too many failed authentication attempts. Please wait ${rateStatus.retryAfterSeconds} seconds.`);
      return;
    }

    // Strict CAPTCHA verification
    if (!isCaptchaValid) {
      setError('Please solve the visual/audio security Captcha before proceeding.');
      return;
    }

    // Input sanitization & checks
    if (activeTab === 'farmer') {
      const cleanMobile = sanitizeInput(mobile);
      const mobileVal = validateMobile(cleanMobile);
      if (!mobileVal.isValid) {
        setFieldErrors({ mobile: mobileVal.message || 'Invalid mobile number' });
        return;
      }

      const cleanOtp = sanitizeInput(otp);
      if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
        setFieldErrors({ otp: 'OTP must be exactly 6 numeric digits.' });
        return;
      }

      // Demo OTP authentication check
      if (cleanOtp !== '123456') {
        const fail = recordFailedAttempt(
          `login_${activeTab}`,
          SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS,
          15,
          SECURITY_PROTOCOLS.COOLDOWN_SECONDS / 60
        );
        StorageService.addAuditLog({
          userName: `Farmer Mobile: ${cleanMobile}`,
          userRole: 'farmer',
          action: 'LOGIN_FAILED',
          recordRef: cleanMobile,
          reason: 'Incorrect OTP code entered.',
        });
        if (fail.blocked) {
          setCooldownSeconds(fail.retryAfterSeconds);
          setError(`Security Lockdown: Too many failed attempts. Terminal locked for ${fail.retryAfterSeconds}s.`);
        } else {
          syncRateLimitStatus(activeTab);
          setError(`Invalid OTP code entered. You have ${SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS - rateStatus.remainingAttempts + 1} attempt(s) remaining. (Demo OTP: 123456)`);
        }
        return;
      }

      // Login Successful
      resetRateLimit(`login_${activeTab}`);
      StorageService.addAuditLog({
        userName: 'Ramesh Kumar',
        userRole: 'farmer',
        action: 'LOGIN_SUCCESS',
        recordRef: 'farmer-1',
        reason: 'Authorized farmer login with OTP & Captcha verification.',
      });
      login('farmer', 'farmer-1');
      navigate('/farmer/dashboard');
    } else {
      // Staff validation
      const cleanUsername = sanitizeInput(username).trim();
      const cleanPassword = sanitizeInput(password).trim();

      if (!cleanUsername) {
        setFieldErrors({ username: 'Staff username is required.' });
        return;
      }
      if (!cleanPassword) {
        setFieldErrors({ password: 'Password is required.' });
        return;
      }

      const expectedCreds: Record<string, { u: string; p: string; name: string; dest: string }> = {
        operator: { u: 'operator.demo', p: 'demo123', name: 'Centre Operator (GPC-01)', dest: '/operator/dashboard' },
        officer: { u: 'officer.demo', p: 'demo123', name: 'Divisional Officer Sharma', dest: '/officer/dashboard' },
        helpdesk: { u: 'helpdesk.demo', p: 'demo123', name: 'Kiosk Assistant Verma', dest: '/helpdesk/dashboard' },
      };

      const target = expectedCreds[activeTab];
      if (!target || cleanUsername !== target.u || cleanPassword !== target.p) {
        const fail = recordFailedAttempt(
          `login_${activeTab}`,
          SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS,
          15,
          SECURITY_PROTOCOLS.COOLDOWN_SECONDS / 60
        );
        StorageService.addAuditLog({
          userName: cleanUsername || 'Anonymous Staff',
          userRole: activeTab,
          action: 'STAFF_LOGIN_FAILED',
          recordRef: cleanUsername,
          reason: 'Invalid staff credentials supplied.',
        });
        if (fail.blocked) {
          setCooldownSeconds(fail.retryAfterSeconds);
          setError(`Security Lockdown: Too many failed staff logins. Terminal locked for ${fail.retryAfterSeconds}s.`);
        } else {
          syncRateLimitStatus(activeTab);
          setError(`Invalid credentials. Use demo credentials: ${target.u} / ${target.p}`);
        }
        return;
      }

      // Login Successful
      resetRateLimit(`login_${activeTab}`);
      StorageService.addAuditLog({
        userName: target.name,
        userRole: activeTab,
        action: 'STAFF_LOGIN_SUCCESS',
        recordRef: cleanUsername,
        reason: 'Authorized staff login with Captcha verification.',
      });
      login(activeTab);
      navigate(target.dest);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      {/* Session timeout notification */}
      {isSessionTimedOut && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xs flex items-center gap-2.5 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            <strong>Session Expired:</strong> Your previous session timed out automatically after inactivity to comply with cyber security mandates. Please sign in again.
          </span>
        </div>
      )}

      {/* Active session banner if user is already logged in */}
      {isAuthenticated && !isSessionTimedOut && (
        <div className="p-4 bg-[#EAF4EA] border-2 border-[#2E7D32] rounded-xs shadow-xs space-y-2.5 text-xs text-[#1F2933]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />
            <div>
              <span className="font-bold text-[#123B5D] block text-sm">
                Already Logged In / आप पहले से लॉगइन हैं
              </span>
              <span className="text-gray-600 text-[11px]">
                Currently authenticated as: <strong className="text-[#123B5D] font-bold">{role === 'farmer' ? (activeFarmer ? activeFarmer.name : 'Farmer') : role}</strong>
                {role === 'farmer' && activeFarmer && ` (ID: ${activeFarmer.refNumber})`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate(role === 'farmer' ? '/farmer/dashboard' : `/${role}/dashboard`)}
              className="flex-1 bg-[#2E7D32] hover:bg-[#236327] text-white py-2 px-3 rounded-xs font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to My Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="bg-white hover:bg-gray-100 text-red-700 border border-gray-300 py-2 px-3 rounded-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Login Box */}
      <div className="bg-white border border-[#D6DDE5] shadow-md rounded-xs overflow-hidden">
        {/* Header */}
        <div className="bg-[#123B5D] text-white p-5 text-center space-y-2">
          <div className="flex justify-center">
            <GovEmblem size="md" className="[&_span]:text-white [&_span.text-gray-600]:text-gray-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold">KisanSetu Portal Login</h1>
            <p className="text-xs text-gray-200">Department of Consumer Affairs • Govt. of India</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-mono border border-emerald-400/30">
            <Lock className="w-3 h-3" />
            <span>CERT-In Audited • 256-Bit Encrypted</span>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 text-[11px] font-bold text-center">
          <button
            type="button"
            onClick={() => handleTabChange('farmer')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'farmer'
                ? 'border-[#E87524] bg-white text-[#E87524]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Farmer
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('operator')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'operator'
                ? 'border-[#2E7D32] bg-white text-[#2E7D32]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Operator
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('officer')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'officer'
                ? 'border-[#123B5D] bg-white text-[#123B5D]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Officer
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('helpdesk')}
            className={`py-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'helpdesk'
                ? 'border-amber-600 bg-white text-amber-800'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Help Desk
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Demo Hint Banner with 1-Click Autofill */}
          <div className="bg-[#FFF3E8] p-3 rounded-xs border border-[#E87524]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E87524] flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Synthetic Demo Credentials:
              </span>
              <button
                type="button"
                onClick={autofillDemo}
                className="text-[10px] font-bold text-[#123B5D] hover:underline flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-xs border border-[#D6DDE5] cursor-pointer"
                title="Autofill default test credentials"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#E87524]" />
                <span>Autofill</span>
              </button>
            </div>
            {activeTab === 'farmer' ? (
              <p className="text-[11px] text-gray-700">
                Farmer: <strong>Ramesh Kumar</strong> • Mobile: <code className="bg-white px-1 py-0.5 rounded-xs border border-gray-200">9876543210</code> • OTP: <code className="bg-white px-1 py-0.5 rounded-xs border border-gray-200">123456</code>
              </p>
            ) : (
              <p className="text-[11px] text-gray-700">
                Username: <code className="bg-white px-1 py-0.5 rounded-xs border border-gray-200">{username}</code> • Password: <code className="bg-white px-1 py-0.5 rounded-xs border border-gray-200">{password}</code>
              </p>
            )}
          </div>

          {/* Rate limit warning banner if attempts are low */}
          {remainingAttempts < SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS && cooldownSeconds === 0 && (
            <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xs text-[11px] flex items-center justify-between">
              <span>Security notice: Remaining login attempts:</span>
              <span className="font-bold font-mono">{remainingAttempts} of {SECURITY_PROTOCOLS.MAX_LOGIN_ATTEMPTS}</span>
            </div>
          )}

          {/* Active Cooldown Lockout Banner */}
          {cooldownSeconds > 0 && (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 rounded-xs flex items-start gap-2 animate-pulse">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
              <div>
                <strong className="block font-bold">Terminal Security Lockout Active</strong>
                <span className="text-[11px]">
                  Too many consecutive failed attempts. You can retry in <strong>{cooldownSeconds} seconds</strong>.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {activeTab === 'farmer' ? (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Registered Mobile Number / मोबाइल नंबर *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-gray-400 font-medium">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      disabled={cooldownSeconds > 0}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(val);
                        if (val.length === 10) {
                          const v = validateMobile(val);
                          setFieldErrors((prev) => ({ ...prev, mobile: v.isValid ? '' : (v.message || '') }));
                        }
                      }}
                      required
                      placeholder="10-digit mobile"
                      className={`w-full pl-10 pr-3 py-2 border rounded-xs font-mono text-sm focus:outline-hidden ${
                        fieldErrors.mobile ? 'border-red-500 bg-red-50/30' : 'border-[#D6DDE5] focus:border-[#123B5D]'
                      }`}
                    />
                  </div>
                  {fieldErrors.mobile && (
                    <p className="text-[11px] text-red-600">{fieldErrors.mobile}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-[#1F2933] block">
                      Demo OTP Code / ओटीपी *
                    </label>
                    <span className="text-[10px] text-gray-400">Use: 123456</span>
                  </div>
                  <input
                    type="password"
                    value={otp}
                    disabled={cooldownSeconds > 0}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs font-mono text-sm tracking-widest text-center focus:outline-hidden focus:border-[#123B5D]"
                  />
                  {fieldErrors.otp && (
                    <p className="text-[11px] text-red-600">{fieldErrors.otp}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-[#1F2933] block">
                    Staff Username / उपयोगकर्ता नाम *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={username}
                      disabled={cooldownSeconds > 0}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                  {fieldErrors.username && (
                    <p className="text-[11px] text-red-600">{fieldErrors.username}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-[#1F2933] block">
                      Password / पासवर्ड *
                    </label>
                    <Link to="/forgot-password" className="text-[10px] text-[#123B5D] hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      disabled={cooldownSeconds > 0}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 border border-[#D6DDE5] rounded-xs text-xs focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-red-600">{fieldErrors.password}</p>
                  )}
                </div>
              </>
            )}

            {/* Accessible Government Captcha Challenge */}
            <GovCaptcha
              id="login-page-captcha"
              onValidate={(valid) => setIsCaptchaValid(valid)}
            />

            {/* Submission Button */}
            <button
              type="submit"
              disabled={cooldownSeconds > 0 || !isCaptchaValid}
              className={`w-full py-2.5 rounded-xs font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
                cooldownSeconds > 0 || !isCaptchaValid
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#123B5D] hover:bg-[#0e2c45] text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {cooldownSeconds > 0 
                  ? `Locked (${cooldownSeconds}s)` 
                  : !isCaptchaValid 
                  ? 'Enter Captcha to Continue' 
                  : 'Verify & Sign In to Portal'}
              </span>
            </button>
          </form>

          {activeTab === 'farmer' && !isAuthenticated && (
            <div className="pt-3 border-t border-gray-200 text-center space-y-1">
              <span className="text-gray-500">Not yet registered for MSP procurement?</span>
              <Link to="/register" className="block font-bold text-[#E87524] hover:underline">
                New Farmer Registration Form →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
