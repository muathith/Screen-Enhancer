import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, Search, Eye, EyeOff } from "lucide-react";

const BANK_BLUE = "#1a3a7a";
const BANK_YELLOW = "#f5a623";

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

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/otp");
  };

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
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 pt-6" style={{ background: BANK_BLUE }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">أ</div>
                <div>
                  <div className="text-white font-bold">مصرف الأمان</div>
                  <div className="text-blue-200 text-xs">AMAN BANK</div>
                </div>
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
          style={{
            background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 40%, #3a6fd8 70%, #7aa3e5 100%)`,
          }}
        />
        {/* Decorative people silhouettes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-white/10 rounded-l-full" />
          <div className="absolute right-10 top-5 w-32 h-32 rounded-full bg-white/5" />
        </div>
        <div className="absolute inset-0 flex items-end pb-6 pr-5">
          <p className="text-white text-xl font-bold leading-snug" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            مصرف الأمان<br />
            حضور فاعل و طموح واعد.
          </p>
        </div>
        {/* Decorative dot pattern */}
        <div className="absolute top-4 left-4 grid grid-cols-4 gap-1.5 opacity-30">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>
      </div>

      {/* Login Form */}
      <div className="px-5 pt-6 pb-4 bg-white">
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-5">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400"
              style={{
                borderBottom: `1.5px solid ${username ? BANK_BLUE : "#d1d5db"}`,
                background: "transparent",
                color: "#1a202c",
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full text-right text-sm py-2 outline-none placeholder-gray-400 pr-0 pl-7"
              style={{
                borderBottom: `1.5px solid ${password ? BANK_BLUE : "#d1d5db"}`,
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
          </div>

          {/* Login Button */}
          <div className="flex justify-center mb-3">
            <button
              type="submit"
              className="px-16 py-2.5 rounded font-bold text-white text-sm"
              style={{ background: BANK_BLUE, minWidth: 180 }}
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
        </form>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-5" />

      {/* Services Grid */}
      <div className="px-4 pt-4 pb-6 bg-white">
        <div className="grid grid-cols-3 gap-x-2 gap-y-5">
          {services.map((service, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-2 text-center"
            >
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
      <div
        className="mx-0 py-6 px-5 flex items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: "#e8f4fd" }}
      >
        <div className="flex-1 text-right z-10">
          <h2 className="text-lg font-bold mb-1" style={{ color: BANK_BLUE }}>
            حقق حلمك معنا
          </h2>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            "يمكنك تحقيق كل أحلامك،<br />
            إذا كان لديك الشجاعة للسعي وراءها<br />
            وأنت دريئ"
          </p>
          <button
            className="text-xs text-white px-4 py-1.5 rounded font-semibold"
            style={{ background: BANK_BLUE }}
          >
            متابعة
          </button>
        </div>
        {/* Decorative person illustration */}
        <div className="flex-shrink-0">
          <div
            className="w-24 h-28 rounded-xl flex items-end justify-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, #b8d4f0, #e8f4fd)" }}
          >
            <div className="text-6xl mb-1">🧑‍💼</div>
          </div>
        </div>
      </div>

      {/* "Technology made banking simple" section */}
      <div
        className="px-5 pt-6 pb-4 relative overflow-hidden"
        style={{ background: "#2f9e9e" }}
      >
        <h2 className="text-white font-bold text-base mb-3 text-right leading-snug">
          جعلت التكنولوجيا المصرفية أمرًا بسيطًا وفعالًا.
        </h2>
        {/* City illustration */}
        <div className="flex items-end gap-1 mt-4" style={{ height: 80 }}>
          {/* Trees */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-8 rounded-full" style={{ background: "#4caf50" }} />
            <div className="w-2 h-3" style={{ background: "#8B5E3C" }} />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-6 rounded-full" style={{ background: "#66bb6a" }} />
            <div className="w-1.5 h-2" style={{ background: "#8B5E3C" }} />
          </div>
          {/* Buildings */}
          <div className="flex gap-0.5 items-end flex-1">
            {[40, 56, 48, 64, 44, 52, 36].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: h,
                  background: i % 2 === 0 ? "#f5a623" : "#fff",
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          {/* Car */}
          <div className="text-2xl absolute bottom-3 left-6">🚗</div>
          {/* Phone icon */}
          <div className="text-xl mr-2">📱</div>
        </div>
        {/* Road */}
        <div
          className="h-4 mt-0 -mx-5 flex items-center justify-center gap-3"
          style={{ background: "#1a5f5f" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-0.5 w-4 bg-yellow-300 rounded" />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-4 text-center"
        style={{ background: BANK_BLUE }}
      >
        <p className="text-blue-200 text-xs mb-2">
          حقوق النشر محفوظة لمصرف الأمان 2019©
        </p>
        <div className="flex justify-center gap-3">
          <button className="text-blue-200 text-xs underline">الشروط والأحكام</button>
          <span className="text-blue-400">|</span>
          <button className="text-blue-200 text-xs underline">المعلومات</button>
        </div>
      </div>
    </div>
  );
}
