# CLAUDE.md — SAGIP-triage Project

## Project Identity
SAGIP (Symptom Analysis and Guidance for Intelligent Patient-routing) is a multilingual
OPD triage support system for Southern Philippines Medical Center (SPMC), Davao City.
It classifies patient symptom descriptions in English, Filipino, Cebuano, and code-switched
variants into eight OPD departments and manages priority queues using a weighted
scheduling algorithm.

- **Framework:** Next.js 16.1.6 (App Router, JavaScript — no TypeScript)
- **React:** 19.2.3
- **Styling:** Plain CSS with CSS variables (no Tailwind)
- **Fonts:** DM Sans (300–700) + DM Serif Display (400) via `next/font/google`
- **Project root:** `sagip-triage/`

## Dev Server
```bash
cd sagip-triage && npm run dev
```
Runs on http://localhost:3000

## Architecture

### Folder Structure
```
sagip-triage/src/
├── app/
│   ├── layout.js          # Root layout — fonts, metadata
│   ├── globals.css         # CSS reset, theme variables, animations
│   └── page.js             # "use client" — main app entry
├── components/
│   ├── Header.jsx          # "use client"
│   ├── TriageView.jsx      # "use client"
│   ├── QueueView.jsx       # "use client"
│   ├── AboutView.jsx       # Server component (no "use client")
│   └── StepIndicator.jsx   # "use client"
├── utils/
│   ├── classifier.js       # classifySymptoms() — Anthropic Messages API
│   ├── priorityQueue.js    # computePriority() — priority scheduling
│   └── speechRecognition.js # useSpeechRecognition() hook — Web Speech API
└── constants/
    └── departments.js      # DEPARTMENTS, DEPT_ICONS, DEPT_COLORS
```

### Key Utilities

**`classifier.js`** — `classifySymptoms(text, language)` async function. Calls Anthropic API (`claude-sonnet-4-20250514`) to classify symptoms into 1 of 8 departments. Returns `{ department, confidence, probabilities, reasoning, detected_language }` or `null` on error. No API key header — auth handled by deployment environment.

**`priorityQueue.js`** — `computePriority(confidence, age, vulnerabilities, waitMinutes)`. Weighted scoring: confidence 0.25, age 0.30, vulnerability 0.30, waitTime 0.15. Implements SPMC age rules and Philippine law (RA 7277, RA 9442, RA 10754) vulnerability scoring. Starvation prevention via wait-time aging.

**`speechRecognition.js`** — `useSpeechRecognition()` React hook. Browser Web Speech API with SSR safety. Supports English (`en-US`), Filipino (`fil-PH`), Cebuano (`ceb`). Returns `{ isListening, transcript, startListening, stopListening, setTranscript }`.

**`departments.js`** — 8 departments: Internal Medicine, Surgery, Pediatrics, OB-GYN, Orthopedics, Ophthalmology, ENT, Dermatology. Each with emoji icon and hex color.

## Queue Management — Authoritative Rules

### Formula
P = w1*C + w2*U + w3*L + w4*A + w5*T

All five components are required. Weights sum to 1.0.

Current placeholder weights (in priorityQueue.js WEIGHTS constant):
  w1 (confidence):   0.25
  w2 (urgency):      0.20
  w3 (legal):        0.25
  w4 (age):          0.20
  w5 (waitTime):     0.10

### C — Classification Confidence
Raw softmax probability from the classifier (0.0–1.0). Passed in directly.

### U — Department Urgency Tier
Lookup per department. Placeholder values (to be calibrated with SPMC physicians):
  Internal Medicine: 0.90
  Surgery:           0.90
  Pediatrics:        0.80
  OB-GYN:            0.80
  Orthopedics:       0.60
  ENT:               0.50
  Ophthalmology:     0.50
  Dermatology:       0.40

### L — Legal/Institutional Modifier
Only two groups qualify:
  Senior Citizen (age >= 60): 1.0   — RA 10754 + SPMC older-gets-first rule
  Pregnant:                   0.95  — RA 10754 / SPMC policy
  All others:                 0.0

PWD is NOT a separate legal modifier. Every OPD patient is implicitly ill.
Remove PWD from vulnerability scoring entirely.

### A — Age Vulnerability Score (SPMC older-gets-first rule)
  age >= 65:  1.0
  age >= 60:  0.85
  age >= 50:  0.60
  age <= 5:   0.90   (pediatric, elevated risk)
  age <= 12:  0.50
  all others: age / 100

### T — Wait Time Factor (normalized, not raw minutes)
  T = elapsed_minutes / AVG_WAIT_MINUTES[department]
  Clamped to max 2.0 to prevent runaway boosting.

Historical average wait times in minutes (placeholder until SPMC immersion):
  Internal Medicine: 45
  Surgery:           40
  Pediatrics:        35
  OB-GYN:            40
  Orthopedics:       30
  ENT:               25
  Ophthalmology:     25
  Dermatology:       20

### Queue structure (client-side, page.js)
- queues: object keyed by department name, value is an array of patient objects
- Array is kept sorted by priority descending after every insertion or recomputation
- No heapq — plain JS array sorted with .sort() after each mutation
- Patient object shape expected by QueueView.jsx:
    id, name, age, department, confidence, priority, timestamp (ms),
    vulnerabilities (array of strings), language, inputMode, overridden (bool)

### Serve
Removes index 0 of the selected department array (highest priority patient).

### Override
Removes patient from old department array, recomputes priority with new
department's U and T values, inserts into new department array, re-sorts.

### Aging (wait time recomputation)
priority and T are recomputed live. QueueView reads (Date.now() - patient.timestamp)
for display. A periodic recomputation of priority scores (every 60s) re-sorts queues.

### PWD removal reminder
getVulnerabilityScore in priorityQueue.js must not score PWD.
The vulnerabilities array on a patient object may still contain the string "PWD"
if the nurse entered it, but it contributes 0 to L. Remove the PWD branch entirely.

### Theme (CSS Variables)
Defined in `globals.css` under `:root`. Key tokens:
- `--primary: #2563eb` (blue), `--primary-hover`, `--primary-light`, `--primary-dark`
- Status: `--success`, `--warning`, `--danger` (each with `-light` variant)
- Backgrounds: `--bg-primary: #f8fafc`, `--bg-secondary`, `--bg-tertiary`
- Text: `--text-primary: #0f172a`, `--text-secondary`, `--text-tertiary`, `--text-inverse`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Fonts: `--font-sans` (DM Sans), `--font-serif` (DM Serif Display)

## Conventions
- JavaScript only — no TypeScript files
- Components use `.jsx` extension, utilities use `.js`
- Client components must have `"use client";` directive at top
- `AboutView.jsx` is the only server component
- Import alias: `@/*` maps to `src/*`
- Do not modify component files when working on utilities, and vice versa, unless explicitly told to

## Current Status
- **Phase 1:** Project scaffolding, theming, fonts, folder structure — COMPLETE
- **Phase 2:** Constants & utilities (departments, priorityQueue, speechRecognition, classifier) — COMPLETE
- **Next:** Phase 3 — Component implementation

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

