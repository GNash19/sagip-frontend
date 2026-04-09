"use client";

import { useState, useEffect } from "react";
import { DEPARTMENTS } from "@/constants/departments";
import { X } from "lucide-react";

export default function OverrideModal({ patient, onConfirm, onClose, isLoading }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [notes, setNotes] = useState("");

  // Reset state when patient changes (modal opens)
  useEffect(() => {
    setSelectedDept(null);
    setNotes("");
  }, [patient]);

  const canConfirm =
    selectedDept !== null &&
    selectedDept !== patient.department &&
    notes.length >= 10 &&
    !isLoading;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.card} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <h3 style={s.title}>I-override ang Departamento (Override Department)</h3>
          <button onClick={onClose} style={s.closeBtn}>
            <X size={20} color="#6B7280" />
          </button>
        </div>

        {/* Patient Summary */}
        <div style={s.summaryBox}>
          <div style={s.summaryRow}>Pasyente (Patient): {patient.name}</div>
          <div style={s.summaryRow}>
            Edad (Age): {patient.age} | Sekso (Gender): {patient.gender}
          </div>
          <div style={s.summaryRow}>
            Karon nga Departamento (Current Department): {patient.department}
          </div>
          <div style={s.summaryRow}>Queue Number: {patient.queue_number}</div>
        </div>

        {/* Department Selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Bag-ong Departamento (New Department)</label>
          <div style={s.deptGrid}>
            {DEPARTMENTS.map((dept) => {
              const isCurrent = dept === patient.department;
              const isSelected = dept === selectedDept;
              return (
                <button
                  key={dept}
                  onClick={() => !isCurrent && setSelectedDept(dept)}
                  disabled={isCurrent}
                  style={{
                    ...s.deptBtn,
                    ...(isCurrent
                      ? { opacity: 0.4, cursor: "not-allowed" }
                      : isSelected
                        ? {
                            background: "#FEF2F2",
                            border: "1px solid #C8102E",
                            color: "#C8102E",
                            fontWeight: 600,
                          }
                        : {
                            background: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            color: "#4B5563",
                          }),
                  }}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Override Reason */}
        <div style={{ marginBottom: 24 }}>
          <label style={s.label}>Rason sa Pag-override (Override Reason) *</label>
          <p style={s.sublabel}>
            Kinahanglanon. Minimum 10 ka letra.
            (Required. Minimum 10 characters.)
          </p>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Isulat ang rason dinhi... (Write the reason here...)"
            style={s.textarea}
          />
          <div
            style={{
              fontSize: 11,
              marginTop: 4,
              color: notes.length >= 10 ? "#059669" : "#DC2626",
            }}
          >
            {notes.length} / 10 minimum
          </div>
        </div>

        {/* Buttons */}
        <div style={s.btnRow}>
          <button onClick={onClose} style={s.cancelBtn}>
            Kansela (Cancel)
          </button>
          <button
            onClick={() => onConfirm({ new_department: selectedDept, notes })}
            disabled={!canConfirm}
            style={{
              ...s.confirmBtn,
              opacity: canConfirm ? 1 : 0.5,
              pointerEvents: canConfirm ? "auto" : "none",
            }}
          >
            {isLoading ? "Nagproseso... (Processing...)" : "Kumpirmaha (Confirm)"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    maxWidth: 480,
    width: "90%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 20,
    color: "#1A1A2E",
    margin: 0,
    flex: 1,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    flexShrink: 0,
  },
  summaryBox: {
    background: "#F9FAFB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 1.8,
  },
  label: {
    display: "block",
    fontWeight: 600,
    fontSize: 14,
    color: "#1A1A2E",
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 11,
    color: "#9CA3AF",
    margin: "0 0 8px",
  },
  deptGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  },
  deptBtn: {
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 13,
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "inherit",
    width: "100%",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    color: "#1A1A2E",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    resize: "none",
    lineHeight: 1.6,
  },
  btnRow: {
    display: "flex",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    color: "#6B7280",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    background: "#C8102E",
    border: "none",
    color: "#FFFFFF",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
