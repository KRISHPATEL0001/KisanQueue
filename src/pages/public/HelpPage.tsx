import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, HelpCircle, MessageSquareWarning, MapPin, ChevronDown, ChevronUp, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { FemaleHelperLogo } from '../../components/chat/MayaHelpbot';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I check my Token position and estimated waiting time?',
      a: 'Once your vehicle arrives and checks in at the procurement centre gate, your token number (e.g. T-038) is activated. Navigate to "Live Queue Status" on this portal to see how many vehicles are ahead of you and the estimated waiting time in minutes.'
    },
    {
      q: 'What should I do if a centre shows "Capacity Full" for my selected date?',
      a: 'The system prevents overbooking to ensure farmers are never stranded. If your preferred centre has exhausted bookable capacity, select another date or choose an alternate procurement centre recommended on the slot booking screen.'
    },
    {
      q: 'What is the operational reserve buffer in mandi capacity?',
      a: 'Every procurement centre reserves 20% of its daily intake capacity as an operational buffer. This accounts for unannounced weather emergencies, minor weighbridge delays, or emergency walk-in farmer allocations.'
    },
    {
      q: 'How is the Net Weight calculated during weighment?',
      a: 'The loaded vehicle is weighed on the electronic weighbridge to record Gross Weight. After unloading into the designated mandi silo or bay, the empty vehicle is re-weighed to record Tare Weight. Net Weight = Gross Weight - Tare Weight.'
    },
    {
      q: 'My payment shows "Submitted". Why is it not yet credited?',
      a: 'When an operator records a purchase, the payment instruction is submitted to the Treasury. Under central auditing regulations, payments are marked "Credited" only after the bank issues a verified transaction reference code (usually within 48-72 banking hours).'
    },
    {
      q: 'I do not own a smartphone. How can I participate in digital procurement?',
      a: 'Visit the Assisted Service Help Desk at your nearest mandi. The Help Desk operator will register your details, book your preferred slot, and hand you a printed physical token.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-2">
        <span className="text-xs font-bold text-[#E87524] uppercase tracking-wider">
          Citizen Assistance & Public Grievance Redressal
        </span>
        <h1 className="text-2xl font-bold text-[#123B5D]">
          Help & Frequently Asked Questions (सहायता एवं समाधान)
        </h1>
        <p className="text-xs text-gray-600">
          Reach out to official support channels or consult procedural guidelines for seamless procurement.
        </p>
      </div>

      {/* Maya AI Helpbot Banner */}
      <div className="bg-[#123B5D] text-white p-5 rounded-xs shadow-md border-2 border-amber-400/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 mt-0.5">
            <FemaleHelperLogo size="lg" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Meet Maya (माया) – KisanSetu Platform Helpbot</span>
              </h2>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-xs">
                Active 24x7
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed max-w-2xl">
              Maya answers <strong>only KisanSetu platform-related questions</strong> (slot reservations, mandi live queue difference, weighbridge net weight rules, moisture specifications, and DBT timelines). For unresolved or centre-specific disputes, Maya always guides you to contact the official Help Center.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-amber-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Security & Privacy Shield Active
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                Aadhaar & Bank Details Redacted
              </span>
              <span>•</span>
              <span>Never Share OTPs or Passwords</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            // Trigger Maya Helpbot
            const triggerBtn = document.querySelector('button[aria-label="Open Maya Helpbot"]') as HTMLButtonElement;
            if (triggerBtn) triggerBtn.click();
          }}
          className="bg-amber-400 hover:bg-amber-500 text-[#123B5D] px-4 py-2.5 rounded-xs font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer shadow-sm transition-transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-[#123B5D]" />
          <span>Ask Maya Now (चैट करें)</span>
        </button>
      </div>

      {/* Emergency & Helpline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-t-4 border-[#E87524] border-x border-b border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#123B5D]">
            <Phone className="w-5 h-5 text-[#E87524]" />
            <h3 className="font-bold text-xs uppercase">National Farmer Helpline</h3>
          </div>
          <div className="text-xl font-black text-[#123B5D]">1800-180-1551</div>
          <p className="text-[11px] text-gray-500">Toll-free Kisan Call Centre • 24 hours / 7 days</p>
        </div>

        <div className="bg-white border-t-4 border-[#2E7D32] border-x border-b border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#123B5D]">
            <Mail className="w-5 h-5 text-[#2E7D32]" />
            <h3 className="font-bold text-xs uppercase">Official Support Email</h3>
          </div>
          <div className="text-sm font-bold text-[#123B5D]">support-kisansetu@gov.in</div>
          <p className="text-[11px] text-gray-500">Replies within 1 business day with ticket reference</p>
        </div>

        <div className="bg-white border-t-4 border-[#123B5D] border-x border-b border-[#D6DDE5] p-4 rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#123B5D]">
            <Clock className="w-5 h-5 text-[#123B5D]" />
            <h3 className="font-bold text-xs uppercase">Mandi Helpdesk Timings</h3>
          </div>
          <div className="text-sm font-bold text-[#123B5D]">07:00 AM – 07:00 PM</div>
          <p className="text-[11px] text-gray-500">Monday through Saturday across all 24 Mandi Yards</p>
        </div>
      </div>

      {/* Assisted Desk CTA */}
      <div className="bg-[#FFF3E8] border border-[#E87524]/40 p-4 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-[#E87524] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#123B5D] block">Need In-Person Support?</span>
            <span className="text-gray-600">Every Mandi gate features an Assisted Service Counter equipped with computer, operator, and token printer.</span>
          </div>
        </div>
        <Link
          to="/farmer/complaints"
          className="bg-[#123B5D] hover:bg-[#0e2c45] text-white text-xs font-bold px-4 py-2 rounded-xs whitespace-nowrap"
        >
          Submit an Official Grievance →
        </Link>
      </div>

      {/* FAQ Accordion */}
      <section className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-[#123B5D] flex items-center gap-2 border-b pb-2 border-gray-200">
          <HelpCircle className="w-5 h-5 text-[#E87524]" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="divide-y divide-gray-200">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 text-xs font-bold text-[#123B5D] hover:text-[#E87524] focus:outline-hidden"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#E87524]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />}
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-2 border-l-2 border-[#E87524]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
