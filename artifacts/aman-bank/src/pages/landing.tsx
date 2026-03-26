import { useNavigate } from "@/components/TransitionContext";

const BANK_BLUE = "#1a3a7a";
const GOLD = "#c8970a";
const GOLD_LIGHT = "#f5d06e";

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2l2.9 6.26L22 9.27l-5 5.14 1.18 7.09L12 18.3l-6.18 3.2L7 14.41 2 9.27l7.1-1.01L12 2z" />
    </svg>
  );
}

const prizes = [
  {
    rank: "الجائزة الأولى",
    rankNum: "1",
    description: "50 جائزة مالية بقيمة 5,000 دينار ليبي لكل جائزة",
    emoji: "🏆",
    highlight: true,
    total: "250,000 د.ل",
    totalLabel: "إجمالي الجوائز",
  },
  {
    rank: "الجائزة الثانية",
    rankNum: "2",
    description: "25 جهاز آيفون 16 برو ماكس مقدم من رائد",
    emoji: "📱",
    highlight: false,
    total: "25 جهاز",
    totalLabel: "آيفون 16 Pro Max",
  },
  {
    rank: "الجائزة الثالثة",
    rankNum: "3",
    description: "جوائز عينية قيمة ومتنوعة للفائزين",
    emoji: "🎁",
    highlight: false,
    total: "جوائز",
    totalLabel: "عينية متنوعة",
  },
];

export default function LandingPage() {
  const { navigateTo } = useNavigate();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto" }}
    >
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-50"
        style={{ background: BANK_BLUE, direction: "ltr" }}
      >
        <div className="flex flex-col gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="block w-5 h-0.5 bg-white/70 rounded" />
          ))}
        </div>
        <img
          src="/aman-bank-logo.png"
          alt="مصرف الأمان"
          style={{ height: 32, filter: "brightness(0) invert(1)" }}
        />
      </nav>

      {/* Hero */}
      <div
        className="relative overflow-hidden text-center pt-8 pb-6 px-5"
        style={{
          background: `linear-gradient(160deg, ${BANK_BLUE} 0%, #1e4db7 55%, #2855b0 100%)`,
        }}
      >
        {/* Floating stars */}
        {[
          { top: 10, left: 12, op: 0.3, sz: 14 },
          { top: 24, left: 60, op: 0.2, sz: 10 },
          { top: 8, left: 80, op: 0.4, sz: 16 },
          { top: 40, left: 5, op: 0.25, sz: 12 },
          { top: 55, left: 88, op: 0.3, sz: 11 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{ top: `${s.top}%`, left: `${s.left}%`, opacity: s.op, color: GOLD_LIGHT, fontSize: s.sz }}
          >
            ★
          </div>
        ))}

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
          style={{ background: "rgba(255,255,255,0.15)", color: GOLD_LIGHT, border: `1px solid ${GOLD_LIGHT}40` }}
        >
          <StarIcon />
          بشرى سارة لعملاء مصرف الأمان
          <StarIcon />
        </div>

        {/* Trophy */}
        <div className="flex justify-center mb-4">
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` }}
          >
            <div className="text-6xl">🏆</div>
            <div
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg"
              style={{ background: BANK_BLUE, color: GOLD_LIGHT, border: `2px solid ${GOLD_LIGHT}` }}
            >
              WIN
            </div>
          </div>
        </div>

        <h1 className="text-white text-2xl font-black mb-2 leading-tight">
          سجل وأربح جوائز
          <br />
          <span style={{ color: GOLD_LIGHT }}>نقدية وعينية مجزية!</span>
        </h1>
        <p className="text-blue-200 text-sm mb-6">
          سجل الآن في السحب السنوي لمصرف الأمان
          <br />
          وكن واحداً من الفائزين بجوائزنا القيمة
        </p>

        {/* CTA button */}
        <button
          onClick={() => navigateTo("/register")}
          className="w-full py-4 rounded-2xl font-black text-base shadow-2xl transition-all active:scale-95 mb-3"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
            color: BANK_BLUE,
            boxShadow: `0 8px 32px ${GOLD}60`,
          }}
        >
          ✨ سجل الآن واربح ✨
        </button>

        <button
          onClick={() => navigateTo("/login")}
          className="text-sm text-blue-200 underline underline-offset-2"
        >
          لديك حساب؟ سجل الدخول
        </button>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 480 32" preserveAspectRatio="none" className="w-full" style={{ height: 32, display: "block" }}>
            <path d="M0,16 C80,32 160,0 240,16 C320,32 400,0 480,16 L480,32 L0,32 Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Prizes cards */}
      <div className="px-4 pt-6 pb-4">
        <div className="text-center mb-5">
          <h2 className="text-lg font-black mb-1" style={{ color: BANK_BLUE }}>جوائزنا القيمة</h2>
          <p className="text-gray-500 text-xs">سجل الآن للمشاركة في السحب</p>
        </div>

        <div className="flex flex-col gap-4">
          {prizes.map((prize, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 flex items-center gap-4 shadow-sm"
              style={{
                background: prize.highlight ? `linear-gradient(135deg, ${BANK_BLUE}08, ${GOLD}15)` : "#f8f9ff",
                border: prize.highlight ? `2px solid ${GOLD}50` : "1px solid #e8edf8",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0"
                style={{
                  background: prize.highlight
                    ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`
                    : `linear-gradient(135deg, ${BANK_BLUE}20, ${BANK_BLUE}35)`,
                  color: BANK_BLUE,
                }}
              >
                {prize.rankNum}
              </div>

              <div className="text-3xl shrink-0">{prize.emoji}</div>

              <div className="flex-1 text-right">
                <div
                  className="text-xs font-bold mb-0.5 uppercase tracking-wide"
                  style={{ color: prize.highlight ? GOLD : "#64748b" }}
                >
                  {prize.rank}
                </div>
                <div className="text-sm font-semibold leading-snug" style={{ color: BANK_BLUE }}>
                  {prize.description}
                </div>
              </div>

              {prize.highlight && (
                <div className="shrink-0 text-right">
                  <div className="text-xs font-black" style={{ color: GOLD }}>{prize.total}</div>
                  <div className="text-xs text-gray-400">{prize.totalLabel}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mx-4 rounded-2xl p-5 mb-4" style={{ background: `${BANK_BLUE}08`, border: `1px solid ${BANK_BLUE}20` }}>
        <h3 className="text-center font-black mb-4" style={{ color: BANK_BLUE }}>كيف تشارك؟</h3>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", text: "سجل اسمك ورقم هاتفك" },
            { step: "2", text: "تحقق من رمز الـ OTP المرسل لهاتفك" },
            { step: "3", text: "أكمل بيانات حسابك البنكي" },
            { step: "4", text: "انتظر نتائج السحب وكن من الفائزين!" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 flex-row-reverse">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-white"
                style={{ background: BANK_BLUE }}
              >
                {item.step}
              </div>
              <div className="h-px flex-1" style={{ background: `${BANK_BLUE}20` }} />
              <p className="text-sm text-gray-700 font-medium text-right">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pb-8">
        <button
          onClick={() => navigateTo("/register")}
          className="w-full py-4 rounded-2xl font-black text-white text-base shadow-lg transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${BANK_BLUE} 0%, #2855b0 100%)`,
            boxShadow: `0 8px 24px ${BANK_BLUE}50`,
          }}
        >
          ابدأ التسجيل الآن
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          © 2019 مصرف الأمان — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
