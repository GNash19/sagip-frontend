"use client";

import { useState, useCallback } from "react";
import { classifySymptoms } from "@/utils/classifier";
import WelcomeScreen from "@/components/kiosk/WelcomeScreen";
import InfoScreen from "@/components/kiosk/InfoScreen";
import SymptomScreen from "@/components/kiosk/SymptomScreen";
import ResultScreen from "@/components/kiosk/ResultScreen";
import TicketScreen from "@/components/kiosk/TicketScreen";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const INITIAL_STATE = {
  name: "",
  age: "",
  gender: "",
  isPregnant: false,
  symptomText: "",
  inputMode: "text",
  language: "Cebuano",
};

export default function KioskPage() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [patientInfo, setPatientInfo] = useState(INITIAL_STATE);
  const [result, setResult] = useState(null);
  const [patientRecord, setPatientRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generic field updater
  const handleChange = useCallback((field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Navigate between screens
  const handleNext = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  // Reset everything back to welcome
  const handleReset = useCallback(() => {
    setPatientInfo(INITIAL_STATE);
    setResult(null);
    setPatientRecord(null);
    setCurrentScreen("welcome");
  }, []);

  // Classify symptoms via API
  const handleClassify = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await classifySymptoms(
        patientInfo.symptomText,
        patientInfo.language,
        { gender: patientInfo.gender }
      );
      if (res) {
        setResult(res);
        setCurrentScreen("result");
      }
    } finally {
      setIsLoading(false);
    }
  }, [patientInfo.symptomText, patientInfo.language, patientInfo.gender]);

  // Confirm and POST to backend
  const handleConfirm = useCallback(async () => {
    if (!result) return;
    setIsLoading(true);
    try {
      const ageNum = parseInt(patientInfo.age);

      // Auto-derive vulnerabilities
      const vulnerabilities = [];
      if (!isNaN(ageNum) && ageNum >= 60) vulnerabilities.push("Senior Citizen");
      if (!isNaN(ageNum) && ageNum > 0 && ageNum < 12) vulnerabilities.push("Pediatric");
      if (patientInfo.isPregnant && patientInfo.gender === "Female") vulnerabilities.push("Pregnant");

      const body = {
        name: patientInfo.name,
        age: ageNum,
        gender: patientInfo.gender,
        vulnerabilities,
        department: result.department,
        confidence: result.confidence,
        probabilities: result.probabilities || {},
        language: patientInfo.language,
        input_mode: patientInfo.inputMode,
        symptom_text: patientInfo.symptomText,
      };

      console.log("[KIOSK] POST /patients body:", body);
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("[KIOSK] POST /patients response:", data);
        setPatientRecord(data);
      } else {
        console.error("[KIOSK] POST /patients failed:", response.status, await response.text());
      }

      // Build patientInfo object with vulnerabilities for TicketScreen
      setPatientInfo((prev) => ({ ...prev, vulnerabilities }));
      setCurrentScreen("ticket");
    } finally {
      setIsLoading(false);
    }
  }, [result, patientInfo]);

  return (
    <div style={s.wrapper}>
      <div style={s.inner}>
        {currentScreen === "welcome" && (
          <WelcomeScreen onStart={() => handleNext("info")} />
        )}
        {currentScreen === "info" && (
          <InfoScreen
            name={patientInfo.name}
            age={patientInfo.age}
            gender={patientInfo.gender}
            isPregnant={patientInfo.isPregnant}
            onChange={handleChange}
            onNext={handleNext}
          />
        )}
        {currentScreen === "symptom" && (
          <SymptomScreen
            symptomText={patientInfo.symptomText}
            inputMode={patientInfo.inputMode}
            language={patientInfo.language}
            onChange={handleChange}
            onClassify={handleClassify}
            onBack={handleNext}
            isLoading={isLoading}
          />
        )}
        {currentScreen === "result" && result && (
          <ResultScreen
            result={result}
            patientInfo={patientInfo}
            onConfirm={handleConfirm}
            onBack={handleNext}
            isLoading={isLoading}
          />
        )}
        {currentScreen === "ticket" && (
          <TicketScreen
            patientRecord={patientRecord}
            patientInfo={patientInfo}
            result={result}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
  },
  inner: {
    width: "100%",
    maxWidth: 520,
    padding: "0 24px",
  },
};
