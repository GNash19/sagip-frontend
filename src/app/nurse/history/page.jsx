"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NurseNav from "@/components/nurse/NurseNav";
import { Inbox, RefreshCw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  "https://sagip-backend-851223561042.asia-southeast1.run.app";

export default function HistoryPage() {
  const router = useRouter();
  const { user, token, role, name, loading, logout, getToken } = useAuth();
  const [history, setHistory] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/nurse/login");
    }
  }, [loading, user, router]);

  const fetchHistory = useCallback(async () => {
    setIsLoadingData(true);
    try {
      let currentToken = token;
      if (!currentToken) currentToken = await getToken();
      const res = await fetch(`${API_URL}/patients/history`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("History fetch failed:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, [token, getToken]);

  useEffect(() => {
    if (user && token) fetchHistory();
  }, [user, token, fetchHistory]);

  if (loading) {
    return (
      <div style={s.loadingScreen}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Nagkarga... (Loading...)</p>
      </div>
    );
  }

  if (!user) return null;

  const patients = history?.patients || [];
  const total = patients.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <NurseNav role={role} name={name} currentPage="history" logout={logout} />

      <div style={s.main}>
        <div style={s.titleRow}>
          <div>
            <h2 style={s.title}>Kasaysayan Karon nga Adlaw (Today&apos;s History)</h2>
            <p style={s.subtitle}>
              {total} nga pasyente ang naserbisyuhan karon.
              ({total} patients served today.)
            </p>
          </div>
          <button onClick={fetchHistory} style={s.refreshBtn}>
            <RefreshCw size={14} style={{ marginRight: 4 }} />
            I-refresh (Refresh)
          </button>
        </div>

        {isLoadingData && !history && (
          <div style={s.centerState}>
            <div style={s.spinner} />
          </div>
        )}

        {!isLoadingData && total === 0 && (
          <div style={s.centerState}>
            <Inbox size={40} color="#9CA3AF" />
            <p style={{ marginTop: 12, color: "#9CA3AF", fontSize: 14, textAlign: "center", lineHeight: 1.6 }}>
              Wala pay naserbisyuhang pasyente karon.
              <br />
              (No patients served today yet.)
            </p>
          </div>
        )}

        {total > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={{ ...s.th, width: 90 }}>Queue No.</th>
                  <th style={s.th}>Ngalan (Name)</th>
                  <th style={{ ...s.th, width: 60 }}>Edad (Age)</th>
                  <th style={{ ...s.th, width: 140 }}>Departamento (Department)</th>
                  <th style={{ ...s.th, width: 100 }}>Override</th>
                  <th style={{ ...s.th, width: 80 }}>Priority</th>
                  <th style={{ ...s.th, width: 80 }}>Gihulat (Wait)</th>
                  <th style={{ ...s.th, width: 100 }}>Oras (Time)</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => {
                  const isOverridden = p.overridden;
                  const servedTime = p.served_at
                    ? new Date(p.served_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—";

                  return (
                    <tr
                      key={p.patient_id || i}
                      style={{
                        ...s.tr,
                        background: isOverridden ? "#FFFBEB" : "#FFFFFF",
                      }}
                    >
                      <td style={s.td}>
                        <span style={s.queueBadge}>{p.queue_number || "—"}</span>
                      </td>
                      <td style={s.td}>{p.name}</td>
                      <td style={s.td}>{p.age}</td>
                      <td style={s.td}>{p.department}</td>
                      <td style={s.td}>
                        {isOverridden ? (
                          <div>
                            <div style={{ color: "#D97706", fontWeight: 600 }}>Oo (Yes)</div>
                            <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                              Gikan: {p.original_department}
                              <br />
                              (From: {p.original_department})
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>Dili (No)</span>
                        )}
                      </td>
                      <td style={s.td}>
                        <span style={{ color: "#C8102E", fontWeight: 700 }}>
                          {(p.priority || 0).toFixed(1)}
                        </span>
                      </td>
                      <td style={s.td}>
                        {p.wait_minutes != null ? `${p.wait_minutes}m` : "—"}
                      </td>
                      <td style={s.td}>{servedTime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
  centerState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0",
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
  queueBadge: {
    background: "#FEF2F2",
    color: "#C8102E",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 700,
  },
};
