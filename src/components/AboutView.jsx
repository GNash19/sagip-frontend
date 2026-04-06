"use client";

import { DEPARTMENTS, DEPT_COLORS } from "@/constants/departments";
import DeptIcon from "@/components/DeptIcon";

const PIPELINE = [
  { label: "Symptom Input", sub: "Text / Speech", color: "#2563EB" },
  { label: "ASR / Normalization", sub: "Whisper + Text Prep", color: "#0891B2" },
  { label: "Tokenization", sub: "WordPiece / Subword", color: "#7C3AED" },
  { label: "Transformer", sub: "XLM-R / mBERT", color: "#DC2626" },
  { label: "Classification", sub: "Softmax Head", color: "#D97706" },
  { label: "Queue Mgmt", sub: "Priority Scheduling", color: "#059669" },
  { label: "OPD Routing", sub: "Dept Assignment", color: "#DB2777" },
];

const IMPL_NOTES = [
  {
    heading: "Classification Engine",
    text: "Fine-tuned XLM-RoBERTa base model trained on multilingual symptom descriptions. Runs on Google Colab GPU via FastAPI. In production, deployed locally at SPMC for data privacy compliance (RA 10173).",
  },
  {
    heading: "Speech Pipeline",
    text: "Web Speech API simulates Whisper ASR for browser-based demo. Production system uses OpenAI Whisper trained on 680,000 hours of multilingual audio data for robust Filipino and Cebuano transcription.",
  },
  {
    heading: "Queue Management",
    text: "Implements Priority Scheduling Theory with weighted scoring: classification confidence (0.25), age-based priority (0.30), vulnerability status (0.30), and wait time aging (0.15). Uses min-heap for O(log n) queue operations.",
  },
  {
    heading: "Philippine Priority Laws",
    text: "Complies with RA 10754 (expanded Senior Citizen benefits). Enforces SPMC\u2019s institutional \u2018older-gets-first\u2019 rule for age-based priority elevation.",
  },
];

const MODEL_SPECS = [
  { label: "Base Model", value: "XLM-RoBERTa Base (278M parameters)" },
  { label: "Training Data", value: "~1,960 synthetic multilingual symptom descriptions" },
  { label: "Languages", value: "English, Filipino, Cebuano, Code-switching" },
  { label: "Departments", value: "8 SPMC OPD departments" },
  { label: "Fine-tuning", value: "5 epochs, learning rate 2e-5, batch size 16" },
  { label: "Hardware", value: "Google Colab Pro (T4 GPU)" },
  { label: "Max Sequence Length", value: "128 tokens" },
];

export default function AboutView() {
  return (
    <div style={s.container}>
      {/* Section 1 — Page Title */}
      <h2 style={s.pageTitle}>System Architecture</h2>

      {/* Section 2 — Conceptual Framework Pipeline */}
      <div style={s.card}>
        <h3 style={s.cardTitleRed}>Conceptual Framework Pipeline</h3>
        <div style={s.pipelineRow}>
          {PIPELINE.map((step, i) => (
            <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  textAlign: "center",
                  minWidth: 90,
                  background: hexToRgba(step.color, 0.06),
                  border: `1px solid ${hexToRgba(step.color, 0.2)}`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: step.color,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {step.sub}
                </div>
              </div>
              {i < PIPELINE.length - 1 && (
                <span
                  style={{
                    color: "var(--border)",
                    fontSize: 16,
                    margin: "0 2px",
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Prototype Implementation Notes */}
      <div style={{ ...s.card, marginTop: 16 }}>
        <h3 style={s.cardTitle}>Prototype Implementation Notes</h3>
        <div style={s.notesGrid}>
          {IMPL_NOTES.map((note) => (
            <div key={note.heading}>
              <div style={s.noteHeading}>{note.heading}</div>
              <div style={s.noteText}>{note.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4 — Target Departments */}
      <div style={{ ...s.card, marginTop: 16 }}>
        <h3 style={s.cardTitle}>Target Departments (SPMC OPD)</h3>
        <div style={s.deptRow}>
          {DEPARTMENTS.map((dept) => {
            const color = DEPT_COLORS[dept];
            return (
              <span
                key={dept}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  background: hexToRgba(color, 0.06),
                  border: `1px solid ${hexToRgba(color, 0.15)}`,
                  color: color,
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <DeptIcon department={dept} size={16} color={color} />
                  {dept}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Section 5 — Model Specifications */}
      <div style={{ ...s.card, marginTop: 16 }}>
        <h3 style={s.cardTitle}>Model Specifications</h3>
        <div style={s.specList}>
          {MODEL_SPECS.map((spec) => (
            <div key={spec.label} style={s.specRow}>
              <span style={s.specLabel}>{spec.label}</span>
              <span style={s.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6 — Footer */}
      <div style={s.footer}>
        Golosino, Nash T. &amp; Morales, Ma. Nicole B.
        <br />
        University of the Immaculate Conception — College of Computer Studies — BS Computer Science
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Styles ────────────────────────────────────────────────────
const s = {
  container: {
    padding: "32px 24px",
    maxWidth: 700,
    margin: "0 auto",
  },
  pageTitle: {
    fontFamily: "var(--font-serif)",
    fontSize: 24,
    color: "var(--text-primary)",
    margin: 0,
    marginBottom: 20,
  },

  // Card
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "24px 28px",
    boxShadow: "var(--shadow-md)",
  },
  cardTitleRed: {
    color: "var(--accent-red)",
    fontSize: 15,
    fontFamily: "var(--font-serif)",
    margin: 0,
    marginBottom: 14,
  },
  cardTitle: {
    color: "var(--accent-red)",
    fontSize: 15,
    fontFamily: "var(--font-serif)",
    margin: 0,
    marginBottom: 14,
  },

  // Pipeline
  pipelineRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    padding: "20px 0",
  },

  // Implementation notes
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  noteHeading: {
    color: "var(--text-primary)",
    fontWeight: 600,
    marginBottom: 6,
    fontSize: 14,
  },
  noteText: {
    fontSize: 13,
    color: "var(--text-secondary)",
    lineHeight: 1.8,
  },

  // Departments
  deptRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  // Model specs
  specList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  specRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
  },
  specLabel: {
    fontSize: 12,
    color: "var(--text-muted)",
    fontWeight: 600,
    textTransform: "uppercase",
    width: 160,
    flexShrink: 0,
  },
  specValue: {
    fontSize: 13,
    color: "var(--text-primary)",
  },

  // Footer
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 11,
    color: "var(--text-muted)",
    borderTop: "1px solid var(--border)",
    paddingTop: 20,
  },
};
