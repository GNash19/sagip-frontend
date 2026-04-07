// SAGIP Classification Engine
// Connects to fine-tuned XLM-RoBERTa deployed on GCP Cloud Run
//
// The backend handles:
//   - Gender prefix injection ([GENDER: Male/Female] prepended to text)
//   - OB-GYN safety gate (Male patients cannot be routed to OB-GYN)
//   - Language detection
//   - Softmax probability output over 8 departments

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function classifySymptoms(text, language, patientContext) {
  try {
    const gender = patientContext?.gender ?? "Male";

    const response = await fetch(`${API_URL}/classify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,       // raw symptom text only — backend prepends gender prefix
        language: language,
        gender: gender,   // backend uses this for prefix + OB-GYN gate
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Defense-in-depth: client-side OB-GYN gate
    // Catches any edge case that slips past the backend gate
    if (gender.toLowerCase() === "male" && data.department === "OB-GYN") {
      data.department = "Internal Medicine";
      data.reasoning =
        "OB-GYN overridden: patient is Male. " + (data.reasoning || "");
    }

    return data;

  } catch (err) {
    console.error("[SAGIP] Classification error:", err);
    console.error("[SAGIP] Check that GCP Cloud Run service is running:");
    console.error(`[SAGIP] Health check: ${API_URL}/health`);
    return null;
  }
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}