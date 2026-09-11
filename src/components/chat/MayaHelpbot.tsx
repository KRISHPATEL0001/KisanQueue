import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Headset,
  UserRound,
  MessageSquare, 
  Send, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Trash2, 
  HelpCircle, 
  Sparkles, 
  RefreshCw,
  Maximize2,
  Minimize2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { 
  MayaMessage, 
  sanitizeAndRedactPII, 
  isPlatformRelated, 
  getPlatformAnswer, 
  getOffTopicResponse,
  HELP_CENTER_DETAILS 
} from '../../lib/mayaKnowledge';

const INITIAL_MESSAGES: MayaMessage[] = [
  {
    id: 'welcome-1',
    sender: 'maya',
    text: `Namaste! I am **Maya**, the official KisanSetu Platform Helpbot. 🙏

I can answer questions regarding the **KisanSetu digital procurement portal** (slot bookings, yard queue tracking, weighbridge norms, moisture standards, and DBT payments).

🔒 **Security & Privacy Rule:** For your safety, do not share OTPs, passwords, or full bank credentials. I answer only platform-related queries.

How can I help you today?

---
📞 **Need direct human assistance?**
Contact our Help Center anytime at Toll-Free **${HELP_CENTER_DETAILS.tollFree}** or visit your nearest Mandi Helpdesk.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const SUGGESTED_QUESTIONS = [
  'How to check my queue token position?',
  'What are the permissible moisture limits?',
  'How is Net Weight calculated at the weighbridge?',
  'When will my MSP payment be credited?',
  'What documents are needed for registration?',
  'What if the mandi capacity is full?'
];

export const FemaleHelperLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dims = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const headsetSize = size === 'sm' ? 'w-5.5 h-5.5' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';

  return (
    <div className={`relative ${dims} rounded-full bg-gradient-to-b from-[#FFF5EB] via-[#FEEAD4] to-[#FCD9B8] border-2 border-amber-400 shadow-sm flex items-center justify-center overflow-hidden shrink-0`}>
      {/* Headset arc */}
      <Headset className={`${headsetSize} text-[#123B5D] absolute top-0.5 z-10`} />
      {/* Female helper silhouette / face */}
      <UserRound className={`${iconSize} text-[#123B5D] relative top-1`} />
      {/* Subtle traditional bindi accent for Maya */}
      <span className="w-1 h-1 bg-[#C62828] rounded-full absolute top-2.5 z-20" />
    </div>
  );
};

export const MayaHelpbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<MayaMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('kisansetu_maya_chat');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [rateLimitCounter, setRateLimitCounter] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('kisansetu_maya_chat', JSON.stringify(messages));
    } catch (e) {
      console.warn('Session storage error:', e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Reset rate limiter every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setRateLimitCounter(0);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    // Rate Limiting Protocol: Max 8 queries per minute to avoid bot spam
    if (rateLimitCounter >= 8) {
      setSecurityNotice('⚠️ Rate limit protection active: Please wait a moment before sending more queries.');
      setTimeout(() => setSecurityNotice(null), 5000);
      return;
    }
    setRateLimitCounter(prev => prev + 1);

    // Security & Privacy Protocol Step 1: Sanitize and detect PII (Aadhaar, Bank Accounts, OTPs)
    const { cleanedText, hasRedactions, warningMessage } = sanitizeAndRedactPII(query);
    if (hasRedactions && warningMessage) {
      setSecurityNotice(warningMessage);
      setTimeout(() => setSecurityNotice(null), 8000);
    }

    const userMsg: MayaMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSecurityWarning: hasRedactions
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Security Protocol Step 2: Check if platform-related
      const platformAllowed = isPlatformRelated(cleanedText);

      let botAnswer: string;
      let isOffTopic = false;

      if (!platformAllowed) {
        // Strict guardrail: Off-topic questions are rejected and directed to Help Center
        botAnswer = getOffTopicResponse();
        isOffTopic = true;
      } else {
        // Attempt server API call with Gemini first
        let gotServerResponse = false;
        try {
          const res = await fetch('/api/maya/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: cleanedText })
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.reply) {
              botAnswer = data.reply;
              isOffTopic = !!data.isOffTopic;
              gotServerResponse = true;
            }
          }
        } catch {
          // If server is not running or network request fails, proceed to resilient client knowledge engine
        }

        if (!gotServerResponse) {
          // Reliable client-side knowledge engine fallback
          botAnswer = getPlatformAnswer(cleanedText);
        }
      }

      const botMsg: MayaMessage = {
        id: `maya-${Date.now()}`,
        sender: 'maya',
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOffTopic
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `maya-err-${Date.now()}`,
          sender: 'maya',
          text: `I apologize, but I encountered a momentary connection issue. Please contact the KisanSetu Help Center at Toll-Free **${HELP_CENTER_DETAILS.tollFree}** (24x7) or try asking again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    sessionStorage.removeItem('kisansetu_maya_chat');
    setSecurityNotice('Conversation history cleared securely.');
    setTimeout(() => setSecurityNotice(null), 3000);
  };

  const renderFormattedText = (content: string) => {
    // Splits by lines and handles bolding **text**
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('---')) {
        return <hr key={idx} className="my-2 border-gray-200" />;
      }
      
      // Parse markdown bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-[#123B5D]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px] text-gray-800">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      return (
        <p key={idx} className={line.trim().startsWith('-') || line.trim().startsWith('•') ? 'pl-2 text-gray-700 leading-relaxed my-0.5' : 'my-1 text-gray-800 leading-relaxed'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <aside aria-label="Maya Helpbot" className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end">
      {/* Floating Chat Trigger Button when closed: Small button with female helper rounded logo and message bar 'Ask me' */}
      {!isOpen && (
        <div className="relative group">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-[#123B5D] hover:bg-[#0c2840] active:scale-95 text-white pl-1.5 pr-3.5 py-1.5 rounded-full shadow-lg border border-amber-400/80 cursor-pointer transition-all duration-200 hover:scale-105 select-none"
            aria-label="Open Maya Helpbot"
          >
            {/* Small rounded female helper logo */}
            <div className="relative shrink-0">
              <FemaleHelperLogo size="sm" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#123B5D]" />
              </span>
            </div>

            {/* Message bar written 'Ask me' */}
            <div className="flex items-center gap-1.5 text-left">
              <span className="text-xs font-bold text-white tracking-tight">
                Ask me
              </span>
              <span className="bg-amber-400 text-[#123B5D] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Maya
              </span>
            </div>
          </button>

          {/* Hover Tooltip */}
          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex flex-col items-end pointer-events-none z-50">
            <div className="bg-[#123B5D] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-xs shadow-lg border border-amber-400/60 whitespace-nowrap">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <span>Maya (माया)</span>
                <span className="text-[9px] bg-emerald-500 text-white font-bold px-1 rounded-xs">Helpbot</span>
              </div>
              <span className="text-gray-200 text-[10px]">Click to ask KisanSetu questions</span>
            </div>
          </div>
        </div>
      )}

      {/* Maya Chat Window */}
      {isOpen && (
        <div
          className={`bg-white border-2 border-[#123B5D] rounded-sm shadow-2xl flex flex-col overflow-hidden transition-all duration-200 max-h-[calc(100vh-24px)] ${
            isExpanded 
              ? 'w-[calc(100vw-24px)] sm:w-[540px] h-[85vh] max-h-[720px]' 
              : 'w-[calc(100vw-24px)] sm:w-[420px] h-[540px]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#123B5D] text-white p-3.5 flex items-center justify-between border-b border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <FemaleHelperLogo size="md" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-[#123B5D] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm text-white">Maya</h2>
                  <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs">
                    ACTIVE
                  </span>
                  <span className="text-[10px] text-amber-200 font-mono">| किसानसेतु</span>
                </div>
                <span className="text-[11px] text-gray-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                  Official Platform Helpbot
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-300 hover:text-white p-1.5 rounded-xs hover:bg-white/10 cursor-pointer"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleClearChat}
                className="text-gray-300 hover:text-white p-1.5 rounded-xs hover:bg-white/10 cursor-pointer"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white p-1.5 rounded-xs hover:bg-white/10 cursor-pointer"
                title="Close Maya"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Security & Privacy Protocol Badge Bar */}
          <div className="bg-[#FFF3E8] border-b border-[#E87524]/20 px-3 py-1.5 flex items-center justify-between text-[10px] text-[#123B5D]">
            <span className="flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-[#E87524]" />
              Platform Questions Only • Privacy Guard Active
            </span>
            <span className="text-gray-500 font-mono">No OTP/PIN required</span>
          </div>

          {/* Security Alert Toast */}
          {securityNotice && (
            <div className="bg-amber-100 border-b border-amber-300 p-2 text-[11px] text-amber-900 flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{securityNotice}</span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F8FAFC] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5 px-1">
                  <span>{msg.sender === 'user' ? 'You' : 'Maya'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[90%] rounded-xs p-3 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#123B5D] text-white border border-[#123B5D]'
                      : msg.isOffTopic
                      ? 'bg-amber-50 border-2 border-amber-300 text-amber-950'
                      : 'bg-white border border-[#D6DDE5] text-gray-900'
                  }`}
                >
                  {msg.isOffTopic && (
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-[10px] mb-1.5 pb-1 border-b border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Non-Platform Query Flagged</span>
                    </div>
                  )}

                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div>{renderFormattedText(msg.text)}</div>
                  )}

                  {/* Help Center Quick Action Bar attached to Maya responses */}
                  {msg.sender === 'maya' && (
                    <div className="mt-3 pt-2.5 border-t border-gray-200 flex flex-wrap gap-2 items-center justify-between text-[11px]">
                      <span className="font-bold text-[#123B5D] flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#E87524]" />
                        Official Help Center:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href="tel:18001801551"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-xs border border-emerald-300 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>1800-180-1551</span>
                        </a>
                        <Link
                          to="/help"
                          onClick={() => setIsOpen(false)}
                          className="bg-gray-100 hover:bg-gray-200 text-[#123B5D] font-bold px-2 py-0.5 rounded-xs border border-gray-300 flex items-center gap-0.5"
                        >
                          <span>Grievance Desk</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs p-2 bg-white border border-[#D6DDE5] rounded-xs max-w-[200px]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#123B5D]" />
                <span>Maya is verifying platform norms...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Query Chips */}
          <div className="bg-white border-t border-[#D6DDE5] px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
              Suggested Platform Topics:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="bg-[#F5F7F9] hover:bg-[#FFF3E8] hover:border-[#E87524] text-[#123B5D] border border-[#D6DDE5] px-2 py-1 rounded-xs text-[11px] font-medium cursor-pointer transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form & Security Policy Footer */}
          <div className="bg-white p-3 border-t border-[#D6DDE5] space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                maxLength={400}
                placeholder="Ask Maya about slots, yard queue, weighbridge, payments..."
                className="flex-1 bg-[#F8FAFC] border border-[#D6DDE5] text-xs px-3 py-2 rounded-xs outline-none focus:ring-1 focus:ring-[#123B5D] text-gray-900"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="bg-[#123B5D] hover:bg-[#0c2840] disabled:bg-gray-300 text-white px-3.5 py-2 rounded-xs font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Protected: Aadhaar & bank details are automatically masked.
              </span>
              <span className="font-mono">{inputQuery.length}/400</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
