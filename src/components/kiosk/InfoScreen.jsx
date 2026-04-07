"use client";

import { Check } from "lucide-react";

export default function InfoScreen({ name, age, gender, isPregnant, onChange, onNext }) {
  const ageNum = parseInt(age);
  const isSenior = !isNaN(ageNum) && ageNum >= 60;
  const isPediatric = !isNaN(ageNum) && ageNum > 0 && ageNum < 12;
  const hasFlags = isSenior || isPediatric || (isPregnant && gender === "Female");
  const canContinue = name.trim() && !isNaN(ageNum) && ageNum > 0 && gender;

  return (
    <div style={s.container}>
      <p style={s.step}>Lakang 1 sa 3 (Step 1 of 3)</p>
      <h2 style={s.title}>Imong Impormasyon (Your Information)</h2>

      {/* Name */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Ngalan (Name)</label>
        <input
          type="text"
          placeholder="Juan Dela Cruz"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          style={s.input}
        />
      </div>

      {/* Age */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Edad (Age)</label>
        <input
          type="number"
          min={1}
          max={120}
          value={age}
          onChange={(e) => onChange("age", e.target.value)}
          style={{ ...s.input, width: 140 }}
        />
        {/* Age-based auto-detected badges */}
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {isSenior && (
            <span style={s.badgeSenior}>Tigulang - Senior Citizen</span>
          )}
          {isPediatric && (
            <span style={s.badgePediatric}>Bata - Pediatric</span>
          )}
        </div>
      </div>

      {/* Gender */}
      <div style={s.fieldGroup}>
        <label style={s.label}>Sekso (Gender)</label>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { value: "Male", label: "Lalaki (Male)" },
            { value: "Female", label: "Babaye (Female)" },
          ].map((g) => {
            const sel = gender === g.value;
            return (
              <button
                key={g.value}
                onClick={() => {
                  onChange("gender", g.value);
                  if (g.value === "Male") onChange("isPregnant", false);
                }}
                style={{
                  ...s.genderBtn,
                  ...(sel
                    ? { background: "#C8102E", color: "#FFFFFF", border: "2px solid #C8102E" }
                    : { background: "#FFFFFF", color: "#4B5563", border: "1px solid #E5E7EB" }),
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pregnant toggle — Female only */}
      {gender === "Female" && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Status sa Pagmabdos (Pregnancy Status)</label>
          <button
            onClick={() => onChange("isPregnant", !isPregnant)}
            style={{
              ...s.pregnantBtn,
              ...(isPregnant
                ? { background: "#FCE7F3", color: "#9D174D", border: "2px solid #FBCFE8" }
                : { background: "#FFFFFF", color: "#6B7280", border: "1px solid #E5E7EB" }),
            }}
          >
            {isPregnant && (
              <Check size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            )}
            Buntis (Pregnant)
          </button>
        </div>
      )}

      {/* Auto-detected flags summary */}
      {hasFlags && (
        <div style={s.flagsBox}>
          <label style={s.label}>
            Mga Nailhan nga Priority (Detected Priority Flags)
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
            {isSenior && <span style={s.badgeSenior}>Senior Citizen</span>}
            {isPediatric && <span style={s.badgePediatric}>Pediatric</span>}
            {isPregnant && gender === "Female" && (
              <span style={s.badgePregnant}>Pregnant</span>
            )}
          </div>
          <p style={s.flagsNote}>
            Kini awtomatiko nga naila base sa imong impormasyon.
            (These are automatically detected from your information.)
          </p>
        </div>
      )}

      {/* Next button */}
      <button
        onClick={() => onNext("symptom")}
        disabled={!canContinue}
        style={{
          ...s.nextBtn,
          opacity: canContinue ? 1 : 0.5,
          pointerEvents: canContinue ? "auto" : "none",
        }}
      >
        Sunod (Next)
      </button>
    </div>
  );
}

const s = {
  container: {
    padding: "32px 0",
  },
  step: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    marginBottom: 8,
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 24,
    color: "#1A1A2E",
    margin: 0,
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#4B5563",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    color: "#1A1A2E",
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
  },
  genderBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  pregnantBtn: {
    padding: "12px 20px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
  },
  badgeSenior: {
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: "#FEF3C7",
    color: "#D97706",
    border: "1px solid #FDE68A",
  },
  badgePediatric: {
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: "#DBEAFE",
    color: "#1E40AF",
    border: "1px solid #BFDBFE",
  },
  badgePregnant: {
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: "#FCE7F3",
    color: "#9D174D",
    border: "1px solid #FBCFE8",
  },
  flagsBox: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
  },
  flagsNote: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    lineHeight: 1.5,
  },
  nextBtn: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
  },
};
