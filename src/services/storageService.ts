import { 
  Farmer, 
  ProcurementCentre, 
  CropInfo, 
  Booking, 
  QualityInspection, 
  PurchaseRecord, 
  PaymentRecord, 
  CentreDisruption, 
  FarmerComplaint, 
  NotificationItem, 
  AuditLogEntry,
  UserRole,
  Language,
  PaymentStatus,
  QualityStatus
} from '../types';

import {
  INITIAL_CROPS,
  INITIAL_FARMERS,
  INITIAL_CENTRES,
  INITIAL_BOOKINGS,
  INITIAL_QUALITY_CHECKS,
  INITIAL_PURCHASES,
  INITIAL_PAYMENTS,
  INITIAL_DISRUPTIONS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

import { 
  generateBookingRef, 
  generateTokenNumber, 
  generateFarmerRef, 
  generatePaymentRef, 
  generatePurchaseRef,
  generateComplaintRef
} from '../lib/formatters';

const STORAGE_KEYS = {
  CROPS: 'kisansetu_crops_v1',
  FARMERS: 'kisansetu_farmers_v1',
  CENTRES: 'kisansetu_centres_v1',
  BOOKINGS: 'kisansetu_bookings_v1',
  QUALITY: 'kisansetu_quality_v1',
  PURCHASES: 'kisansetu_purchases_v1',
  PAYMENTS: 'kisansetu_payments_v1',
  DISRUPTIONS: 'kisansetu_disruptions_v1',
  COMPLAINTS: 'kisansetu_complaints_v1',
  NOTIFICATIONS: 'kisansetu_notifications_v1',
  AUDIT_LOGS: 'kisansetu_audit_logs_v1',
  USER_ROLE: 'kisansetu_active_role_v1',
  ACTIVE_FARMER_ID: 'kisansetu_active_farmer_id_v1',
  AUTH_SESSION: 'kisansetu_auth_session_v1',
  LANGUAGE: 'kisansetu_language_v1',
  ACCESSIBILITY: 'kisansetu_accessibility_v1',
};

function getStoredItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
}

function setStoredItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Trigger custom window event for reactive component syncing
    window.dispatchEvent(new Event('kisansetu_storage_change'));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
      setStoredItem(STORAGE_KEYS.CROPS, INITIAL_CROPS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FARMERS)) {
      setStoredItem(STORAGE_KEYS.FARMERS, INITIAL_FARMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CENTRES)) {
      setStoredItem(STORAGE_KEYS.CENTRES, INITIAL_CENTRES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      setStoredItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUALITY)) {
      setStoredItem(STORAGE_KEYS.QUALITY, INITIAL_QUALITY_CHECKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
      setStoredItem(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      setStoredItem(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DISRUPTIONS)) {
      setStoredItem(STORAGE_KEYS.DISRUPTIONS, INITIAL_DISRUPTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      setStoredItem(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      setStoredItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_ROLE)) {
      setStoredItem(STORAGE_KEYS.USER_ROLE, 'farmer');
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_FARMER_ID)) {
      setStoredItem(STORAGE_KEYS.ACTIVE_FARMER_ID, 'farmer-1'); // Default Ramesh Kumar
    }
    if (!localStorage.getItem(STORAGE_KEYS.LANGUAGE)) {
      setStoredItem(STORAGE_KEYS.LANGUAGE, 'en');
    }
  },

  resetToDemoDefaults() {
    setStoredItem(STORAGE_KEYS.CROPS, INITIAL_CROPS);
    setStoredItem(STORAGE_KEYS.FARMERS, INITIAL_FARMERS);
    setStoredItem(STORAGE_KEYS.CENTRES, INITIAL_CENTRES);
    setStoredItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setStoredItem(STORAGE_KEYS.QUALITY, INITIAL_QUALITY_CHECKS);
    setStoredItem(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
    setStoredItem(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    setStoredItem(STORAGE_KEYS.DISRUPTIONS, INITIAL_DISRUPTIONS);
    setStoredItem(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    setStoredItem(STORAGE_KEYS.USER_ROLE, 'farmer');
    setStoredItem(STORAGE_KEYS.ACTIVE_FARMER_ID, 'farmer-1');
  },

  // Role & Session
  isAuthenticated(): boolean {
    return getStoredItem<boolean>(STORAGE_KEYS.AUTH_SESSION, true);
  },
  setAuthenticated(isAuth: boolean) {
    setStoredItem(STORAGE_KEYS.AUTH_SESSION, isAuth);
  },
  getUserRole(): UserRole {
    return getStoredItem<UserRole>(STORAGE_KEYS.USER_ROLE, 'farmer');
  },
  setUserRole(role: UserRole) {
    setStoredItem(STORAGE_KEYS.USER_ROLE, role);
  },
  getActiveFarmerId(): string {
    return getStoredItem<string>(STORAGE_KEYS.ACTIVE_FARMER_ID, 'farmer-1');
  },
  setActiveFarmerId(id: string) {
    setStoredItem(STORAGE_KEYS.ACTIVE_FARMER_ID, id);
  },
  getLanguage(): Language {
    return getStoredItem<Language>(STORAGE_KEYS.LANGUAGE, 'en');
  },
  setLanguage(lang: Language) {
    setStoredItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Farmers
  getFarmers(): Farmer[] {
    return getStoredItem<Farmer[]>(STORAGE_KEYS.FARMERS, INITIAL_FARMERS);
  },
  getFarmerById(id: string): Farmer | undefined {
    return this.getFarmers().find(f => f.id === id);
  },
  getFarmerByMobile(mobile: string): Farmer | undefined {
    return this.getFarmers().find(f => f.mobile === mobile);
  },
  registerFarmer(farmerData: Omit<Farmer, 'id' | 'refNumber' | 'createdAt'>): Farmer {
    const farmers = this.getFarmers();
    const newFarmer: Farmer = {
      ...farmerData,
      id: `farmer-${Date.now()}`,
      refNumber: generateFarmerRef('MH', 2026),
      createdAt: new Date().toISOString(),
    };
    farmers.push(newFarmer);
    setStoredItem(STORAGE_KEYS.FARMERS, farmers);
    this.addAuditLog({
      userName: newFarmer.name,
      userRole: 'farmer',
      action: 'FARMER_REGISTERED',
      recordRef: newFarmer.refNumber,
      reason: `New farmer registered from village ${newFarmer.village}`,
    });
    return newFarmer;
  },

  // Crops
  getCrops(): CropInfo[] {
    return getStoredItem<CropInfo[]>(STORAGE_KEYS.CROPS, INITIAL_CROPS);
  },

  // Centres
  getCentres(): ProcurementCentre[] {
    return getStoredItem<ProcurementCentre[]>(STORAGE_KEYS.CENTRES, INITIAL_CENTRES);
  },
  getCentreById(id: string): ProcurementCentre | undefined {
    return this.getCentres().find(c => c.id === id);
  },
  updateCentreCapacity(centreId: string, dailyCapacity: number, bufferOrReason?: number | string, updatedBy: string = 'Procurement Officer') {
    const centres = this.getCentres();
    const idx = centres.findIndex(c => c.id === centreId);
    if (idx !== -1) {
      const oldCap = centres[idx].dailyCapacityQuintals;
      centres[idx].dailyCapacityQuintals = dailyCapacity;
      if (typeof bufferOrReason === 'number') {
        centres[idx].operationalReserveQuintals = bufferOrReason;
      }
      setStoredItem(STORAGE_KEYS.CENTRES, centres);
      this.addAuditLog({
        userName: updatedBy,
        userRole: 'operator',
        centreId,
        centreName: centres[idx].name,
        action: 'CAPACITY_UPDATED',
        recordRef: centres[idx].code,
        previousStatus: `${oldCap} qtl`,
        newStatus: `${dailyCapacity} qtl`,
        reason: typeof bufferOrReason === 'string' ? bufferOrReason : 'Capacity adjustment',
      });
    }
  },
  toggleCentreBookingPause(centreId: string, isPaused: boolean, reason: string, updatedBy: string) {
    const centres = this.getCentres();
    const idx = centres.findIndex(c => c.id === centreId);
    if (idx !== -1) {
      centres[idx].isBookingPaused = isPaused;
      centres[idx].pauseReason = isPaused ? reason : undefined;
      setStoredItem(STORAGE_KEYS.CENTRES, centres);
      this.addAuditLog({
        userName: updatedBy,
        userRole: 'operator',
        centreId,
        centreName: centres[idx].name,
        action: isPaused ? 'BOOKINGS_PAUSED' : 'BOOKINGS_RESUMED',
        recordRef: centres[idx].code,
        reason,
      });
    }
  },

  // Bookings
  getBookings(): Booking[] {
    return getStoredItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  },
  getBookingByRef(ref: string): Booking | undefined {
    return this.getBookings().find(b => b.bookingRef.toLowerCase() === ref.toLowerCase().trim());
  },
  getBookingsByFarmer(farmerId: string): Booking[] {
    return this.getBookings().filter(b => b.farmerId === farmerId);
  },
  bookSlot(params: {
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    centreId: string;
    cropId: string;
    cropName: string;
    estimatedQuantity: number;
    scheduledDate: string;
    arrivalWindow: string;
    vehicleNumber?: string;
  }): { success: boolean; booking?: Booking; message?: string } {
    const centres = this.getCentres();
    const centre = centres.find(c => c.id === params.centreId);
    if (!centre) {
      return { success: false, message: 'Invalid procurement centre selected.' };
    }
    if (centre.isBookingPaused) {
      return { 
        success: false, 
        message: `Bookings at ${centre.name} are currently paused: ${centre.pauseReason || 'Operational maintenance'}. Please select an alternate centre.` 
      };
    }

    const availableCapacity = centre.dailyCapacityQuintals - centre.operationalReserveQuintals - centre.bookedTodayQuintals;
    if (params.estimatedQuantity > availableCapacity) {
      return {
        success: false,
        message: `Requested quantity (${params.estimatedQuantity} qtl) exceeds available bookable capacity (${availableCapacity} qtl) at ${centre.name}. Please reduce quantity or choose another date/centre.`
      };
    }

    const bookings = this.getBookings();
    const tokenCounter = bookings.length + 35;
    const tokenNumber = generateTokenNumber(tokenCounter);
    const bookingRef = generateBookingRef(params.cropName.slice(0, 3));

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      bookingRef,
      tokenNumber,
      farmerId: params.farmerId,
      farmerName: params.farmerName,
      farmerPhone: params.farmerPhone,
      centreId: params.centreId,
      centreName: centre.name,
      cropId: params.cropId,
      cropName: params.cropName,
      estimatedQuantity: params.estimatedQuantity,
      scheduledDate: params.scheduledDate,
      arrivalWindow: params.arrivalWindow,
      vehicleNumber: params.vehicleNumber,
      status: 'upcoming',
      currentStage: 'BOOKING_CONFIRMED',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);

    // Update centre booked quantity
    centre.bookedTodayQuintals += params.estimatedQuantity;
    setStoredItem(STORAGE_KEYS.CENTRES, centres);

    // Notify farmer
    this.addNotification({
      recipientId: params.farmerId,
      title: `Slot Booked: ${bookingRef} (Token ${tokenNumber})`,
      titleHi: `स्लॉट पुष्ट: ${bookingRef} (टोकन ${tokenNumber})`,
      message: `Your procurement slot for ${params.estimatedQuantity} qtl of ${params.cropName} at ${centre.name} on ${params.scheduledDate} (${params.arrivalWindow}) is confirmed.`,
      messageHi: `आपका ${params.cropName} उपार्जन स्लॉट ${centre.name} पर ${params.scheduledDate} हेतु पुष्ट हो चुका है।`,
      type: 'booking',
      priority: 'high',
      actionUrl: `/farmer/bookings/${newBooking.id}`,
    });

    this.addAuditLog({
      userName: params.farmerName,
      userRole: 'farmer',
      centreId: centre.id,
      centreName: centre.name,
      action: 'SLOT_BOOKED',
      recordRef: bookingRef,
      reason: `Slot booked for ${params.estimatedQuantity} qtl ${params.cropName} on ${params.scheduledDate}`,
    });

    return { success: true, booking: newBooking };
  },

  checkInBooking(bookingId: string, vehicleNumber: string, actualQuantity: number = 0, operatorName: string = 'Procurement Operator'): { success: boolean; booking?: Booking; message?: string } {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return { success: false, message: 'Booking not found.' };

    bookings[idx].status = 'in_progress';
    bookings[idx].currentStage = 'QUALITY_INSPECTION';
    bookings[idx].vehicleNumber = vehicleNumber;
    if (actualQuantity > 0) bookings[idx].acceptedQuantity = actualQuantity;
    bookings[idx].actualArrivalTimestamp = new Date().toISOString();
    bookings[idx].lastUpdated = new Date().toISOString();

    setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);

    // Update Centre waiting count
    const centres = this.getCentres();
    const cIdx = centres.findIndex(c => c.id === bookings[idx].centreId);
    if (cIdx !== -1) {
      centres[cIdx].waitingFarmersCount += 1;
      setStoredItem(STORAGE_KEYS.CENTRES, centres);
    }

    this.addNotification({
      recipientId: bookings[idx].farmerId,
      title: `Gate Check-In Verified: Token ${bookings[idx].tokenNumber}`,
      titleHi: `गेट सत्यापन पूर्ण: टोकन ${bookings[idx].tokenNumber}`,
      message: `You are checked in at ${bookings[idx].centreName}. Proceed to Quality Inspection Bay.`,
      type: 'queue',
      priority: 'high',
      actionUrl: '/farmer/queue-status',
    });

    this.addAuditLog({
      userName: operatorName,
      userRole: 'operator',
      centreId: bookings[idx].centreId,
      centreName: bookings[idx].centreName,
      action: 'CHECK_IN_CONFIRMED',
      recordRef: bookings[idx].bookingRef,
      previousStatus: 'upcoming',
      newStatus: 'in_progress',
      reason: `Vehicle ${vehicleNumber} verified at gate. Moved to Quality Inspection.`,
    });

    return { success: true, booking: bookings[idx] };
  },

  updateQueueStage(bookingId: string, stage: Booking['currentStage'], operatorName: string = 'Procurement Operator', reason?: string) {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return;

    const oldStage = bookings[idx].currentStage;
    bookings[idx].currentStage = stage;
    bookings[idx].lastUpdated = new Date().toISOString();
    if (reason) bookings[idx].priorityChangedReason = reason;

    if (stage === 'COMPLETED') {
      bookings[idx].status = 'completed';
    }

    setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);

    this.addAuditLog({
      userName: operatorName,
      userRole: 'operator',
      centreId: bookings[idx].centreId,
      centreName: bookings[idx].centreName,
      action: 'STAGE_TRANSITION',
      recordRef: bookings[idx].bookingRef,
      previousStatus: oldStage,
      newStatus: stage,
      reason: reason || 'Routine stage progression in queue',
    });
  },

  // Quality Inspections
  getQualityChecks(): QualityInspection[] {
    return getStoredItem<QualityInspection[]>(STORAGE_KEYS.QUALITY, INITIAL_QUALITY_CHECKS);
  },
  getQualityCheckByBookingId(bookingId: string): QualityInspection | undefined {
    return this.getQualityChecks().find(q => q.bookingId === bookingId);
  },
  recordQualityCheck(params: {
    bookingId: string;
    inspectorName: string;
    moisturePct: number;
    foreignMatterPct: number;
    damagedGrainsPct: number;
    status: QualityStatus;
    remarks: string;
    rejectionReason?: string;
  }) {
    const qualityChecks = this.getQualityChecks();
    const booking = this.getBookingById(params.bookingId);
    if (!booking) return;

    const newCheck: QualityInspection = {
      id: `qual-${Date.now()}`,
      bookingId: params.bookingId,
      bookingRef: booking.bookingRef,
      inspectorName: params.inspectorName,
      inspectedAt: new Date().toISOString(),
      cropName: booking.cropName,
      moisturePct: params.moisturePct,
      foreignMatterPct: params.foreignMatterPct,
      damagedGrainsPct: params.damagedGrainsPct,
      status: params.status,
      remarks: params.remarks,
      rejectionReason: params.rejectionReason,
    };

    qualityChecks.push(newCheck);
    setStoredItem(STORAGE_KEYS.QUALITY, qualityChecks);

    // Update booking stage
    if (params.status === 'approved') {
      this.updateQueueStage(params.bookingId, 'WEIGHING', params.inspectorName, 'Quality passed inspection. Moved to Weighing.');
    } else if (params.status === 'rejected') {
      const bookings = this.getBookings();
      const bIdx = bookings.findIndex(b => b.id === params.bookingId);
      if (bIdx !== -1) {
        bookings[bIdx].status = 'delayed';
        bookings[bIdx].delayReason = `Quality rejected: ${params.rejectionReason || 'Exceeds maximum allowable moisture/matter limits'}`;
        setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);
      }
    }

    this.addNotification({
      recipientId: booking.farmerId,
      title: `Quality Inspection Result: ${params.status.toUpperCase().replace('_', ' ')}`,
      titleHi: `गुणवत्ता जांच परिणाम: ${params.status}`,
      message: params.status === 'approved' 
        ? `Quality check approved (Moisture: ${params.moisturePct}%). Proceeding to Weighing Bridge.`
        : `Quality check status: ${params.status}. Reason: ${params.rejectionReason || params.remarks}`,
      type: 'quality',
      priority: params.status === 'approved' ? 'normal' : 'urgent',
      actionUrl: '/farmer/procurement-status',
    });

    this.addAuditLog({
      userName: params.inspectorName,
      userRole: 'operator',
      centreId: booking.centreId,
      centreName: booking.centreName,
      action: 'QUALITY_INSPECTED',
      recordRef: booking.bookingRef,
      newStatus: params.status,
      reason: `Moisture: ${params.moisturePct}%, Result: ${params.status}`,
    });
  },

  // Purchase & Weighing
  getPurchases(): PurchaseRecord[] {
    return getStoredItem<PurchaseRecord[]>(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
  },
  getPurchaseByBookingId(bookingId: string): PurchaseRecord | undefined {
    return this.getPurchases().find(p => p.bookingId === bookingId);
  },
  recordPurchase(params: {
    bookingId: string;
    grossWeightKg: number;
    tareWeightKg: number;
    operatorName?: string;
    [key: string]: any;
  }): { success: boolean; purchase?: PurchaseRecord; message?: string } {
    const booking = this.getBookingById(params.bookingId);
    if (!booking) return { success: false, message: 'Booking not found.' };

    const quality = this.getQualityCheckByBookingId(params.bookingId);
    if (!quality || quality.status !== 'approved') {
      return { success: false, message: 'Cannot record purchase without prior approved quality inspection.' };
    }

    if (params.grossWeightKg <= params.tareWeightKg) {
      return { success: false, message: 'Gross weight must be strictly greater than tare weight.' };
    }

    const netWeightKg = params.grossWeightKg - params.tareWeightKg;
    const netQuantityQuintals = Number((netWeightKg / 100).toFixed(2));
    
    // Look up MSP rate
    const crops = this.getCrops();
    const crop = crops.find(c => c.id === booking.cropId || c.name === booking.cropName);
    const ratePerQuintal = crop ? crop.mspRatePerQuintal : 2275;
    const totalAmount = Math.round(netQuantityQuintals * ratePerQuintal);

    const purchaseRef = generatePurchaseRef(2026);
    const purchases = this.getPurchases();
    const opName = params.operatorName || 'Procurement Operator';

    const newPurchase: PurchaseRecord = {
      id: `pur-${Date.now()}`,
      purchaseRef,
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      centreId: booking.centreId,
      centreName: booking.centreName,
      cropName: booking.cropName,
      ratePerQuintal,
      grossWeightKg: params.grossWeightKg,
      tareWeightKg: params.tareWeightKg,
      netWeightKg,
      netQuantityQuintals,
      payableQuantityQuintals: netQuantityQuintals,
      totalAmount,
      operatorName: opName,
      recordedAt: new Date().toISOString(),
      receiptGenerated: true,
      status: 'completed',
    };

    purchases.push(newPurchase);
    setStoredItem(STORAGE_KEYS.PURCHASES, purchases);

    // Update booking
    this.updateQueueStage(params.bookingId, 'PURCHASE_RECORDED', params.operatorName, 'Weighment & Purchase recorded successfully.');

    // Auto-create Payment in 'awaiting_approval'
    const payments = this.getPayments();
    const farmer = this.getFarmerById(booking.farmerId);
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      purchaseId: newPurchase.id,
      purchaseRef: newPurchase.purchaseRef,
      bookingRef: booking.bookingRef,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      bankAccountMasked: farmer ? `•••• •••• ${farmer.bankAccountMasked}` : '•••• •••• 5682',
      amount: totalAmount,
      status: 'awaiting_approval',
      stageTimestamps: {
        purchaseRecorded: new Date().toISOString(),
        awaitingApproval: new Date().toISOString(),
      },
      responsibleOffice: 'District Procurement Office / Mandi Committee',
      lastUpdated: new Date().toISOString(),
    };
    payments.push(newPayment);
    setStoredItem(STORAGE_KEYS.PAYMENTS, payments);

    // Notify farmer
    this.addNotification({
      recipientId: booking.farmerId,
      title: `Purchase Receipt Issued: ${purchaseRef}`,
      titleHi: `उपार्जन रसीद जारी: ${purchaseRef}`,
      message: `Purchase completed for ${netQuantityQuintals} qtl ${booking.cropName} at ₹${ratePerQuintal}/qtl. Total: ₹${totalAmount.toLocaleString('en-IN')}. Receipt available for download.`,
      type: 'payment',
      priority: 'high',
      actionUrl: '/farmer/procurement-status',
    });

    this.addAuditLog({
      userName: params.operatorName,
      userRole: 'operator',
      centreId: booking.centreId,
      centreName: booking.centreName,
      action: 'PURCHASE_COMPLETED',
      recordRef: purchaseRef,
      newStatus: 'completed',
      reason: `Net weight ${netQuantityQuintals} qtl. Total procurement sum ₹${totalAmount}`,
    });

    return { success: true, purchase: newPurchase };
  },

  // Payments
  getPayments(): PaymentRecord[] {
    return getStoredItem<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },
  getPaymentByPurchaseId(purchaseId: string): PaymentRecord | undefined {
    return this.getPayments().find(p => p.purchaseId === purchaseId);
  },
  getPaymentsByFarmer(farmerId: string): PaymentRecord[] {
    return this.getPayments().filter(p => p.farmerId === farmerId);
  },
  updatePaymentStatus(params: {
    paymentId: string;
    newStatus: PaymentStatus;
    paymentRef?: string;
    verifiedAt?: string;
    failureReason?: string;
    operatorName: string;
    responsibleOffice?: string;
  }): { success: boolean; message?: string } {
    const payments = this.getPayments();
    const idx = payments.findIndex(p => p.id === params.paymentId);
    if (idx === -1) return { success: false, message: 'Payment record not found.' };

    // STRICT GOVERNMENT RULE:
    // Do not show "Payment credited" unless mock official payment record contains payment reference and verified time.
    if (params.newStatus === 'credited') {
      if (!params.paymentRef || params.paymentRef.trim() === '') {
        return { success: false, message: 'Payment reference (e.g. PAY-2026-XXXXX) is mandatory before marking Payment as Credited.' };
      }
      if (!params.verifiedAt || params.verifiedAt.trim() === '') {
        return { success: false, message: 'Official verification date/time is required before confirming credit.' };
      }
    }

    if (params.newStatus === 'failed' && (!params.failureReason || params.failureReason.trim() === '')) {
      return { success: false, message: 'Failure reason is mandatory for failed payment status.' };
    }

    const currentPayment = payments[idx];
    const prevStatus = currentPayment.status;
    currentPayment.status = params.newStatus;
    currentPayment.lastUpdated = new Date().toISOString();

    if (params.paymentRef) currentPayment.paymentRef = params.paymentRef;
    if (params.verifiedAt) currentPayment.verifiedAt = params.verifiedAt;
    if (params.failureReason) currentPayment.failureReason = params.failureReason;
    if (params.responsibleOffice) currentPayment.responsibleOffice = params.responsibleOffice;

    const nowIso = new Date().toISOString();
    if (params.newStatus === 'submitted') {
      currentPayment.stageTimestamps.submitted = nowIso;
      if (!currentPayment.paymentRef) {
        currentPayment.paymentRef = generatePaymentRef(2026);
      }
    } else if (params.newStatus === 'credited') {
      currentPayment.stageTimestamps.credited = params.verifiedAt || nowIso;
      currentPayment.stageTimestamps.verified = params.verifiedAt || nowIso;
    } else if (params.newStatus === 'failed') {
      currentPayment.stageTimestamps.failed = nowIso;
    }

    setStoredItem(STORAGE_KEYS.PAYMENTS, payments);

    // Notify farmer
    this.addNotification({
      recipientId: currentPayment.farmerId,
      title: `Payment Update: ${params.newStatus.toUpperCase().replace('_', ' ')}`,
      titleHi: `भुगतान स्थिति अपडेट: ${params.newStatus}`,
      message: params.newStatus === 'credited'
        ? `Payment of ₹${currentPayment.amount.toLocaleString('en-IN')} has been CREDITED to your registered account (Ref: ${currentPayment.paymentRef}).`
        : params.newStatus === 'submitted'
        ? `Payment instruction submitted. Bank clearance is in process (Ref: ${currentPayment.paymentRef || 'Generated'}).`
        : `Payment status updated to ${params.newStatus}.`,
      type: 'payment',
      priority: params.newStatus === 'credited' ? 'high' : 'normal',
      actionUrl: '/farmer/payment-status',
    });

    this.addAuditLog({
      userName: params.operatorName,
      userRole: 'operator',
      action: 'PAYMENT_STATUS_UPDATED',
      recordRef: currentPayment.paymentRef || currentPayment.purchaseRef,
      previousStatus: prevStatus,
      newStatus: params.newStatus,
      reason: params.failureReason || `Payment state updated to ${params.newStatus} by ${params.operatorName}`,
    });

    return { success: true };
  },

  // Disruptions
  getDisruptions(): CentreDisruption[] {
    return getStoredItem<CentreDisruption[]>(STORAGE_KEYS.DISRUPTIONS, INITIAL_DISRUPTIONS);
  },
  getActiveDisruptions(): CentreDisruption[] {
    return this.getDisruptions().filter(d => d.status === 'active');
  },
  reportDisruption(params: Omit<CentreDisruption, 'id' | 'reportedAt' | 'status'>): CentreDisruption {
    const disruptions = this.getDisruptions();
    const newDisruption: CentreDisruption = {
      ...params,
      id: `disrupt-${Date.now()}`,
      status: 'active',
      reportedAt: new Date().toISOString(),
    };
    disruptions.unshift(newDisruption);
    setStoredItem(STORAGE_KEYS.DISRUPTIONS, disruptions);

    // Update Centre operating status
    const centres = this.getCentres();
    const cIdx = centres.findIndex(c => c.id === params.centreId);
    if (cIdx !== -1) {
      centres[cIdx].operatingStatus = params.severity === 'critical' ? 'closed' : 'delayed';
      setStoredItem(STORAGE_KEYS.CENTRES, centres);
    }

    // Broadcast notification
    this.addNotification({
      recipientId: 'all',
      title: `Operational Notice: ${params.title}`,
      titleHi: `संचालन सूचना: ${params.centreName} में व्यवधान`,
      message: `${params.description} Affected slots: ${params.affectedSlots.join(', ')}. Suggested: ${params.suggestedAction}`,
      type: 'disruption',
      priority: 'urgent',
      actionUrl: '/announcements',
    });

    this.addAuditLog({
      userName: params.reportedBy,
      userRole: 'operator',
      centreId: params.centreId,
      centreName: params.centreName,
      action: 'DISRUPTION_REPORTED',
      recordRef: newDisruption.id,
      newStatus: 'active',
      reason: `${params.type}: ${params.description}`,
    });

    return newDisruption;
  },
  resolveDisruption(disruptionId: string, resolvedBy: string = 'Procurement Operator', resolutionNotes: string = 'Disruption resolved and normal operations resumed') {
    const disruptions = this.getDisruptions();
    const idx = disruptions.findIndex(d => d.id === disruptionId);
    if (idx === -1) return;

    disruptions[idx].status = 'resolved';
    disruptions[idx].resolvedAt = new Date().toISOString();
    setStoredItem(STORAGE_KEYS.DISRUPTIONS, disruptions);

    // Check if other disruptions remain on centre
    const otherActive = disruptions.some(d => d.centreId === disruptions[idx].centreId && d.status === 'active');
    if (!otherActive) {
      const centres = this.getCentres();
      const cIdx = centres.findIndex(c => c.id === disruptions[idx].centreId);
      if (cIdx !== -1) {
        centres[cIdx].operatingStatus = 'normal';
        setStoredItem(STORAGE_KEYS.CENTRES, centres);
      }
    }

    this.addAuditLog({
      userName: resolvedBy,
      userRole: 'operator',
      centreId: disruptions[idx].centreId,
      centreName: disruptions[idx].centreName,
      action: 'DISRUPTION_RESOLVED',
      recordRef: disruptionId,
      previousStatus: 'active',
      newStatus: 'resolved',
      reason: resolutionNotes,
    });
  },

  addDisruption(params: Omit<CentreDisruption, 'id' | 'reportedAt' | 'status'>): CentreDisruption {
    return this.reportDisruption(params);
  },

  updateCentreOperatingStatus(centreId: string, status: ProcurementCentre['operatingStatus'], reason?: string, updatedBy: string = 'Supervising Officer') {
    const centres = this.getCentres();
    const idx = centres.findIndex(c => c.id === centreId);
    if (idx !== -1) {
      centres[idx].operatingStatus = status;
      if (status === 'closed') {
        centres[idx].isBookingPaused = true;
        centres[idx].pauseReason = reason || 'Emergency closure';
      } else if (status === 'normal') {
        centres[idx].isBookingPaused = false;
        centres[idx].pauseReason = undefined;
      }
      setStoredItem(STORAGE_KEYS.CENTRES, centres);
      this.addAuditLog({
        userName: updatedBy,
        userRole: 'officer',
        centreId,
        centreName: centres[idx].name,
        action: 'CENTRE_STATUS_CHANGED',
        recordRef: centres[idx].code,
        newStatus: status,
        reason: reason || `Centre status set to ${status}`,
      });
    }
  },

  // Complaints
  getComplaints(): FarmerComplaint[] {
    return getStoredItem<FarmerComplaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  },
  submitComplaint(params: {
    farmerId: string;
    farmerName: string;
    farmerMobile: string;
    centreId?: string;
    centreName?: string;
    category: FarmerComplaint['category'];
    description: string;
    priority?: 'normal' | 'urgent';
  }): FarmerComplaint {
    const complaints = this.getComplaints();
    const complaintRef = generateComplaintRef(2026);
    const newComplaint: FarmerComplaint = {
      id: `cmp-${Date.now()}`,
      complaintRef,
      farmerId: params.farmerId,
      farmerName: params.farmerName,
      farmerMobile: params.farmerMobile,
      centreId: params.centreId,
      centreName: params.centreName,
      category: params.category,
      description: params.description,
      status: 'submitted',
      priority: params.priority || 'normal',
      submittedAt: new Date().toISOString(),
      assignedOfficer: 'District Grievance Redressal Cell',
    };
    complaints.unshift(newComplaint);
    setStoredItem(STORAGE_KEYS.COMPLAINTS, complaints);

    this.addNotification({
      recipientId: params.farmerId,
      title: `Grievance Registered: ${complaintRef}`,
      titleHi: `शिकायत पंजीकृत: ${complaintRef}`,
      message: `Your grievance regarding ${params.category.replace('_', ' ')} has been registered and forwarded to the Grievance Cell.`,
      type: 'system',
      priority: 'normal',
      actionUrl: '/farmer/complaints',
    });

    this.addAuditLog({
      userName: params.farmerName,
      userRole: 'farmer',
      action: 'GRIEVANCE_REGISTERED',
      recordRef: complaintRef,
      reason: `Category: ${params.category}`,
    });

    return newComplaint;
  },

  updateComplaintStatus(complaintId: string, status: FarmerComplaint['status'], resolutionNotes?: string, officerName?: string) {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === complaintId);
    if (idx === -1) return;

    complaints[idx].status = status;
    if (resolutionNotes) complaints[idx].resolutionNotes = resolutionNotes;
    if (status === 'resolved' || status === 'closed') {
      complaints[idx].resolvedAt = new Date().toISOString();
    }
    setStoredItem(STORAGE_KEYS.COMPLAINTS, complaints);

    this.addAuditLog({
      userName: officerName || 'Grievance Officer',
      userRole: 'officer',
      action: 'GRIEVANCE_STATUS_UPDATED',
      recordRef: complaints[idx].complaintRef,
      newStatus: status,
      reason: resolutionNotes || `Status marked as ${status}`,
    });
  },

  // Notifications
  getNotifications(recipientId?: string): NotificationItem[] {
    const all = getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!recipientId) return all;
    return all.filter(n => n.recipientId === recipientId || n.recipientId === 'all');
  },
  markNotificationAsRead(id: string) {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifs[idx].isRead = true;
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  },
  markAllNotificationsRead(recipientId?: string) {
    const notifs = this.getNotifications();
    notifs.forEach(n => {
      if (!recipientId || n.recipientId === recipientId || n.recipientId === 'all') {
        n.isRead = true;
      }
    });
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) {
    const notifs = this.getNotifications();
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    notifs.unshift(item);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Grievance Aliases
  getGrievances(): FarmerComplaint[] {
    return this.getComplaints();
  },
  getGrievancesByFarmer(farmerId: string): FarmerComplaint[] {
    return this.getComplaints().filter(c => c.farmerId === farmerId);
  },
  submitGrievance(params: {
    farmerId: string;
    farmerName: string;
    farmerPhone?: string;
    farmerMobile?: string;
    centreName?: string;
    category: any;
    subject?: string;
    description: string;
    priority?: 'normal' | 'urgent';
  }): FarmerComplaint {
    return this.submitComplaint({
      farmerId: params.farmerId,
      farmerName: params.farmerName,
      farmerMobile: params.farmerPhone || params.farmerMobile || '9876543210',
      centreName: params.centreName,
      category: params.category,
      description: params.subject ? `${params.subject}: ${params.description}` : params.description,
      priority: params.priority || 'normal',
    });
  },
  resolveGrievance(complaintId: string, resolutionNotes: string, officerName: string = 'Supervising Officer') {
    return this.updateComplaintStatus(complaintId, 'resolved', resolutionNotes, officerName);
  },

  // Purchase & Farmer Helpers
  getPurchasesByFarmer(farmerId: string): PurchaseRecord[] {
    return this.getPurchases().filter(p => p.farmerId === farmerId);
  },
  addCropToFarmer(farmerId: string, crop: { cropId: string; cropName: string; estimatedQuintals: number; harvestDate: string }) {
    const farmers = this.getFarmers();
    const f = farmers.find(x => x.id === farmerId);
    if (f) {
      if (!f.registeredCrops) f.registeredCrops = [];
      f.registeredCrops.push(crop);
      setStoredItem(STORAGE_KEYS.FARMERS, farmers);
    }
  },
  createBooking(params: {
    farmerId: string;
    farmerName: string;
    farmerPhone: string;
    centreId: string;
    centreName?: string;
    cropId: string;
    cropName: string;
    estimatedQuantity: number;
    scheduledDate: string;
    arrivalWindow: string;
  }) {
    return this.bookSlot(params);
  },
  reconcilePayment(paymentId: string, utrRef: string = `UTR-SBIN-${Date.now().toString().slice(-8)}`, officerName: string = 'Supervising Officer') {
    return this.updatePaymentStatus({
      paymentId,
      newStatus: 'credited',
      paymentRef: utrRef,
      verifiedAt: new Date().toISOString(),
      operatorName: officerName,
    });
  },
  cancelBooking(bookingId: string, reason: string = 'Cancelled by farmer'): { success: boolean; message?: string } {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === bookingId);
    if (idx === -1) return { success: false, message: 'Booking not found.' };

    bookings[idx].status = 'cancelled';
    bookings[idx].notes = reason;
    setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);
    this.addAuditLog({
      userName: bookings[idx].farmerName || 'Farmer',
      userRole: 'farmer',
      centreId: bookings[idx].centreId,
      centreName: bookings[idx].centreName,
      action: 'BOOKING_CANCELLED',
      recordRef: bookings[idx].bookingRef,
      previousStatus: bookings[idx].status,
      newStatus: 'cancelled',
      reason,
    });

    return { success: true };
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return getStoredItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const item: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(item);
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }
};
