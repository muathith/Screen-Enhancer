import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, User, Lock, CreditCard, Zap, Headphones, Users } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/otp");
  };

  const quickServices = [
    { icon: <Users className="w-6 h-6" />, label: "المستفيدين" },
    { icon: <CreditCard className="w-6 h-6" />, label: "بطاقات الدفع المسبق" },
    { icon: <Zap className="w-6 h-6" />, label: "سحب بدون بطاقة" },
    { icon: <Headphones className="w-6 h-6" />, label: "كاستومر اونبوردنق" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ background: "linear-gradient(160deg, #0f2557 0%, #1a3a8f 40%, #1e4db7 100%)" }}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex justify-center pt-10 pb-6 px-6">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl" style={{ minWidth: 200 }}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner"
                style={{ background: "linear-gradient(135deg, #1a3a8f, #1e4db7)" }}
              >
                <span className="text-white font-bold text-lg">أ</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 font-medium">مصرف</div>
                <div className="text-base font-bold" style={{ color: "#0f2557" }}>الأمان</div>
                <div className="text-xs text-blue-600 font-semibold tracking-wide">AMAN BANK</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6 flex flex-col shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#0f2557" }}>
              أهلاً بك
            </h1>
            <p className="text-gray-500 text-sm">سجل دخولك للمتابعة</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 text-right">
                اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full rounded-xl border-2 px-4 py-3.5 pr-11 text-right text-sm outline-none transition-all"
                  style={{
                    borderColor: username ? "#1a3a8f" : "#e2e8f0",
                    background: username ? "#f0f4ff" : "#f8fafc",
                  }}
                />
                <User
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4"
                  style={{ color: username ? "#1a3a8f" : "#94a3b8" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 text-right">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="w-full rounded-xl border-2 px-4 py-3.5 pr-11 pl-11 text-right text-sm outline-none transition-all"
                  style={{
                    borderColor: password ? "#1a3a8f" : "#e2e8f0",
                    background: password ? "#f0f4ff" : "#f8fafc",
                  }}
                />
                <Lock
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4"
                  style={{ color: password ? "#1a3a8f" : "#94a3b8" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 left-3.5 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-white text-base mt-2 shadow-lg transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #0f2557 0%, #1a3a8f 100%)",
                boxShadow: "0 8px 25px rgba(26, 58, 143, 0.4)",
              }}
            >
              تسجيل الدخول
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm font-semibold"
                style={{ color: "#1a3a8f" }}
                onClick={() => navigate("/register")}
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <div className="text-center mt-1">
              <span className="text-sm text-gray-500">ليس لديك حساب؟ </span>
              <button
                type="button"
                className="text-sm font-bold"
                style={{ color: "#1a3a8f" }}
                onClick={() => navigate("/register")}
              >
                سجل الآن
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 whitespace-nowrap">الخدمات السريعة</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {quickServices.map((service, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all active:scale-95"
                    style={{ background: "#f0f4ff" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1a3a8f, #1e4db7)" }}
                    >
                      <span className="text-white">{service.icon}</span>
                    </div>
                    <span className="text-xs text-center font-medium text-gray-600 leading-tight">
                      {service.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
