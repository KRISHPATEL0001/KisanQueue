import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, Volume2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface GovCaptchaProps {
  onValidate: (isValid: boolean) => void;
  id?: string;
  className?: string;
  required?: boolean;
}

// Characters excluding easily confused glyphs (0, O, I, 1, l)
const CAPTCHA_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const GovCaptcha: React.FC<GovCaptchaProps> = ({
  onValidate,
  id = 'gov-captcha',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds validity
  const [isExpired, setIsExpired] = useState(false);

  // Generate random 5-char code
  const generateNewCaptcha = useCallback(() => {
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(null);
    setIsExpired(false);
    setTimeLeft(120);
    onValidate(false);
  }, [onValidate]);

  // Render canvas with realistic distortion, lines, and speckles
  useEffect(() => {
    if (!captchaText) {
      generateNewCaptcha();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#f8fafc');
    bgGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Random background interference lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 40%, 75%)`;
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Draw noisy dots / speckles
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 65%)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with rotation, offset, and high-contrast styling
    const charSpacing = width / (captchaText.length + 1);
    const textColors = ['#0f172a', '#1e3a8a', '#14532d', '#7c2d12', '#312e81', '#164e63'];

    for (let i = 0; i < captchaText.length; i++) {
      const char = captchaText[i];
      const x = (i + 0.8) * charSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);

      ctx.save();
      ctx.translate(x, y);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);
      ctx.rotate(angle);

      ctx.font = `bold ${Math.floor(22 + Math.random() * 5)}px monospace`;
      ctx.fillStyle = textColors[i % textColors.length];
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }

    // Foreground strike-through security wave
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(10, height / 2);
    ctx.quadraticCurveTo(width / 2, height / 2 - 12, width - 10, height / 2 + 5);
    ctx.stroke();
  }, [captchaText, generateNewCaptcha]);

  // Countdown timer for captcha expiration (120s)
  useEffect(() => {
    if (isExpired) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          setIsVerified(false);
          onValidate(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExpired, onValidate]);

  // Audio readout using Web Speech API
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Audio Captcha: Speech synthesis is not supported on this browser. Captcha is: ' + captchaText.split('').join(' '));
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const phoneticList = captchaText.split('').map((c) => {
      if (/[A-Z]/.test(c)) return `Capital ${c}`;
      return c;
    });

    const phrase = `National Procurement Security Captcha: ${phoneticList.join(', ')}.`;
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (val: string) => {
    const clean = val.toUpperCase().slice(0, 5);
    setUserInput(clean);

    if (isExpired) {
      setIsVerified(false);
      onValidate(false);
      return;
    }

    if (clean.length === 5) {
      const match = clean === captchaText;
      setIsVerified(match);
      onValidate(match);
    } else {
      setIsVerified(null);
      onValidate(false);
    }
  };

  return (
    <div id={id} className={`p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xs space-y-2 text-xs ${className}`}>
      <div className="flex items-center justify-between text-gray-700">
        <label htmlFor={`${id}-input`} className="font-bold text-[11px] text-[#123B5D] flex items-center gap-1.5">
          <span>Security Verification Captcha / सुरक्षा कोड *</span>
        </label>
        <span className={`text-[10px] flex items-center gap-1 font-mono ${timeLeft < 30 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
          <Clock className="w-3 h-3" />
          <span>{isExpired ? 'Expired' : `${timeLeft}s`}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Distorted Canvas Box */}
        <div className="relative border border-gray-300 rounded-xs overflow-hidden shadow-2xs bg-white">
          <canvas
            ref={canvasRef}
            width={160}
            height={44}
            className="block select-none pointer-events-none"
            title="Visual Security Captcha Code"
          />
          {isExpired && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-2xs flex items-center justify-center text-[11px] font-bold text-red-600">
              Expired — Click Refresh
            </div>
          )}
        </div>

        {/* Action Controls: Refresh & Audio */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={generateNewCaptcha}
            title="Generate New Captcha Code"
            className="p-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xs transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSpeak}
            disabled={isSpeaking || isExpired}
            title="Listen to Captcha Audio Readout"
            className={`p-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xs transition-colors cursor-pointer ${
              isSpeaking ? 'text-[#E87524] animate-pulse' : ''
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Captcha Input Box */}
        <div className="flex-1 min-w-[130px] relative">
          <input
            id={`${id}-input`}
            type="text"
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type 5 chars"
            maxLength={5}
            autoComplete="off"
            spellCheck="false"
            className={`w-full px-3 py-2 text-center uppercase tracking-widest font-mono font-bold text-sm bg-white border rounded-xs focus:outline-hidden ${
              isVerified === true
                ? 'border-emerald-600 ring-1 ring-emerald-500 text-emerald-800'
                : isVerified === false
                ? 'border-red-500 ring-1 ring-red-400 text-red-700'
                : 'border-[#CBD5E1] focus:border-[#123B5D]'
            }`}
          />
          {isVerified === true && (
            <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5 pointer-events-none" />
          )}
          {isVerified === false && (
            <XCircle className="w-4 h-4 text-red-500 absolute right-2.5 top-2.5 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Inline Feedback */}
      {isVerified === true && (
        <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>Security Captcha matched successfully.</span>
        </p>
      )}
      {isVerified === false && (
        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          <span>{isExpired ? 'Captcha has expired. Please click refresh.' : 'Characters do not match. Please re-enter.'}</span>
        </p>
      )}
    </div>
  );
};
