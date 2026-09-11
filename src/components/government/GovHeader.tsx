import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GovEmblem } from './Emblem';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCheck
} from 'lucide-react';

export const GovHeader: React.FC = () => {
  const { role, setRole, activeFarmer, isAuthenticated, login, logout, language } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (newRole: UserRole) => {
    login(newRole);
    setRoleMenuOpen(false);
    if (newRole === 'farmer') navigate('/farmer/dashboard');
    else if (newRole === 'operator') navigate('/operator/dashboard');
    else if (newRole === 'officer') navigate('/officer/dashboard');
    else if (newRole === 'helpdesk') navigate('/helpdesk/dashboard');
  };

  const handleLogout = () => {
    logout();
    setMobileNavOpen(false);
    navigate('/login');
  };

  const getDashboardPath = () => {
    switch (role) {
      case 'farmer': return '/farmer/dashboard';
      case 'operator': return '/operator/dashboard';
      case 'officer': return '/officer/dashboard';
      case 'helpdesk': return '/helpdesk/dashboard';
      default: return '/farmer/dashboard';
    }
  };

  const isDashboard = location.pathname.startsWith('/farmer') || 
    location.pathname.startsWith('/operator') || 
    location.pathname.startsWith('/officer') || 
    location.pathname.startsWith('/helpdesk');

  return (
    <header className="bg-white border-b border-[#D6DDE5] relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <Link to="/" className="flex items-center gap-3.5 focus:outline-hidden group min-w-0 flex-1">
          <div className="shrink-0">
            <GovEmblem size="sm" showText={false} className="sm:hidden" />
            <GovEmblem size="md" showText={false} className="hidden sm:block" />
          </div>
          <div className="flex flex-col border-l-2 border-gray-300 pl-3.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#123B5D] group-hover:text-[#E87524] transition-colors leading-none">
                KisanSetu
              </span>
              <span className="hidden sm:inline-block bg-[#FFF3E8] text-[#E87524] border border-[#E87524]/30 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                ID: 26032
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-semibold text-[#1F2933] truncate leading-tight mt-0.5">
              {language === 'hi' 
                ? 'किसान उपार्जन एवं कतार प्रबंधन प्रणाली' 
                : 'Farmer Procurement & Queue Management System'}
            </span>
            <span className="text-[10px] text-gray-600 hidden lg:inline leading-none mt-0.5">
              Ministry of Consumer Affairs, Food & Public Distribution • Govt. of India
            </span>
          </div>
        </Link>

        {/* Desktop Controls (hidden on mobile, shown on md and up) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Quick Demo Role Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 bg-[#F5F7F9] hover:bg-[#EAF4EA] border border-[#D6DDE5] text-xs font-semibold px-2.5 py-1.5 rounded-md text-[#123B5D] shadow-2xs transition-colors cursor-pointer"
              title="Switch demo persona"
            >
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-gray-500 font-normal">Role:</span>
              <span className="capitalize text-[#123B5D] font-bold">
                {role === 'farmer' ? (activeFarmer ? activeFarmer.name : 'Farmer') : role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-white border border-[#D6DDE5] rounded-md shadow-lg py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-100">
                  Switch Demo Persona
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleChange('farmer')}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-[#FFF3E8] cursor-pointer ${role === 'farmer' ? 'bg-[#FFF3E8] font-bold text-[#E87524]' : 'text-gray-700'}`}
                >
                  <span className="font-semibold">Farmer (Ramesh Kumar)</span>
                  <span className="text-[10px] text-gray-500">Slot booking, queue, payment tracking</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('operator')}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-[#EAF4EA] cursor-pointer ${role === 'operator' ? 'bg-[#EAF4EA] font-bold text-[#2E7D32]' : 'text-gray-700'}`}
                >
                  <span className="font-semibold">Procurement Centre Operator</span>
                  <span className="text-[10px] text-gray-500">Check-in, quality, weighment, disruptions</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('officer')}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-sky-50 cursor-pointer ${role === 'officer' ? 'bg-sky-50 font-bold text-[#123B5D]' : 'text-gray-700'}`}
                >
                  <span className="font-semibold">Supervising Officer</span>
                  <span className="text-[10px] text-gray-500">Multi-centre analytics, delay alerts, audits</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('helpdesk')}
                  className={`w-full text-left px-3 py-2 flex flex-col hover:bg-amber-50 cursor-pointer ${role === 'helpdesk' ? 'bg-amber-50 font-bold text-amber-800' : 'text-gray-700'}`}
                >
                  <span className="font-semibold">Help Desk Operator</span>
                  <span className="text-[10px] text-gray-500">Assisted farmer registration, token reprint</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct Navigation Button based on authentication context */}
          {isAuthenticated ? (
            !isDashboard && (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold px-3 py-2 rounded-sm transition-colors shadow-2xs"
                  title="Go to Active Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>
                    {role === 'farmer' 
                      ? (language === 'hi' ? 'किसान डैशबोर्ड' : 'My Dashboard') 
                      : 'Dashboard'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold px-2.5 py-2 rounded-sm transition-colors cursor-pointer"
                  title="Sign out of portal"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>{language === 'hi' ? 'लॉगआउट' : 'Sign Out'}</span>
                </button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 bg-[#123B5D] hover:bg-[#0e2c45] text-white text-xs font-semibold px-3 py-2 rounded-sm transition-colors shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉगिन' : 'Portal Login'}</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-[#E87524] hover:bg-[#d66619] text-white text-xs font-semibold px-3 py-2 rounded-sm transition-colors shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'किसान पंजीकरण' : 'Register Farmer'}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-gray-700 hover:text-[#123B5D] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer / dropdown when hamburger opened on public pages */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-t border-[#D6DDE5] shadow-lg">
          {/* User Session status banner on mobile */}
          {isAuthenticated && (
            <div className="bg-[#123B5D] text-white px-4 py-3 border-b border-[#0e2c45]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider block">Active Persona</span>
                  <span className="font-bold text-sm text-white capitalize">
                    {role === 'farmer' ? (activeFarmer ? activeFarmer.name : 'Farmer') : role}
                  </span>
                </div>
                <span className="text-xs bg-[#E87524] text-white font-bold px-2 py-0.5 rounded-xs uppercase">
                  {role}
                </span>
              </div>

              {/* Mobile Role Switcher */}
              <div className="mt-2.5 pt-2 border-t border-white/15">
                <span className="text-[10px] text-gray-300 font-semibold uppercase block mb-1.5">Switch Demo Role:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange('farmer');
                      setMobileNavOpen(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded-sm text-xs ${role === 'farmer' ? 'bg-[#E87524] font-bold text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
                  >
                    🌾 Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange('operator');
                      setMobileNavOpen(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded-sm text-xs ${role === 'operator' ? 'bg-[#2E7D32] font-bold text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
                  >
                    ⚖️ Operator
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange('officer');
                      setMobileNavOpen(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded-sm text-xs ${role === 'officer' ? 'bg-sky-600 font-bold text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
                  >
                    📊 Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange('helpdesk');
                      setMobileNavOpen(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded-sm text-xs ${role === 'helpdesk' ? 'bg-amber-600 font-bold text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
                  >
                    🎧 Help Desk
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links with 44px+ touch targets for Android & iOS */}
          <nav className="p-3 space-y-1 text-sm">
            <Link 
              to="/" 
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md hover:bg-gray-100 text-[#1F2933] font-medium active:bg-gray-200"
            >
              Home / मुख्य पृष्ठ
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md hover:bg-gray-100 text-[#1F2933] font-medium active:bg-gray-200"
            >
              About KisanSetu / परिचय
            </Link>
            <Link 
              to="/how-it-works" 
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md hover:bg-gray-100 text-[#1F2933] font-medium active:bg-gray-200"
            >
              How It Works / प्रक्रिया
            </Link>
            <Link 
              to="/announcements" 
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md hover:bg-gray-100 text-[#1F2933] font-medium active:bg-gray-200"
            >
              Announcements & Notices / सूचनाएं
            </Link>
            <Link 
              to="/help" 
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md hover:bg-gray-100 text-[#1F2933] font-medium active:bg-gray-200"
            >
              Help & FAQs / सहायता
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileNavOpen(false)}
                  className="w-full min-h-[44px] bg-[#2E7D32] active:bg-[#236327] text-white rounded-md font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {role === 'farmer' 
                      ? (language === 'hi' ? 'किसान डैशबोर्ड पर जाएं' : 'Go to Farmer Dashboard') 
                      : 'Go to Dashboard'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full min-h-[44px] bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md font-bold flex items-center justify-center gap-2 cursor-pointer active:bg-red-200"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>{language === 'hi' ? 'लॉगआउट करें (Sign Out)' : 'Sign Out of Portal'}</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-full min-h-[44px] bg-[#123B5D] active:bg-[#0e2c45] text-white rounded-md font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Portal / लॉगिन</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-full min-h-[44px] bg-[#E87524] active:bg-[#d66619] text-white rounded-md font-bold flex items-center justify-center gap-2 shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>New Farmer Registration / नया पंजीकरण</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
