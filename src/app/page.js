"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import TriageView from "@/components/TriageView";
import QueueView from "@/components/QueueView";
import AboutView from "@/components/AboutView";
import LandingPage from "@/components/LandingPage";
import { DEPARTMENTS } from "@/constants/departments";

export default function Home() {
  const [currentView, setCurrentView] = useState("home");
  const [queues, setQueues] = useState(() =>
    Object.fromEntries(DEPARTMENTS.map((d) => [d, []]))
  );

  const totalPatients = useMemo(
    () => Object.values(queues).reduce((sum, arr) => sum + arr.length, 0),
    [queues]
  );

  function handlePatientQueued(patient) {
    setQueues((prev) => {
      const dept = patient.department;
      const updated = [...prev[dept], patient].sort(
        (a, b) => b.priority - a.priority
      );
      return { ...prev, [dept]: updated };
    });
  }

  function handleServe(dept) {
    setQueues((prev) => {
      const updated = prev[dept].slice(1);
      return { ...prev, [dept]: updated };
    });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        queueCount={totalPatients}
      />

      {currentView === "home" && (
        <LandingPage onNavigate={setCurrentView} />
      )}
      {currentView === "triage" && (
        <TriageView onPatientQueued={handlePatientQueued} queues={queues} />
      )}
      {currentView === "queue" && (
        <QueueView queues={queues} onServe={handleServe} />
      )}
      {currentView === "about" && <AboutView />}
    </div>
  );
}
