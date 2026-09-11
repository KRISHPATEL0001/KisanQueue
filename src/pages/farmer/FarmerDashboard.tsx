import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { Booking, PurchaseRecord, PaymentRecord, NotificationItem } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { PrintableReceipt } from '../../components/ui/PrintableReceipt';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { 
  CalendarCheck, 
  Clock, 
  CreditCard, 
  FileCheck2, 
  PhoneCall, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Bell
} from 'lucide-react';
import { formatCurrencyINR, formatIndianDate } from '../../lib/formatters';
import { calculateLiveQueue } from '../../lib/queueService';

export const FarmerDashboard: React.FC = () => {
  const { activeFarmer, language } = useApp();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [activePurchase, setActivePurchase] = useState<PurchaseRecord | null>(null);
  const [activePayment, setActivePayment] = useState<PaymentRecord | null>(null);
  const [recentNotifs, setRecentNotifs] = useState<NotificationItem[]>([]);
  
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (!activeFarmer) return;
    const bList = StorageService.getBookingsByFarmer(activeFarmer.id);
    setBookings(bList);

    // Pick in-progress or upcoming booking as active
    const active = bList.find(b => b.status === 'in_progress') || bList.find(b => b.status === 'upcoming') || bList[0] || null;
    setActiveBooking(active);

    if (active) {
      const pur = StorageService.getPurchaseByBookingId(active.id);
      setActivePurchase(pur || null);
      if (pur) {
        const pay = StorageService.getPaymentByPurchaseId(pur.id);
        setActivePayment(pay || null);
      }
    }

    const notifs = StorageService.getNotifications(activeFarmer.id).slice(0, 3);
    setRecentNotifs(notifs);
  }, [activeFarmer]);

  // Stage timeline mapping
  const timelineStages = [
    { key: 'BOOKING_CONFIRMED', label: 'Booking Confirmed', labelHi: 'बुकिंग पुष्ट' },
    { key: 'CHECKED_IN', label: 'Checked In', labelHi: 'गेट चेक-इन' },
    { key: 'QUALITY_INSPECTION', label: 'Quality Check', labelHi: 'गुणवत्ता जांच' },
    { key: 'WEIGHING', label: 'Weighing', labelHi: 'इलेक्ट्रॉनिक तौल' },
    { key: 'PURCHASE_RECORDED', label: 'Purchase Completed', labelHi: 'खरीद दर्ज' },
    { key: 'COMPLETED', label: 'Payment Credited', labelHi: 'भुगतान जमा' },
  ];

  const getStageIndex = (stage?: string) => {
    switch (stage) {
      case 'BOOKING_CONFIRMED': return 0;
      case 'CHECKED_IN': return 1;
      case 'QUALITY_INSPECTION': return 2;
      case 'WEIGHING': return 3;
      case 'PURCHASE_RECORDED': return 4;
      case 'PAYMENT_PENDING': return 4;
      case 'COMPLETED': return 5;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(activeBooking?.currentStage);

  const liveQueue = activeBooking
    ? calculateLiveQueue(activeBooking.centreId, activeBooking.tokenNumber)
    : null;

  if (!activeFarmer) {
    return (
      <div className="p-8 text-center bg-white border border-[#D6DDE5] rounded-xs">
        <p className="text-gray-600 text-xs">No active farmer profile loaded.</p>
        <Link to="/login" className="text-xs font-bold text-[#123B5D] underline mt-2 inline-block">
          Select Farmer in Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-[#E87524] uppercase tracking-wider">
            {language === 'hi' ? 'किसान पोर्टल' : 'Official Farmer Portal'} • DBT Integrated
          </div>
          <h1 className="text-xl font-bold text-[#123B5D]">
            {language === 'hi' ? `नमस्ते, ${activeFarmer.name}` : `Good morning, ${activeFarmer.name}`}
          </h1>
          <p className="text-gray-600 text-xs">
            Farmer Reference ID: <strong className="font-mono text-[#1F2933]">{activeFarmer.refNumber}</strong> • 
            Village: <strong>{activeFarmer.village}, {activeFarmer.district}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/farmer/book-slot"
            className="bg-[#E87524] hover:bg-[#d66619] text-white font-bold px-4 py-2 rounded-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book a New Slot</span>
          </Link>
        </div>
      </div>

      {/* Active Booking Hero Card */}
      {activeBooking ? (
        <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
          <div className="bg-[#123B5D] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">
                Active Appointment: {activeBooking.bookingRef}
              </span>
              <Badge variant="saffron" size="sm">
                Token {activeBooking.tokenNumber}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTokenModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-xs text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#E87524]" />
                <span>View / Print Token</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Status Timeline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mandi Queue & Processing Stage (वर्तमान चरण)
                </span>
                <span className="text-[11px] font-semibold text-[#E87524]">
                  {activeBooking.status === 'in_progress' ? '● Real-Time Active in Mandi' : 'Scheduled'}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                {timelineStages.map((stage, idx) => {
                  const isDone = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div
                      key={stage.key}
                      className={`p-2.5 rounded-xs border text-center transition-colors ${
                        isCurrent
                          ? 'bg-[#FFF3E8] border-[#E87524] text-[#123B5D] shadow-xs'
                          : isDone
                          ? 'bg-[#EAF4EA] border-[#18794E]/40 text-[#18794E]'
                          : 'bg-[#F5F7F9] border-[#D6DDE5] text-gray-400'
                      }`}
                    >
                      <div className="flex justify-center mb-1">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#18794E]" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full bg-[#E87524] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                            {idx + 1}
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-300 text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-[11px] leading-tight">
                        {stage.label}
                      </div>
                      <div className="text-[10px] opacity-80">
                        {stage.labelHi}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#F5F7F9] p-4 border border-[#D6DDE5] rounded-xs">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Centre & Location</span>
                <span className="font-bold text-[#123B5D] text-xs block">{activeBooking.centreName}</span>
                <span className="text-[11px] text-gray-500">APMC Mandi Yard</span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Appointment Window</span>
                <span className="font-bold text-[#1F2933] text-xs block">{activeBooking.scheduledDate}</span>
                <span className="text-[11px] text-[#2E7D32] font-semibold">{activeBooking.arrivalWindow}</span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Commodity / Quantity</span>
                <span className="font-bold text-[#123B5D] text-xs block">
                  {activeBooking.cropName} ({activeBooking.estimatedQuantity} qtl)
                </span>
                <span className="text-[11px] text-gray-500">Vehicle: {activeBooking.vehicleNumber || 'Gate Entry Pending'}</span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Yard Queue & Wait</span>
                {liveQueue ? (
                  <div>
                    <span className="font-bold text-[#123B5D] text-xs block">
                      Serving: <strong className="font-mono text-emerald-700">{liveQueue.activeServingToken}</strong> ({liveQueue.tokensAheadCount} ahead)
                    </span>
                    <Link
                      to="/farmer/queue-status"
                      className="text-[10px] text-[#E87524] font-bold hover:underline flex items-center gap-0.5 mt-0.5"
                    >
                      <span>Live Yard Tracker</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-amber-700 text-xs block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      30–50 Minutes
                    </span>
                    <span className="text-[10px] text-gray-500">Based on standard queue</span>
                  </div>
                )}
              </div>
            </div>

            {/* Procurement & Payment summary if available */}
            {activePurchase && (
              <div className="bg-[#EAF4EA] border border-[#18794E]/40 p-4 rounded-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[#18794E] uppercase">
                    Procurement Recorded (Receipt: {activePurchase.purchaseRef})
                  </span>
                  <div className="text-sm font-bold text-[#123B5D]">
                    Net Weight: {activePurchase.netQuantityQuintals} qtl • Value: {formatCurrencyINR(activePurchase.totalAmount)}
                  </div>
                  <div className="text-[11px] text-gray-700 mt-0.5">
                    Payment Status: <strong className="capitalize text-[#18794E]">{activePayment?.status || 'Awaiting Approval'}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReceiptModal(true)}
                    className="bg-[#18794E] hover:bg-[#13623f] text-white px-3 py-1.5 rounded-xs font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs text-center space-y-3">
          <p className="text-gray-600 text-xs">You have no upcoming or active procurement bookings.</p>
          <Link
            to="/farmer/book-slot"
            className="inline-block bg-[#E87524] text-white font-bold px-4 py-2 rounded-xs text-xs"
          >
            Book a Procurement Slot Now
          </Link>
        </div>
      )}

      {/* Quick Action Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Link
          to="/farmer/book-slot"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] hover:bg-[#FFF3E8] p-3.5 rounded-xs text-center space-y-1 transition-colors group shadow-2xs"
        >
          <CalendarCheck className="w-5 h-5 text-[#E87524] mx-auto group-hover:scale-110 transition-transform" />
          <div className="font-bold text-[#123B5D]">Book a Slot</div>
          <div className="text-[10px] text-gray-500">स्लॉट बुक करें</div>
        </Link>

        <Link
          to="/farmer/queue-status"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] hover:bg-[#FFF3E8] p-3.5 rounded-xs text-center space-y-1 transition-colors group shadow-2xs"
        >
          <Clock className="w-5 h-5 text-[#123B5D] mx-auto group-hover:scale-110 transition-transform" />
          <div className="font-bold text-[#123B5D]">Track Queue</div>
          <div className="text-[10px] text-gray-500">कतार स्थिति</div>
        </Link>

        <Link
          to="/farmer/payment-status"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] hover:bg-[#FFF3E8] p-3.5 rounded-xs text-center space-y-1 transition-colors group shadow-2xs"
        >
          <CreditCard className="w-5 h-5 text-[#2E7D32] mx-auto group-hover:scale-110 transition-transform" />
          <div className="font-bold text-[#123B5D]">Check Payment</div>
          <div className="text-[10px] text-gray-500">भुगतान स्थिति</div>
        </Link>

        <Link
          to="/farmer/procurement-status"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] hover:bg-[#FFF3E8] p-3.5 rounded-xs text-center space-y-1 transition-colors group shadow-2xs"
        >
          <FileCheck2 className="w-5 h-5 text-[#123B5D] mx-auto group-hover:scale-110 transition-transform" />
          <div className="font-bold text-[#123B5D]">Download Receipt</div>
          <div className="text-[10px] text-gray-500">उपार्जन रसीद</div>
        </Link>

        <Link
          to="/help"
          className="bg-white border border-[#D6DDE5] hover:border-[#123B5D] hover:bg-[#FFF3E8] p-3.5 rounded-xs text-center space-y-1 transition-colors group shadow-2xs col-span-2 sm:col-span-1"
        >
          <PhoneCall className="w-5 h-5 text-amber-600 mx-auto group-hover:scale-110 transition-transform" />
          <div className="font-bold text-[#123B5D]">Contact Help Desk</div>
          <div className="text-[10px] text-gray-500">सहायता केंद्र</div>
        </Link>
      </div>

      {/* Recent Notifications Widget */}
      <div className="bg-white border border-[#D6DDE5] p-5 rounded-xs shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-gray-200">
          <h2 className="font-bold text-[#123B5D] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#E87524]" />
            <span>Recent Official Notifications & SMS Alerts (नवीनतम सूचनाएं)</span>
          </h2>
          <Link to="/farmer/notifications" className="text-xs font-semibold text-[#123B5D] hover:underline">
            View All ({recentNotifs.length}) →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentNotifs.map((n) => (
            <div key={n.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-[#1F2933] flex items-center gap-2">
                  <span>{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#E87524]" title="Unread" />
                  )}
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">{n.message}</p>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                {formatIndianDate(n.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Token Slip */}
      {showTokenModal && activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowTokenModal(false)}>
          <div className="max-w-xl w-full" onClick={e => e.stopPropagation()}>
            <PrintableToken booking={activeBooking} onClose={() => setShowTokenModal(false)} />
          </div>
        </div>
      )}

      {/* Modal for Purchase Receipt */}
      {showReceiptModal && activePurchase && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowReceiptModal(false)}>
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <PrintableReceipt purchase={activePurchase} payment={activePayment || undefined} onClose={() => setShowReceiptModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
