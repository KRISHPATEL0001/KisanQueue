import React from 'react';
import { 
  UserCheck, 
  Sprout, 
  Calendar, 
  Truck, 
  Microscope, 
  Scale, 
  CreditCard,
  ArrowDown
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Farmer & Land Registration (किसान पंजीकरण)',
      desc: 'Farmers register using their basic details, village, mobile number, and masked bank account. One-time verification guarantees all subsequent payments reach their bank directly via DBT.',
      icon: <UserCheck className="w-5 h-5 text-[#123B5D]" />,
    },
    {
      num: 2,
      title: 'Crop & Harvest Declaration (फसल एवं मात्रा चयन)',
      desc: 'Declare the estimated harvest volume in quintals (e.g. 20 quintals of Wheat or 35 quintals of Paddy). The system checks against MSP eligibility and central season caps.',
      icon: <Sprout className="w-5 h-5 text-[#2E7D32]" />,
    },
    {
      num: 3,
      title: 'Capacity-Based Slot Booking (स्लॉट एवं केंद्र चयन)',
      desc: 'View real-time remaining capacity across nearby procurement centres. Select an open date and a 2-hour arrival window (e.g. 09:00 AM - 11:00 AM). Overbooking is blocked by algorithm.',
      icon: <Calendar className="w-5 h-5 text-[#E87524]" />,
    },
    {
      num: 4,
      title: 'Arrival & Token Issuance (केंद्र पर आगमन एवं टोकन)',
      desc: 'Upon arrival with tractor or trolley, the gate operator verifies the booking reference, checks vehicle number, and generates a printable Token Slip (e.g. Token T-038).',
      icon: <Truck className="w-5 h-5 text-[#123B5D]" />,
    },
    {
      num: 5,
      title: 'Quality Inspection (गुणवत्ता एवं नमी परीक्षण)',
      desc: 'Grain samples are tested by the certified quality inspector for moisture percentage and foreign matter. Official parameters are logged into the system immediately.',
      icon: <Microscope className="w-5 h-5 text-[#2E7D32]" />,
    },
    {
      num: 6,
      title: 'Electronic Weighment & Purchase Slip (इलेक्ट्रॉनिक तौल एवं रसीद)',
      desc: 'Vehicle passes over the electronic weighbridge to record gross weight, unloads grain in the storage bay, and re-weighs for tare weight. Net weight is calculated automatically.',
      icon: <Scale className="w-5 h-5 text-[#E87524]" />,
    },
    {
      num: 7,
      title: 'Direct Bank Settlement (डीबीटी भुगतान)',
      desc: 'The purchase slip triggers an automated payment instruction forwarded to the District Treasury. Once verified, funds are credited to the farmer’s account with an official reference code.',
      icon: <CreditCard className="w-5 h-5 text-[#18794E]" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-[#D6DDE5] p-6 rounded-xs shadow-2xs space-y-4">
        <div className="border-b border-gray-200 pb-3">
          <span className="text-xs font-bold text-[#E87524] uppercase tracking-wider">
            Step-By-Step Standard Operating Procedure (SOP)
          </span>
          <h1 className="text-2xl font-bold text-[#123B5D]">
            How KisanSetu Works
          </h1>
          <p className="text-xs text-gray-600">
            A comprehensive overview of the agricultural procurement workflow from booking to payment credit.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {steps.map((s, idx) => (
            <div key={s.num} className="relative">
              <div className="flex items-start gap-4 p-4 bg-[#F5F7F9] border border-[#D6DDE5] rounded-xs hover:border-[#123B5D] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#123B5D] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                  {s.num}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {s.icon}
                    <h3 className="font-bold text-sm text-[#123B5D]">{s.title}</h3>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{s.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex justify-center my-1 text-gray-400">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
