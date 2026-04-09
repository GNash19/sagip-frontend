"use client";
import { useState, useRef, useCallback } from "react";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

// Language detection markers
const CEBUANO_MARKERS = ["kaayo", "akong", "naa", "ug", "dili", "koy", "nag", "pud", "lisod", "grabe", "dughan", "tutunlan", "dalunggan"];
const FILIPINO_MARKERS = ["ako", "ang", "ko", "na", "ng", "masakit", "ulo", "tiyan", "lagnat", "hindi", "mga"];
const ENGLISH_MARKERS = ["the", "and", "my", "have", "pain", "is", "very", "with", "cannot", "difficulty", "been"];

function detectLanguage(text) {
  const words = text.toLowerCase().split(/\s+/);
  const ceb = words.filter(w => CEBUANO_MARKERS.includes(w)).length;
  const fil = words.filter(w => FILIPINO_MARKERS.includes(w)).length;
  const en = words.filter(w => ENGLISH_MARKERS.includes(w)).length;

  const hasLocal = ceb > 0 || fil > 0;
  const hasEnglish = en > 0;

  if (hasLocal && hasEnglish) return "Code-switch";
  if (ceb > fil) return "Cebuano";
  if (fil > en) return "Filipino";
  return "English";
}

export function useSpeechRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const typewriterRef = useRef(null);

  // Typewriter animation — word by word with 80ms delay
  const typewriterEffect = useCallback((text) => {
    const words = text.split(/\s+/);
    let current = "";
    let i = 0;

    const tick = () => {
      if (i < words.length) {
        current = current ? current + " " + words[i] : words[i];
        setLiveTranscript(current);
        i++;
        typewriterRef.current = setTimeout(tick, 80);
      } else {
        // Animation complete — lock final transcript
        setTranscript(text);
        setIsTranscribing(false);
      }
    };

    tick();
  }, []);

  // Send recorded audio to Gemini REST API for transcription
  const sendToGemini = useCallback(async (base64Audio, mimeType) => {
    try {
      console.log("[GEMINI] Audio size (base64 chars):", base64Audio.length);
      console.log("[GEMINI] Mime type sent:", "audio/webm");
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: "audio/webm",
                  data: base64Audio,
                }
              },
              {
                text: "Transcribe exactly what is spoken in this audio. The speaker may use Cebuano, Filipino, English, or a mix. Output ONLY the transcribed words, nothing else. No translation, no explanation, no punctuation beyond what is naturally spoken. Common Cebuano medical words: sakit (pain), dughan (chest), tiyan (stomach), ulo (head), ilong (nose), ngipon (teeth/tooth), mata (eyes), dalunggan (ears), tutunlan (throat), hilanat (fever), ubo (cough), lisod (difficulty breathing). Return ONLY the transcript text."
              }
            ]
          }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 256,
          }
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("[GEMINI] Error body:", errorBody);
        throw new Error(`Gemini API error: ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        setError("Wala nakuhaa nga teksto. Palihug sulayan pag-usab. (No speech detected. Please try again.)");
        setIsTranscribing(false);
        return;
      }

      console.log("[GEMINI] Transcript:", text);

      // Detect language from transcribed text
      setDetectedLanguage(detectLanguage(text));

      // Animate the transcript appearing word by word
      typewriterEffect(text);

    } catch (err) {
      console.error("[GEMINI] Transcription error:", err);
      setError("Adunay sayop sa transcription. Palihug sulayan pag-usab. (Transcription error. Please try again.)");
      setIsTranscribing(false);
    }
  }, [typewriterEffect]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript("");
      setLiveTranscript("");
      setDetectedLanguage(null);
      audioChunksRef.current = [];

      // Cancel any running typewriter animation
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
        typewriterRef.current = null;
      }

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

      // Use WebM/Opus — widely supported and efficient
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
        // Release microphone
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size < 1000) {
          setError("Wala nakuhaa nga audio. Palihug sulayan pag-usab. (No audio captured. Please try again.)");
          setIsTranscribing(false);
          return;
        }

        // Convert blob to base64 and send to Gemini
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result.split(",")[1];
          sendToGemini(base64Audio, "audio/webm");
        };
        reader.readAsDataURL(audioBlob);
      };

      // Collect audio in 250ms chunks
      mediaRecorder.start(250);
      setIsRecording(true);

    } catch (err) {
      console.error("[GEMINI] Microphone error:", err);
      if (err.name === "NotAllowedError") {
        setError("Wala gihatagi og permission ang mikropono. (Microphone permission denied.)");
      } else {
        setError("Dili ma-access ang mikropono. (Cannot access microphone.)");
      }
    }
  }, [sendToGemini]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsTranscribing(true);

    // Stop MediaRecorder — triggers onstop which sends to Gemini
    if (mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Stop microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  const clearTranscript = useCallback(() => {
    // Cancel any running typewriter animation
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
      typewriterRef.current = null;
    }
    setTranscript("");
    setLiveTranscript("");
    setDetectedLanguage(null);
    setError(null);
  }, []);

  return {
    isRecording,
    isTranscribing,
    transcript,
    liveTranscript,
    detectedLanguage,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    setTranscript,
  };
}
