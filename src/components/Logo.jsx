"use client";

// SAGIP Logo — stylized S with medical cross in a rounded red square
export default function Logo({ size = 36, showText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red rounded square background */}
        <rect width="40" height="40" rx="8" fill="#C8102E" />
        {/* White S letterform with integrated cross */}
        {/* Top horizontal of S / cross arm */}
        <rect x="11" y="8" width="18" height="4" rx="2" fill="white" />
        {/* Left vertical of S top curve */}
        <rect x="11" y="8" width="4" height="10" rx="2" fill="white" />
        {/* Middle horizontal — cross bar / S center */}
        <rect x="11" y="17" width="18" height="4" rx="2" fill="white" />
        {/* Right vertical of S bottom curve */}
        <rect x="25" y="17" width="4" height="12" rx="2" fill="white" />
        {/* Bottom horizontal of S */}
        <rect x="11" y="27" width="18" height="4" rx="2" fill="white" />
        {/* Cross vertical accent — subtle center stroke */}
        <rect x="18" y="10" width="4" height="6" rx="1" fill="rgba(200,16,46,0.25)" />
        <rect x="18" y="22" width="4" height="4" rx="1" fill="rgba(200,16,46,0.25)" />
      </svg>
      {showText && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
              fontSize: 18,
              color: "#C8102E",
              letterSpacing: "0.5px",
              lineHeight: 1.2,
            }}
          >
            SAGIP
          </span>
          <span
            style={{
              fontSize: 9,
              color: "#9CA3AF",
              letterSpacing: "2px",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            OPD Triage Support System
          </span>
        </div>
      )}
    </div>
  );
}
