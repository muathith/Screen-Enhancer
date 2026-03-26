import { useState } from "react";
import { useNavigate } from "@/components/TransitionContext";

const BLUE = "#1a3a7a";
const BLUE2 = "#1e4db7";

function FieldError({ msg }: { msg: string }) {
  return <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4, textAlign: "right", fontWeight: 600 }}>{msg}</p>;
}

function StepBar({ active }: { active: number }) {
  const labels = ["بياناتك", "تسجيل الدخول", "التحقق"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px 8px", gap: 0 }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < labels.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: i < active ? `linear-gradient(135deg, #10b981, #059669)` : i === active ? `linear-gradient(135deg, ${BLUE}, ${BLUE2})` : "#e2e8f0",
              color: i <= active ? "white" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800,
              boxShadow: i <= active ? `0 4px 14px ${BLUE}40` : "none",
              transition: "all 0.3s",
            }}>
              {i < active ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: i <= active ? BLUE : "#94a3b8", letterSpacing: 0.2 }}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ flex: 1, height: 2, margin: "0 6px", marginBottom: 16, background: i < active ? "#10b981" : "#e2e8f0", borderRadius: 2, transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { navigateTo, navigateBack } = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ fullName?: boolean; phone?: boolean }>({});

  function validate(name: string, ph: string) {
    const e: { fullName?: string; phone?: string } = {};
    if (!name.trim()) e.fullName = "الاسم الكامل مطلوب";
    else if (name.trim().length < 3) e.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";
    if (!ph.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\s\-]{7,15}$/.test(ph.trim())) e.phone = "أدخل رقم هاتف صحيح";
    return e;
  }

  const touch = (f: "fullName" | "phone") => { setTouched(t => ({ ...t, [f]: true })); setErrors(validate(fullName, phone)); };
  const valid = Object.keys(validate(fullName, phone)).length === 0 && !!fullName && !!phone;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fullName, phone);
    setErrors(errs); setTouched({ fullName: true, phone: true });
    if (!Object.keys(errs).length) navigateTo("/login");
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f4f7ff" }}>

      {/* Navbar */}
      <nav style={{ background: "white", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", boxShadow: "0 2px 16px rgba(26,58,122,0.08)" }}>
        <button onClick={() => navigateBack()} style={{ background: `${BLUE}12`, border: "none", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 800, color: BLUE }}>إنشاء حساب</span>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 52 }} />
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, #0d2660, ${BLUE}, ${BLUE2})`, padding: "32px 24px 48px", textAlign: "right" }}>
        <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", animation: "ab-orb-drift 9s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -20, right: -20, width: 120, height: 120, borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.15)", animation: "ab-spin 20s linear infinite" }} />
        <div style={{ fontSize: 36, marginBottom: 12 }} className="ab-float">👋</div>
        <h2 style={{ color: "white", fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.4 }}>انضم إلى مصرف الأمان</h2>
        <p style={{ color: "rgba(200,220,255,0.8)", fontSize: 13, marginTop: 6, marginBottom: 0 }}>سجل بياناتك وكن جزءاً من عائلتنا</p>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 480 32" preserveAspectRatio="none" style={{ width: "100%", height: 32, display: "block" }}>
            <path d="M0,16 C120,32 240,0 360,16 C420,24 460,8 480,16 L480,32 L0,32 Z" fill="#f4f7ff" />
          </svg>
        </div>
      </div>

      {/* Stepper */}
      <StepBar active={0} />

      {/* Form card */}
      <div style={{ padding: "8px 16px 32px" }}>
        <div className="ab-card" style={{ padding: 24 }}>
          <form onSubmit={submit} noValidate>

            {/* Name field */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#ef4444", fontSize: 12 }}>*</span>
                <label style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>الاسم الكامل</label>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>👤</div>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); if (touched.fullName) setErrors(validate(e.target.value, phone)); }}
                  onBlur={() => touch("fullName")}
                  placeholder="أدخل اسمك الكامل"
                  style={{
                    width: "100%", padding: "14px 46px 14px 14px", borderRadius: 14, border: `2px solid ${touched.fullName && errors.fullName ? "#ef4444" : fullName ? BLUE : "#e2e8f0"}`,
                    background: touched.fullName && errors.fullName ? "#fff5f5" : fullName ? "#f0f4ff" : "#f8faff",
                    fontSize: 14, fontFamily: "'Cairo', sans-serif", textAlign: "right", color: "#1a202c", outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                  }}
                />
              </div>
              {touched.fullName && errors.fullName && <FieldError msg={errors.fullName} />}
            </div>

            {/* Phone field */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#ef4444", fontSize: 12 }}>*</span>
                <label style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>رقم الهاتف</label>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📱</div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); if (touched.phone) setErrors(validate(fullName, e.target.value)); }}
                  onBlur={() => touch("phone")}
                  placeholder="09XXXXXXXX"
                  dir="ltr"
                  style={{
                    width: "100%", padding: "14px 46px 14px 14px", borderRadius: 14, border: `2px solid ${touched.phone && errors.phone ? "#ef4444" : phone ? BLUE : "#e2e8f0"}`,
                    background: touched.phone && errors.phone ? "#fff5f5" : phone ? "#f0f4ff" : "#f8faff",
                    fontSize: 14, fontFamily: "'Cairo', sans-serif", textAlign: "left", color: "#1a202c", outline: "none", transition: "all 0.2s", boxSizing: "border-box"
                  }}
                />
              </div>
              {touched.phone && errors.phone && <FieldError msg={errors.phone} />}
            </div>

            {/* Info banner */}
            <div style={{ background: `linear-gradient(135deg, ${BLUE}0a, ${BLUE2}14)`, border: `1px solid ${BLUE}20`, borderRadius: 14, padding: "14px 16px", marginBottom: 24, textAlign: "right" }}>
              <p style={{ color: BLUE, fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                🎁 <strong>بشرى سارة!</strong> سجل في السحب السنوي وأربح جوائز نقدية بقيمة 5,000 دينار وأجهزة آيفون 16 برو ماكس
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%", padding: "16px 0", borderRadius: 14, fontWeight: 800, fontSize: 15, color: "white", border: "none", cursor: valid ? "pointer" : "not-allowed",
                background: valid ? `linear-gradient(135deg, ${BLUE}, ${BLUE2})` : "#c0cfe8",
                boxShadow: valid ? `0 6px 24px ${BLUE}45` : "none", transition: "all 0.2s",
                fontFamily: "'Cairo', sans-serif"
              }}
            >
              متابعة ←
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>لديك حساب؟ </span>
              <button type="button" onClick={() => navigateTo("/login")} style={{ background: "none", border: "none", color: BLUE, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>سجل الدخول</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
