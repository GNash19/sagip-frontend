"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NurseNav from "@/components/nurse/NurseNav";
import { RefreshCw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  "https://sagip-backend-851223561042.asia-southeast1.run.app";

export default function AdminPage() {
  const router = useRouter();
  const { user, token, role, name, loading, logout, getToken } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/nurse/login");
    } else if (!loading && user && role !== "admin") {
      router.push("/nurse");
    }
  }, [loading, user, role, router]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoadingData(true);
    try {
      let currentToken = token;
      if (!currentToken) currentToken = await getToken();
      const res = await fetch(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Analytics fetch failed:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    if (user && token && role === "admin") fetchAnalytics();
  }, [user, token, role, fetchAnalytics]);

  const handleReset = async () => {
    setIsResetting(true);
    setResetMessage(null);
    try {
      const res = await fetch(`${API_URL}/admin/reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setResetMessage({ type: "success", text: "Na-reset na ang queue! (Queue has been reset!)" });
        setTimeout(() => fetchAnalytics(), 1000);
      } else {
        setResetMessage({ type: "error", text: "Adunay sayop sa pag-reset. (Error resetting queue.)" });
      }
    } catch {
      setResetMessage({ type: "error", text: "Adunay sayop sa pag-reset. (Error resetting queue.)" });
    } finally {
      setIsResetting(false);
      setConfirmReset(false);
    }
  };

  if (loading) {
    return (
      <div style={s.loadingScreen}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Nagkarga... (Loading...)</p>
      </div>
    );
  }

  if (!user || role !== "admin") return null;

  const summary = analytics?.summary || {};
  const departments = analytics?.departments || [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <NurseNav role={role} name={name} currentPage="admin" logout={logout} />

      <div style={s.main}>
        <h2 style={s.title}>Admin Panel</h2>
        <p style={s.subtitle}>
          System management ug analytics.
          (System management and analytics.)
        </p>

        {/* Section 1 — Analytics */}
        <div style={{ marginTop: 32 }}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Analytics Karon nga Adlaw (Today&apos;s Analytics)</h3>
            <button onClick={fetchAnalytics} style={s.refreshBtn}>
              <RefreshCw size={14} style={{ marginRight: 4 }} />
              I-refresh (Refresh)
            </button>
          </div>

          {isLoadingData && !analytics && (
            <div style={s.centerState}>
              <div style={s.spinner} />
            </div>
          )}

          {analytics && (
            <>
              {/* Summary Cards */}
              <div style={s.summaryGrid}>
                <div style={s.summaryCard}>
                  <div style={s.cardLabel}>Total Pasyente (Total Patients)</div>
                  <div style={{ ...s.cardNumber, color: "#1A1A2E" }}>
                    {summary.total_patients || 0}
                  </div>
                </div>
                <div style={s.summaryCard}>
                  <div style={s.cardLabel}>Naghulat (Waiting)</div>
                  <div style={{ ...s.cardNumber, color: "#C8102E" }}>
                    {summary.waiting || 0}
                  </div>
                </div>
                <div style={s.summaryCard}>
                  <div style={s.cardLabel}>Naserbisyuhan (Served)</div>
                  <div style={{ ...s.cardNumber, color: "#059669" }}>
                    {summary.served || 0}
                  </div>
                </div>
                <div style={s.summaryCard}>
                  <div style={s.cardLabel}>Na-override (Overridden)</div>
                  <div style={{ ...s.cardNumber, color: "#D97706" }}>
                    {summary.overridden || 0}
                  </div>
                </div>
              </div>

              {/* Per Department Table */}
              {departments.length > 0 && (
                <div style={{ overflowX: "auto", marginTop: 24 }}>
                  <table style={s.table}>
                    <thead>
                      <tr style={s.thead}>
                        <th style={s.th}>Departamento</th>
                        <th style={{ ...s.th, width: 80 }}>Total</th>
                        <th style={{ ...s.th, width: 80 }}>Naghulat</th>
                        <th style={{ ...s.th, width: 100 }}>Naserbisyuhan</th>
                        <th style={{ ...s.th, width: 110 }}>Avg Wait (min)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((d, i) => (
                        <tr key={d.department || i} style={s.tr}>
                          <td style={{ ...s.td, fontWeight: 600 }}>{d.department}</td>
                          <td style={s.td}>{d.total || 0}</td>
                          <td style={s.td}>{d.waiting || 0}</td>
                          <td style={s.td}>{d.served || 0}</td>
                          <td style={s.td}>
                            {d.avg_wait_minutes != null
                              ? Math.round(d.avg_wait_minutes)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* Section 2 — Danger Zone */}
        <div>
          <h3 style={s.dangerTitle}>Danger Zone</h3>
          <div style={s.dangerBox}>
            <p style={s.dangerDesc}>
              Ang pag-reset sa queue mopahunong sa tanan nga naghulat nga pasyente
              karon ug magsugod pag-usab ang numero gikan sa 001.
              <br />
              (Resetting the queue will void all waiting patients today and restart
              numbering from 001.)
            </p>

            {resetMessage && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: resetMessage.type === "success" ? "#ECFDF5" : "#FEF2F2",
                  color: resetMessage.type === "success" ? "#059669" : "#DC2626",
                }}
              >
                {resetMessage.text}
              </div>
            )}

            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} style={s.resetBtn}>
                I-reset ang Queue (Reset Queue)
              </button>
            ) : (
              <div>
                <p style={s.confirmWarning}>
                  Sigurado ka ba? Dili kini mabawi!
                  (Are you sure? This cannot be undone!)
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleReset}
                    disabled={isResetting}
                    style={{
                      ...s.confirmYesBtn,
                      opacity: isResetting ? 0.5 : 1,
                    }}
                  >
                    {isResetting
                      ? "Nagproseso... (Processing...)"
                      : "Oo, I-reset (Yes, Reset)"}
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    style={s.confirmNoBtn}
                  >
                    Dili (Cancel)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #FEE2E2",
    borderTop: "3px solid #C8102E",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },
  main: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 32,
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
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1A1A2E",
    margin: 0,
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
  centerState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
  },
  summaryCard: {
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "20px 24px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  cardLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardNumber: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 36,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#F9FAFB",
    borderBottom: "2px solid #E5E7EB",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 600,
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tr: {
    borderBottom: "1px solid #F3F4F6",
  },
  td: {
    padding: "12px 16px",
    fontSize: 13,
    color: "#4B5563",
  },
  divider: {
    height: 1,
    background: "#E5E7EB",
    margin: "40px 0",
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#DC2626",
    margin: "0 0 16px",
  },
  dangerBox: {
    border: "1px solid #FECACA",
    borderRadius: 12,
    padding: 24,
    background: "#FEF2F2",
  },
  dangerDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  resetBtn: {
    padding: "10px 24px",
    borderRadius: 8,
    border: "1px solid #C8102E",
    background: "#FFFFFF",
    color: "#C8102E",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmWarning: {
    fontSize: 14,
    fontWeight: 600,
    color: "#DC2626",
    marginBottom: 12,
  },
  confirmYesBtn: {
    padding: "10px 24px",
    borderRadius: 8,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  confirmNoBtn: {
    padding: "10px 24px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    background: "#FFFFFF",
    color: "#6B7280",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
