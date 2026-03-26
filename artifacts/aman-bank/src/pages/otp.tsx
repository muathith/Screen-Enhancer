import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function OtpPage() {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const isComplete = otp.every((d) => d !== "");

  if (verified) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        dir="rtl"
        style={{ background: "linear-gradient(160deg, #0f2557 0%, #1a3a8f 100%)" }}
      >
        <div className="text-center text-white">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">تم التحقق بنجاح!</h2>
          <p className="text-blue-200">جارٍ تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ background: "linear-gradient(160deg, #0f2557 0%, #1a3a8f 40%, #1e4db7 100%)" }}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-5 pt-8 pb-4">
          <div className="bg-white rounded-xl px-4 py-2.5 shadow-xl">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1a3a8f, #1e4db7)" }}
              >
                <span className="text-white font-bold text-sm">أ</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold" style={{ color: "#0f2557" }}>مصرف الأمان</div>
                <div className="text-xs text-blue-600 font-semibold">AMAN BANK</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6 flex flex-col shadow-2xl">
          <div className="mb-8 text-right">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #0f2557, #1a3a8f)" }}
            >
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#0f2557" }}>
              رمز التحقق
            </h1>
            <p className="text-gray-500 text-sm">
              أدخل رمز التأكيد المرسل إلى هاتفك المحمول
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-6 flex-1">
            <div>
              <div className="flex justify-center gap-3 mb-6 flex-row-reverse">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                    style={{
                      borderColor: digit ? "#1a3a8f" : "#e2e8f0",
                      background: digit ? "#f0f4ff" : "#f8fafc",
                      color: "#0f2557",
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled={timeLeft > 0}
                  onClick={() => setTimeLeft(120)}
                  className="text-sm font-semibold transition-all"
                  style={{ color: timeLeft > 0 ? "#94a3b8" : "#1a3a8f" }}
                >
                  إعادة الإرسال
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">الوقت المتبقي:</span>
                  <div
                    className="px-3 py-1.5 rounded-lg font-mono font-bold text-sm"
                    style={{
                      background: timeLeft > 30 ? "#f0f4ff" : "#fff0f0",
                      color: timeLeft > 30 ? "#0f2557" : "#dc2626",
                      border: `1px solid ${timeLeft > 30 ? "#c7d4f7" : "#fecaca"}`,
                    }}
                  >
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{ background: "#f0f4ff", border: "1px solid #c7d4f7" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#1a3a8f" }}
                >
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#0f2557" }}>
                  ملاحظة أمنية
                </span>
              </div>
              <p className="text-xs text-gray-600 text-right leading-relaxed">
                لا تشارك رمز التحقق مع أي شخص. مصرف الأمان لن يطلب منك هذا الرمز أبداً.
              </p>
            </div>

            <div className="mt-auto">
              <button
                type="submit"
                disabled={!isComplete}
                className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all"
                style={{
                  background: isComplete
                    ? "linear-gradient(135deg, #0f2557 0%, #1a3a8f 100%)"
                    : "#e2e8f0",
                  color: isComplete ? "white" : "#94a3b8",
                  boxShadow: isComplete ? "0 8px 25px rgba(26, 58, 143, 0.4)" : "none",
                  cursor: isComplete ? "pointer" : "not-allowed",
                }}
              >
                تأكيد
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
