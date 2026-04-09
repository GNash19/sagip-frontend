"use client";

import { useState, useEffect, useCallback } from "react";
import { DEPARTMENTS, DEPT_COLORS } from "@/constants/departments";
import DeptIcon from "@/components/DeptIcon";
import OverrideModal from "@/components/nurse/OverrideModal";
import {
  Mic,
  PenLine,
  UserCheck,
  Inbox,
  RefreshCw,
  ArrowLeftRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  "https://sagip-backend-851223561042.asia-southeast1.run.app";

export default function NurseQueueView({ token, getToken }) {
  const [queueData, setQueueData] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overridePatient, setOverridePatient] = useState(null);
  const [isServing, setIsServing] = useState(false);
  const [isOverriding, setIsOverriding] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchQueue = useCallback(
    async (retried = false) => {
      try {
        let currentToken = token;
        if (!currentToken) {
          currentToken = await getToken();
        }
        const res = await fetch(`${API_URL}/patients/queue`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        if (res.status === 401 && !retried) {
          const fresh = await getToken();
          if (fresh) return fetchQueue(true);
        }
        if (!res.ok) throw new Error("Queue fetch failed");
        const data = await res.json();
        setQueueData(data);
        setLastRefreshed(new Date());
        setError(null);
      } catch {
        setError("Dili ma-load ang queue. (Cannot load queue.)");
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchQueue();
    const id = setInterval(() => fetchQueue(), 30000);
    return () => clearInterval(id);
  }, [fetchQueue]);

  const handleServe = async (patientId, dept) => {
    setIsServing(true);
    try {
      const res = await fetch(`${API_URL}/patients/${patientId}/serve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchQueue();
      } else {
        alert("Adunay sayop sa pag-serbisyo. (Error serving patient.)");
      }
    } catch {
      alert("Adunay sayop sa pag-serbisyo. (Error serving patient.)");
    } finally {
      setIsServing(false);
    }
  };

  const handleOverride = async (data) => {
    if (!overridePatient) return;
    setIsOverriding(true);
    try {
      const res = await fetch(
        `${API_URL}/patients/${overridePatient.patient_id}/override`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_department: data.new_department,
            notes: data.notes,
          }),
        }
      );
      if (res.ok) {
        setOverridePatient(null);
        await fetchQueue();
      } else {
        alert("Adunay sayop sa pag-override. (Error overriding patient.)");
      }
    } catch {
      alert("Adunay sayop sa pag-override. (Error overriding patient.)");
    } finally {
      setIsOverriding(false);
    }
  };

  // Loading state
  if (isLoading && !queueData) {
    return (
      <div style={s.centerState}>
        <div style={s.spinner} />
        <p style={{ marginTop: 12, color: "#9CA3AF", fontSize: 14 }}>
          Gikuha ang queue... (Loading queue...)
        </p>
      </div>
    );
  }

  // Error state
  if (error && !queueData) {
    return (
      <div style={s.centerState}>
        <div style={s.errorBox}>
          <p style={{ color: "#DC2626", margin: 0 }}>{error}</p>
          <button onClick={() => fetchQueue()} style={s.retryBtn}>
            Sulayi pag-usab (Retry)
          </button>
        </div>
      </div>
    );
  }

  const departments = queueData?.departments || {};
  const totalWaiting = DEPARTMENTS.reduce(
    (sum, dept) => sum + (departments[dept]?.queue_depth || 0),
    0
  );
  const selectedQueue = selectedDept
    ? departments[selectedDept]?.patients || []
    : [];
  const selectedColor = selectedDept ? DEPT_COLORS[selectedDept] : null;

  return (
    <div style={s.container}>
      {/* Title Section */}
      <div style={s.titleRow}>
        <div>
          <h2 style={s.title}>Department Queues</h2>
          <p style={s.subtitle}>
            Real-time queue state across 8 OPD departments &bull;{" "}
            {totalWaiting} patient(s) waiting
            {lastRefreshed && (
              <span>
                {" "}&bull; Gi-refresh (Refreshed):{" "}
                {lastRefreshed.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </span>
            )}
          </p>
        </div>
        <button onClick={() => fetchQueue()} style={s.refreshBtn}>
          <RefreshCw size={14} style={{ marginRight: 4 }} />
          I-refresh (Refresh)
        </button>
      </div>

      {/* Department Cards Grid */}
      <div style={s.grid} className="stagger-children">
        {DEPARTMENTS.map((dept) => {
          const deptData = departments[dept] || { patients: [], queue_depth: 0 };
          const patients = deptData.patients || [];
          const count = deptData.queue_depth || 0;
          const isSelected = selectedDept === dept;
          const color = DEPT_COLORS[dept];

          return (
            <button
              key={dept}
              className="hover-lift"
              onClick={() => setSelectedDept(isSelected ? null : dept)}
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
              <div style={s.cardTopRow}>
                <DeptIcon department={dept} size={24} color={color} />
                <span
                  style={{
                    ...s.countBadge,
                    ...(count > 0
                      ? { background: color + "14", color: color, fontWeight: 700 }
                      : { background: "#F9FAFB", color: "#9CA3AF" }),
                  }}
                >
                  {count}
                </span>
              </div>
              <div
                style={{
                  ...s.deptName,
                  color: isSelected ? "#1A1A2E" : "#4B5563",
                }}
              >
                {dept}
              </div>
              {patients.length > 0 && (
                <div style={s.previewLine}>
                  Sunod (Next): {patients[0].name} — {patients[0].wait_minutes || 0}m
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Department Detail Panel */}
      {selectedDept && (
        <div style={{ ...s.detailPanel, borderColor: selectedColor + "33" }}>
          <div style={s.detailHeader}>
            <h3 style={s.detailTitle}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <DeptIcon department={selectedDept} size={24} color={selectedColor} />
                {selectedDept} Queue
              </span>
            </h3>
            <span style={s.detailCount}>{selectedQueue.length} patients</span>
          </div>

          {selectedQueue.length === 0 && (
            <div style={s.emptyState}>
              <Inbox size={32} color="#9CA3AF" />
              <div style={{ marginTop: 8 }}>No patients in queue</div>
            </div>
          )}

          {selectedQueue.length > 0 && (
            <div style={s.patientList}>
              {selectedQueue.map((patient, idx) => {
                const isFirst = idx === 0;
                const waitMin = patient.wait_minutes || 0;
                const vulns = patient.vulnerabilities || [];

                return (
                  <div
                    key={patient.patient_id}
                    style={{
                      ...s.patientRow,
                      ...(isFirst
                        ? { background: "#FFF5F5", border: "1px solid #FECACA" }
                        : { background: "#F9FAFB", border: "1px solid #E5E7EB" }),
                    }}
                  >
                    {/* Position */}
                    <div
                      style={{
                        ...s.positionBadge,
                        ...(isFirst
                          ? { background: "#FEE2E2", color: "#C8102E" }
                          : { background: "#F9FAFB", color: "#9CA3AF" }),
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Patient info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={s.patientTopLine}>
                        {/* Queue number badge */}
                        {patient.queue_number && (
                          <span style={s.queueBadge}>{patient.queue_number}</span>
                        )}
                        <span style={s.patientName}>{patient.name}</span>
                        <span style={s.patientAge}>Age {patient.age}</span>
                        {patient.overridden && (
                          <span style={s.overriddenBadge}>OVERRIDDEN</span>
                        )}
                        {vulns.map((v) => (
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
                      <div style={s.patientMeta}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            verticalAlign: "middle",
                          }}
                        >
                          {patient.input_mode === "speech" ? (
                            <Mic size={11} />
                          ) : (
                            <PenLine size={11} />
                          )}
                        </span>{" "}
                        {patient.language} &bull; {patient.gender} &bull; Wait:{" "}
                        {waitMin}m &bull; Conf:{" "}
                        {Math.round((patient.confidence || 0) * 100)}%
                      </div>
                    </div>

                    {/* Priority */}
                    <div style={s.priorityBlock}>
                      <div style={{ ...s.priorityScore, color: selectedColor }}>
                        {(patient.priority || 0).toFixed(1)}
                      </div>
                      <div style={s.priorityLabel}>PRIORITY</div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                      {isFirst && (
                        <button
                          onClick={() => handleServe(patient.patient_id, selectedDept)}
                          disabled={isServing}
                          style={{
                            ...s.serveBtn,
                            opacity: isServing ? 0.5 : 1,
                          }}
                        >
                          <UserCheck size={14} style={{ marginRight: 4 }} />
                          I-serbisyo (Serve)
                        </button>
                      )}
                      <button
                        onClick={() => setOverridePatient(patient)}
                        style={s.overrideBtn}
                      >
                        <ArrowLeftRight size={14} style={{ marginRight: 4 }} />
                        I-override (Override)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Override Modal */}
      {overridePatient && (
        <OverrideModal
          patient={overridePatient}
          onConfirm={handleOverride}
          onClose={() => setOverridePatient(null)}
          isLoading={isOverriding}
        />
      )}
    </div>
  );
}

const s = {
  container: {
    padding: "32px 24px",
    maxWidth: 1000,
    margin: "0 auto",
  },
  centerState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #FEE2E2",
    borderTop: "3px solid #C8102E",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    textAlign: "center",
    padding: 24,
    background: "#FEF2F2",
    borderRadius: 12,
    border: "1px solid #FECACA",
  },
  retryBtn: {
    marginTop: 12,
    padding: "8px 20px",
    borderRadius: 8,
    border: "1px solid #C8102E",
    background: "#FFFFFF",
    color: "#C8102E",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
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
  },
  refreshBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    background: "#FFFFFF",
    color: "#6B7280",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 12,
    marginBottom: 28,
  },
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
  queueBadge: {
    background: "#FEF2F2",
    color: "#C8102E",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 700,
  },
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
    color: "#D97706",
    background: "#FEF3C7",
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
    fontFamily: "inherit",
  },
  overrideBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid rgba(37,99,235,0.3)",
    background: "rgba(37,99,235,0.08)",
    color: "#2563EB",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "inherit",
  },
};
