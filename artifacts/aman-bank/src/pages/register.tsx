import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, User, Phone } from "lucide-react";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/otp");
  };

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
            onClick={() => navigate("/")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6 flex flex-col shadow-2xl">
          <div className="mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, #0f2557, #1a3a8f)" }}
            >
              <User className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-right mb-1" style={{ color: "#0f2557" }}>
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-500 text-sm text-right">
              أدخل بياناتك للتسجيل في مصرف الأمان
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 text-right">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل الاسم الكامل"
                  className="w-full rounded-xl border-2 px-4 py-3.5 pr-11 text-right text-sm outline-none transition-all"
                  style={{
                    borderColor: fullName ? "#1a3a8f" : "#e2e8f0",
                    background: fullName ? "#f0f4ff" : "#f8fafc",
                  }}
                />
                <User
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4"
                  style={{ color: fullName ? "#1a3a8f" : "#94a3b8" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 text-right">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  className="w-full rounded-xl border-2 px-4 py-3.5 pr-11 text-right text-sm outline-none transition-all"
                  style={{
                    borderColor: phone ? "#1a3a8f" : "#e2e8f0",
                    background: phone ? "#f0f4ff" : "#f8fafc",
                  }}
                />
                <Phone
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 w-4 h-4"
                  style={{ color: phone ? "#1a3a8f" : "#94a3b8" }}
                />
              </div>
            </div>

            <div
              className="rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "#f0f4ff", border: "1px solid #c7d4f7" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "#1a3a8f" }}
              >
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold mb-0.5" style={{ color: "#0f2557" }}>
                  بشرى سارة لعملاء مصرف الأمان
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  سجل في السحب وأربح جوائز نقدية وعينية مجزية
                </p>
              </div>
            </div>

            <div className="mt-auto">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #0f2557 0%, #1a3a8f 100%)",
                  boxShadow: "0 8px 25px rgba(26, 58, 143, 0.4)",
                }}
              >
                متابعة
              </button>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">لديك حساب؟ </span>
                <button
                  type="button"
                  className="text-sm font-bold"
                  style={{ color: "#1a3a8f" }}
                  onClick={() => navigate("/")}
                >
                  سجل الدخول
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
