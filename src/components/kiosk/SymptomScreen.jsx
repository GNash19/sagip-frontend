"use client";

import { PenLine, Mic, Square, Loader } from "lucide-react";
import { useSpeechRecording } from "@/utils/speechRecording";
import { useEffect } from "react";

export default function SymptomScreen({
  symptomText,
  inputMode,
  onChange,
  onClassify,
  onBack,
  onLanguageDetected,
  isLoading,
}) {
  const {
    isRecording, isTranscribing, transcript,
    detectedLanguage, error: speechError,
    startRecording, stopRecording,
    clearTranscript, setTranscript,
  } = useSpeechRecording();

  // Sync speech transcript and detected language to parent
  useEffect(() => {
    if (transcript && detectedLanguage) {
      onChange("symptomText", transcript);
      onLanguageDetected(detectedLanguage);
    }
  }, [transcript, detectedLanguage]);

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
            onClick={() => isRecording ? stopRecording() : startRecording()}
            disabled={isTranscribing}
            style={{
              ...s.micBtn,
              ...(isRecording
                ? {
                    background: "#C8102E",
                    border: "2px solid #C8102E",
                    animation: "pulse 1.5s infinite",
                  }
                : isTranscribing
                ? {
                    background: "#FEF3C7",
                    border: "2px solid #FDE68A",
                  }
                : {
                    background: "#FEF2F2",
                    border: "2px solid #FECACA",
                  }),
              ...(isTranscribing ? { cursor: "not-allowed" } : {}),
            }}
          >
            {isRecording ? (
              <Square size={32} color="#FFFFFF" />
            ) : isTranscribing ? (
              <Loader size={32} color="#D97706" style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Mic size={36} color="#C8102E" />
            )}
          </button>
          <p style={s.micLabel}>
            {isRecording
              ? "Nagrekord... I-tap para mohunong\n(Recording... Tap to stop)"
              : isTranscribing
              ? "Nagproseso... (Processing...)"
              : "I-tap para mag-rekord (Tap to record)"}
          </p>

          {/* Error display */}
          {speechError && (
            <div style={s.speechError}>
              {speechError}
              <button onClick={clearTranscript} style={s.tryAgainLink}>
                Sulayan pag-usab (Try again)
              </button>
            </div>
          )}

          {transcript && (
            <div style={s.transcriptBox}>
              <div style={s.transcriptLabel}>
                Nakuha nga teksto (Captured text):
              </div>
              <div style={s.transcriptText}>
                &ldquo;{transcript}&rdquo;
              </div>
              {/* Detected language indicator */}
              {detectedLanguage && (
                <div style={s.detectedLang}>
                  Nadiskobreng Sinultian (Detected Language): {detectedLanguage}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
  speechError: {
    background: "#FEF2F2",
    color: "#DC2626",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginTop: 12,
    lineHeight: 1.5,
  },
  tryAgainLink: {
    display: "block",
    marginTop: 6,
    background: "none",
    border: "none",
    color: "#DC2626",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "inherit",
    padding: 0,
  },
  detectedLang: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 8,
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
