"use client";

import DeptIcon from "@/components/DeptIcon";
import { DEPT_COLORS } from "@/constants/departments";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

export default function ResultScreen({
  result,
  patientInfo,
  onConfirm,
  onBack,
  isLoading,
}) {
  const dept = result.department;
  const deptColor = DEPT_COLORS[dept] || "#C8102E";
  const conf = result.confidence;

  // Confidence tier
  let confTier;
  if (conf >= 0.8) {
    confTier = {
      label: "Dako ang Kasiguroan (High Confidence)",
      color: "#059669",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      Icon: CheckCircle,
    };
  } else if (conf >= 0.6) {
    confTier = {
      label: "Kasarangan ang Kasiguroan (Moderate Confidence)",
      color: "#D97706",
      bg: "#FFFBEB",
      border: "#FDE68A",
      Icon: AlertCircle,
    };
  } else {
    confTier = {
      label: "Palihug Suginli ang Nars (Please Inform the Nurse)",
      color: "#DC2626",
      bg: "#FEF2F2",
      border: "#FECACA",
      Icon: AlertTriangle,
    };
  }

  // Vulnerabilities from patientInfo
  const vulns = patientInfo.vulnerabilities || [];

  return (
    <div style={s.container}>
      <p style={s.step}>Lakang 3 sa 3 (Step 3 of 3)</p>
      <h2 style={s.title}>Resulta sa Triage (Triage Result)</h2>

      {/* Department Card */}
      <div style={s.deptCard}>
        <DeptIcon department={dept} size={48} color={deptColor} />
        <div
          style={{
            fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
            fontSize: 32,
            color: "#1A1A2E",
            marginTop: 12,
          }}
        >
          {dept}
        </div>
      </div>

      {/* Confidence Indicator */}
      <div
        style={{
          ...s.confBox,
          background: confTier.bg,
          border: `1px solid ${confTier.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <confTier.Icon size={22} color={confTier.color} />
          <span style={{ fontSize: 15, fontWeight: 600, color: confTier.color }}>
            {confTier.label}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          {Math.round(conf * 100)}% confidence
        </div>
        {conf < 0.6 && (
          <p style={{ fontSize: 13, color: "#DC2626", marginTop: 10, lineHeight: 1.6 }}>
            Ang sistema dili sigurado sa imong departamento.
            Palihug mangita og nars para sa tabang.
            (The system is not confident about your department.
            Please find a nurse for assistance.)
          </p>
        )}
      </div>

      {/* Priority Flags */}
      {vulns.length > 0 && (
        <div style={s.flagsSection}>
          <div style={s.flagsLabel}>Mga Priority Flag (Priority Flags)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {vulns.map((v) => (
              <span
                key={v}
                style={
                  v === "Senior Citizen"
                    ? s.badgeSenior
                    : v === "Pediatric"
                      ? s.badgePediatric
                      : s.badgePregnant
                }
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Patient Summary */}
      <div style={s.summaryBox}>
        <div style={s.summaryRow}>
          <span style={s.summaryLabel}>Ngalan:</span> {patientInfo.name}
        </div>
        <div style={s.summaryRow}>
          <span style={s.summaryLabel}>Edad:</span> {patientInfo.age} &bull;{" "}
          <span style={s.summaryLabel}>Sekso:</span> {patientInfo.gender}
        </div>
        <div style={s.summaryRow}>
          <span style={s.summaryLabel}>Input:</span> {patientInfo.inputMode} &bull;{" "}
          <span style={s.summaryLabel}>Pinulongan:</span> {result.detected_language || patientInfo.language}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={isLoading}
        style={{
          ...s.confirmBtn,
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {isLoading
          ? "Nagproseso... (Processing...)"
          : "Kumpirmaha ug I-print (Confirm and Print)"}
      </button>

      {/* Back Button */}
      <button onClick={() => onBack("symptom")} style={s.backBtn}>
        &larr; Balik (Back)
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
    marginBottom: 8,
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 24,
    color: "#1A1A2E",
    margin: 0,
    marginBottom: 24,
  },
  deptCard: {
    textAlign: "center",
    padding: "32px 24px",
    background: "#FFFFFF",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    border: "1px solid #E5E7EB",
    marginBottom: 20,
  },
  confBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  flagsSection: {
    marginBottom: 20,
  },
  flagsLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#4B5563",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  badgeSenior: {
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: "#FEF3C7",
    color: "#D97706",
  },
  badgePediatric: {
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: "#DBEAFE",
    color: "#1E40AF",
  },
  badgePregnant: {
    padding: "5px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    background: "#FCE7F3",
    color: "#9D174D",
  },
  summaryBox: {
    padding: 16,
    borderRadius: 12,
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    marginBottom: 28,
  },
  summaryRow: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 1.8,
  },
  summaryLabel: {
    fontWeight: 600,
    color: "#1A1A2E",
  },
  confirmBtn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  backBtn: {
    display: "block",
    margin: "16px auto 0",
    background: "none",
    border: "none",
    color: "#6B7280",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
