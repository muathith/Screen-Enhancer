import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const BANK_BLUE = "#1a3a7a";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/otp");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600 p-1">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-right font-bold text-sm" style={{ color: BANK_BLUE }}>إنشاء حساب</div>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 36 }} />
      </nav>

      {/* Hero Banner */}
      <div
        className="h-24 flex items-center px-5"
        style={{ background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 100%)` }}
      >
        <p className="text-white font-bold text-base">
          انضم إلى مصرف الأمان اليوم
        </p>
      </div>

      {/* Form */}
      <div className="px-5 pt-8 pb-6 bg-white">
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-6">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400"
              style={{
                borderBottom: `1.5px solid ${fullName ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
              }}
            />
          </div>

          {/* Phone */}
          <div className="mb-8">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400"
              style={{
                borderBottom: `1.5px solid ${phone ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
              }}
            />
          </div>

          {/* Info box */}
          <div
            className="rounded-lg p-4 mb-6 text-right"
            style={{ background: "#f0f7ff", border: "1px solid #c7d9f7" }}
          >
            <p className="text-xs text-gray-600 leading-relaxed">
              بشرى سارة لعملاء مصرف الأمان — سجل في السحب وأربح جوائز نقدية وعينية مجزية
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-16 py-2.5 rounded font-bold text-white text-sm"
              style={{ background: BANK_BLUE, minWidth: 180 }}
            >
              متابعة
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-sm"
              style={{ color: BANK_BLUE }}
              onClick={() => navigate("/login")}
            >
              لديك حساب؟ سجل الدخول
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
