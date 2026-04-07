"use client";

import Logo from "@/components/Logo";

export default function WelcomeScreen({ onStart }) {
  return (
    <div style={s.container}>
      <div style={s.content}>
        <Logo size={64} showText={false} />

        <h1 style={s.title}>SAGIP</h1>
        <p style={s.subtitle}>Sistema sa Triage sa OPD</p>
        <p style={s.subtitleEn}>(OPD Triage System)</p>
        <p style={s.spmc}>Southern Philippines Medical Center</p>
      </div>

      <button onClick={onStart} style={s.startBtn}>
        Sugod (Start)
      </button>
    </div>
  );
}

const s = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: 32,
    gap: 48,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 36,
    color: "#1A1A2E",
    marginTop: 16,
  },
  subtitle: {
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    fontSize: 16,
    color: "#6B7280",
    margin: 0,
  },
  subtitleEn: {
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    fontSize: 13,
    color: "#9CA3AF",
    margin: 0,
  },
  spmc: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  startBtn: {
    width: "100%",
    maxWidth: 400,
    height: 56,
    borderRadius: 14,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 600,
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    cursor: "pointer",
  },
};
