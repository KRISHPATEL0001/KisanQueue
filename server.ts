import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Port configuration:
// - In development: bind strictly to port 3000 for AI Studio dev server reverse proxy.
// - In production (Cloud Run): bind to process.env.PORT provided by Cloud Run container runtime (default 8080).
const isDev = process.env.NODE_ENV === 'development';
const PORT = isDev ? 3000 : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

app.use(express.json({ limit: '1mb' }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KisanSetu Platform',
    bot: 'Maya Helpbot',
    timestamp: new Date().toISOString()
  });
});

// Platform-only keywords and verification
const PLATFORM_KEYWORDS = [
  'kisansetu', 'kisan', 'setu', 'mandi', 'token', 'queue', 'slot', 'booking',
  'procurement', 'weigh', 'weighing', 'weighbridge', 'gross', 'tare', 'net',
  'moisture', 'quality', 'inspection', 'grade', 'faq', 'msp', 'payment',
  'dbt', 'pfms', 'bank', 'receipt', 'farmer', 'crop', 'wheat', 'paddy',
  'mustard', 'gram', 'cotton', 'soybean', 'maize', 'quintal', 'capacity',
  'centre', 'center', 'helpdesk', 'operator', 'officer', 'grievance', 'complaint',
  'dispute', 'registration', 'register', 'login', 'portal', 'slip', 'delay',
  'aadhaar', 'ekyc', 'kyc', 'khatauni', 'khasra', 'land', 'documents', 'timing',
  'hours', 'help', 'helpline', 'tollfree', 'support', 'status', 'yard', 'vehicle'
];

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

function sanitizeAndRedactPII(input: string): { cleanedText: string; hasRedactions: boolean } {
  let text = input;
  let hasRedactions = false;

  // Mask 12-digit Aadhaar pattern
  const aadhaarRegex = /\b(\d{4})[ -]?(\d{4})[ -]?(\d{4})\b/g;
  if (aadhaarRegex.test(text)) {
    text = text.replace(aadhaarRegex, 'XXXX-XXXX-$3');
    hasRedactions = true;
  }

  // Mask 9-18 digit bank account numbers
  const bankRegex = /\b(\d{5,14})(\d{4})\b/g;
  if (bankRegex.test(text)) {
    text = text.replace(bankRegex, 'XXXXXX$2');
    hasRedactions = true;
  }

  return { cleanedText: text, hasRedactions };
}

function isPlatformRelated(query: string): boolean {
  const lower = query.toLowerCase().trim();
  if (/^(hi|hello|hey|namaste|pranam|ram ram|kisan|help|madad)\b/i.test(lower)) {
    return true;
  }
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(lower)) {
      const hasStrongPlatform = lower.includes('kisansetu') || lower.includes('mandi') || lower.includes('procurement');
      if (!hasStrongPlatform) {
        return false;
      }
    }
  }
  for (const kw of PLATFORM_KEYWORDS) {
    if (lower.includes(kw)) {
      return true;
    }
  }
  return false;
}

const HELP_CENTER_CLOSING = `\n\n---\n📞 **Need further help or facing issues at the mandi?**\nPlease contact our **KisanSetu Help Center** at Toll-Free **1800-180-1551** (24x7), email **support@kisansetu.gov.in**, or visit the **Assisted Service Helpdesk** at your nearest procurement centre.`;

