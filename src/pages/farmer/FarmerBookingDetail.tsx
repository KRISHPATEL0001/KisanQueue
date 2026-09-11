import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StorageService } from '../../services/storageService';
import { Booking, PurchaseRecord, PaymentRecord } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { PrintableToken } from '../../components/ui/PrintableToken';
import { PrintableReceipt } from '../../components/ui/PrintableReceipt';
import { 
  ArrowLeft, 
  Printer, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  Scale
} from 'lucide-react';
import { formatCurrencyINR } from '../../lib/formatters';

export const FarmerBookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [purchase, setPurchase] = useState<PurchaseRecord | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (!id) return;
    const b = StorageService.getBookingById(id);
    setBooking(b || null);
    if (b) {
      const pur = StorageService.getPurchaseByBookingId(b.id);
      setPurchase(pur || null);
      if (pur) {
        setPayment(StorageService.getPaymentByPurchaseId(pur.id) || null);
      }
    }
  }, [id]);

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white border border-[#D6DDE5] rounded-xs space-y-3">
        <p className="text-gray-600 text-xs">Booking record not found.</p>
        <Link to="/farmer/bookings" className="text-xs font-bold text-[#123B5D] underline">
          Return to Bookings List
        </Link>
      </div>
    );
  }

  const centre = StorageService.getCentres().find(c => c.id === booking.centreId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs pb-8">
      {/* Back Button */}
      <Link to="/farmer/bookings" className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#123B5D] font-bold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Bookings</span>
      </Link>

      {/* Main Details Card */}
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-2xs overflow-hidden">
        <div className="bg-[#123B5D] text-white p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-[#E87524] font-bold uppercase tracking-wider">
              Procurement Appointment Dossier
            </div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>{booking.bookingRef}</span>
              <Badge variant="saffron" size="sm">Token {booking.tokenNumber}</Badge>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowToken(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#E87524]" />
              <span>Print Token Slip</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F7F9] p-4 border border-[#D6DDE5] rounded-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Farmer Name</span>
              <span className="font-bold text-[#1F2933]">{booking.farmerName}</span>
              <span className="text-[10px] text-gray-500 block font-mono">{booking.farmerPhone}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Commodity</span>
              <span className="font-bold text-[#123B5D]">{booking.cropName}</span>
              <span className="text-[10px] text-gray-500 block">Declared: {booking.estimatedQuantity} qtl</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Scheduled Window</span>
              <span className="font-bold text-[#1F2933]">{booking.scheduledDate}</span>
              <span className="text-[10px] text-[#2E7D32] block font-semibold">{booking.arrivalWindow}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Operational Status</span>
              <Badge variant={booking.status === 'completed' ? 'success' : 'warning'}>
                {booking.status.toUpperCase()}
              </Badge>
              <span className="text-[10px] text-[#E87524] block mt-1 font-semibold">{booking.currentStage.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Centre & Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#D6DDE5] rounded-xs space-y-2">
              <h3 className="font-bold text-[#123B5D] flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-[#E87524]" />
                <span>Procurement Centre Details</span>
              </h3>
              <div className="text-xs space-y-0.5 text-gray-700">
                <div className="font-bold">{booking.centreName}</div>
                <div>{centre?.address || 'APMC Mandi Main Yard'}</div>
                <div className="text-gray-500">Contact In-charge: {centre?.contactPhone || '1800-180-1551'}</div>
              </div>
            </div>

            <div className="p-4 border border-[#D6DDE5] rounded-xs space-y-2">
              <h3 className="font-bold text-[#123B5D] flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-[#2E7D32]" />
                <span>Mandatory Documents Checklist</span>
              </h3>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#18794E]" />
                  <span>KisanSetu Printed Token Slip or SMS</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#18794E]" />
                  <span>Original Aadhaar Card for biometric/gate verification</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#18794E]" />
                  <span>Bank Passbook copy (Aadhaar DBT seeded)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Purchase Result if exists */}
          {purchase && (
            <div className="p-4 bg-[#EAF4EA] border border-[#18794E]/40 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#18794E] flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Official Purchase Weighment Record ({purchase.purchaseRef})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  className="bg-[#18794E] text-white px-3 py-1 rounded-xs font-bold text-xs hover:bg-[#13623f] cursor-pointer"
                >
                  View Digital Receipt →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase block">Accepted Net Weight</span>
                  <span className="font-bold text-[#1F2933]">{purchase.netQuantityQuintals} qtl</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase block">Government MSP</span>
                  <span className="font-bold text-[#1F2933]">₹{purchase.ratePerQuintal}/qtl</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase block">Total Sanctioned</span>
                  <span className="font-bold text-[#18794E] text-sm">{formatCurrencyINR(purchase.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase block">Payment Status</span>
                  <span className="font-bold capitalize text-[#123B5D]">{payment?.status || 'Submitted'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Token Slip */}
      {showToken && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowToken(false)}>
          <div className="max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
            <PrintableToken booking={booking} onClose={() => setShowToken(false)} />
          </div>
        </div>
      )}

      {/* Modal for Purchase Receipt */}
      {showReceipt && purchase && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowReceipt(false)}>
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <PrintableReceipt purchase={purchase} payment={payment || undefined} onClose={() => setShowReceipt(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
