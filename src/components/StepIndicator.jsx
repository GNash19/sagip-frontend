"use client";

import {
  UserRound,
  MessageSquareText,
  Brain,
  ClipboardCheck,
  Check,
} from "lucide-react";

const STEPS = [
  { label: "Patient Info", Icon: UserRound },
  { label: "Symptoms", Icon: MessageSquareText },
  { label: "Classification", Icon: Brain },
  { label: "Nurse Review", Icon: ClipboardCheck },
];

export default function StepIndicator({ current }) {
  return (
    <div style={styles.container}>
      {STEPS.map((step, i) => {
        const num = i + 1;
        const completed = num < current;
        const active = num === current;
        const last = i === STEPS.length - 1;

        let circleStyle = { ...styles.circle };
        let labelStyle = { ...styles.label };

        if (completed) {
          circleStyle = { ...circleStyle, ...styles.circleCompleted };
          labelStyle = { ...labelStyle, ...styles.labelCompleted };
        } else if (active) {
          circleStyle = { ...circleStyle, ...styles.circleActive };
          labelStyle = { ...labelStyle, ...styles.labelActive };
        } else {
          circleStyle = { ...circleStyle, ...styles.circleFuture };
          labelStyle = { ...labelStyle, ...styles.labelFuture };
        }

        const iconColor = completed
          ? "#FFFFFF"
          : active
          ? "#FFFFFF"
          : "#9CA3AF";

        return (
          <div key={num} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={circleStyle}>
                {completed ? (
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <step.Icon size={16} color={iconColor} />
                )}
              </div>
              <span style={labelStyle}>{step.label}</span>
            </div>
            {!last && (
              <div
                style={{
                  ...styles.line,
                  background: completed ? "#059669" : "#E5E7EB",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 32,
  },
  circle: {
    width: 36,
    height: 36,
    minWidth: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  circleCompleted: {
    background: "#059669",
  },
  circleActive: {
    background: "#C8102E",
  },
  circleFuture: {
    background: "#F9FAFB",
    border: "1.5px solid #E5E7EB",
  },
  label: {
    fontSize: 12,
  },
  labelCompleted: {
    color: "#059669",
    fontWeight: 400,
  },
  labelActive: {
    color: "#C8102E",
    fontWeight: 600,
  },
  labelFuture: {
    color: "#9CA3AF",
    fontWeight: 400,
  },
  line: {
    width: 32,
    height: 2,
    marginLeft: 4,
    marginRight: 4,
  },
};
