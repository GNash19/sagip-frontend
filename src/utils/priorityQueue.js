// priorityQueue.js

// w1–w5 sum to 1.0 — calibrate with SPMC OPD nurses during immersion
export const WEIGHTS = {
  confidence: 0.25,
  urgency: 0.20,
  legal: 0.25,
  age: 0.20,
  waitTime: 0.10,
};

export const DEPARTMENT_URGENCY = {
  "Internal Medicine": 0.90, // placeholder — calibrate with SPMC physicians during immersion
  "Surgery": 0.90,           // placeholder — calibrate with SPMC physicians during immersion
  "Pediatrics": 0.80,        // placeholder — calibrate with SPMC physicians during immersion
  "OB-GYN": 0.80,            // placeholder — calibrate with SPMC physicians during immersion
  "Orthopedics": 0.60,       // placeholder — calibrate with SPMC physicians during immersion
  "ENT": 0.50,               // placeholder — calibrate with SPMC physicians during immersion
  "Ophthalmology": 0.50,     // placeholder — calibrate with SPMC physicians during immersion
  "Dermatology": 0.40,       // placeholder — calibrate with SPMC physicians during immersion
};

export const AVG_WAIT_MINUTES = {
  "Internal Medicine": 45, // placeholder — replace with SPMC immersion data
  "Surgery": 40,           // placeholder — replace with SPMC immersion data
  "Pediatrics": 35,        // placeholder — replace with SPMC immersion data
  "OB-GYN": 40,            // placeholder — replace with SPMC immersion data
  "Orthopedics": 30,       // placeholder — replace with SPMC immersion data
  "ENT": 25,               // placeholder — replace with SPMC immersion data
  "Ophthalmology": 25,     // placeholder — replace with SPMC immersion data
  "Dermatology": 20,       // placeholder — replace with SPMC immersion data
};

function getAgeScore(age) {
  if (age >= 65) return 1.0;
  if (age >= 60) return 0.85;
  if (age >= 50) return 0.6;
  if (age <= 5) return 0.9;
  if (age <= 12) return 0.5;
  return age / 100;
}

// PWD excluded — all OPD patients are implicitly ill
function getLegalScore(age, vulnerabilities) {
  if (age >= 60) return 1.0; // Senior Citizen — RA 10754 + SPMC older-gets-first
  if (vulnerabilities && vulnerabilities.includes("Pregnant")) return 0.95;
  return 0.0;
}

function getDepartmentUrgency(department) {
  return DEPARTMENT_URGENCY[department] ?? 0.5;
}

function getWaitTimeScore(waitMinutes, department) {
  const avg = AVG_WAIT_MINUTES[department] ?? 30;
  return Math.min(waitMinutes / avg, 2.0);
}

export function computePriority(confidence, age, vulnerabilities, waitMinutes, department) {
  const C = confidence;
  const U = getDepartmentUrgency(department);
  const L = getLegalScore(age, vulnerabilities);
  const A = getAgeScore(age);
  const T = getWaitTimeScore(waitMinutes, department);

  const priority =
    WEIGHTS.confidence * C +
    WEIGHTS.urgency * U +
    WEIGHTS.legal * L +
    WEIGHTS.age * A +
    WEIGHTS.waitTime * T;

  return Math.round(priority * 100) / 100;
}

export function recomputeQueues(queues) {
  const now = Date.now();
  for (const dept of Object.keys(queues)) {
    const patients = queues[dept];
    for (const patient of patients) {
      const waitMinutes = (now - patient.timestamp) / 60000;
      patient.priority = computePriority(
        patient.confidence,
        patient.age,
        patient.vulnerabilities,
        waitMinutes,
        patient.department
      );
    }
    patients.sort((a, b) => b.priority - a.priority);
  }
  return queues;
}
