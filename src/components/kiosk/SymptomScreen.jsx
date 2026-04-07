"use client";

import { PenLine, Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/utils/speechRecognition";
import { useEffect } from "react";

export default function SymptomScreen({
  symptomText,
  inputMode,
  language,
  onChange,
  onClassify,
  onBack,
  isLoading,
}) {
  const speech = useSpeechRecognition();

  // Sync speech transcript to parent symptomText
  useEffect(() => {
    if (inputMode === "speech" && speech.transcript) {
      onChange("symptomText", speech.transcript);
    }
  }, [speech.transcript, inputMode]);

  const textEmpty = !symptomText.trim();

  return (
    <div style={s.container}>
      <p style={s.step}>Lakang 2 sa 3 (Step 2 of 3)</p>
      <h2 style={s.title}>Imong mga Sintomas (Your Symptoms)</h2>

      {/* Input Mode Selector */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { id: "text", Icon: PenLine, label: "I-type (Type)", sub: "(Type your symptoms)" },
          { id: "speech", Icon: Mic, label: "I-rekord (Record)", sub: "(Record your voice)" },
        ].map((mode) => {
          const sel = inputMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange("inputMode", mode.id)}
              style={{
                ...s.modeCard,
                ...(sel
                  ? { border: "2px solid #C8102E", background: "#FFF5F5" }
                  : { border: "1px solid #E5E7EB", background: "#FFFFFF" }),
              }}
            >
              <mode.Icon size={28} color={sel ? "#C8102E" : "#9CA3AF"} />
              <div style={{ fontSize: 15, fontWeight: 600, color: sel ? "#C8102E" : "#4B5563", marginTop: 6 }}>
                {mode.label}
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                {mode.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Text Mode */}
      {inputMode === "text" && (
        <textarea
          placeholder="Isulat dinhi ang imong mga sintomas...&#10;(Write your symptoms here...)"
          rows={6}
          value={symptomText}
          onChange={(e) => onChange("symptomText", e.target.value)}
          style={s.textarea}
        />
      )}

      {/* Speech Mode */}
      {inputMode === "speech" && (
        <div style={s.speechContainer}>
          <button
            onClick={() =>
              speech.isListening
                ? speech.stopListening()
                : speech.startListening(language)
            }
            style={{
              ...s.micBtn,
              ...(speech.isListening
                ? {
                    background: "#C8102E",
                    border: "2px solid #C8102E",
                    animation: "pulse 1.5s infinite",
                  }
                : {
                    background: "#FEF2F2",
                    border: "2px solid #FECACA",
                  }),
            }}
          >
            {speech.isListening ? (
              <Square size={32} color="#FFFFFF" />
            ) : (
              <Mic size={36} color="#C8102E" />
            )}
          </button>
          <p style={s.micLabel}>
            {speech.isListening
              ? "Nagpaminaw... (Listening...)\nI-tap para mohunong (Tap to stop)"
              : "I-tap para mag-rekord (Tap to record)"}
          </p>
          {speech.transcript && (
            <div style={s.transcriptBox}>
              <div style={s.transcriptLabel}>
                Nakuha nga teksto (Captured text):
              </div>
              <div style={s.transcriptText}>
                &ldquo;{speech.transcript}&rdquo;
              </div>
            </div>
          )}
        </div>
      )}

      {/* Language Selector */}
      <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
        {["Cebuano", "Filipino", "English", "Code-switch"].map((lang) => {
          const sel = language === lang;
          return (
            <button
              key={lang}
              onClick={() => onChange("language", lang)}
              style={{
                ...s.langPill,
                ...(sel
                  ? { background: "#C8102E", color: "#FFFFFF", border: "1px solid #C8102E" }
                  : { background: "#F9FAFB", color: "#4B5563", border: "1px solid #E5E7EB" }),
              }}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* Classify Button */}
      <button
        onClick={onClassify}
        disabled={textEmpty || isLoading}
        style={{
          ...s.classifyBtn,
          opacity: textEmpty || isLoading ? 0.5 : 1,
          pointerEvents: textEmpty || isLoading ? "none" : "auto",
        }}
      >
        {isLoading ? "Nagproseso... (Processing...)" : "I-classify (Classify)"}
      </button>

      {/* Back Button */}
      <button onClick={() => onBack("info")} style={s.backBtn}>
        &larr; Balik (Back)
      </button>
    </div>
  );
}

const s = {
  container: {
    padding: "32px 0",
  },
  step: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 24,
    color: "#1A1A2E",
    margin: 0,
    marginBottom: 24,
  },
  modeCard: {
    flex: 1,
    padding: "20px 16px",
    borderRadius: 14,
    cursor: "pointer",
    textAlign: "center",
    fontFamily: "inherit",
    background: "none",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    color: "#1A1A2E",
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
    resize: "none",
    lineHeight: 1.6,
  },
  speechContainer: {
    textAlign: "center",
    padding: 24,
    borderRadius: 16,
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
  },
  micBtn: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  micLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 14,
    whiteSpace: "pre-line",
    lineHeight: 1.5,
  },
  transcriptBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    textAlign: "left",
  },
  transcriptLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: 6,
  },
  transcriptText: {
    fontSize: 15,
    color: "#1A1A2E",
    lineHeight: 1.6,
  },
  langPill: {
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  classifyBtn: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 28,
  },
  backBtn: {
    display: "block",
    margin: "16px auto 0",
    background: "none",
    border: "none",
    color: "#6B7280",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
