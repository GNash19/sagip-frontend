"use client";

import { useState } from "react";
import StepIndicator from "./StepIndicator";
import DeptIcon from "@/components/DeptIcon";
import { useSpeechRecognition } from "@/utils/speechRecognition";
import { classifySymptoms } from "@/utils/classifier";
import { computePriority } from "@/utils/priorityQueue";
import { DEPARTMENTS, DEPT_COLORS } from "@/constants/departments";
import {
  Check,
  Zap,
  PenLine,
  Mic,
  Square,
  AudioLines,
  Languages,
  Lightbulb,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const PLACEHOLDERS = {
  English: "e.g., I have severe chest pain and difficulty breathing...",
  Filipino: "e.g., Masakit ang aking dibdib at nahihirapan akong huminga...",
  Cebuano: "e.g., Sakit kaayo akong dughan ug lisod ko mogininhawa...",
};

export default function TriageView({ onPatientQueued, queues }) {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState("text");
  const [language, setLanguage] = useState("English");
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    vulnerabilities: [],
  });
  const [symptomText, setSymptomText] = useState("");
  const [classification, setClassification] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [nurseOverride, setNurseOverride] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const speech = useSpeechRecognition();

  function resetForm() {
    setStep(1);
    setInputMode("text");
    setLanguage("English");
    setPatientInfo({ name: "", age: "", vulnerabilities: [] });
    setSymptomText("");
    setClassification(null);
    setIsClassifying(false);
    setNurseOverride(null);
    setConfirmed(false);
    speech.setTranscript("");
  }

  function toggleVulnerability(v) {
    setPatientInfo((prev) => {
      const has = prev.vulnerabilities.includes(v);
      return {
        ...prev,
        vulnerabilities: has
          ? prev.vulnerabilities.filter((x) => x !== v)
          : [...prev.vulnerabilities, v],
      };
    });
  }

  async function handleClassify() {
    const text =
      inputMode === "speech" ? speech.transcript : symptomText;
    setIsClassifying(true);
    setStep(3);
    const result = await classifySymptoms(text, language);
    setClassification(result);
    setIsClassifying(false);
    if (result) setStep(4);
  }

  function handleConfirm() {
    const dept = nurseOverride || classification.department;
    const conf = nurseOverride ? 0.85 : classification.confidence;
    const age = parseInt(patientInfo.age) || 30;
    const priority = computePriority(
      conf,
      age,
      patientInfo.vulnerabilities,
      0
    );

    const patient = {
      id:
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 5),
      name: patientInfo.name || "Patient",
      age,
      vulnerabilities: patientInfo.vulnerabilities,
      symptom: inputMode === "speech" ? speech.transcript : symptomText,
      language: classification.detected_language || language,
      inputMode,
      department: dept,
      confidence: conf,
      priority,
      timestamp: Date.now(),
      overridden: !!nurseOverride,
      reasoning: classification.reasoning,
    };

    onPatientQueued(patient);
    setConfirmed(true);
    setTimeout(() => resetForm(), 2500);
  }

  // ── STEP 1: Patient Information ─────────────────────────────
  if (step === 1) {
    const ageNum = parseInt(patientInfo.age);
    const showAgeBadge =
      patientInfo.age && (ageNum >= 65 || ageNum <= 5);

    return (
      <div style={s.container}>
        <StepIndicator current={1} />
        <div style={s.card}>
          <h2 style={s.title}>Patient Information</h2>
          <p style={s.subtitle}>
            Enter patient demographic data for priority computation
          </p>

          {/* Name */}
          <div style={{ marginTop: 24 }}>
            <label style={s.label}>PATIENT NAME / ID</label>
            <input
              type="text"
              placeholder="e.g., Juan Dela Cruz"
              value={patientInfo.name}
              onChange={(e) =>
                setPatientInfo((p) => ({ ...p, name: e.target.value }))
              }
              style={s.input}
            />
          </div>

          {/* Age */}
          <div style={{ marginTop: 16 }}>
            <label style={s.label}>AGE</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="number"
                value={patientInfo.age}
                onChange={(e) =>
                  setPatientInfo((p) => ({ ...p, age: e.target.value }))
                }
                style={{ ...s.input, width: 120 }}
              />
              {showAgeBadge && (
                <span style={s.ageBadge}>
                  <Zap size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
                  Age-based priority elevation
                </span>
              )}
            </div>
          </div>

          {/* Vulnerabilities */}
          <div style={{ marginTop: 20 }}>
            <label style={s.label}>
              VULNERABILITY STATUS{" "}
              <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                (RA 7277 / RA 9442 / RA 10754)
              </span>
            </label>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              {["Senior Citizen", "PWD", "Pregnant"].map((v) => {
                const sel = patientInfo.vulnerabilities.includes(v);
                return (
                  <button
                    key={v}
                    onClick={() => toggleVulnerability(v)}
                    style={sel ? s.vulnSelected : s.vulnDefault}
                  >
                    {sel && (
                      <Check
                        size={14}
                        style={{ verticalAlign: "middle", marginRight: 4 }}
                      />
                    )}
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue */}
          <button
            onClick={() => setStep(2)}
            disabled={!patientInfo.age}
            style={{
              ...s.primaryBtn,
              marginTop: 28,
              width: "100%",
              opacity: patientInfo.age ? 1 : 0.4,
              pointerEvents: patientInfo.age ? "auto" : "none",
            }}
          >
            Continue to Symptom Input
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: Symptom Input ───────────────────────────────────
  if (step === 2) {
    const vulnText =
      patientInfo.vulnerabilities.length > 0
        ? " \u2022 " + patientInfo.vulnerabilities.join(", ")
        : "";

    const textEmpty =
      inputMode === "text"
        ? !symptomText.trim()
        : !speech.transcript.trim();

    return (
      <div style={s.container}>
        <StepIndicator current={2} />
        <div style={s.card}>
          <h2 style={s.title}>Symptom Description</h2>
          <p style={s.subtitle}>
            Patient: {patientInfo.name || "\u2014"}, Age {patientInfo.age}
            {vulnText && (
              <span style={{ color: "var(--accent-red)" }}>{vulnText}</span>
            )}
          </p>

          {/* Language */}
          <div style={{ marginTop: 20 }}>
            <label style={s.label}>LANGUAGE</label>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {["English", "Filipino", "Cebuano"].map((lang) => {
                const sel = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={sel ? s.langSelected : s.langDefault}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Mode */}
          <div style={{ marginTop: 20 }}>
            <label style={s.label}>INPUT MODALITY</label>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {[
                {
                  id: "text",
                  Icon: PenLine,
                  label: "Text Input",
                  sub: "Direct text entry",
                },
                {
                  id: "speech",
                  Icon: Mic,
                  label: "Speech Input",
                  sub: "Whisper ASR simulation",
                },
              ].map((mode) => {
                const sel = inputMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setInputMode(mode.id)}
                    style={{
                      ...(sel ? s.modeSelected : s.modeDefault),
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 10,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        color: sel ? "#1A1A2E" : "#4B5563",
                      }}
                    >
                      <mode.Icon size={18} />
                      {mode.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.7,
                        marginTop: 2,
                        color: sel ? "#1A1A2E" : "#4B5563",
                      }}
                    >
                      {mode.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Input */}
          {inputMode === "text" && (
            <div style={{ marginTop: 20 }}>
              <label style={s.label}>DESCRIBE SYMPTOMS</label>
              <textarea
                placeholder={PLACEHOLDERS[language]}
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                style={{
                  ...s.input,
                  height: 120,
                  resize: "vertical",
                  marginTop: 6,
                }}
              />
            </div>
          )}

          {/* Speech Input */}
          {inputMode === "speech" && (
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <div
                style={{
                  borderRadius: 16,
                  padding: 32,
                  background: speech.isListening ? "#FEF2F2" : "#F9FAFB",
                  border: speech.isListening
                    ? "2px solid #FECACA"
                    : "1px solid #E5E7EB",
                }}
              >
                <button
                  onClick={() =>
                    speech.isListening
                      ? speech.stopListening()
                      : speech.startListening(language)
                  }
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    ...(speech.isListening
                      ? {
                          background:
                            "linear-gradient(135deg, #DC2626, #B91C1C)",
                          boxShadow: "0 0 30px rgba(220,38,38,0.3)",
                          animation: "pulse 1.5s infinite",
                        }
                      : {
                          background:
                            "linear-gradient(135deg, #C8102E, #8B0000)",
                          boxShadow: "var(--shadow-md)",
                        }),
                  }}
                >
                  {speech.isListening ? (
                    <Square size={20} color="#FFFFFF" />
                  ) : (
                    <Mic size={28} color="#FFFFFF" />
                  )}
                </button>
                <p
                  style={{
                    fontSize: 13,
                    color: "#4B5563",
                    marginTop: 14,
                  }}
                >
                  {speech.isListening
                    ? "Listening... tap to stop"
                    : "Tap to start recording"}
                </p>

                {speech.transcript && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 16,
                      background: "#FFFFFF",
                      borderRadius: 10,
                      textAlign: "left",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: "#0891B2",
                        marginBottom: 6,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <AudioLines size={12} color="#0891B2" />
                      ASR TRANSCRIPTION
                    </div>
                    <div
                      style={{
                        color: "#1A1A2E",
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      &ldquo;{speech.transcript}&rdquo;
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 28,
            }}
          >
            <button onClick={() => setStep(1)} style={s.secondaryBtn}>
              Back
            </button>
            <button
              onClick={handleClassify}
              disabled={textEmpty}
              style={{
                ...s.primaryBtn,
                flex: 1,
                opacity: textEmpty ? 0.4 : 1,
                pointerEvents: textEmpty ? "none" : "auto",
              }}
            >
              Classify Symptoms
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Classification Loading ──────────────────────────
  if (step === 3 && isClassifying) {
    return (
      <div style={{ ...s.container, padding: "80px 20px", textAlign: "center" }}>
        <StepIndicator current={3} />
        <div style={s.card}>
          <div style={s.spinner} />
          <h2
            style={{
              fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
              fontSize: 20,
              color: "#1A1A2E",
              marginTop: 24,
            }}
          >
            Classifying Symptoms
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "#4B5563",
              marginTop: 8,
            }}
          >
            Multilingual Transformer processing...
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            {/* Completed chips */}
            {["Text Normalization", "Subword Tokenization"].map((label) => (
              <span
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#ECFDF5",
                  color: "#059669",
                }}
              >
                <Check size={12} />
                {label}
              </span>
            ))}
            {/* Active chip */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 6,
                background: "#FFF5F5",
                color: "#C8102E",
              }}
            >
              <Loader2
                size={12}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Classification
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 4: Nurse Review ────────────────────────────────────
  if (step === 4 && classification) {
    // Success screen
    if (confirmed) {
      const dept = nurseOverride || classification.department;
      return (
        <div style={{ ...s.container, maxWidth: 560 }}>
          <StepIndicator current={4} />
          <div
            style={{
              ...s.card,
              borderColor: "#059669",
              background: "#ECFDF5",
              textAlign: "center",
            }}
          >
            <CheckCircle2 size={48} color="#059669" />
            <h2
              style={{
                fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
                fontSize: 22,
                color: "#059669",
                marginTop: 8,
              }}
            >
              Patient Queued Successfully
            </h2>
            <p
              style={{
                color: "#4B5563",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              Routed to <strong>{dept}</strong>
            </p>
          </div>
        </div>
      );
    }

    // Full review screen
    const deptColor =
      DEPT_COLORS[classification.department] || "#C8102E";
    const sortedProbs = classification.probabilities
      ? Object.entries(classification.probabilities).sort(
          (a, b) => b[1] - a[1]
        )
      : [];

    return (
      <div style={{ ...s.container, maxWidth: 620 }}>
        <StepIndicator current={4} />
        <div style={s.card}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h2 style={s.title}>Nurse Review</h2>
              <p style={s.subtitle}>
                Human-in-the-loop validation — confirm or override
              </p>
            </div>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: 11,
                background: "rgba(8,145,178,0.08)",
                color: "#0891B2",
                border: "1px solid rgba(8,145,178,0.2)",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Languages size={12} />
              {classification.detected_language || language}
            </span>
          </div>

          {/* Symptom recap */}
          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 10,
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              fontSize: 13,
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#9CA3AF",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {inputMode === "speech" ? (
                <Mic size={12} color="#9CA3AF" />
              ) : (
                <PenLine size={12} color="#9CA3AF" />
              )}
              {inputMode === "speech"
                ? "Speech \u2192 ASR Transcription"
                : "Text Input"}
            </div>
            <div
              style={{
                color: "#1A1A2E",
                marginTop: 6,
              }}
            >
              &ldquo;
              {inputMode === "speech" ? speech.transcript : symptomText}
              &rdquo;
            </div>
          </div>

          {/* Top prediction */}
          <div
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 12,
              background: deptColor + "08",
              border: `2px solid ${deptColor}4D`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: deptColor + "1F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DeptIcon
                  department={classification.department}
                  size={28}
                  color={deptColor}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  RECOMMENDED DEPARTMENT
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1A1A2E",
                    fontFamily:
                      "var(--font-dm-serif), 'DM Serif Display', serif",
                  }}
                >
                  {classification.department}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: deptColor,
                  }}
                >
                  {Math.round(classification.confidence * 100)}%
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                  }}
                >
                  Confidence
                </div>
              </div>
            </div>

            {classification.reasoning && (
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#FFFBEB",
                  fontSize: 12,
                  color: "#4B5563",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <Lightbulb
                  size={14}
                  color="#D97706"
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <span>{classification.reasoning}</span>
              </div>
            )}
          </div>

          {/* Probabilities */}
          {sortedProbs.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <label style={s.label}>
                DEPARTMENT PROBABILITIES (SOFTMAX OUTPUT)
              </label>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {sortedProbs.map(([dept, prob]) => {
                  const isTop = dept === classification.department;
                  const barColor = isTop
                    ? DEPT_COLORS[dept] || "#C8102E"
                    : "#D1D5DB";
                  return (
                    <div
                      key={dept}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 130,
                          fontSize: 11,
                          color: "#4B5563",
                          textAlign: "right",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 6,
                        }}
                      >
                        <DeptIcon
                          department={dept}
                          size={14}
                          color={isTop ? DEPT_COLORS[dept] : "#9CA3AF"}
                        />
                        {dept}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: "#F9FAFB",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${prob * 100}%`,
                            height: "100%",
                            borderRadius: 4,
                            background: barColor,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          width: 40,
                          fontSize: 11,
                          color: "#9CA3AF",
                          textAlign: "right",
                        }}
                      >
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Override */}
          <div style={{ marginTop: 24 }}>
            <label style={s.label}>
              OVERRIDE DEPARTMENT{" "}
              <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                (optional)
              </span>
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 8,
              }}
            >
              {DEPARTMENTS.filter(
                (d) => d !== classification.department
              ).map((dept) => {
                const sel = nurseOverride === dept;
                const dc = DEPT_COLORS[dept] || "#666";
                return (
                  <button
                    key={dept}
                    onClick={() =>
                      setNurseOverride(sel ? null : dept)
                    }
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      ...(sel
                        ? {
                            border: `2px solid ${dc}`,
                            background: dc + "14",
                            color: dc,
                          }
                        : {
                            border: "1px solid #E5E7EB",
                            background: "transparent",
                            color: "#9CA3AF",
                          }),
                    }}
                  >
                    <DeptIcon
                      department={dept}
                      size={14}
                      color={sel ? dc : "#9CA3AF"}
                    />
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom buttons */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 28,
            }}
          >
            <button onClick={resetForm} style={s.secondaryBtn}>
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{ ...s.primaryBtn, flex: 1 }}
            >
              {nurseOverride
                ? `Override \u2192 ${nurseOverride}`
                : `Confirm \u2192 ${classification.department}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (e.g. classification failed on step 3)
  return (
    <div style={{ ...s.container, textAlign: "center", padding: "80px 20px" }}>
      <StepIndicator current={step} />
      <div style={s.card}>
        <p style={{ fontSize: 14, color: "#4B5563" }}>
          Classification could not be completed. Please try again.
        </p>
        <button
          onClick={resetForm}
          style={{ ...s.primaryBtn, marginTop: 20 }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

// ── Shared Styles ─────────────────────────────────────────────
const s = {
  container: {
    maxWidth: 580,
    margin: "0 auto",
    padding: "40px 20px",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    padding: 28,
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 22,
    color: "#1A1A2E",
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
  },
  label: {
    display: "block",
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: 600,
    color: "#4B5563",
    letterSpacing: "0.5px",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    color: "#1A1A2E",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  ageBadge: {
    fontSize: 12,
    color: "#D97706",
    background: "#FEF3C7",
    padding: "4px 10px",
    borderRadius: 6,
    marginLeft: 12,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
  },
  vulnSelected: {
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    border: "2px solid #C8102E",
    background: "#FFF5F5",
    color: "#C8102E",
    fontWeight: 600,
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
  },
  vulnDefault: {
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    color: "#4B5563",
    fontWeight: 400,
    transition: "all 0.2s ease",
  },
  langSelected: {
    padding: "7px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    border: "2px solid #0891B2",
    background: "rgba(8,145,178,0.08)",
    color: "#0891B2",
    fontWeight: 600,
  },
  langDefault: {
    padding: "7px 16px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    border: "1px solid #E5E7EB",
    background: "transparent",
    color: "#4B5563",
  },
  modeSelected: {
    border: "2px solid #2563EB",
    background: "rgba(37,99,235,0.06)",
    color: "#1A1A2E",
  },
  modeDefault: {
    border: "1px solid #E5E7EB",
    background: "transparent",
    color: "#4B5563",
  },
  primaryBtn: {
    padding: "14px 28px",
    borderRadius: 10,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "14px 20px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "transparent",
    color: "#4B5563",
    fontSize: 14,
    cursor: "pointer",
  },
  spinner: {
    width: 56,
    height: 56,
    margin: "0 auto",
    borderRadius: "50%",
    border: "3px solid #E5E7EB",
    borderTopColor: "#C8102E",
    animation: "spin 1s linear infinite",
  },
};
