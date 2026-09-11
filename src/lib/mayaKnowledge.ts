/**
 * Maya Helpbot Knowledge Base & Security / Privacy Engine for KisanSetu
 * Strict Protocols:
 * 1. ONLY answers KisanSetu platform-related questions.
 * 2. Politely rejects non-platform questions and refers to Help Center.
 * 3. Asks user to contact Help Center for further assistance at the end of every answer.
 * 4. Strictly enforces security & privacy protocols: masks Aadhaar, Bank Accounts, alerts on OTP/PIN sharing.
 */

export interface MayaMessage {
  id: string;
  sender: 'user' | 'maya';
  text: string;
  timestamp: string;
  isSecurityWarning?: boolean;
  isOffTopic?: boolean;
  suggestedActions?: { label: string; action: string }[];
}

export const HELP_CENTER_DETAILS = {
  tollFree: '1800-180-1551',
  hours: '24x7 Toll-Free (Operator Desks: 06:00 AM – 10:00 PM, Mon–Sat)',
  email: 'support@kisansetu.gov.in',
  grievanceLink: '/help',
  mandiHelpdesk: 'Available at all operational procurement yards (Room 4, Gate 1)'
};

export const HELP_CENTER_CLOSING = `\n\n---\n📞 **Need further help or facing issues at the mandi?**\nPlease contact our **KisanSetu Help Center** at Toll-Free **${HELP_CENTER_DETAILS.tollFree}** (24x7), email **${HELP_CENTER_DETAILS.email}**, or visit the **Assisted Service Helpdesk** at your nearest procurement centre.`;

// Keywords that identify KisanSetu platform queries
const PLATFORM_KEYWORDS = [
  'kisansetu', 'kisan', 'setu', 'mandi', 'token', 'queue', 'slot', 'booking',
  'procurement', 'weigh', 'weighing', 'weighbridge', 'gross', 'tare', 'net',
  'moisture', 'quality', 'inspection', 'grade', 'faq', 'msp', 'payment',
  'dbt', 'pfms', 'bank', 'receipt', 'farmer', 'crop', 'wheat', 'paddy',
  'mustard', 'gram', 'cotton', 'soybean', 'maize', 'quintal', 'capacity',
  'centre', 'center', 'helpdesk', 'operator', 'officer', 'grievance', 'complaint',
  'dispute', 'registration', 'register', 'login', 'portal', 'slip', 'delay',
  'aadhaar', 'ekyc', 'kyc', 'khatauni', 'khasra', 'land', 'documents', 'timing',
  'hours', 'help', 'helpline', 'tollfree', 'support', 'status', 'check in',
  'check-in', 'biometric', 'yard', 'vehicle', 'tractor', 'trolley', 'stage'
];

// Patterns that identify clear non-platform topics (sports, movies, cooking, coding, politics, etc.)
const OFF_TOPIC_PATTERNS = [
  /\b(recipe|cook|bake|ingredients?|curry|pasta|pizza|cake)\b/i,
  /\b(cricket|football|fifa|ipl|world cup|olympics|messi|ronaldo|kohli)\b/i,
  /\b(movie|cinema|actor|actress|hollywood|bollywood|netflix|song|lyrics)\b/i,
  /\b(python|javascript|react|code|programming|algorithm|html|css|sql query|c\+\+)\b/i,
  /\b(math|calculus|derivative|solve x|integral|geometry theorem)\b/i,
  /\b(medical advice|diagnos(is|e)|prescription|symptom|medicine for|disease treatment)\b/i,
  /\b(politics|election results?|prime minister of|president of|political party)\b/i,
  /\b(weather in tokyo|weather in new york|weather in london)\b/i,
  /\b(who are you|who made you|are you human|tell me a joke|write a poem|write a story)\b/i
];

/**
 * Redact sensitive PII to safeguard citizen privacy
 */
