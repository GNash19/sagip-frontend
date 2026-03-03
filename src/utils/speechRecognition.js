"use client";

import { useState, useRef, useEffect } from "react";

const LANGUAGE_MAP = {
  "English": "en-US",
  "Filipino": "fil-PH",
  "Cebuano": "ceb",
};

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  function startListening(language) {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.lang = LANGUAGE_MAP[language] || "en-US";
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }

  function stopListening() {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.stop();
    setIsListening(false);
  }

  return { isListening, transcript, startListening, stopListening, setTranscript };
}
