const WEIGHTS = {
  confidence: 0.25,
  age: 0.30,
  vulnerability: 0.30,
  waitTime: 0.15,
};

function getAgeScore(age) {
  if (age >= 65) return 1.0;
  if (age >= 60) return 0.85;
  if (age >= 50) return 0.6;
  if (age <= 5) return 0.9;
  if (age <= 12) return 0.5;
  return age / 100;
}

function getVulnerabilityScore(vulnerabilities) {
  if (!vulnerabilities || vulnerabilities.length === 0) return 0;

  const scores = vulnerabilities.map((v) => {
    if (v === "Senior Citizen") return 1.0;
    if (v === "PWD") return 1.0;
    if (v === "Pregnant") return 0.95;
    return 0;
  });

  return Math.max(...scores);
}

function getWaitTimeScore(waitMinutes) {
  return Math.min(waitMinutes / 60, 1.0);
}

export function computePriority(confidence, age, vulnerabilities, waitMinutes) {
  const ageScore = getAgeScore(age);
  const vulnScore = getVulnerabilityScore(vulnerabilities);
  const waitScore = getWaitTimeScore(waitMinutes);

  const priority =
    confidence * WEIGHTS.confidence +
    ageScore * WEIGHTS.age +
    vulnScore * WEIGHTS.vulnerability +
    waitScore * WEIGHTS.waitTime;

  return Math.round(priority * 100) / 100;
}
