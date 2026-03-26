import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";

const BANK_BLUE = "#1a3a7a";

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="text-xs mt-1 text-right" style={{ color: "#dc2626" }}>
      {msg}
    </p>
  );
}

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ fullName?: boolean; phone?: boolean }>({});

  function validate(name: string, ph: string) {
    const errs: { fullName?: string; phone?: string } = {};
    if (!name.trim()) {
      errs.fullName = "الاسم الكامل مطلوب";
    } else if (name.trim().length < 3) {
      errs.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }
    if (!ph.trim()) {
      errs.phone = "رقم الهاتف مطلوب";
    } else if (!/^[0-9+\s\-]{7,15}$/.test(ph.trim())) {
      errs.phone = "أدخل رقم هاتف صحيح";
    }
    return errs;
  }

  const handleBlur = (field: "fullName" | "phone") => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate(fullName, phone));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fullName, phone);
    setErrors(errs);
    setTouched({ fullName: true, phone: true });
    if (Object.keys(errs).length === 0) {
      navigate("/login");
    }
  };

  const isValid = !validate(fullName, phone).fullName && !validate(fullName, phone).phone && fullName && phone;

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600 p-1">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-sm font-bold" style={{ color: BANK_BLUE }}>إنشاء حساب</div>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 36 }} />
      </nav>

      {/* Hero Banner */}
      <div
        className="h-24 flex items-center px-5"
        style={{ background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 100%)` }}
      >
        <p className="text-white font-bold text-base">انضم إلى مصرف الأمان اليوم</p>
      </div>

      {/* Progress indicator */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          {["بياناتك", "تسجيل الدخول", "التحقق"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: i === 0 ? BANK_BLUE : "#e2e8f0",
                    color: i === 0 ? "white" : "#94a3b8",
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-xs" style={{ color: i === 0 ? BANK_BLUE : "#94a3b8", fontSize: 9 }}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className="w-8 h-px mb-4" style={{ background: i === 0 ? BANK_BLUE : "#e2e8f0" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="px-5 pt-4 pb-6 bg-white">
        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-right mb-1.5" style={{ color: BANK_BLUE }}>
              الاسم الكامل <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => {
                setFullName(e.target.value);
                if (touched.fullName) setErrors(validate(e.target.value, phone));
              }}
              onBlur={() => handleBlur("fullName")}
              placeholder="أدخل اسمك الكامل"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400 transition-all"
              style={{
                borderBottom: `1.5px solid ${touched.fullName && errors.fullName ? "#dc2626" : fullName ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
                color: "#1a202c",
              }}
            />
            {touched.fullName && errors.fullName && <FieldError msg={errors.fullName} />}
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-right mb-1.5" style={{ color: BANK_BLUE }}>
              رقم الهاتف <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => {
                setPhone(e.target.value);
                if (touched.phone) setErrors(validate(fullName, e.target.value));
              }}
              onBlur={() => handleBlur("phone")}
              placeholder="09XXXXXXXX"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400 transition-all"
              style={{
                borderBottom: `1.5px solid ${touched.phone && errors.phone ? "#dc2626" : phone ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
                color: "#1a202c",
              }}
              dir="ltr"
            />
            {touched.phone && errors.phone && <FieldError msg={errors.phone} />}
          </div>

          {/* Info box */}
          <div
            className="rounded-lg p-4 mb-6 text-right"
            style={{ background: "#f0f7ff", border: "1px solid #c7d9f7" }}
          >
            <p className="text-xs leading-relaxed" style={{ color: BANK_BLUE }}>
              🎁 بشرى سارة لعملاء مصرف الأمان — سجل في السحب وأربح جوائز نقدية وعينية مجزية
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-16 py-3 rounded font-bold text-white text-sm transition-all"
              style={{
                background: isValid ? BANK_BLUE : "#9eb0d4",
                minWidth: 200,
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              متابعة
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-xs text-gray-500">لديك حساب؟ </span>
            <button
              type="button"
              className="text-xs font-bold"
              style={{ color: BANK_BLUE }}
              onClick={() => navigate("/login")}
            >
              سجل الدخول
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
