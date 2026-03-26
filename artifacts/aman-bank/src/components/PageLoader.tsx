import { useEffect, useState } from "react";

export function PageLoader({ visible }: { visible: boolean }) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (visible) {
      setOpacity(1);
    } else {
      const t = setTimeout(() => setOpacity(0), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!visible && opacity === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0f2557 0%, #1a3a8f 50%, #1e4db7 100%)",
        opacity,
        transition: "opacity 0.3s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* Animated rings */}
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 32 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: i * 16,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.15)",
              animation: `pulse-ring 1.8s ease-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Logo container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              animation: "logo-breathe 1.8s ease-in-out infinite",
            }}
          >
            <img
              src="/aman-bank-logo.png"
              alt="مصرف الأمان"
              style={{ width: 72, height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* Dots loader */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.8)",
              animation: "dot-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.7; }
          60%  { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(0.85); opacity: 0; }
        }
        @keyframes logo-breathe {
          0%, 100% { transform: scale(1);    box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
          50%       { transform: scale(1.06); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.5; }
          40%            { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
