"use client";
// QueueView.jsx

import { useState } from "react";
import { DEPARTMENTS, DEPT_COLORS } from "@/constants/departments";
import DeptIcon from "@/components/DeptIcon";
import { Mic, PenLine, UserCheck, Inbox } from "lucide-react";

export default function QueueView({ queues, onServe }) {
  const [selectedDept, setSelectedDept] = useState(null);

  const allPatients = Object.values(queues).flat();
  const now = Date.now();

  const selectedQueue = selectedDept ? queues[selectedDept] || [] : [];
  const selectedColor = selectedDept ? DEPT_COLORS[selectedDept] : null;

  return (
    <div style={s.container}>
      {/* Title Section */}
      <h2 style={s.title}>Department Queues</h2>
      <p style={s.subtitle}>
        Real-time queue state across 8 OPD departments &bull;{" "}
        {allPatients.length} patient(s) waiting
      </p>

      {/* Department Cards Grid */}
      <div style={s.grid} className="stagger-children">
        {DEPARTMENTS.map((dept) => {
          const patients = queues[dept] || [];
          const count = patients.length;
          const isSelected = selectedDept === dept;
          const color = DEPT_COLORS[dept];

          return (
            <button
              key={dept}
              className="hover-lift"
              onClick={() =>
                setSelectedDept(isSelected ? null : dept)
              }
              style={{
                ...s.deptCard,
                ...(isSelected
                  ? {
                      border: `2px solid ${color}`,
                      background: `linear-gradient(135deg, ${color}08, #FFFFFF)`,
                    }
                  : {
                      border: "1px solid #E5E7EB",
                      background: "#FFFFFF",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }),
              }}
            >
              {/* Top row: icon + count badge */}
              <div style={s.cardTopRow}>
                <DeptIcon department={dept} size={24} color={color} />
                <span
                  style={{
                    ...s.countBadge,
                    ...(count > 0
                      ? {
                          background: color + "14",
                          color: color,
                          fontWeight: 700,
                        }
                      : {
                          background: "#F9FAFB",
                          color: "#9CA3AF",
                        }),
                  }}
                >
                  {count}
                </span>
              </div>

              {/* Department name */}
              <div
                style={{
                  ...s.deptName,
                  color: isSelected ? "#1A1A2E" : "#4B5563",
                }}
              >
                {dept}
              </div>

              {/* Preview line */}
              {count > 0 && (
                <div style={s.previewLine}>
                  Next: {patients[0].name} —{" "}
                  {Math.round((now - patients[0].timestamp) / 60000)}m wait
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Department Detail Panel */}
      {selectedDept && (
        <div
          style={{
            ...s.detailPanel,
            borderColor: selectedColor + "33",
          }}
        >
          {/* Header row */}
          <div style={s.detailHeader}>
            <h3 style={s.detailTitle}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <DeptIcon
                  department={selectedDept}
                  size={24}
                  color={selectedColor}
                />
                {selectedDept} Queue
              </span>
            </h3>
            <span style={s.detailCount}>
              {selectedQueue.length} patients
            </span>
          </div>

          {/* Empty state */}
          {selectedQueue.length === 0 && (
            <div style={s.emptyState}>
              <Inbox size={32} color="#9CA3AF" />
              <div style={{ marginTop: 8 }}>No patients in queue</div>
            </div>
          )}

          {/* Patient rows */}
          {selectedQueue.length > 0 && (
            <div style={s.patientList}>
              {selectedQueue.map((patient, idx) => {
                const isFirst = idx === 0;
                const waitMin = Math.round(
                  (now - patient.timestamp) / 60000
                );

                return (
                  <div
                    key={patient.id}
                    style={{
                      ...s.patientRow,
                      ...(isFirst
                        ? {
                            background: "#FFF5F5",
                            border: "1px solid #FECACA",
                          }
                        : {
                            background: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                          }),
                    }}
                  >
                    {/* Position number */}
                    <div
                      style={{
                        ...s.positionBadge,
                        ...(isFirst
                          ? {
                              background: "#FEE2E2",
                              color: "#C8102E",
                            }
                          : {
                              background: "#F9FAFB",
                              color: "#9CA3AF",
                            }),
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Patient info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Top line */}
                      <div style={s.patientTopLine}>
                        <span style={s.patientName}>
                          {patient.name}
                        </span>
                        <span style={s.patientAge}>
                          Age {patient.age}
                        </span>
                        {patient.overridden && (
                          <span style={s.overriddenBadge}>
                            OVERRIDDEN
                          </span>
                        )}
                        {patient.vulnerabilities.map((v) => (
                          <span
                            key={v}
                            style={
                              v === "Pediatric"
                                ? s.vulnBadgePediatric
                                : v === "Pregnant"
                                  ? s.vulnBadgePregnant
                                  : s.vulnBadge
                            }
                          >
                            {v}
                          </span>
                        ))}
                      </div>

                      {/* Bottom line */}
                      <div style={s.patientMeta}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, verticalAlign: "middle" }}>
                          {patient.inputMode === "speech" ? (
                            <Mic size={11} />
                          ) : (
                            <PenLine size={11} />
                          )}
                        </span>{" "}
                        {patient.language} &bull;{" "}
                        {patient.gender} &bull; Wait: {waitMin}m
                        &bull; Conf:{" "}
                        {Math.round(patient.confidence * 100)}%
                      </div>
                    </div>

                    {/* Priority score */}
                    <div style={s.priorityBlock}>
                      <div
                        style={{
                          ...s.priorityScore,
                          color: selectedColor,
                        }}
                      >
                        {patient.priority.toFixed(1)}
                      </div>
                      <div style={s.priorityLabel}>PRIORITY</div>
                    </div>

                    {/* Serve button — first patient only */}
                    {isFirst && (
                      <button
                        onClick={() => onServe(selectedDept)}
                        style={s.serveBtn}
                      >
                        <UserCheck size={14} style={{ marginRight: 4 }} />
                        Serve
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = {
  container: {
    padding: "32px 24px",
    maxWidth: 1000,
    margin: "0 auto",
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 24,
    color: "#1A1A2E",
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
    marginBottom: 28,
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 12,
    marginBottom: 28,
  },

  // Department card
  deptCard: {
    padding: 18,
    borderRadius: 14,
    textAlign: "left",
    cursor: "pointer",
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countBadge: {
    padding: "3px 10px",
    borderRadius: 10,
    fontSize: 13,
  },
  deptName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 600,
  },
  previewLine: {
    marginTop: 4,
    fontSize: 11,
    color: "#9CA3AF",
  },

  // Detail panel
  detailPanel: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: 28,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  detailTitle: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 20,
    color: "#1A1A2E",
    margin: 0,
  },
  detailCount: {
    color: "#4B5563",
    fontSize: 13,
  },
  emptyState: {
    textAlign: "center",
    padding: "32px 0",
    color: "#9CA3AF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
  },

  // Patient list
  patientList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  patientRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 10,
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },

  // Patient info
  patientTopLine: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  patientName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1A1A2E",
  },
  patientAge: {
    fontSize: 11,
    color: "#4B5563",
  },
  overriddenBadge: {
    fontSize: 9,
    color: "#EF4444",
    background: "#FEE2E2",
    padding: "2px 6px",
    borderRadius: 4,
    textTransform: "uppercase",
  },
  vulnBadge: {
    fontSize: 9,
    color: "#D97706",
    background: "#FEF3C7",
    padding: "2px 6px",
    borderRadius: 4,
  },
  vulnBadgePregnant: {
    fontSize: 9,
    color: "#9D174D",
    background: "#FCE7F3",
    padding: "2px 6px",
    borderRadius: 4,
  },
  vulnBadgePediatric: {
    fontSize: 9,
    color: "#1E40AF",
    background: "#DBEAFE",
    padding: "2px 6px",
    borderRadius: 4,
  },
  patientMeta: {
    marginTop: 3,
    fontSize: 11,
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
    gap: 3,
    flexWrap: "wrap",
  },

  // Priority
  priorityBlock: {
    textAlign: "right",
    flexShrink: 0,
  },
  priorityScore: {
    fontSize: 18,
    fontWeight: 800,
  },
  priorityLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    textTransform: "uppercase",
  },

  // Serve button
  serveBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid rgba(5, 150, 105, 0.3)",
    background: "rgba(5, 150, 105, 0.08)",
    color: "#059669",
    cursor: "pointer",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
  },
};
