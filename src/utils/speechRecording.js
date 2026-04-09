"use client";
import { useState, useRef, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||
  "https://sagip-backend-851223561042.asia-southeast1.run.app";

export function useSpeechRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript("");
      setDetectedLanguage(null);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;

      // Use WebM/Opus format — what Google Speech-to-Text expects
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size < 1000) {
          setError("Wala nakuhaa nga audio. Palihug sulayan pag-usab. (No audio captured. Please try again.)");
          setIsTranscribing(false);
          return;
        }

        // Send to backend /transcribe endpoint
        setIsTranscribing(true);
        try {
          const response = await fetch(`${API_URL}/transcribe`, {
            method: "POST",
            headers: {
              "Content-Type": "audio/webm",
            },
            body: audioBlob,
          });

          if (!response.ok) {
            throw new Error(`Transcription failed: ${response.status}`);
          }

          const data = await response.json();

          if (data.success && data.transcript) {
            setTranscript(data.transcript);
            setDetectedLanguage(data.detected_language);
          } else {
            setError(data.message || "Wala nakuhaa nga teksto. (No speech detected.)");
          }
        } catch (err) {
          console.error("[SPEECH] Transcription error:", err);
          setError("Adunay sayop sa transcription. Palihug sulayan pag-usab. (Transcription error. Please try again.)");
        } finally {
          setIsTranscribing(false);
        }
      };

      // Collect audio in 250ms chunks
      mediaRecorder.start(250);
      setIsRecording(true);

    } catch (err) {
      console.error("[SPEECH] Microphone error:", err);
      if (err.name === "NotAllowedError") {
        setError("Wala gihatagi og permission ang mikropono. (Microphone permission denied.)");
      } else {
        setError("Dili ma-access ang mikropono. (Cannot access microphone.)");
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive") {
      setIsRecording(false);
      mediaRecorderRef.current.stop();
      // isTranscribing will be set to true in onstop handler
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setDetectedLanguage(null);
    setError(null);
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    detectedLanguage,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    setTranscript,
  };
}
