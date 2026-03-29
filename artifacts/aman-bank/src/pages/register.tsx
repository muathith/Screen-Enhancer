import { useState } from "react";
import { useNavigate } from "@/components/TransitionContext";
import { saveRegistration } from "@/lib/firebase";

const BLUE  = "#1a3a7a";
const BLUE2 = "#1e4db7";

function FieldError({ msg }: { msg: string }) {
  return <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4, textAlign: "right", fontWeight: 600 }}>{msg}</p>;
}

function StepBar({ active }: { active: number }) {
  const labels = ["بياناتك", "تسجيل الدخول", "التحقق"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 28px 8px", gap: 0 }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < labels.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < active ? "#10b981" : i === active ? BLUE : "#e2e8f0",
              color: i <= active ? "white" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800,
            }}>
              {i < active ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: i <= active ? BLUE : "#94a3b8" }}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ flex: 1, height: 1.5, margin: "0 6px", marginBottom: 16, background: i < active ? "#10b981" : "#e2e8f0", borderRadius: 2 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { navigateTo, navigateBack } = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [errors,   setErrors]   = useState<{ fullName?: string; phone?: string }>({});
  const [touched,  setTouched]  = useState<{ fullName?: boolean; phone?: boolean }>({});

  function validate(name: string, ph: string) {
    const e: { fullName?: string; phone?: string } = {};
    if (!name.trim()) e.fullName = "الاسم الكامل مطلوب";
    else if (name.trim().length < 3) e.fullName = "الاسم يجب أن يكون 3 أحرف على الأقل";
    if (!ph.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\s\-]{7,15}$/.test(ph.trim())) e.phone = "أدخل رقم هاتف صحيح";
    return e;
  }

  const touch = (f: "fullName" | "phone") => {
    setTouched(t => ({ ...t, [f]: true }));
    setErrors(validate(fullName, phone));
  };
  const valid = Object.keys(validate(fullName, phone)).length === 0 && !!fullName && !!phone;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fullName, phone);
    setErrors(errs); setTouched({ fullName: true, phone: true });
    if (!Object.keys(errs).length) {
      saveRegistration(fullName, phone).catch(console.error);
      navigateTo("/login");
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "white" }}>

      {/* Navbar */}
      <nav style={{ background: "white", borderBottom: "1px solid #e8eef5", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", direction: "ltr" }}>
        <button onClick={() => navigateBack()} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: BLUE }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 48 }} />
      </nav>

      {/* StepBar */}
      <StepBar active={0} />

      {/* Form */}
      <form onSubmit={submit} noValidate style={{ padding: "12px 24px 32px" }}>

        {/* Prize notice */}
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "11px 14px", marginBottom: 28, textAlign: "right" }}>
          <p style={{ color: "#92400e", fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            🎁 <strong>بشرى سارة!</strong> سجل في السحب السنوي وأربح جوائز نقدية بقيمة 5,000 دينار وأجهزة ايفون 17 برو ماكس
          </p>
        </div>

        {/* Full name */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ borderBottom: `1.5px solid ${touched.fullName && errors.fullName ? "#ef4444" : "#c8d0dc"}` }}>
            <input
              type="text" value={fullName} placeholder="الاسم الكامل" dir="rtl"
              onChange={e => { setFullName(e.target.value); if (touched.fullName) setErrors(validate(e.target.value, phone)); }}
              onBlur={() => touch("fullName")}
              style={{ width: "100%", padding: "10px 0", border: "none", outline: "none", fontSize: 14, fontFamily: "'Cairo',sans-serif", color: "#1a202c", background: "transparent", textAlign: "right", boxSizing: "border-box" }}
            />
          </div>
          {touched.fullName && errors.fullName && <FieldError msg={errors.fullName} />}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ borderBottom: `1.5px solid ${touched.phone && errors.phone ? "#ef4444" : "#c8d0dc"}` }}>
            <input
              type="tel" value={phone} placeholder="رقم الهاتف — 09XXXXXXXX" dir="ltr"
              onChange={e => { setPhone(e.target.value); if (touched.phone) setErrors(validate(fullName, e.target.value)); }}
              onBlur={() => touch("phone")}
              style={{ width: "100%", padding: "10px 0", border: "none", outline: "none", fontSize: 14, fontFamily: "'Cairo',sans-serif", color: "#1a202c", background: "transparent", textAlign: "right", boxSizing: "border-box" }}
            />
          </div>
          {touched.phone && errors.phone && <FieldError msg={errors.phone} />}
        </div>

        {/* Submit */}
        <button type="submit"
          style={{ width: "100%", padding: "15px 0", borderRadius: 8, fontWeight: 800, fontSize: 15, color: "white", border: "none", cursor: "pointer", background: valid ? BLUE : "#9fb3d4", fontFamily: "'Cairo',sans-serif", letterSpacing: 0.3 }}>
          متابعة ←
        </button>
      </form>
    </div>
  );
}