export function sanitizeAndRedactPII(input: string): {
  cleanedText: string;
  hasRedactions: boolean;
  warningMessage?: string;
} {
  let text = input;
  let hasRedactions = false;
  let warningMessage = '';

  // Detect and mask 12-digit Aadhaar pattern
  const aadhaarRegex = /\b(\d{4})[ -]?(\d{4})[ -]?(\d{4})\b/g;
  if (aadhaarRegex.test(text)) {
    text = text.replace(aadhaarRegex, 'XXXX-XXXX-$3');
    hasRedactions = true;
    warningMessage = '⚠️ Security & Privacy Guard: Your 12-digit Aadhaar number was redacted. Never share full Aadhaar, OTPs, or passwords in chat.';
  }

  // Detect and mask 9 to 18-digit bank account number pattern
  const bankRegex = /\b(\d{5,14})(\d{4})\b/g;
  if (bankRegex.test(text)) {
    text = text.replace(bankRegex, 'XXXXXX$2');
    hasRedactions = true;
    warningMessage = warningMessage || '⚠️ Security & Privacy Guard: Sensitive financial number masked. Never share bank PINs, OTPs, or full account numbers.';
  }

  // Detect OTP, CVV, or PIN requests / sharing
  const sensitiveCredentialRegex = /\b(otp|cvv|pin|password|passcode)\s*(is|:|was|=)?\s*\d+/i;
  if (sensitiveCredentialRegex.test(text)) {
    hasRedactions = true;
    warningMessage = '🛡️ Critical Privacy Alert: Do NOT share OTP, CVV, or passwords! KisanSetu never asks for your credentials.';
  }

  return { cleanedText: text, hasRedactions, warningMessage };
}

/**
 * Check if the user query is related to the KisanSetu platform
 */
export function isPlatformRelated(query: string): boolean {
  const lower = query.toLowerCase().trim();

  // If very short greeting (hi, hello, namaste), consider valid
  if (/^(hi|hello|hey|namaste|pranam|ram ram|kisan|help|madad)\b/i.test(lower)) {
    return true;
  }

  // Check explicit off-topic triggers
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(lower)) {
      // Check if it also has strong platform keywords (e.g. "recipe for wheat" -> off-topic)
      const hasStrongPlatform = lower.includes('kisansetu') || lower.includes('mandi') || lower.includes('procurement');
      if (!hasStrongPlatform) {
        return false;
      }
    }
  }

  // Check matching platform keywords
  for (const kw of PLATFORM_KEYWORDS) {
    if (lower.includes(kw)) {
      return true;
    }
  }

  // Default to false for completely unrelated text
  return false;
}

/**
 * Off-topic refusal response adhering strictly to user guidelines
 */
export function getOffTopicResponse(): string {
  return `Namaste! I am **Maya**, the official KisanSetu Platform Assistant.

🔒 **Platform Scope Notice:**
Under KisanSetu privacy and operational security protocols, I am authorized to answer **only questions directly related to the KisanSetu agricultural procurement platform** (such as farmer registrations, slot bookings, mandi yard queue status, weighbridge operations, quality moisture norms, and DBT payment tracking).

I am unable to answer general knowledge, entertainment, technical, or non-platform inquiries.

${HELP_CENTER_CLOSING}`;
}

/**
 * Comprehensive KisanSetu Knowledge Engine
 */
