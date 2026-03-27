import { useNavigate } from "@/components/TransitionContext";

const BLUE = "#1a3a7a";
const BLUE2 = "#1e4db7";
const GOLD = "#c8970a";
const GOLD_L = "#f5d06e";

const prizes = [
  {
    num: "01",
    icon: "🏆",
    title: "الجائزة الأولى",
    desc: "50 جائزة نقدية بقيمة 5,000 دينار ليبي",
    tag: "250,000 د.ل",
    gold: true,
  },
  {
    num: "02",
    icon: "📱",
    title: "الجائزة الثانية",
    desc: "25 جهاز آيفون 16 برو ماكس من رائد",
    tag: "25 جهاز",
    gold: false,
  },
  {
    num: "03",
    icon: "🎁",
    title: "الجائزة الثالثة",
    desc: "جوائز عينية قيمة ومتنوعة للفائزين",
    tag: "جوائز متنوعة",
    gold: false,
  },
];

const steps = [
  { n: "١", text: "سجل اسمك ورقم هاتفك" },
  { n: "٢", text: "تحقق برمز OTP المرسل لهاتفك" },
  { n: "٣", text: "أكمل بيانات حسابك البنكي" },
  { n: "٤", text: "انتظر السحب وكن من الفائزين!" },
];

export default function LandingPage() {
  const { navigateTo } = useNavigate();

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo', sans-serif",
        maxWidth: 480,
        margin: "0 auto",
        background: "#f4f7ff",
        minHeight: "100vh",
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          background: BLUE,
          direction: "ltr",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
        className="flex items-center justify-between px-4 py-3 shadow-lg"
      >
        <div className="flex flex-col gap-1 cursor-pointer">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 22,
                height: 2.5,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 2,
              }}
            />
          ))}
        </div>
        <img
          src="/aman-bank-logo.png"
          alt="مصرف الأمان"
          style={{ height: 52, filter: "brightness(0) invert(1)" }}
        />
      </nav>

      {/* ── Hero ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(160deg, #0d2660 0%, ${BLUE} 40%, ${BLUE2} 70%, #2f63d4 100%)`,
          paddingBottom: 40,
        }}
      >
        {/* Animated orbs */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            animation: "ab-orb-drift 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: `rgba(200,151,10,0.08)`,
            animation: "ab-orb-drift 11s ease-in-out infinite reverse",
          }}
        />
        {/* Spinning ring */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 20,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.12)",
            animation: "ab-spin 25s linear infinite",
          }}
        />

        {/* Star sparkles */}
        {[
          { t: 8, l: 15, d: 0 },
          { t: 18, l: 70, d: 1.2 },
          { t: 5, l: 82, d: 0.6 },
          { t: 35, l: 8, d: 2 },
          { t: 28, l: 55, d: 1.8 },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${s.t}%`,
              left: `${s.l}%`,
              color: GOLD_L,
              fontSize: 12,
              animation: `ab-star-twinkle ${2 + s.d}s ease-in-out infinite`,
              animationDelay: `${s.d}s`,
            }}
          >
            ★
          </div>
        ))}

        {/* Badge */}
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}
        >
          <div
            className="ab-glass"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 40,
              color: GOLD_L,
              fontSize: 12,
              fontWeight: 700,
              animation: "ab-slide-up 0.5s ease both",
            }}
          >
            ✦ بشرى سارة لعملاء مصرف الأمان ✦
          </div>
        </div>

        {/* Trophy */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ position: "relative", width: 130, height: 130 }}>
            {/* Glow rings */}
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: i * 14,
                  borderRadius: "50%",
                  border: `2px solid rgba(200,151,10,${0.3 - i * 0.1})`,
                  animation: `ab-ring 2.4s ease-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
            <div
              className="ab-pulse-glow"
              style={{
                position: "absolute",
                inset: 14,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD_L} 0%, ${GOLD} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 46,
              }}
            >
              <span className="ab-trophy-bounce" style={{ display: "block" }}>
                🏆
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: BLUE,
                border: `2px solid ${GOLD_L}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 900,
                color: GOLD_L,
              }}
            >
              WIN
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <h1
            style={{
              color: "white",
              fontSize: 26,
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            سجل وأربح جوائز
            <br />
            <span className="ab-shimmer-gold">نقدية وعينية مجزية!</span>
          </h1>
          <p
            style={{
              color: "rgba(200,220,255,0.85)",
              fontSize: 13,
              marginTop: 10,
              marginBottom: 28,
              lineHeight: 1.7,
            }}
          >
            سجل الآن في السحب السنوي لمصرف الأمان
            <br />
            وكن واحداً من الفائزين بجوائزنا القيمة
          </p>

          {/* Gold CTA */}
          <button
            onClick={() => navigateTo("/register")}
            className="ab-btn-gold ab-pulse-glow"
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: 16,
              fontWeight: 900,
              fontSize: 16,
              color: BLUE,
              border: "none",
              cursor: "pointer",
              letterSpacing: 0.3,
              marginBottom: 12,
            }}
          >
            ✨ سجل الآن واربح ✨
          </button>
        </div>

        {/* Goals person image — bottom-right of hero */}
        <img
          src="/goals.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 210,
            objectFit: "contain",
            objectPosition: "bottom left",
            mixBlendMode: "screen",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Wave */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg
            viewBox="0 0 480 40"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 40, display: "block" }}
          >
            <path
              d="M0,20 C80,40 160,0 240,20 C320,40 400,0 480,20 L480,40 L0,40 Z"
              fill="#f4f7ff"
            />
          </svg>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div
        style={{
          display: "flex",
          background: "white",
          margin: "0 16px",
          borderRadius: 20,
          marginTop: -12,
          padding: "16px 0",
          boxShadow: "0 4px 30px rgba(26,58,122,0.12)",
        }}
      >
        {[
          { val: "75+", lab: "فائز محتمل" },
          { val: "250K", lab: "دينار جوائز" },
          { val: "3", lab: "فئات جوائز" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              borderRight: i < 2 ? "1px solid #eef2ff" : "none",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 900, color: BLUE }}>
              {s.val}
            </div>
            <div style={{ fontSize: 10, color: "#64748b" }}>{s.lab}</div>
          </div>
        ))}
      </div>

      {/* ── Prizes ── */}
      <div style={{ padding: "24px 16px 8px" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: BLUE, margin: 0 }}>
            جوائزنا القيمة
          </h2>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            سجل الآن للمشاركة في السحب
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {prizes.map((p, i) => (
            <div
              key={i}
              className="ab-card ab-card-hover"
              style={{
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                border: p.gold
                  ? `1.5px solid ${GOLD}50`
                  : "1.5px solid #eef2ff",
                background: p.gold
                  ? `linear-gradient(135deg, #fffbeb, #fff9e6)`
                  : "white",
                animation: `ab-slide-up 0.5s ease ${i * 0.1}s both`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: p.gold ? GOLD : "#94a3b8",
                  minWidth: 24,
                  textAlign: "center",
                  letterSpacing: 1,
                }}
              >
                {p.num}
              </div>
              <div style={{ fontSize: 36 }}>{p.icon}</div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: p.gold ? GOLD : "#64748b",
                    marginBottom: 2,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: BLUE,
                    lineHeight: 1.4,
                  }}
                >
                  {p.desc}
                </div>
              </div>
              <div
                style={{
                  background: p.gold
                    ? `linear-gradient(135deg,${GOLD},${GOLD_L})`
                    : `${BLUE}18`,
                  borderRadius: 10,
                  padding: "6px 10px",
                  textAlign: "center",
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: p.gold ? BLUE : BLUE,
                  }}
                >
                  {p.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div
        style={{
          margin: "16px 16px",
          background: `linear-gradient(135deg, ${BLUE}08, ${BLUE2}12)`,
          borderRadius: 24,
          padding: 20,
          border: `1px solid ${BLUE}18`,
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: 900,
            color: BLUE,
            fontSize: 16,
            margin: "0 0 20px",
          }}
        >
          كيف تشارك؟
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexDirection: "row-reverse",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${BLUE}, ${BLUE2})`,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 900,
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${BLUE}40`,
                }}
              >
                {s.n}
              </div>
              {i < steps.length - 1 && <div style={{ position: "absolute" }} />}
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(to left, ${BLUE}30, transparent)`,
                }}
              />
              <p
                style={{
                  fontSize: 13,
                  color: "#374151",
                  fontWeight: 600,
                  margin: 0,
                  textAlign: "right",
                  flex: 2,
                }}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Corporate / About section ── */}
      <div
        style={{
          margin: "16px 0",
          position: "relative",
          overflow: "hidden",
          borderRadius: 0,
          minHeight: 200,
        }}
      >
        {/* Background photo */}
        <img
          src="/corporate.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, rgba(13,38,96,0.88) 0%, rgba(26,58,122,0.80) 50%, rgba(30,77,183,0.75) 100%)`,
          }}
        />
        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "36px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `rgba(200,151,10,0.18)`,
              border: `1px solid ${GOLD}50`,
              borderRadius: 20,
              padding: "4px 16px",
              color: GOLD_L,
              fontSize: 11,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            ✦ موثوق ومعتمد ✦
          </div>
          <h3
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 900,
              margin: "0 0 10px",
              lineHeight: 1.4,
            }}
          >
            مصرف الأمان
            <br />
            <span style={{ color: GOLD_L }}>شريكك المالي الموثوق</span>
          </h3>
          <p
            style={{
              color: "rgba(200,220,255,0.82)",
              fontSize: 13,
              lineHeight: 1.75,
              margin: "0 0 24px",
            }}
          >
            نقدم خدمات مصرفية متكاملة وفق أحكام الشريعة الإسلامية،
            <br />
            ونسعى دائماً لتلبية احتياجات عملائنا بأعلى معايير الجودة.
          </p>
          {/* Three pillars */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {[
              { icon: "🏛️", label: "خدمات متكاملة" },
              { icon: "🛡️", label: "أمان وموثوقية" },
              { icon: "📈", label: "نمو مستدام" },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  padding: "12px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
                <div
                  style={{
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "'Cairo',sans-serif",
                  }}
                >
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ padding: "8px 16px 32px" }}>
        <button
          onClick={() => navigateTo("/register")}
          style={{
            width: "100%",
            padding: "17px 0",
            borderRadius: 18,
            fontWeight: 900,
            fontSize: 15,
            color: "white",
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE2} 100%)`,
            boxShadow: `0 8px 28px ${BLUE}50`,
          }}
        >
          ابدأ التسجيل الآن
        </button>
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            color: "#94a3b8",
            marginTop: 14,
          }}
        >
          © 2019 مصرف الأمان — جميع الحقوق محفوظة
        </p>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button
            onClick={() => navigateTo("/admin")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#c8c8c8", fontSize: 11, fontFamily: "'Cairo', sans-serif",
              opacity: 0.45, transition: "opacity 0.2s",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.45")}
          >
            🔐 لوحة الإدارة
          </button>
        </div>
      </div>
    </div>
  );
}
