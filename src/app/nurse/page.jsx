"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NurseNav from "@/components/nurse/NurseNav";
import NurseQueueView from "@/components/nurse/NurseQueueView";

export default function NursePage() {
  const router = useRouter();
  const { user, token, role, name, loading, logout, getToken } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/nurse/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div style={s.loadingScreen}>
        <div style={s.spinner} />
        <p style={s.loadingText}>Nagkarga... (Loading...)</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <NurseNav role={role} name={name} currentPage="queue" logout={logout} />
      <NurseQueueView token={token} getToken={getToken} />
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
};
