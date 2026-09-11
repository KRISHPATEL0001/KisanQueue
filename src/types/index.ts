export type UserRole = 'farmer' | 'operator' | 'officer' | 'helpdesk';

export type Language = 'en' | 'hi';

export type QueueStage = 
  | 'BOOKING_CONFIRMED'
  | 'CHECKED_IN'
  | 'QUALITY_INSPECTION'
  | 'WEIGHING'
  | 'PURCHASE_RECORDED'
  | 'PAYMENT_PENDING'
  | 'COMPLETED';

export type BookingStatus = 
  | 'upcoming' 
  | 'checked_in' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'rescheduled'
  | 'delayed';

export type QualityStatus = 
  | 'pending'
  | 'approved'
  | 'requires_rechecking'
  | 'partially_approved'
  | 'rejected';

export type PaymentStatus = 
  | 'awaiting_approval'
  | 'submitted'
  | 'processing'
  | 'credited'
  | 'failed'
  | 'returned'
  | 'partially_credited';

export type DisruptionType = 
  | 'weighing_machine_failure'
  | 'centre_closure'
  | 'power_failure'
  | 'storage_full'
  | 'transport_unavailable'
  | 'staff_shortage'
  | 'internet_outage'
  | 'quality_equipment_failure';

export type ComplaintCategory = 
  | 'long_waiting_time'
  | 'centre_closed'
  | 'payment_delayed'
  | 'quality_issue'
  | 'booking_problem'
  | 'staff_behaviour'
  | 'other';

export type ComplaintStatus = 
  | 'submitted'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed';

export interface CropInfo {
  id: string;
  name: string;
  nameHi: string;
  mspRatePerQuintal: number;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  maxMoisturePct: number;
}

export interface Farmer {
  id: string;
  refNumber: string; // e.g. FRM-MH-2026-8891
  name: string;
  nameHi?: string;
  mobile: string;
  preferredLanguage: Language;
  village: string;
  block: string;
  district: string;
  state: string;
  bankAccountMasked: string;
  ifscMasked: string;
  bankVerificationStatus: 'verified' | 'pending' | 'rejected';
  registeredCrops: {
    cropId: string;
    cropName: string;
    estimatedQuintals: number;
    harvestDate: string;
  }[];
  createdAt: string;
}

export interface ProcurementCentre {
  id: string;
  code: string;
  name: string;
  nameHi?: string;
  district: string;
  state: string;
  address: string;
  contactPhone: string;
  officerInCharge: string;
  operatingStatus: 'normal' | 'near_capacity' | 'delayed' | 'disrupted' | 'closed';
  dailyCapacityQuintals: number;
  operationalReserveQuintals: number;
  bookedTodayQuintals: number;
  storageCapacityQuintals: number;
  storageFilledQuintals: number;
  activeInspectors: number;
  activeWeighingBridges: number;
  waitingFarmersCount: number;
  averageWaitMinutes: number;
  isBookingPaused: boolean;
  pauseReason?: string;
  supportedCrops: string[];
}

export interface Booking {
  id: string;
  bookingRef: string; // e.g. KS-WHT-1042
  tokenNumber: string; // e.g. T-038
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centreId: string;
  centreName: string;
  cropId: string;
  cropName: string;
  estimatedQuantity: number; // quintals
  acceptedQuantity?: number;
  scheduledDate: string; // DD-MM-YYYY
  arrivalWindow: string; // e.g. 09:00 AM - 11:00 AM
  status: BookingStatus;
  currentStage: QueueStage;
  vehicleNumber?: string;
  actualArrivalTimestamp?: string;
  notes?: string;
  isDelayed?: boolean;
  delayReason?: string;
  priorityChangedReason?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface QualityInspection {
  id: string;
  bookingId: string;
  bookingRef: string;
  inspectorName: string;
  inspectedAt: string;
  cropName: string;
  moisturePct: number;
  foreignMatterPct: number;
  damagedGrainsPct: number;
  status: QualityStatus;
  remarks: string;
  rejectionReason?: string;
  documentMockUrl?: string;
}

export interface PurchaseRecord {
  id: string;
  purchaseRef: string; // e.g. PUR-2026-9042
  bookingId: string;
  bookingRef: string;
  farmerId: string;
  farmerName: string;
  centreId: string;
  centreName: string;
  cropName: string;
  ratePerQuintal: number;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  netQuantityQuintals: number;
  deductionQuintals?: number;
  payableQuantityQuintals: number;
  totalAmount: number; // ₹
  operatorName: string;
  recordedAt: string;
  receiptGenerated: boolean;
  status: 'draft' | 'completed' | 'cancelled';
  qualityGrade?: string;
}

export interface PaymentRecord {
  id: string;
  paymentRef?: string; // e.g. PAY-2026-00142 (only when submitted/credited)
  purchaseId: string;
  purchaseRef: string;
  bookingRef: string;
  farmerId: string;
  farmerName: string;
  bankAccountMasked: string;
  amount: number;
  status: PaymentStatus;
  stageTimestamps: {
    purchaseRecorded: string;
    awaitingApproval: string;
    submitted?: string;
    verified?: string;
    credited?: string;
    failed?: string;
  };
  verifiedAt?: string;
  creditedAt?: string;
  initiatedAt?: string;
  responsibleOffice: string;
  failureReason?: string;
  lastUpdated: string;
}

export interface CentreDisruption {
  id: string;
  centreId: string;
  centreName: string;
  type: DisruptionType;
  title: string;
  description: string;
  affectedDate: string;
  affectedSlots: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'mitigated' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  assignedTo: string;
  suggestedAction: string;
}

export type Grievance = FarmerComplaint;

export interface FarmerComplaint {
  id: string;
  complaintRef: string; // e.g. CMP-2026-0812
  ticketRef?: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  centreId?: string;
  centreName?: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  priority: 'normal' | 'urgent';
  assignedOfficer?: string;
  submittedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // farmerId or 'all' or role
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  type: 'booking' | 'queue' | 'disruption' | 'quality' | 'payment' | 'system' | 'reminder';
  priority: 'normal' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  centreId?: string;
  centreName?: string;
  action: string;
  recordRef: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
}
