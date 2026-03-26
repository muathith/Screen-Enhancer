import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const BANK_BLUE = "#1a3a7a";

export default function OtpPage() {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const isComplete = otp.every(d => d !== "");

  if (verified) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${BANK_BLUE}, #2855b0)` }}
        >
          ✓
        </div>
        <h2 className="text-xl font-bold mb-1" style={{ color: BANK_BLUE }}>تم التحقق بنجاح!</h2>
        <p className="text-gray-500 text-sm">جارٍ تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600 p-1">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-right font-bold text-sm" style={{ color: BANK_BLUE }}>رمز التحقق</div>
        <div className="flex items-center gap-1.5">
          <div className="text-right">
            <div className="text-xs font-bold leading-tight" style={{ color: BANK_BLUE }}>مصرف الأمان</div>
            <div className="text-xs font-semibold" style={{ color: BANK_BLUE, fontSize: 9 }}>AMAN BANK</div>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: `linear-gradient(135deg, ${BANK_BLUE}, #2855b0)` }}
          >
            أ
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="h-24 flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 100%)` }}
      >
        <p className="text-white font-bold text-base">رمز التحقق</p>
        <p className="text-blue-200 text-xs mt-1">أدخل الرمز المرسل إلى هاتفك</p>
      </div>

      <div className="px-5 pt-8 pb-6">
        <form onSubmit={handleVerify}>
          {/* OTP instruction */}
          <p className="text-gray-600 text-sm text-right mb-6 leading-relaxed">
            أدخل رمز التأكيد المرسل إلى هاتفك المحمول
          </p>

          {/* OTP input boxes - styled like the screenshot with dark blue boxes */}
          <div className="flex justify-center gap-2 mb-6 flex-row-reverse">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-11 h-12 text-center text-lg font-bold rounded outline-none transition-all"
                style={{
                  background: digit ? BANK_BLUE : "#f0f4ff",
                  color: digit ? "white" : BANK_BLUE,
                  border: `2px solid ${digit ? BANK_BLUE : "#d1d9f0"}`,
                  letterSpacing: digit ? "0.2em" : "normal",
                }}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              disabled={timeLeft > 0}
              onClick={() => setTimeLeft(120)}
              className="text-sm font-semibold"
              style={{ color: timeLeft > 0 ? "#94a3b8" : BANK_BLUE }}
            >
              إعادة الإرسال
            </button>
            <div
              className="font-mono font-bold text-base px-3 py-1 rounded"
              style={{
                background: timeLeft > 30 ? "#f0f4ff" : "#fff0f0",
                color: timeLeft > 30 ? BANK_BLUE : "#dc2626",
              }}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Confirm button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isComplete}
              className="px-16 py-2.5 rounded font-bold text-sm transition-all"
              style={{
                background: isComplete ? BANK_BLUE : "#d1d5db",
                color: isComplete ? "white" : "#9ca3af",
                minWidth: 180,
                cursor: isComplete ? "pointer" : "not-allowed",
              }}
            >
              تأكيد
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-5 py-3 text-center border-t border-gray-100 bg-white">
        <p className="text-gray-400 text-xs">© 2019 مصرف الأمان — جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