export function getPlatformAnswer(query: string): string {
  const lower = query.toLowerCase();

  // 1. Greeting
  if (/^(hi|hello|hey|namaste|pranam|ram ram|good morning|good afternoon)/i.test(lower) && query.length < 25) {
    return `Namaste! I am **Maya**, your KisanSetu Digital Helpbot. 🙏

I can assist you with all KisanSetu platform services, including:
1. **Slot Booking & Centre Quotas**: How to schedule procurement delivery.
2. **Live Yard Queue & Token Tracking**: Knowing your token position and vehicle wait times.
3. **Moisture & Quality Inspection**: Fair Average Quality (FAQ) norms and testing.
4. **Weighbridge Process**: Gross, Tare, and Net weight calculation.
5. **MSP Payment Tracking**: Direct Benefit Transfer (DBT) via PFMS timelines.
6. **Assisted Helpdesk**: Registration for farmers without smartphones.

How may I assist your procurement today?

${HELP_CENTER_CLOSING}`;
  }

  // 2. Queue Tracking & Tokens
  if (lower.includes('queue') || lower.includes('token') || lower.includes('wait') || lower.includes('position') || lower.includes('difference')) {
    return `**Live Mandi Queue & Token Tracking on KisanSetu:**

- **How it works:** When your vehicle arrives at the procurement gate and undergoes gate check-in, an electronic Token (e.g., **T-038**) is activated.
- **Queue Difference:** The live dashboard shows the token actively serving on the weighbridge right now (e.g., **T-035**) and your difference (e.g., *+3 Vehicles Ahead*).
- **Estimated Waiting Time:** Calculated at approximately 10 minutes per vehicle weighment.
- **Where to View:** Click on **"Live Queue Status"** in the Farmer Portal or look at the Public Queue Tracker on the homepage.
- **Audio Paging:** Mandi operators broadcast audio announcements when your token is called to Bay 1.

${HELP_CENTER_CLOSING}`;
  }

  // 3. Slot Booking & Capacity Full
  if (lower.includes('slot') || lower.includes('book') || lower.includes('capacity') || lower.includes('schedule')) {
    return `**Slot Booking Guidelines on KisanSetu:**

- **Booking Window:** Slots open 7 days in advance from 06:00 AM.
- **Capacity Limits:** Each procurement centre has a designated daily intake capacity (e.g., 1,500 Quintals) with a mandatory 20% operational buffer for emergencies.
- **What if a Centre is Full?** The system prevents overbooking to prevent yard congestion. You can select an alternate date or pick an adjacent recommended procurement centre shown on the booking screen.
- **Assisted Booking:** If you do not have internet access, visit your nearest Mandi Helpdesk for assisted physical slot booking.

${HELP_CENTER_CLOSING}`;
  }

  // 4. Quality Inspection & Moisture Limits
  if (lower.includes('moisture') || lower.includes('quality') || lower.includes('inspection') || lower.includes('faq') || lower.includes('sample')) {
    return `**Quality Inspection & Moisture Specifications (FAQ Norms):**

- **Testing Procedure:** An authorized QC Inspector draws a composite sample at Gate Bay 1 using an electronic moisture meter and grain analysis kit.
- **Moisture Limits:**
  - **Paddy:** Maximum permissible moisture is **17%**.
  - **Wheat:** Maximum permissible moisture is **12%**.
  - **Mustard / Oilseeds:** Maximum permissible moisture is **8%**.
- **Grading:** Samples are graded as Grade-A or Common. If moisture exceeds statutory limits, farmers are advised on yard drying options.
- **Appeal:** In case of dispute, you may request re-sampling supervised by the Mandi Agricultural Officer.

${HELP_CENTER_CLOSING}`;
  }

  // 5. Weighbridge (Gross, Tare, Net)
  if (lower.includes('weigh') || lower.includes('gross') || lower.includes('tare') || lower.includes('scale') || lower.includes('weight')) {
    return `**Electronic Weighbridge Procedures:**

- **Gross Weighment:** The fully loaded vehicle (tractor/trolley) drives onto the calibrated electronic weighbridge to record Gross Weight.
- **Unloading:** The vehicle moves to the designated unloading apron or silo.
- **Tare Weighment:** The empty vehicle returns to the weighbridge to record Tare Weight.
- **Net Weight Formula:** \`Net Weight = Gross Weight - Tare Weight\`.
- **Farmer Procurement Receipt (FPR):** A digitally signed electronic slip with QR code is generated instantly upon final weighment.

${HELP_CENTER_CLOSING}`;
  }

  // 6. Payment Status, DBT & PFMS
  if (lower.includes('payment') || lower.includes('dbt') || lower.includes('pfms') || lower.includes('money') || lower.includes('credit') || lower.includes('bank')) {
    return `**Procurement Payment & DBT Process:**

- **Direct Benefit Transfer (DBT):** All procurement proceeds are transferred directly into the farmer's Aadhaar-seeded bank account via PFMS.
- **Timeline:** Payments are typically credited within **48 to 72 banking hours** following final purchase record submission.
- **Payment Stages:**
  1. *Submitted to Treasury*: Purchase record locked and forwarded.
  2. *PFMS Validated*: Bank account and IFSC confirmed.
  3. *Payment Credited*: Final UTR reference number generated.
- **Check Status:** Visit the **"Payment Status (DBT)"** tab in the Farmer Portal to view your transaction reference and credit date.

${HELP_CENTER_CLOSING}`;
  }

  // 7. Farmer Registration & Documents
  if (lower.includes('register') || lower.includes('registration') || lower.includes('document') || lower.includes('ekyc') || lower.includes('aadhaar')) {
    return `**Farmer Registration Requirements on KisanSetu:**

- **Required Documents:**
  1. **Aadhaar Card** (used for OTP/biometric e-KYC).
  2. **Land Record Documents** (Khatauni / Khasra number to verify sown acreage).
  3. **Bank Passbook Copy / Account details** (must be Aadhaar-linked for DBT payments).
  4. **Active Mobile Number** for SMS token and dispatch updates.
- **Self vs Assisted Registration:** You can register online at \`/register\` or visit the Mandi Helpdesk where an operator will scan your documents and register you free of cost.

${HELP_CENTER_CLOSING}`;
  }

  // 8. Complaints & Grievance Redressal
  if (lower.includes('complaint') || lower.includes('grievance') || lower.includes('dispute') || lower.includes('issue') || lower.includes('problem')) {
    return `**Filing a Grievance or Dispute on KisanSetu:**

- **In-Portal Filing:** Navigate to **"Complaints / Grievances"** in your dashboard and click *"File New Grievance"*.
- **Supported Categories:** Weighment discrepancies, quality assessment disputes, delayed DBT payments, or staff misbehavior.
- **Resolution Timeline:** Mandi Grievance Redressal Officers are mandated to resolve standard grievances within **48 hours**.
- **Urgent Yard Escalation:** Report directly to the Mandi Secretary's office or call the National Farmer Helpline at **1800-180-1551**.

${HELP_CENTER_CLOSING}`;
  }

  // 9. Mandi Timings & Helpdesk
  if (lower.includes('timing') || lower.includes('time') || lower.includes('hour') || lower.includes('open') || lower.includes('helpdesk')) {
    return `**Procurement Centre & Helpdesk Operations:**

- **Operating Hours:** 06:00 AM to 10:00 PM (Monday through Saturday).
- **Gate Ingress:** Gates open at 06:00 AM. Token queues begin processing sequentially.
- **Assisted Help Desk:** Room 4, Mandi Administrative Block (provides free registration, physical token printing, and queue inquiries).
- **Sunday / Holiday Protocol:** Weighbridges remain closed on statutory public holidays unless an emergency extension is notified by the District Collector.

${HELP_CENTER_CLOSING}`;
  }

  // Generic platform fallback for matching keywords
  return `**KisanSetu Platform Information:**

KisanSetu is India's digital agricultural procurement and queue management portal designed to eliminate mandi bottlenecks, ensure transparent electronic weighbridge operations, and speed up direct MSP payments to farmers.

You can manage your:
- Slot Bookings & Centre Selection
- Live Mandi Yard Queue & Token Position
- Quality & Moisture Inspection Reports
- Weighment Slips & Farmer Procurement Receipts (FPR)
- Direct Benefit Transfer (DBT) Payment Status

${HELP_CENTER_CLOSING}`;
}