// Intelligent local domain knowledge fallback
function getLocalPlatformAnswer(query: string): string {
  const lower = query.toLowerCase();

  if (/^(hi|hello|hey|namaste|pranam|ram ram|good morning|good afternoon)/i.test(lower) && query.length < 30) {
    return `Namaste! I am **Maya**, your KisanSetu Digital Helpbot. 🙏\n\nI can assist you with all KisanSetu agricultural procurement services:\n1. **Slot Booking & Quotas**: Schedule delivery dates with 20% operational buffer.\n2. **Live Queue & Tokens**: Check your token number (e.g., T-038) and vehicle queue position.\n3. **Moisture & Quality Inspection**: Standards (Paddy 17%, Wheat 12%, Mustard 8%).\n4. **Electronic Weighbridge**: Gross, Tare, and Net Weight (Net = Gross - Tare).\n5. **MSP Payment Tracking**: Direct Benefit Transfer (DBT) via PFMS within 48-72 banking hours.\n6. **Assisted Helpdesk**: Physical registration support for farmers without smartphones.\n\nHow may I help with your procurement today?${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('queue') || lower.includes('token') || lower.includes('wait') || lower.includes('position') || lower.includes('difference')) {
    return `**Live Mandi Queue & Token Tracking on KisanSetu:**\n\n- **Token Activation:** Upon arriving at the mandi entry gate and completing gate check-in, an electronic Token (e.g., **T-038**) is activated.\n- **Queue Position & Difference:** The live display shows the vehicle currently on the weighbridge (e.g., **T-035**) and your queue difference (e.g., *3 vehicles ahead*).\n- **Estimated Wait Time:** Estimated at ~10 minutes per vehicle weighment.\n- **Where to Track:** Click **"Live Queue Status"** in your Farmer Dashboard or view the public queue ticker on the portal homepage.\n- **Audio Announcements:** Public address speakers call out token numbers when bays are ready.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('slot') || lower.includes('book') || lower.includes('capacity') || lower.includes('schedule')) {
    return `**Slot Booking Guidelines on KisanSetu:**\n\n- **Booking Window:** Slots open 7 days in advance starting at 06:00 AM daily.\n- **Centre Capacity & Buffer:** Each centre has a fixed daily quota (e.g., 1,500 Quintals) plus a statutory 20% operational buffer to prevent yard congestion.\n- **Full Centres:** If your preferred centre has exhausted its daily quota, the system recommends adjacent centres with available capacity.\n- **Assisted Booking:** Visit your nearest Mandi Helpdesk if you do not have internet access or a smartphone.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('moisture') || lower.includes('quality') || lower.includes('inspection') || lower.includes('norm') || lower.includes('faq') || lower.includes('limit')) {
    return `**Quality Inspection & Moisture Specifications (FAQ Norms):**\n\n- **Statutory Moisture Limits:**\n  - **Paddy:** Maximum permissible moisture is **17%**.\n  - **Wheat:** Maximum permissible moisture is **12%**.\n  - **Mustard / Oilseeds:** Maximum permissible moisture is **8%**.\n- **Testing Kit:** Quality Control (QC) inspectors test composite samples at Gate Bay 1 using calibrated digital moisture meters.\n- **High Moisture Stock:** Produce exceeding the limit is directed to the yard drying apron for aeration prior to re-testing.\n- **Dispute Redressal:** If dissatisfied with moisture testing, farmers have the right to request joint re-sampling with the Mandi Supervisor.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('weigh') || lower.includes('gross') || lower.includes('tare') || lower.includes('scale') || lower.includes('net')) {
    return `**Electronic Weighbridge Procedures:**\n\n- **Gross Weight:** The loaded tractor/trolley is weighed first upon entry.\n- **Unloading:** Produce is unloaded at the designated storage bay or silo apron.\n- **Tare Weight:** The empty vehicle is weighed on the return exit scale.\n- **Net Weight Calculation:** \`Net Weight = Gross Weight - Tare Weight\`.\n- **Farmer Procurement Receipt (FPR):** A tamper-evident digital receipt with a QR code is generated instantly upon final weighment.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('payment') || lower.includes('dbt') || lower.includes('pfms') || lower.includes('money') || lower.includes('account') || lower.includes('bank')) {
    return `**Procurement Payment & DBT Process:**\n\n- **Direct Benefit Transfer:** Payments are credited directly into your Aadhaar-linked bank account via the Public Financial Management System (PFMS).\n- **Timeline:** Payments are processed and credited within **48 to 72 banking hours** of weighment confirmation.\n- **Tracking:** Check the **"Payment Status (DBT)"** tab in your Farmer Dashboard to view UTR reference numbers and treasury clearance dates.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('register') || lower.includes('registration') || lower.includes('document') || lower.includes('ekyc') || lower.includes('aadhaar')) {
    return `**Farmer Registration Requirements on KisanSetu:**\n\n- **Required Documents:**\n  1. **Aadhaar Number** (for OTP or biometric verification).\n  2. **Land Record Details** (Khatauni / Khasra number and cultivated acreage).\n  3. **Bank Account Details** (Aadhaar-seeded for DBT payments).\n  4. **Active Mobile Number** (to receive SMS token alerts).\n- **How to Register:** Self-register online under the **"Farmer Registration"** tab, or visit the Mandi Helpdesk for assisted biometric registration.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('timing') || lower.includes('time') || lower.includes('hour') || lower.includes('open') || lower.includes('helpdesk')) {
    return `**Procurement Centre & Helpdesk Operations:**\n\n- **Operating Hours:** 06:00 AM to 10:00 PM (Monday through Saturday).\n- **Gate Ingress:** Gates open at 06:00 AM for vehicle token verification.\n- **Assisted Service Helpdesk:** Room 4, Mandi Administrative Block (provides free registration, physical token printing, and queue assistance).\n- **Holidays:** Mandis remain closed on notified gazetted holidays unless an emergency procurement order is issued by the District Administration.${HELP_CENTER_CLOSING}`;
  }

  if (lower.includes('complaint') || lower.includes('grievance') || lower.includes('dispute') || lower.includes('issue')) {
    return `**Grievance & Dispute Redressal:**\n\n- **Filing an Issue:** Navigate to the **"Complaints / Grievances"** section in your portal.\n- **Coverage:** Weighbridge calibration disputes, quality deduction objections, delayed DBT credits, or staff complaints.\n- **Resolution Mandate:** Mandi Grievance Officers must address standard disputes within **48 hours**.\n- **Urgent Yard Contact:** Visit the Mandi Secretary's office directly or call **1800-180-1551**.${HELP_CENTER_CLOSING}`;
  }

  return `**KisanSetu Platform Information:**\n\nKisanSetu is India's digital agricultural procurement platform ensuring fair MSP sales, live yard queue tracking, electronic weighbridge recording, and direct DBT payments.\n\n- **Live Queue:** Track your token position under "Live Queue Status".\n- **Moisture Norms:** Max 17% for Paddy, 12% for Wheat, 8% for Mustard.\n- **Weighbridge:** Net Weight = Gross Weight - Tare Weight.\n- **Payment:** Direct Benefit Transfer (DBT) within 48-72 banking hours.${HELP_CENTER_CLOSING}`;
}

