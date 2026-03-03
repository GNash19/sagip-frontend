// SAGIP Design System
// White + Red hospital-professional theme

export const colors = {
  // Primary
  red: "#C8102E",
  redDark: "#8B0000",
  redLight: "#EF4444",

  // Backgrounds
  white: "#FFFFFF",
  cream: "#FDF8F4",
  grayLight: "#F9FAFB",
  grayMid: "#F3F4F6",

  // Text
  textPrimary: "#1A1A2E",
  textSecondary: "#4B5563",
  textMuted: "#9CA3AF",

  // Borders
  border: "#E5E7EB",
  borderRed: "#FECACA",

  // Accents
  success: "#059669",
  warning: "#D97706",
  info: "#2563EB",
  teal: "#0891B2",
};

export const shadows = {
  sm: "0 1px 3px rgba(0,0,0,0.06)",
  md: "0 4px 16px rgba(0,0,0,0.06)",
  lg: "0 8px 30px rgba(0,0,0,0.08)",
  card: "0 2px 12px rgba(0,0,0,0.04)",
};

export const fonts = {
  serif: "var(--font-dm-serif), 'DM Serif Display', Georgia, serif",
  sans: "var(--font-dm-sans), 'DM Sans', sans-serif",
};

// Department data — icons will be Lucide component names
// Import them where needed:
// import { Heart, Scissors, Baby, PersonStanding, Bone, Eye, Ear, Droplets } from "lucide-react"
export const DEPT_ICON_MAP = {
  "Internal Medicine": "Heart",
  "Surgery": "Scissors",
  "Pediatrics": "Baby",
  "OB-GYN": "PersonStanding",
  "Orthopedics": "Bone",
  "Ophthalmology": "Eye",
  "ENT": "Ear",
  "Dermatology": "Droplets",
};
