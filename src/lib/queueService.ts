import { StorageService } from '../services/storageService';
import { Booking, QueueStage } from '../types';

export interface QueueTokenItem {
  id: string;
  bookingRef: string;
  tokenNumber: string;
  numericToken: number;
  farmerName: string;
  farmerPhone?: string;
  cropName: string;
  quantityQuintals: number;
  vehicleNumber: string;
  scheduledDate: string;
  arrivalWindow: string;
  status: string;
  currentStage: QueueStage;
  stageLabel: string;
  stageLabelHi: string;
  isNowServing: boolean;
  isUserToken: boolean;
  differenceFromServing: number;
  differenceFromUser: number | null;
  positionLabel: string;
  positionLabelHi: string;
  estimatedServiceTime: string;
}

export interface StageActiveInfo {
  gateEntryToken: string | null;
  qualityCheckToken: string | null;
  weighbridgeToken: string | null;
  unloadingToken: string | null;
  completedCountToday: number;
}

export interface LiveQueueResult {
  centreId: string;
  centreName: string;
  activeServingToken: string;
  activeServingBooking: Booking | null;
  activeFacilityStage: string;
  stageBreakdown: StageActiveInfo;
  
  // User comparison
  userToken: string | null;
  userBooking: Booking | null;
  userFound: boolean;
  tokensAheadCount: number;
  differenceNumber: number | null;
  isUserServingNow: boolean;
  isUserCompleted: boolean;
  estimatedWaitMinutes: number;
  recommendedAction: string;
  recommendedActionHi: string;
  statusTone: 'serving' | 'next' | 'waiting' | 'completed' | 'not_found';
  
  // Sequential queue list
  totalInQueue: number;
  queueList: QueueTokenItem[];
}

// Stage display labels
export const STAGE_DISPLAY_META: Record<QueueStage, { label: string; labelHi: string; facility: string }> = {
  BOOKING_CONFIRMED: { label: 'Scheduled / En Route', labelHi: 'कतार में प्रतीक्षारत', facility: 'Outer Yard' },
  CHECKED_IN: { label: 'Gate Ingress Cleared', labelHi: 'गेट प्रवेश पूर्ण', facility: 'Staging Lane' },
  QUALITY_INSPECTION: { label: 'Quality & Moisture Testing', labelHi: 'गुणवत्ता प्रयोगशाला', facility: 'Assay Lab Bay 1' },
  WEIGHING: { label: 'Electronic Weighbridge Active', labelHi: 'इलेक्ट्रॉनिक तौल कांटा', facility: 'Weighbridge Bay 1' },
  PURCHASE_RECORDED: { label: 'Unloading / Tare Weighment', labelHi: 'खाली वाहन तौल एवं रसीद', facility: 'Storage Apron 2' },
  PAYMENT_PENDING: { label: 'Payment Processing', labelHi: 'भुगतान प्रक्रियाधीन', facility: 'Accounts Desk' },
  COMPLETED: { label: 'Procurement Slip Issued', labelHi: 'प्रक्रिया संपन्न', facility: 'Exit Gate' },
};

