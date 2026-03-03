"use client";

import { Home, Stethoscope, ListOrdered, Settings } from "lucide-react";
import Logo from "./Logo";

const NAV_TABS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "triage", label: "Triage", Icon: Stethoscope },
  { id: "queue", label: "Queues", Icon: ListOrdered },
  { id: "about", label: "System", Icon: Settings },
];

export default function Header({ currentView, setCurrentView, queueCount }) {
  return (
    <header style={styles.header}>
      <Logo />

      <nav style={styles.nav}>
        {NAV_TABS.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              style={{
                ...styles.tabButton,
                ...(isActive ? styles.tabActive : styles.tabInactive),
              }}
            >
              <tab.Icon size={16} />
              <span>{tab.label}</span>
              {tab.id === "queue" && queueCount > 0 && (
                <span style={styles.badge}>{queueCount}</span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    height: 64,
    background: "var(--bg-primary)",
    borderBottom: "2px solid var(--accent-red)",
    boxShadow: "var(--shadow-sm)",
    padding: "0 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nav: {
    display: "flex",
    gap: 4,
  },
  tabButton: {
    padding: "8px 18px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tabActive: {
    background: "var(--bg-red-tint)",
    border: "1px solid var(--border-red)",
    color: "var(--accent-red)",
    fontWeight: 600,
  },
  tabInactive: {
    background: "transparent",
    border: "1px solid transparent",
    color: "var(--text-secondary)",
    fontWeight: 400,
  },
  badge: {
    background: "var(--accent-red)",
    color: "#FFFFFF",
    borderRadius: 10,
    padding: "1px 7px",
    fontSize: 10,
    fontWeight: 700,
  },
};
