"use client";

import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function NurseNav({ role, name, currentPage, logout }) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/nurse/login");
  };

  const navItems = [
    { id: "queue", label: "Queue", path: "/nurse" },
    { id: "history", label: "History", path: "/nurse/history" },
  ];
  if (role === "admin") {
    navItems.push({ id: "admin", label: "Admin", path: "/nurse/admin" });
  }

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        {/* Left */}
        <div style={s.left}>
          <Logo size={32} showText={false} />
          <span style={s.brand}>SAGIP</span>
          <span style={s.badge}>Nurse Station</span>
        </div>

        {/* Center */}
        <div style={s.center}>
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                style={{
                  ...s.navLink,
                  ...(active
                    ? {
                        color: "#C8102E",
                        fontWeight: 600,
                        borderBottom: "2px solid #C8102E",
                        paddingBottom: 2,
                      }
                    : {
                        color: "#6B7280",
                        fontWeight: 400,
                      }),
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div style={s.right}>
          {name && <span style={s.nurseName}>{name}</span>}
          <button onClick={handleLogout} style={s.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    height: 64,
    background: "#FFFFFF",
    borderBottom: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 32px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  brand: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 20,
    color: "#1A1A2E",
  },
  badge: {
    background: "#FEF2F2",
    color: "#C8102E",
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 10,
    fontWeight: 600,
    marginLeft: 4,
  },
  center: {
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  navLink: {
    background: "none",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    padding: "4px 0",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  nurseName: {
    fontSize: 13,
    color: "#4B5563",
  },
  logoutBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid #E5E7EB",
    background: "#FFFFFF",
    color: "#6B7280",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
