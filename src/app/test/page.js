"use client";

import { useState } from "react";
import { classifySymptoms, checkHealth } from "@/utils/classifier";

const TEST_CASES = [
  { text: "I have severe chest pain and difficulty breathing", lang: "English", expect: "Internal Medicine" },
  { text: "Masakit ang tuhod ko at hindi na ako makalakad", lang: "Filipino", expect: "Orthopedics" },
  { text: "Sakit kaayo akong dughan ug lisod ko mogininhawa", lang: "Cebuano", expect: "Internal Medicine" },
  { text: "May rashes ako that's spreading all over my body na", lang: "Code-switch", expect: "Dermatology" },
  { text: "My child has high fever for 3 days and keeps vomiting", lang: "English", expect: "Pediatrics" },
  { text: "Lumabo na ang paningin ko at hindi na ako makakita ng malinaw", lang: "Filipino", expect: "Ophthalmology" },
  { text: "Sobrang sakit ng lalamunan ko at hirap akong lumunok", lang: "Filipino", expect: "ENT" },
  { text: "Nahulog ako and I think nabali ang arm ko", lang: "Code-switch", expect: "Orthopedics" },
];

export default function TestPage() {
  const [status, setStatus] = useState("idle");
  const [healthResult, setHealthResult] = useState(null);
  const [classifyResult, setClassifyResult] = useState(null);
  const [error, setError] = useState(null);

  const testHealth = async () => {
    setStatus("checking health...");
    setError(null);
    try {
      const result = await checkHealth();
      if (result) {
        setHealthResult(result);
        setStatus("health OK \u2705");
      } else {
        setStatus("health FAILED \u274C");
        setError("checkHealth() returned null. Is Colab Cell 5 running?");
      }
    } catch (err) {
      setStatus("health FAILED \u274C");
      setError(err.message);
    }
  };

  const testClassify = async (text, lang) => {
    setStatus(`classifying: "${text.slice(0, 40)}..."`);
    setError(null);
    try {
      const result = await classifySymptoms(text, lang);
      if (result) {
        setClassifyResult(result);
        setStatus("classification OK \u2705");
      } else {
        setStatus("classification FAILED \u274C");
        setError("classifySymptoms() returned null. Check browser console for details.");
      }
    } catch (err) {
      setStatus("classification FAILED \u274C");
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>{"\uD83E\uDDEA"} SAGIP Connection Test</h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
        This page tests the full pipeline: Next.js → ngrok → Colab → XLM-RoBERTa → response
      </p>

      {/* Status bar */}
      <div style={{
        padding: "12px 16px", borderRadius: 8, marginBottom: 24,
        background: status.includes("\u2705") ? "#f0fdf4" : status.includes("\u274C") ? "#fef2f2" : "#f8fafc",
        border: `1px solid ${status.includes("\u2705") ? "#bbf7d0" : status.includes("\u274C") ? "#fecaca" : "#e2e8f0"}`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Status: {status}</div>
        {error && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>Error: {error}</div>}
      </div>

      {/* Step 1: Health Check */}
      <h2 style={{ fontSize: 18, marginBottom: 4 }}>Step 1: Health Check</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>Tests if the Colab API is reachable.</p>
      <button
        onClick={testHealth}
        style={{
          padding: "10px 20px", borderRadius: 8, border: "1px solid #2563eb",
          background: "#2563eb", color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600,
        }}
      >
        Test /health endpoint
      </button>
      {healthResult && (
        <pre style={{
          marginTop: 12, padding: 16, background: "#f1f5f9", borderRadius: 8,
          fontSize: 12, overflow: "auto",
        }}>
          {JSON.stringify(healthResult, null, 2)}
        </pre>
      )}

      {/* Step 2: Classification Tests */}
      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 4 }}>Step 2: Classification Tests</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
        Tests actual model inference across all 3 languages + code-switch.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {TEST_CASES.map((test, i) => (
          <button
            key={i}
            onClick={() => testClassify(test.text, test.lang)}
            style={{
              padding: "8px 16px", textAlign: "left", cursor: "pointer",
              background: "white", border: "1px solid #ddd", borderRadius: 8, fontSize: 13,
            }}
          >
            <strong>[{test.lang}]</strong>{" "}
            {test.text.length > 60 ? test.text.slice(0, 60) + "..." : test.text}
            {" → expect: "}<em>{test.expect}</em>
          </button>
        ))}
      </div>

      {/* Classification Result */}
      {classifyResult && (
        <div style={{
          marginTop: 16, padding: 20, background: "#f0fdf4",
          border: "1px solid #bbf7d0", borderRadius: 12,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#059669" }}>
            {"\u2705"} Result: {classifyResult.department} ({(classifyResult.confidence * 100).toFixed(1)}%)
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
            Language: {classifyResult.detected_language}
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
            Reasoning: {classifyResult.reasoning}
          </div>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer", fontSize: 13, color: "#2563eb" }}>Full probabilities</summary>
            <pre style={{
              marginTop: 8, padding: 12, background: "#f1f5f9",
              borderRadius: 8, fontSize: 12,
            }}>
              {JSON.stringify(classifyResult.probabilities, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Troubleshooting */}
      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 8 }}>Troubleshooting</h2>
      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
        <p>
          <strong>Health check fails:</strong><br />
          → Is Colab Cell 5 actively running? (should show uvicorn logs)<br />
          → Did you replace API_URL in src/utils/classifier.js with your actual ngrok URL?<br />
          → Try opening your ngrok URL directly in browser: paste it + /health<br />
          → ngrok URL changes every restart — check Colab Cell 5 output for the latest one
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Health works but classification fails:</strong><br />
          → Open browser console (F12) and check for CORS or network errors<br />
          → Make sure the Colab model finished training (Cell 3 completed)
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Getting HTML instead of JSON:</strong><br />
          → The &quot;ngrok-skip-browser-warning&quot; header is missing in classifier.js
        </p>
      </div>

      {/* Warning footer */}
      <div style={{
        marginTop: 32, padding: "12px 16px", borderRadius: 8,
        background: "#fef3c7", border: "1px solid #fde68a", fontSize: 13, color: "#92400e",
      }}>
        {"\u26A0\uFE0F"} Remember: Delete this test page (src/app/test/) before your presentation.
      </div>
    </div>
  );
}
