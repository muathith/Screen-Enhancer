import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, Search, Eye, EyeOff, ArrowRight } from "lucide-react";

const BANK_BLUE = "#1a3a7a";

const services = [
  { label: "إدارة المستفيدين", icon: "👤" },
  { label: "بطاقات الدفع المسبق", icon: "💳" },
  { label: "سحب بدون بطاقة", icon: "🏧" },
  { label: "كاستومر اونبوردنق", icon: "👨‍💼" },
  { label: "شحن رصيد الموبايل", icon: "📱" },
  { label: "بطاقات السحب الآلي", icon: "💰" },
  { label: "طلب طباعة بطاقة عن طريق الـ KIOSK", icon: "🖨️" },
  { label: "تحويل الأموال", icon: "🔄" },
  { label: "طباعة دفتر صكوك عن طريق KIOSK", icon: "📄" },
  { label: "مطابقة بيانات مخصص الأغراض الشخصية 2024", icon: "✅" },
  { label: "أمان باي كيو آر", icon: "📲" },
];

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="text-xs mt-1 text-right" style={{ color: "#dc2626" }}>
      {msg}
    </p>
  );
}

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});

  function validate(u: string, p: string) {
    const errs: { username?: string; password?: string } = {};
    if (!u.trim()) errs.username = "اسم المستخدم مطلوب";
    if (!p) errs.password = "كلمة المرور مطلوبة";
    else if (p.length < 4) errs.password = "كلمة المرور يجب أن تكون 4 أحرف على الأقل";
    return errs;
  }

  const handleBlur = (field: "username" | "password") => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(validate(username, password));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(username, password);
    setErrors(errs);
    setTouched({ username: true, password: true });
    if (Object.keys(errs).length === 0) {
      navigate("/otp");
    }
  };

  const isValid = Object.keys(validate(username, password)).length === 0 && username && password;

  return (
    <div dir="rtl" className="min-h-screen bg-white" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      {/* Navbar — LTR so hamburger stays left, logo stays right */}
      <nav className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" style={{ direction: "ltr" }}>
        <div className="flex items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 p-1">
            <Menu className="w-6 h-6" />
          </button>
          <button className="text-gray-600 p-1">
            <Search className="w-5 h-5" />
          </button>
        </div>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 36 }} />
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 pt-6" style={{ background: BANK_BLUE }}>
              <div className="flex items-center gap-3">
                <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 40, filter: "brightness(0) invert(1)" }} />
              </div>
            </div>
            <div className="p-4 flex flex-col gap-0">
              {["الرئيسية", "خدماتنا", "من نحن", "تواصل معنا", "الشروط والأحكام"].map(item => (
                <button key={item} className="text-right py-3 px-2 border-b border-gray-100 text-gray-700 font-medium text-sm w-full">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: 180 }}>
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 40%, #3a6fd8 70%, #7aa3e5 100%)` }}
        />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-white/10 rounded-l-full" />
        </div>
        <div className="absolute inset-0 flex items-end pb-6 pr-5">
          <p className="text-white text-xl font-bold leading-snug" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            مصرف الأمان<br />
            حضور فاعل و طموح واعد.
          </p>
        </div>
        <div className="absolute top-4 left-4 grid grid-cols-4 gap-1.5 opacity-30">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>
      </div>

      {/* Login Form */}
      <div className="px-5 pt-6 pb-4 bg-white">
        <form onSubmit={handleLogin} noValidate>
          {/* Username */}
          <div className="mb-5">
            <input
              type="text"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                if (touched.username) setErrors(validate(e.target.value, password));
              }}
              onBlur={() => handleBlur("username")}
              placeholder="اسم المستخدم"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400 transition-all"
              style={{
                borderBottom: `1.5px solid ${touched.username && errors.username ? "#dc2626" : username ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
                color: "#1a202c",
              }}
            />
            {touched.username && errors.username && <FieldError msg={errors.username} />}
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (touched.password) setErrors(validate(username, e.target.value));
              }}
              onBlur={() => handleBlur("password")}
              placeholder="كلمة المرور"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400 pr-0 pl-7 transition-all"
              style={{
                borderBottom: `1.5px solid ${touched.password && errors.password ? "#dc2626" : password ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
                color: "#1a202c",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {touched.password && errors.password && <FieldError msg={errors.password} />}
          </div>

          {/* Login Button */}
          <div className="flex justify-center mb-3 mt-4">
            <button
              type="submit"
              className="px-16 py-2.5 rounded font-bold text-white text-sm transition-all"
              style={{
                background: isValid ? BANK_BLUE : "#9eb0d4",
                minWidth: 180,
                cursor: isValid ? "pointer" : "not-allowed",
              }}
            >
              تسجيل الدخول
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-center mb-2">
            <button type="button" className="text-sm" style={{ color: BANK_BLUE }}>
              نسيت كلمة المرور
            </button>
          </div>

          {/* Register link */}
          <div className="text-center mb-2">
            <span className="text-xs text-gray-500">ليس لديك حساب؟ </span>
            <button
              type="button"
              className="text-xs font-bold"
              style={{ color: BANK_BLUE }}
              onClick={() => navigate("/register")}
            >
              سجل الآن
            </button>
          </div>
        </form>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-5" />

      {/* Services Grid */}
      <div className="px-4 pt-4 pb-6 bg-white">
        <div className="grid grid-cols-3 gap-x-2 gap-y-5">
          {services.map((service, i) => (
            <button key={i} className="flex flex-col items-center gap-2 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm border border-gray-100"
                style={{ background: "#f8f9ff" }}
              >
                {service.icon}
              </div>
              <span className="text-xs text-gray-700 leading-tight font-medium" style={{ fontSize: 10 }}>
                {service.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* "Achieve your dream" section */}
      <div className="py-6 px-5 flex items-center justify-between gap-4 relative overflow-hidden" style={{ background: "#e8f4fd" }}>
        <div className="flex-1 text-right z-10">
          <h2 className="text-lg font-bold mb-1" style={{ color: BANK_BLUE }}>حقق حلمك معنا</h2>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            "يمكنك تحقيق كل أحلامك،<br />إذا كان لديك الشجاعة للسعي وراءها"
          </p>
          <button className="text-xs text-white px-4 py-1.5 rounded font-semibold" style={{ background: BANK_BLUE }}>
            متابعة
          </button>
        </div>
        <div className="text-6xl mb-1 shrink-0">🧑‍💼</div>
      </div>

      {/* Technology section */}
      <div className="px-5 pt-6 pb-4 relative overflow-hidden" style={{ background: "#2f9e9e" }}>
        <h2 className="text-white font-bold text-base mb-3 text-right leading-snug">
          جعلت التكنولوجيا المصرفية أمرًا بسيطًا وفعالًا.
        </h2>
        <div className="flex items-end gap-1 mt-4" style={{ height: 80 }}>
          <div className="flex flex-col items-center">
            <div className="w-5 h-8 rounded-full" style={{ background: "#4caf50" }} />
            <div className="w-2 h-3" style={{ background: "#8B5E3C" }} />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-6 rounded-full" style={{ background: "#66bb6a" }} />
            <div className="w-1.5 h-2" style={{ background: "#8B5E3C" }} />
          </div>
          <div className="flex gap-0.5 items-end flex-1">
            {[40, 56, 48, 64, 44, 52, 36].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: h, background: i % 2 === 0 ? "#f5a623" : "#fff", opacity: 0.85 }} />
            ))}
          </div>
          <div className="text-xl mr-2">📱</div>
        </div>
        <div className="h-4 mt-0 -mx-5 flex items-center justify-center gap-3" style={{ background: "#1a5f5f" }}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-0.5 w-4 bg-yellow-300 rounded" />)}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 text-center" style={{ background: BANK_BLUE }}>
        <p className="text-blue-200 text-xs mb-2">حقوق النشر محفوظة لمصرف الأمان 2019©</p>
        <div className="flex justify-center gap-3">
          <button className="text-blue-200 text-xs underline">الشروط والأحكام</button>
          <span className="text-blue-400">|</span>
          <button className="text-blue-200 text-xs underline">المعلومات</button>
        </div>
      </div>
    </div>
  );
}