function extractTokenNumber(token: string): number {
  const match = token.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Ensures a robust queue of bookings exists for the specified centre.
 */
function getNormalizedCentreBookings(centreId: string): Booking[] {
  const allBookings = StorageService.getBookings();
  let centreBookings = allBookings.filter(b => b.centreId === centreId);

  // If centre has very few bookings in storage, supply default realistic tokens
  if (centreBookings.length < 5) {
    const defaultTemplates: Partial<Booking>[] = [
      {
        id: `mock-q-34-${centreId}`,
        tokenNumber: 'T-034',
        bookingRef: 'KS-WHT-1034',
        farmerName: 'Suresh Deshmukh',
        farmerPhone: '9822019283',
        cropName: 'Wheat',
        estimatedQuantity: 32,
        vehicleNumber: 'MH-12-PQ-1002',
        status: 'in_progress',
        currentStage: 'PURCHASE_RECORDED',
        scheduledDate: '10-09-2026',
        arrivalWindow: '08:00 AM - 10:00 AM',
      },
      {
        id: `mock-q-35-${centreId}`,
        tokenNumber: 'T-035',
        bookingRef: 'KS-WHT-1035',
        farmerName: 'Balasaheb Patil',
        farmerPhone: '9845091823',
        cropName: 'Wheat',
        estimatedQuantity: 28,
        vehicleNumber: 'MH-12-XY-9081',
        status: 'in_progress',
        currentStage: 'WEIGHING',
        scheduledDate: '10-09-2026',
        arrivalWindow: '08:30 AM - 10:30 AM',
      },
      {
        id: `mock-q-36-${centreId}`,
        tokenNumber: 'T-036',
        bookingRef: 'KS-WHT-1036',
        farmerName: 'Ganesh More',
        farmerPhone: '9764123890',
        cropName: 'Wheat',
        estimatedQuantity: 22,
        vehicleNumber: 'MH-12-KL-3344',
        status: 'in_progress',
        currentStage: 'QUALITY_INSPECTION',
        scheduledDate: '10-09-2026',
        arrivalWindow: '09:00 AM - 11:00 AM',
      },
      {
        id: `mock-q-37-${centreId}`,
        tokenNumber: 'T-037',
        bookingRef: 'KS-WHT-1037',
        farmerName: 'Nitin Kadam',
        farmerPhone: '9811882233',
        cropName: 'Wheat',
        estimatedQuantity: 18,
        vehicleNumber: 'MH-14-AA-1122',
        status: 'checked_in',
        currentStage: 'CHECKED_IN',
        scheduledDate: '10-09-2026',
        arrivalWindow: '09:00 AM - 11:00 AM',
      },
      {
        id: `mock-q-38-${centreId}`,
        tokenNumber: 'T-038',
        bookingRef: 'KS-WHT-1042',
        farmerId: 'farmer-1',
        farmerName: 'Ramesh Kumar',
        farmerPhone: '9876543210',
        cropName: 'Wheat',
        estimatedQuantity: 20,
        vehicleNumber: 'MH-12-AB-4501',
        status: 'checked_in',
        currentStage: 'CHECKED_IN',
        scheduledDate: '10-09-2026',
        arrivalWindow: '09:00 AM - 11:00 AM',
      },
      {
        id: `mock-q-39-${centreId}`,
        tokenNumber: 'T-039',
        bookingRef: 'KS-WHT-1039',
        farmerName: 'Santosh Pawar',
        farmerPhone: '9850123456',
        cropName: 'Wheat',
        estimatedQuantity: 25,
        vehicleNumber: 'MH-12-ZZ-5566',
        status: 'upcoming',
        currentStage: 'BOOKING_CONFIRMED',
        scheduledDate: '10-09-2026',
        arrivalWindow: '10:00 AM - 12:00 PM',
      },
      {
        id: `mock-q-40-${centreId}`,
        tokenNumber: 'T-040',
        bookingRef: 'KS-WHT-1040',
        farmerName: 'Anand Shinde',
        farmerPhone: '9890456123',
        cropName: 'Wheat',
        estimatedQuantity: 30,
        vehicleNumber: 'MH-12-NN-7788',
        status: 'upcoming',
        currentStage: 'BOOKING_CONFIRMED',
        scheduledDate: '10-09-2026',
        arrivalWindow: '10:30 AM - 12:30 PM',
      },
      {
        id: `mock-q-41-${centreId}`,
        tokenNumber: 'T-041',
        bookingRef: 'KS-MST-3175',
        farmerId: 'farmer-3',
        farmerName: 'Mahesh Patel',
        farmerPhone: '9765432190',
        cropName: 'Mustard Seeds',
        estimatedQuantity: 15,
        vehicleNumber: 'MH-12-CD-7721',
        status: 'upcoming',
        currentStage: 'BOOKING_CONFIRMED',
        scheduledDate: '10-09-2026',
        arrivalWindow: '11:00 AM - 01:00 PM',
      },
      {
        id: `mock-q-42-${centreId}`,
        tokenNumber: 'T-042',
        bookingRef: 'KS-WHT-1042b',
        farmerName: 'Vikram Jagtap',
        farmerPhone: '9764551122',
        cropName: 'Wheat',
        estimatedQuantity: 26,
        vehicleNumber: 'MH-12-RR-9911',
        status: 'upcoming',
        currentStage: 'BOOKING_CONFIRMED',
        scheduledDate: '10-09-2026',
        arrivalWindow: '11:30 AM - 01:30 PM',
      },
    ];

    // Merge missing tokens by tokenNumber
    const existingTokens = new Set(centreBookings.map(b => b.tokenNumber.toUpperCase()));
    defaultTemplates.forEach(tpl => {
      if (!existingTokens.has(tpl.tokenNumber!.toUpperCase())) {
        centreBookings.push({
          id: tpl.id!,
          bookingRef: tpl.bookingRef!,
          tokenNumber: tpl.tokenNumber!,
          farmerId: tpl.farmerId || 'farmer-gen',
          farmerName: tpl.farmerName!,
          farmerPhone: tpl.farmerPhone || '9800000000',
          centreId,
          centreName: 'Greenfield Procurement Centre',
          cropId: 'crop-wheat',
          cropName: tpl.cropName!,
          estimatedQuantity: tpl.estimatedQuantity!,
          scheduledDate: tpl.scheduledDate!,
          arrivalWindow: tpl.arrivalWindow!,
          status: tpl.status as any,
          currentStage: tpl.currentStage as any,
          vehicleNumber: tpl.vehicleNumber,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        });
      }
    });
  }

  return centreBookings;
}

/**
 * Calculates complete live queue state, active serving token, and difference by user token.
 */
export function calculateLiveQueue(centreId: string, userTokenQuery?: string): LiveQueueResult {
  const centres = StorageService.getCentres();
  const centre = centres.find(c => c.id === centreId) || centres[0];
  const activeCentreId = centre ? centre.id : centreId;
  const centreName = centre ? centre.name : 'Greenfield Procurement Centre';

  const bookings = getNormalizedCentreBookings(activeCentreId);

  // Sort bookings by numeric token ascending
  const sorted = [...bookings].sort((a, b) => {
    return extractTokenNumber(a.tokenNumber) - extractTokenNumber(b.tokenNumber);
  });

  // Identify active facility tokens
  const weighbridgeBooking = sorted.find(b => b.currentStage === 'WEIGHING');
  const qualityBooking = sorted.find(b => b.currentStage === 'QUALITY_INSPECTION');
  const gateBooking = sorted.find(b => b.currentStage === 'CHECKED_IN');
  const unloadingBooking = sorted.find(b => b.currentStage === 'PURCHASE_RECORDED');
  const completedList = sorted.filter(b => b.status === 'completed' || b.currentStage === 'COMPLETED');

  // Primary active serving token on centre:
  // Priority: Weighbridge > Quality > Unloading > Gate
  const primaryServingBooking = weighbridgeBooking || qualityBooking || unloadingBooking || gateBooking || sorted[0];
  const activeServingToken = primaryServingBooking ? primaryServingBooking.tokenNumber : 'T-035';
  const activeFacilityStage = primaryServingBooking 
    ? STAGE_DISPLAY_META[primaryServingBooking.currentStage]?.facility || 'Yard Weighbridge'
    : 'Weighbridge Bay 1';

  // Normalize user query token
  const cleanUserQuery = userTokenQuery ? userTokenQuery.trim().toUpperCase() : null;
  const userBooking = cleanUserQuery 
    ? sorted.find(b => b.tokenNumber.toUpperCase() === cleanUserQuery || b.bookingRef.toUpperCase() === cleanUserQuery) || null
    : null;

  const servingTokenNum = extractTokenNumber(activeServingToken);
  const userTokenNum = userBooking ? extractTokenNumber(userBooking.tokenNumber) : (cleanUserQuery ? extractTokenNumber(cleanUserQuery) : null);

  // Active uncompleted queue items
  const activeQueue = sorted.filter(b => b.status !== 'completed' && b.currentStage !== 'COMPLETED');

  // Tokens ahead calculation:
  // Count how many non-completed tokens exist in queue strictly before the user token
  let tokensAheadCount = 0;
  let differenceNumber: number | null = null;
  let isUserServingNow = false;
  let isUserCompleted = false;

  if (userBooking) {
    if (userBooking.status === 'completed' || userBooking.currentStage === 'COMPLETED') {
      isUserCompleted = true;
      tokensAheadCount = 0;
      differenceNumber = 0;
    } else if (userBooking.tokenNumber === activeServingToken) {
      isUserServingNow = true;
      tokensAheadCount = 0;
      differenceNumber = 0;
    } else {
      // Find index of serving token and user token in sorted active queue
      const servingIdx = activeQueue.findIndex(b => b.tokenNumber === activeServingToken);
      const userIdx = activeQueue.findIndex(b => b.tokenNumber === userBooking.tokenNumber);

      if (userIdx !== -1) {
        if (servingIdx !== -1 && userIdx > servingIdx) {
          tokensAheadCount = userIdx - servingIdx;
        } else if (servingIdx !== -1 && userIdx < servingIdx) {
          tokensAheadCount = 0; // Already passed serving position
        } else {
          tokensAheadCount = Math.max(0, userIdx);
        }
      }

      if (userTokenNum !== null && servingTokenNum !== 0) {
        differenceNumber = userTokenNum - servingTokenNum;
      }
    }
  } else if (cleanUserQuery && userTokenNum !== null && userTokenNum > 0) {
    differenceNumber = userTokenNum - servingTokenNum;
    tokensAheadCount = Math.max(0, differenceNumber);
  }

  // Waiting time: ~10 mins per ahead vehicle
  const estimatedWaitMinutes = isUserCompleted ? 0 : isUserServingNow ? 0 : tokensAheadCount * 10;

  // Recommendations and status tone
  let statusTone: 'serving' | 'next' | 'waiting' | 'completed' | 'not_found' = 'waiting';
  let recommendedAction = '';
  let recommendedActionHi = '';

  if (isUserCompleted) {
    statusTone = 'completed';
    recommendedAction = 'Your harvest procurement is completed! J-Form receipt and DBT sanction have been generated.';
    recommendedActionHi = 'आपकी फसल उपार्जन प्रक्रिया पूर्ण हो चुकी है! जे-फॉर्म रसीद व डीबीटी स्वीकृति जारी है।';
  } else if (isUserServingNow) {
    statusTone = 'serving';
    recommendedAction = `Token ${activeServingToken} is currently active on ${activeFacilityStage}! Please guide your vehicle to the bay immediately.`;
    recommendedActionHi = `टोकन ${activeServingToken} वर्तमान में सक्रिय है! कृपया अपना वाहन तत्काल वे-ब्रिज पर ले जाएं।`;
  } else if (tokensAheadCount === 1) {
    statusTone = 'next';
    recommendedAction = `Your turn is NEXT! Exactly 1 vehicle ahead (${activeServingToken}). Line up your tractor at the weighbridge entrance gate.`;
    recommendedActionHi = `आपकी बारी अगली है! आपके आगे ठीक 1 वाहन है। कृपया अपना ट्रैक्टर गेट पर तैयार रखें।`;
  } else if (tokensAheadCount > 1) {
    statusTone = 'waiting';
    recommendedAction = `There are ${tokensAheadCount} vehicles ahead of your token ${userBooking ? userBooking.tokenNumber : cleanUserQuery} (Serving: ${activeServingToken}, Difference: +${differenceNumber || tokensAheadCount}). Estimated wait is ~${estimatedWaitMinutes} minutes.`;
    recommendedActionHi = `आपके टोकन से आगे ${tokensAheadCount} वाहन कतार में हैं (वर्तमान: ${activeServingToken}, अंतर: +${differenceNumber || tokensAheadCount})। अनुमानित प्रतीक्षा समय ~${estimatedWaitMinutes} मिनट है।`;
  } else if (!userBooking && cleanUserQuery) {
    statusTone = 'not_found';
    recommendedAction = `Token ${cleanUserQuery} is not registered in today's active yard queue for ${centreName}. Please check your booking date or reference ID.`;
    recommendedActionHi = `टोकन ${cleanUserQuery} आज की सक्रिय कतार में नहीं मिला। कृपया अपनी तिथि या पर्ची जांचें।`;
  } else {
    statusTone = 'waiting';
    recommendedAction = `Currently serving Token ${activeServingToken} on ${activeFacilityStage}. Select or enter your token above to calculate your exact waiting difference.`;
    recommendedActionHi = `वर्तमान में टोकन ${activeServingToken} सेवा में है। अपना टोकन दर्ज करके कतार अंतर देखें।`;
  }

  // Build full enriched queue list
  // Generate relative timing stamps starting around current time (09:30 AM IST)
  const baseTimeMinutes = 9 * 60 + 30; // 09:30 AM
  let cumulativeMinutes = baseTimeMinutes;

  const queueList: QueueTokenItem[] = sorted.map((b) => {
    const tNum = extractTokenNumber(b.tokenNumber);
    const isNowServing = b.tokenNumber === activeServingToken;
    const isUser = userBooking ? b.tokenNumber === userBooking.tokenNumber : false;
    const diffFromServing = tNum - servingTokenNum;
    const diffFromUser = userTokenNum ? tNum - userTokenNum : null;

    // Estimated service time
    const itemHours = Math.floor(cumulativeMinutes / 60) % 12 || 12;
    const itemMins = String(cumulativeMinutes % 60).padStart(2, '0');
    const ampm = cumulativeMinutes >= 720 ? 'PM' : 'AM';
    const estimatedServiceTime = `${itemHours}:${itemMins} ${ampm}`;
    cumulativeMinutes += 10; // next vehicle in 10 mins

    let positionLabel = '';
    let positionLabelHi = '';

    if (b.status === 'completed' || b.currentStage === 'COMPLETED') {
      positionLabel = 'COMPLETED';
      positionLabelHi = 'संपन्न';
    } else if (isNowServing) {
      positionLabel = 'NOW SERVING';
      positionLabelHi = 'वर्तमान सेवा में';
    } else if (isUser) {
      positionLabel = diffFromServing > 0 ? `YOUR TOKEN (${diffFromServing} AHEAD)` : 'YOUR TOKEN';
      positionLabelHi = `आपका टोकन (${diffFromServing > 0 ? `${diffFromServing} आगे` : ''})`;
    } else if (userTokenNum !== null) {
      if (diffFromUser !== null && diffFromUser < 0) {
        const aheadVal = Math.abs(diffFromUser);
        positionLabel = aheadVal === 1 ? '1 AHEAD OF YOU (NEXT)' : `${aheadVal} AHEAD OF YOU`;
        positionLabelHi = aheadVal === 1 ? '1 आपके आगे (अगला)' : `${aheadVal} आपके आगे`;
      } else if (diffFromUser !== null && diffFromUser > 0) {
        positionLabel = `${diffFromUser} BEHIND YOU`;
        positionLabelHi = `${diffFromUser} आपके पीछे`;
      } else {
        positionLabel = `${diffFromServing > 0 ? `+${diffFromServing} in Queue` : 'Active'}`;
        positionLabelHi = 'कतार में';
      }
    } else {
      positionLabel = diffFromServing === 1 ? 'NEXT IN LINE' : diffFromServing > 1 ? `+${diffFromServing} in line` : 'Processed';
      positionLabelHi = diffFromServing === 1 ? 'कतार में अगला' : `+${diffFromServing} कतार में`;
    }

    const stageMeta = STAGE_DISPLAY_META[b.currentStage] || {
      label: b.currentStage,
      labelHi: b.currentStage,
      facility: 'Mandi Yard'
    };

    return {
      id: b.id,
      bookingRef: b.bookingRef,
      tokenNumber: b.tokenNumber,
      numericToken: tNum,
      farmerName: b.farmerName,
      farmerPhone: b.farmerPhone,
      cropName: b.cropName,
      quantityQuintals: b.estimatedQuantity,
      vehicleNumber: b.vehicleNumber || 'Gate Pending',
      scheduledDate: b.scheduledDate,
      arrivalWindow: b.arrivalWindow,
      status: b.status,
      currentStage: b.currentStage,
      stageLabel: stageMeta.label,
      stageLabelHi: stageMeta.labelHi,
      isNowServing,
      isUserToken: isUser,
      differenceFromServing: diffFromServing,
      differenceFromUser: diffFromUser,
      positionLabel,
      positionLabelHi,
      estimatedServiceTime,
    };
  });

  return {
    centreId: activeCentreId,
    centreName,
    activeServingToken,
    activeServingBooking: primaryServingBooking,
    activeFacilityStage,
    stageBreakdown: {
      weighbridgeToken: weighbridgeBooking ? weighbridgeBooking.tokenNumber : null,
      qualityCheckToken: qualityBooking ? qualityBooking.tokenNumber : null,
      gateEntryToken: gateBooking ? gateBooking.tokenNumber : null,
      unloadingToken: unloadingBooking ? unloadingBooking.tokenNumber : null,
      completedCountToday: completedList.length + 12,
    },
    userToken: userBooking ? userBooking.tokenNumber : cleanUserQuery,
    userBooking,
    userFound: !!userBooking || (cleanUserQuery ? userTokenNum !== null : false),
    tokensAheadCount,
    differenceNumber,
    isUserServingNow,
    isUserCompleted,
    estimatedWaitMinutes,
    recommendedAction,
    recommendedActionHi,
    statusTone,
    totalInQueue: activeQueue.length,
    queueList,
  };
}
