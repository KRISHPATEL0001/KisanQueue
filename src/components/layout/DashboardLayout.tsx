import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { GovUtilityBar } from '../government/GovUtilityBar';
import { GovHeader } from '../government/GovHeader';
import { TricolorStrip } from '../government/TricolorStrip';
import { GovFooter } from '../government/GovFooter';
import { SessionSecurityWatcher } from '../security/SessionSecurityWatcher';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  FileCheck2,
  CreditCard,
  Bell,
  MessageSquareWarning,
  User,
  Settings,
  PlusCircle,
  QrCode,
  Scale,
  Building2,
  AlertTriangle,
  FileText,
  BarChart3,
  ShieldCheck,
  Printer,
  Search,
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  labelHi: string;
  icon: React.ReactNode;
  badgeCount?: number;
}

export const DashboardLayout: React.FC = () => {
  const { role, activeFarmer, language, unreadCount, lastUpdated, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Role specific navigation definitions
  const farmerNav: NavItem[] = [
    { to: '/farmer/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/farmer/book-slot', label: 'Book Slot', labelHi: 'स्लॉट बुक करें', icon: <CalendarCheck className="w-4 h-4" /> },
    { to: '/farmer/bookings', label: 'My Bookings', labelHi: 'मेरी बुकिंग्स', icon: <FileText className="w-4 h-4" /> },
    { to: '/farmer/queue-status', label: 'Live Queue Status', labelHi: 'कतार स्थिति', icon: <Clock className="w-4 h-4" /> },
    { to: '/farmer/procurement-status', label: 'Procurement & Receipt', labelHi: 'उपार्जन विवरण', icon: <FileCheck2 className="w-4 h-4" /> },
    { to: '/farmer/payment-status', label: 'Payment Status (DBT)', labelHi: 'भुगतान स्थिति', icon: <CreditCard className="w-4 h-4" /> },
    { to: '/farmer/register-crop', label: 'Register Crop', labelHi: 'फसल पंजीकरण', icon: <PlusCircle className="w-4 h-4" /> },
    { to: '/farmer/notifications', label: 'Notifications', labelHi: 'सूचनाएं', icon: <Bell className="w-4 h-4" />, badgeCount: unreadCount },
    { to: '/farmer/complaints', label: 'Complaints / Grievances', labelHi: 'शिकायतें', icon: <MessageSquareWarning className="w-4 h-4" /> },
    { to: '/farmer/profile', label: 'Farmer Profile', labelHi: 'प्रोफ़ाइल', icon: <User className="w-4 h-4" /> },
    { to: '/farmer/settings', label: 'Settings', labelHi: 'सेटिंग्स', icon: <Settings className="w-4 h-4" /> },
  ];

  const operatorNav: NavItem[] = [
    { to: '/operator/dashboard', label: 'Operations Dashboard', labelHi: 'केंद्र डैशबोर्ड', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/operator/today-schedule', label: "Today's Schedule", labelHi: 'दैनिक रोस्टर', icon: <CalendarCheck className="w-4 h-4" /> },
    { to: '/operator/queue', label: 'Live Queue Board', labelHi: 'कतार प्रबंधन', icon: <Clock className="w-4 h-4" /> },
    { to: '/operator/check-in', label: 'Gate Check-In & Token', labelHi: 'गेट चेक-इन', icon: <QrCode className="w-4 h-4" /> },
    { to: '/operator/quality-check', label: 'Quality Inspection', labelHi: 'गुणवत्ता परीक्षण', icon: <FileCheck2 className="w-4 h-4" /> },
    { to: '/operator/weighing', label: 'Weighing & Purchase', labelHi: 'तौल एवं खरीद', icon: <Scale className="w-4 h-4" /> },
    { to: '/operator/purchase-records', label: 'Purchase Records', labelHi: 'खरीद रिकॉर्ड', icon: <FileText className="w-4 h-4" /> },
    { to: '/operator/payment-updates', label: 'Payment Updates', labelHi: 'भुगतान अपडेट', icon: <CreditCard className="w-4 h-4" /> },
    { to: '/operator/capacity', label: 'Capacity Management', labelHi: 'क्षमता प्रबंधन', icon: <Building2 className="w-4 h-4" /> },
    { to: '/operator/disruptions', label: 'Disruption Alerts', labelHi: 'व्यवधान सूचना', icon: <AlertTriangle className="w-4 h-4" /> },
    { to: '/operator/notifications', label: 'Alerts & Messages', labelHi: 'संदेश', icon: <Bell className="w-4 h-4" /> },
    { to: '/operator/settings', label: 'Centre Config', labelHi: 'सेटिंग्स', icon: <Settings className="w-4 h-4" /> },
  ];

  const officerNav: NavItem[] = [
    { to: '/officer/dashboard', label: 'Supervising Dashboard', labelHi: 'पर्यवेक्षण डैशबोर्ड', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/officer/centres', label: 'Procurement Centres', labelHi: 'उपार्जन केंद्र', icon: <Building2 className="w-4 h-4" /> },
    { to: '/officer/capacity-monitor', label: 'Capacity Utilization', labelHi: 'क्षमता निगरानी', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/officer/delayed-transactions', label: 'Delayed Transactions', labelHi: 'विलंबित मामले', icon: <Clock className="w-4 h-4" /> },
    { to: '/officer/payment-monitor', label: 'Payment DBT Tracking', labelHi: 'भुगतान ट्रैकिंग', icon: <CreditCard className="w-4 h-4" /> },
    { to: '/officer/complaints', label: 'Grievance Redressal', labelHi: 'शिकायत निवारण', icon: <MessageSquareWarning className="w-4 h-4" /> },
    { to: '/officer/reports', label: 'State Reports & Analytics', labelHi: 'राज्य रिपोर्ट', icon: <FileText className="w-4 h-4" /> },
    { to: '/officer/audit-log', label: 'Official Audit Trail', labelHi: 'ऑडिट लॉग', icon: <ShieldCheck className="w-4 h-4" /> },
    { to: '/officer/settings', label: 'System Controls', labelHi: 'सिस्टम सेटिंग्स', icon: <Settings className="w-4 h-4" /> },
  ];

  const helpdeskNav: NavItem[] = [
    { to: '/helpdesk/dashboard', label: 'Help Desk Home', labelHi: 'हेल्प डेस्क', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/helpdesk/register-farmer', label: 'Assisted Registration', labelHi: 'सहायता पंजीकरण', icon: <User className="w-4 h-4" /> },
    { to: '/helpdesk/book-slot', label: 'Assisted Slot Booking', labelHi: 'स्लॉट सहायता', icon: <CalendarCheck className="w-4 h-4" /> },
    { to: '/helpdesk/search-farmer', label: 'Search Farmer Record', labelHi: 'किसान खोजें', icon: <Search className="w-4 h-4" /> },
    { to: '/helpdesk/print-token', label: 'Print Token / Slip', labelHi: 'टोकन प्रिंट', icon: <Printer className="w-4 h-4" /> },
    { to: '/helpdesk/complaints', label: 'File Grievance', labelHi: 'शिकायत दर्ज करें', icon: <MessageSquareWarning className="w-4 h-4" /> },
  ];

  let currentNavList: NavItem[] = farmerNav;
  let roleTitle = 'Farmer Portal / किसान पोर्टल';
  let roleBadge = 'bg-[#FFF3E8] text-[#E87524] border-[#E87524]/40';

  if (role === 'operator') {
    currentNavList = operatorNav;
    roleTitle = 'Procurement Centre Operator / केंद्र संचालक';
    roleBadge = 'bg-[#EAF4EA] text-[#2E7D32] border-[#2E7D32]/40';
  } else if (role === 'officer') {
    currentNavList = officerNav;
    roleTitle = 'Supervising Officer Portal / पर्यवेक्षक अधिकारी';
    roleBadge = 'bg-sky-100 text-[#123B5D] border-[#123B5D]/40';
  } else if (role === 'helpdesk') {
    currentNavList = helpdeskNav;
    roleTitle = 'Assisted Help Desk Operator / सहायता केंद्र';
    roleBadge = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  // Generate breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] text-[#1F2933]">
      <GovUtilityBar />
      <GovHeader />
      <TricolorStrip />

      {/* Role Context Bar */}
      <div className="bg-[#123B5D] text-white px-4 py-2 text-xs border-b border-[#0e2c45]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded-xs font-bold text-[11px] border ${roleBadge}`}>
              {roleTitle}
            </span>
            {role === 'farmer' && activeFarmer && (
              <span className="text-gray-200">
                Logged in as: <strong className="text-white">{activeFarmer.name}</strong> ({activeFarmer.refNumber})
              </span>
            )}
            {role === 'operator' && (
              <span className="text-gray-200">
                Operating Centre: <strong className="text-white">Greenfield Procurement Centre (GPC-01)</strong>
              </span>
            )}
            {role === 'officer' && (
              <span className="text-gray-200">
                Supervising Jurisdiction: <strong className="text-white">Pune Division (5 Centres)</strong>
              </span>
            )}
            {role === 'helpdesk' && (
              <span className="text-gray-200">
                Assisted Counter: <strong className="text-white">Counter No. 1 (APMC Mandi Yard)</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-300">
            <span className="hidden sm:inline">Last Sync: {lastUpdated}</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="hover:text-white underline underline-offset-2 cursor-pointer"
            >
              Change Persona
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1 text-red-300 hover:text-red-100 font-semibold cursor-pointer"
              title="Sign out of portal"
            >
              <LogOut className="w-3 h-3" />
              <span>{language === 'hi' ? 'लॉगआउट' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 flex flex-col md:flex-row gap-5">
        {/* Mobile menu toggle bar */}
        <div className="md:hidden flex items-center justify-between bg-white border border-[#D6DDE5] p-3 rounded-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="flex items-center gap-2 text-xs font-bold text-[#123B5D]"
          >
            <Menu className="w-4 h-4" />
            <span>Navigation Menu / कार्य सूची</span>
          </button>
          <span className="text-xs text-gray-500 font-medium capitalize">{role}</span>
        </div>

        {/* Sidebar for Desktop */}
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden sticky top-4">
            <div className="bg-[#123B5D] text-white px-4 py-3 border-b border-[#0e2c45]">
              <div className="text-xs uppercase tracking-wider font-bold">
                {language === 'hi' ? 'नेविगेशन सूची' : 'Portal Modules'}
              </div>
              <div className="text-[11px] text-gray-300 capitalize">
                Role: {role} Mode
              </div>
            </div>

            <nav className="p-1.5 space-y-0.5">
              {currentNavList.map((item) => {
                const isActive = location.pathname === item.to || (item.to !== `/${role}/dashboard` && location.pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-3 py-2 text-xs rounded-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#123B5D] text-white font-bold'
                        : 'text-[#1F2933] hover:bg-[#F5F7F9] hover:text-[#123B5D]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#E87524]' : 'text-[#123B5D]'}>
                        {item.icon}
                      </span>
                      <span>{language === 'hi' ? item.labelHi : item.label}</span>
                    </div>
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="bg-[#E87524] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Assisted Quick Help Box */}
            <div className="p-3 m-2 bg-[#FFF3E8] border border-[#E87524]/30 rounded-xs text-[11px] text-[#1F2933] space-y-1">
              <div className="font-bold text-[#123B5D] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Help Desk Line</span>
              </div>
              <p className="text-gray-600">Dial 1800-180-1551 for assisted slot booking or queries.</p>
            </div>
          </div>
        </aside>

        {/* Mobile slide-out drawer modal */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden" onClick={() => setMobileDrawerOpen(false)}>
            <div 
              className="bg-white w-80 max-w-[85vw] h-full shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-[#123B5D] text-white p-4 flex items-center justify-between border-b border-[#0e2c45]">
                <div>
                  <div className="font-bold text-sm">KisanSetu Portal</div>
                  <div className="text-xs text-gray-300 capitalize flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>{roleTitle}</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-md text-gray-300 hover:text-white bg-white/10 active:bg-white/20 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Farmer/Staff Identity Details in Drawer */}
              <div className="bg-[#F5F7F9] px-4 py-2.5 border-b border-[#D6DDE5] text-xs">
                {role === 'farmer' && activeFarmer && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Farmer Account</span>
                    <strong className="text-[#123B5D] block text-sm">{activeFarmer.name}</strong>
                    <span className="text-[11px] text-gray-600 font-mono">ID: {activeFarmer.refNumber}</span>
                  </div>
                )}
                {role !== 'farmer' && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block font-semibold">Logged Role</span>
                    <strong className="text-[#123B5D] block capitalize text-sm">{role} Mode</strong>
                  </div>
                )}
              </div>

              <div className="p-3 flex-1 overflow-y-auto space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">
                  Module Navigation
                </span>
                {currentNavList.map((item) => {
                  const isActive = location.pathname === item.to || (item.to !== `/${role}/dashboard` && location.pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-3 text-xs rounded-md font-semibold min-h-[44px] transition-colors ${
                        isActive
                          ? 'bg-[#123B5D] text-white shadow-xs'
                          : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-[#E87524]' : 'text-[#123B5D]'}>
                          {item.icon}
                        </span>
                        <span className="text-sm">{language === 'hi' ? item.labelHi : item.label}</span>
                      </div>
                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span className="bg-[#E87524] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Footer Actions: Persona Switcher and Logout */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 pb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigate('/login');
                  }}
                  className="w-full min-h-[42px] bg-white hover:bg-gray-100 text-[#123B5D] border border-gray-300 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:bg-gray-200"
                >
                  <span>Change Persona / रोल बदलें</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileDrawerOpen(false);
                    navigate('/login');
                  }}
                  className="w-full min-h-[44px] bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:bg-red-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'hi' ? 'लॉगआउट करें (Sign Out)' : 'Sign Out of Portal'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <section className="flex-1 min-w-0 flex flex-col">
          {/* Breadcrumbs */}
          <nav className="mb-3 text-xs text-gray-500 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#123B5D] hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="capitalize text-gray-600">{role}</span>
            {pathParts.slice(1).map((part, idx) => (
              <React.Fragment key={part}>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className={`capitalize ${idx === pathParts.length - 2 ? 'font-bold text-[#123B5D]' : 'text-gray-600'}`}>
                  {part.replace(/-/g, ' ')}
                </span>
              </React.Fragment>
            ))}
          </nav>

          {/* Actual Page Body */}
          <div className="flex-1">
            <Outlet />
          </div>
        </section>
      </div>

      <SessionSecurityWatcher />
      <GovFooter />
    </div>
  );
};
