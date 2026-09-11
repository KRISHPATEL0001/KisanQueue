import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AnnouncementsPage } from './pages/public/AnnouncementsPage';
import { HelpPage } from './pages/public/HelpPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerBookSlot } from './pages/farmer/FarmerBookSlot';
import { FarmerBookings } from './pages/farmer/FarmerBookings';
import { FarmerBookingDetail } from './pages/farmer/FarmerBookingDetail';
import { FarmerQueueStatus } from './pages/farmer/FarmerQueueStatus';
import { FarmerProcurementStatus } from './pages/farmer/FarmerProcurementStatus';
import { FarmerPaymentStatus } from './pages/farmer/FarmerPaymentStatus';
import { FarmerRegisterCrop } from './pages/farmer/FarmerRegisterCrop';
import { FarmerNotifications } from './pages/farmer/FarmerNotifications';
import { FarmerComplaints } from './pages/farmer/FarmerComplaints';
import { FarmerProfile } from './pages/farmer/FarmerProfile';
import { FarmerSettings } from './pages/farmer/FarmerSettings';

// Operator Pages
import { OperatorDashboard } from './pages/operator/OperatorDashboard';
import { OperatorSchedule } from './pages/operator/OperatorSchedule';
import { OperatorQueueBoard } from './pages/operator/OperatorQueueBoard';
import { OperatorCheckIn } from './pages/operator/OperatorCheckIn';
import { OperatorQualityCheck } from './pages/operator/OperatorQualityCheck';
import { OperatorWeighing } from './pages/operator/OperatorWeighing';
import { OperatorPurchaseRecords } from './pages/operator/OperatorPurchaseRecords';
import { OperatorPaymentUpdates } from './pages/operator/OperatorPaymentUpdates';
import { OperatorCapacity } from './pages/operator/OperatorCapacity';
import { OperatorDisruptions } from './pages/operator/OperatorDisruptions';
import { OperatorSettings } from './pages/operator/OperatorSettings';

// Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { OfficerCentres } from './pages/officer/OfficerCentres';
import { OfficerCapacityMonitor } from './pages/officer/OfficerCapacityMonitor';
import { OfficerDelayedTransactions } from './pages/officer/OfficerDelayedTransactions';
import { OfficerPaymentMonitor } from './pages/officer/OfficerPaymentMonitor';
import { OfficerGrievances } from './pages/officer/OfficerGrievances';
import { OfficerReports } from './pages/officer/OfficerReports';
import { OfficerAuditLog } from './pages/officer/OfficerAuditLog';
import { OfficerSettings } from './pages/officer/OfficerSettings';

// Helpdesk Pages
import { HelpdeskDashboard } from './pages/helpdesk/HelpdeskDashboard';
import { HelpdeskRegisterFarmer } from './pages/helpdesk/HelpdeskRegisterFarmer';
import { HelpdeskBookSlot } from './pages/helpdesk/HelpdeskBookSlot';
import { HelpdeskSearchFarmer } from './pages/helpdesk/HelpdeskSearchFarmer';
import { HelpdeskPrintToken } from './pages/helpdesk/HelpdeskPrintToken';
import { HelpdeskComplaints } from './pages/helpdesk/HelpdeskComplaints';

// AI Helpbot
import { MayaHelpbot } from './components/chat/MayaHelpbot';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Portal Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Farmer Portal Routes */}
          <Route path="/farmer" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/farmer/dashboard" replace />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="book-slot" element={<FarmerBookSlot />} />
            <Route path="bookings" element={<FarmerBookings />} />
            <Route path="bookings/:id" element={<FarmerBookingDetail />} />
            <Route path="queue-status" element={<FarmerQueueStatus />} />
            <Route path="procurement-status" element={<FarmerProcurementStatus />} />
            <Route path="payment-status" element={<FarmerPaymentStatus />} />
            <Route path="register-crop" element={<FarmerRegisterCrop />} />
            <Route path="notifications" element={<FarmerNotifications />} />
            <Route path="complaints" element={<FarmerComplaints />} />
            <Route path="profile" element={<FarmerProfile />} />
            <Route path="settings" element={<FarmerSettings />} />
          </Route>

          {/* Operator Portal Routes */}
          <Route path="/operator" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/operator/dashboard" replace />} />
            <Route path="dashboard" element={<OperatorDashboard />} />
            <Route path="today-schedule" element={<OperatorSchedule />} />
            <Route path="queue" element={<OperatorQueueBoard />} />
            <Route path="check-in" element={<OperatorCheckIn />} />
            <Route path="quality-check" element={<OperatorQualityCheck />} />
            <Route path="weighing" element={<OperatorWeighing />} />
            <Route path="purchase-records" element={<OperatorPurchaseRecords />} />
            <Route path="payment-updates" element={<OperatorPaymentUpdates />} />
            <Route path="capacity" element={<OperatorCapacity />} />
            <Route path="disruptions" element={<OperatorDisruptions />} />
            <Route path="notifications" element={<FarmerNotifications />} />
            <Route path="settings" element={<OperatorSettings />} />
          </Route>

          {/* Officer Portal Routes */}
          <Route path="/officer" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/officer/dashboard" replace />} />
            <Route path="dashboard" element={<OfficerDashboard />} />
            <Route path="centres" element={<OfficerCentres />} />
            <Route path="capacity-monitor" element={<OfficerCapacityMonitor />} />
            <Route path="delayed-transactions" element={<OfficerDelayedTransactions />} />
            <Route path="payment-monitor" element={<OfficerPaymentMonitor />} />
            <Route path="complaints" element={<OfficerGrievances />} />
            <Route path="reports" element={<OfficerReports />} />
            <Route path="audit-log" element={<OfficerAuditLog />} />
            <Route path="settings" element={<OfficerSettings />} />
          </Route>

          {/* Helpdesk Portal Routes */}
          <Route path="/helpdesk" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/helpdesk/dashboard" replace />} />
            <Route path="dashboard" element={<HelpdeskDashboard />} />
            <Route path="register-farmer" element={<HelpdeskRegisterFarmer />} />
            <Route path="book-slot" element={<HelpdeskBookSlot />} />
            <Route path="search-farmer" element={<HelpdeskSearchFarmer />} />
            <Route path="print-token" element={<HelpdeskPrintToken />} />
            <Route path="complaints" element={<HelpdeskComplaints />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <MayaHelpbot />
      </Router>
    </AppProvider>
  );
}
