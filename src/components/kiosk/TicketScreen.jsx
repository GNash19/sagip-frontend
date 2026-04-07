"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function TicketScreen({ patientRecord, patientInfo, result, onReset }) {
  const [countdown, setCountdown] = useState(10);

  // Auto-print on mount
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, []);

  // Countdown to auto-reset
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onReset]);

  const queueNumber = patientRecord?.queue_number || "---";
  const department = patientRecord?.department || result?.department || "---";
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Vulnerabilities
  const vulns = patientInfo.vulnerabilities || [];

  return (
    <>
      {/* ── On-Screen Content ─────────────────────── */}
      <div className="no-print" style={s.screenContainer}>
        <CheckCircle size={64} color="#059669" />
        <h2 style={s.screenTitle}>Nakumpleto! (Complete!)</h2>
        <p style={s.screenSubtitle}>
          Ang imong ticket gi-print na.
          (Your ticket has been printed.)
        </p>

        <div style={s.queueSection}>
          <div style={s.queueLabel}>Imong Queue Number (Your Queue Number):</div>
          <div style={s.queueNumber}>{queueNumber}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={s.deptLabel}>Departamento (Department):</div>
          <div style={s.deptValue}>{department}</div>
        </div>

        <div style={s.instructionBox}>
          Palihug adto sa <strong>{department}</strong> nga waiting area ug
          hulaton ang imong numero nga tawgon.
          (Please proceed to the <strong>{department}</strong> waiting area
          and wait for your number to be called.)
        </div>

        <p style={s.countdownText}>
          Awtomatikong mag-reset sulod sa {countdown} segundo...
          (Auto-resetting in {countdown} seconds...)
        </p>

        <button onClick={onReset} style={s.newPatientBtn}>
          Bag-ong Pasyente (New Patient)
        </button>
      </div>

      {/* ── Print Ticket ──────────────────────────── */}
      <div className="print-only" style={s.ticket}>
        <div style={s.ticketHeader}>
          <Logo size={28} showText={false} />
          <span style={s.ticketBrand}>SAGIP</span>
        </div>
        <div style={s.ticketSubheader}>SPMC OPD Triage System</div>

        <div style={s.ticketDivider} />

        <div style={s.ticketSectionLabel}>QUEUE NUMBER</div>
        <div style={s.ticketQueueNumber}>{queueNumber}</div>

        <div style={s.ticketDivider} />

        <div style={s.ticketSectionLabel}>Department:</div>
        <div style={s.ticketDeptName}>{department}</div>

        <div style={s.ticketDivider} />

        <div style={s.ticketRow}>Ngalan: {patientInfo.name}</div>
        <div style={s.ticketRow}>
          Edad: {patientInfo.age} | Sekso: {patientInfo.gender === "Female" ? "F" : "M"}
        </div>
        <div style={s.ticketRow}>Petsa: {dateStr}</div>
        <div style={s.ticketRow}>Oras: {timeStr}</div>

        {vulns.length > 0 && (
          <>
            <div style={s.ticketDivider} />
            <div style={s.ticketSectionLabel}>Priority Flags:</div>
            {vulns.map((v) => (
              <div key={v} style={s.ticketRow}>{v}</div>
            ))}
          </>
        )}

        <div style={s.ticketDivider} />

        <div style={s.ticketRow}>Palihug adto sa:</div>
        <div style={s.ticketRow}>(Please proceed to:)</div>
        <div style={{ ...s.ticketDeptName, fontSize: 16 }}>{department}</div>
        <div style={s.ticketRow}>waiting area</div>

        <div style={s.ticketDivider} />

        <div style={s.ticketFooter}>Gipagana ni SAGIP</div>
        <div style={s.ticketFooter}>(Powered by SAGIP)</div>
      </div>
    </>
  );
}

const s = {
  // ── Screen styles ──
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "48px 0",
  },
  screenTitle: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 28,
    color: "#1A1A2E",
    marginTop: 16,
  },
  screenSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 1.5,
  },
  queueSection: {
    marginBottom: 24,
  },
  queueLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  queueNumber: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 48,
    color: "#C8102E",
    fontWeight: 900,
  },
  deptLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  deptValue: {
    fontSize: 20,
    color: "#1A1A2E",
    fontWeight: 600,
  },
  instructionBox: {
    padding: 20,
    borderRadius: 12,
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 1.7,
    marginBottom: 24,
    maxWidth: 480,
  },
  countdownText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  newPatientBtn: {
    width: "100%",
    maxWidth: 400,
    height: 52,
    borderRadius: 10,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // ── Print ticket styles ──
  ticket: {
    width: 300,
    margin: "0 auto",
    padding: "16px 12px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#000000",
    textAlign: "center",
  },
  ticketHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 4,
  },
  ticketBrand: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 22,
    fontWeight: 400,
  },
  ticketSubheader: {
    fontSize: 11,
    color: "#666",
    marginBottom: 8,
  },
  ticketDivider: {
    borderTop: "1px dashed #999",
    margin: "10px 0",
  },
  ticketSectionLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#666",
    marginBottom: 4,
  },
  ticketQueueNumber: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  ticketDeptName: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 2,
  },
  ticketRow: {
    fontSize: 12,
    lineHeight: 1.6,
  },
  ticketFooter: {
    fontSize: 10,
    color: "#999",
    lineHeight: 1.4,
  },
};
