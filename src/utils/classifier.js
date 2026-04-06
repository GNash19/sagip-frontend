// SAGIP Classification Engine
// Connects to fine-tuned XLM-RoBERTa running on Google Colab via ngrok
//
// How it works:
//   1. Colab runs FastAPI server with the trained model on port 8000
//   2. ngrok tunnels that port to a public URL
//   3. This file calls that public URL from the browser
//   4. Model returns classification results
//   5. Next.js displays them in the UI

// ⚠️ REPLACE THIS with your actual ngrok URL from Colab Cell 5
// It looks like: https://a1b2-34-56-78-90.ngrok-free.app
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function classifySymptoms(text, language, patientContext) {
  try {
    // Build enriched text with patient context for gender-aware routing
    let enrichedText = text;
    if (patientContext) {
      const flags = patientContext.vulnerabilities.length > 0
        ? patientContext.vulnerabilities.join(", ")
        : "None";
      enrichedText =
        `Patient context: ${patientContext.age}-year-old ${patientContext.gender} patient.\n` +
        `Priority flags: ${flags}.\n` +
        `OB-GYN department is only appropriate for Female patients. Do not route Male patients to OB-GYN under any circumstances.\n` +
        `Symptom description: ${text}`;
    }

    const response = await fetch(`${API_URL}/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // This header is REQUIRED for free ngrok — bypasses the browser warning page
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        text: enrichedText,
        language: language,
        patient_context: patientContext || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (err) {
    console.error("Classification error:", err);
    console.error("Troubleshooting:");
    console.error("  1. Is your Colab notebook running? (Cell 5 must be active)");
    console.error("  2. Is the ngrok URL correct in classifier.js?");
    console.error("  3. Check Colab output for the latest ngrok URL");
    return null;
  }
}

// Optional: health check function to test connection
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}
