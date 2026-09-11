import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { GovUtilityBar } from '../government/GovUtilityBar';
import { GovHeader } from '../government/GovHeader';
import { TricolorStrip } from '../government/TricolorStrip';
import { GovFooter } from '../government/GovFooter';
import { SessionSecurityWatcher } from '../security/SessionSecurityWatcher';
import { 
  Home, 
  Info, 
  HelpCircle, 
  FileText, 
  Bell, 
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const { language, isAuthenticated, role } = useApp();

  const navLinks = [
    { to: '/', label: 'Home', labelHi: 'मुख्य पृष्ठ', icon: <Home className="w-4 h-4" /> },
    { to: '/about', label: 'About', labelHi: 'परिचय', icon: <Info className="w-4 h-4" /> },
    { to: '/how-it-works', label: 'How It Works', labelHi: 'कार्यप्रणाली', icon: <FileText className="w-4 h-4" /> },
    { to: '/announcements', label: 'Announcements', labelHi: 'घोषणाएं', icon: <Bell className="w-4 h-4" /> },
    { to: '/help', label: 'Help & FAQs', labelHi: 'सहायता', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#1F2933]">
      <GovUtilityBar />
      <GovHeader />
      <TricolorStrip />

      {/* Primary Public Navigation Bar */}
      <nav className="bg-[#123B5D] text-white hidden md:block border-b border-[#0e2c45]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#E87524] bg-[#0e2c45] text-white'
                      : 'border-transparent text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'hi' ? item.labelHi : item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={role === 'farmer' ? '/farmer/dashboard' : `/${role}/dashboard`}
                className="flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-xs transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="flex items-center gap-1 bg-[#E87524] hover:bg-[#d66619] text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-xs transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नया पंजीकरण' : 'Farmer Registration'}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <SessionSecurityWatcher />
      <GovFooter />
    </div>
  );
};