// Candidate models in order of resilience and speed
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash'
];

async function callGeminiWithFallback(ai: GoogleGenAI, cleanedText: string, systemInstruction: string): Promise<string | null> {
  for (const model of CANDIDATE_MODELS) {
    try {
      const timeoutMs = 6500;
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
      });

      const callPromise = (async () => {
        const response = await ai.models.generateContent({
          model,
          contents: cleanedText,
          config: {
            systemInstruction,
            maxOutputTokens: 600,
            temperature: 0.2
          }
        });
        return response.text?.trim() || null;
      })();

      const result = await Promise.race([callPromise, timeoutPromise]);
      if (result) {
        return result;
      }
    } catch (modelError: any) {
      // Graceful fallback to next model when 503 UNAVAILABLE or timeout occurs
      const status = modelError?.status || (modelError?.message?.includes('503') ? 503 : 'unavailable');
      console.log(`[Maya AI] Model '${model}' ${status}. Trying next resilient candidate...`);
    }
  }
  return null;
}

// Maya Helpbot Chat API Endpoint
app.post('/api/maya/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid query message is required.' });
    }

    const trimmed = message.slice(0, 500); // Safety constraint: limit length
    const { cleanedText, hasRedactions } = sanitizeAndRedactPII(trimmed);

    // Protocol check: Only platform-related questions
    if (!isPlatformRelated(cleanedText)) {
      return res.json({
        reply: `Namaste! I am **Maya**, the official KisanSetu Platform Assistant.\n\n🔒 **Platform Scope Notice:**\nUnder KisanSetu privacy and security protocols, I am authorized to answer **only questions directly related to the KisanSetu agricultural procurement platform** (such as farmer registrations, slot bookings, mandi yard queue status, weighbridge operations, quality moisture norms, and DBT payment tracking).\n\nI cannot answer general knowledge, entertainment, technical, or non-platform inquiries.${HELP_CENTER_CLOSING}`,
        isOffTopic: true,
        hasRedactions
      });
    }

    const ai = getGeminiClient();
    if (ai) {
      const systemInstruction = `You are Maya, the official AI Platform Helpbot for KisanSetu (किसानसेतु) - Indian Government Agricultural Procurement & Yard Queue Management Portal.

MANDATORY PROTOCOLS & SECURITY RULES:
1. PLATFORM-ONLY SCOPE: You ONLY answer questions related to the KisanSetu platform:
   - Farmer registration & e-KYC (Aadhaar & land record linkage).
   - Slot booking rules, centre selection, daily quotas, 20% operational buffer.
   - Live mandi queue tracking, sequential token numbers (e.g., T-038), queue difference, and bay facilities.
   - Quality inspection & moisture standards (Paddy max 17%, Wheat max 12%, Mustard max 8%).
   - Electronic weighbridge operations: Gross Weight, Tare Weight, Net Weight = Gross - Tare.
   - Farmer Procurement Receipts (FPR) and Minimum Support Price (MSP) records.
   - Direct Benefit Transfer (DBT) payment timelines via PFMS (48 to 72 banking hours).
   - Mandi operating hours (06:00 AM – 10:00 PM, Mon-Sat), Helpdesk assisted registrations for farmers without smartphones, and grievance filing.
2. NON-PLATFORM REJECTION: If the user asks ANY question not related to KisanSetu (e.g., general world trivia, programming, recipes, politics, celebrities, sports, non-platform math, or personal advice), you MUST politely refuse and state that you only answer KisanSetu platform questions, then direct them to the Help Center.
3. HELP CENTER ESCALATION: At the end of EVERY answer, you MUST advise the user to contact the KisanSetu Help Center for further assistance or unresolved mandi issues: Toll-Free 1800-180-1551 (24x7) or email support@kisansetu.gov.in.
4. PRIVACY & SECURITY: NEVER request, store, or repeat full 12-digit Aadhaar numbers, bank account PINs, OTPs, or passwords. Warn users if they attempt to provide confidential credentials.
5. STYLE: Courteous, concise, authoritative, and helpful. Use clear bullet points and bold key terms.`;

      const aiReply = await callGeminiWithFallback(ai, cleanedText, systemInstruction);
      if (aiReply) {
        let finalReply = aiReply;
        if (!finalReply.includes('1800-180-1551')) {
          finalReply += HELP_CENTER_CLOSING;
        }
        return res.json({
          reply: finalReply,
          isOffTopic: false,
          hasRedactions
        });
      }
    }

    // High-fidelity local platform response tailored to the farmer's specific query
    const localAnswer = getLocalPlatformAnswer(cleanedText);
    return res.json({
      reply: localAnswer,
      isOffTopic: false,
      hasRedactions
    });
  } catch (error) {
    console.error('Error in /api/maya/chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (mode: ${process.env.NODE_ENV || 'production'})`);
  });
}

startServer();
