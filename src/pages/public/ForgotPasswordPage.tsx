import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GovEmblem } from '../../components/government/Emblem';
import { ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [mobileOrUser, setMobileOrUser] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="bg-white border border-[#D6DDE5] rounded-xs shadow-md overflow-hidden text-xs">
        <div className="bg-[#123B5D] text-white p-5 text-center space-y-2">
          <div className="flex justify-center">
            <GovEmblem size="sm" className="[&_span]:text-white [&_span.text-gray-600]:text-gray-300" />
          </div>
          <h1 className="text-base font-bold">Credential Recovery (पासवर्ड / ओटीपी पुनर्प्राप्ति)</h1>
          <p className="text-[11px] text-gray-200">KisanSetu Security Cell</p>
        </div>

        <div className="p-6 space-y-4">
          {sent ? (
            <div className="p-4 bg-[#EAF4EA] border border-[#18794E]/40 rounded-xs space-y-3 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#18794E] mx-auto" />
              <div className="font-bold text-sm text-[#18794E]">Recovery Instructions Dispatched</div>
              <p className="text-gray-700 leading-relaxed text-[11px]">
                In this synthetic prototype, your password reset OTP or link has been simulated for registered mobile / username. You may use demo password <code>demo123</code> or demo OTP <code>123456</code>.
              </p>
              <Link
                to="/login"
                className="inline-block bg-[#123B5D] text-white px-4 py-2 rounded-xs font-bold text-xs"
              >
                Return to Login →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-gray-600">
                Enter your registered mobile number (for farmers) or staff username (for operators/officers) to receive a secure recovery code.
              </p>

              <div className="space-y-1">
                <label className="font-bold text-[#1F2933] block">
                  Registered Identifier (Mobile or Staff ID)
                </label>
                <input
                  type="text"
                  value={mobileOrUser}
                  onChange={(e) => setMobileOrUser(e.target.value)}
                  placeholder="e.g. 9876543210 or operator.demo"
                  required
                  className="w-full px-3 py-2 border border-[#D6DDE5] rounded-xs focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#123B5D] hover:bg-[#0e2c45] text-white py-2.5 rounded-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Send One-Time Passcode (OTP)</span>
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-gray-600 hover:text-[#123B5D] flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
