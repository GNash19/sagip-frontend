"use client";

import {
  MessageSquare,
  Languages,
  Brain,
  ListOrdered,
  ArrowRightToLine,
  Globe,
  Mic,
  Volume2,
  GitBranch,
  Building2,
  Stethoscope,
  Heart,
  Activity,
  ShieldCheck,
} from "lucide-react";
import Logo from "./Logo";

const PIPELINE_STEPS = [
  {
    icon: MessageSquare,
    label: "Input",
    desc: "Patient types or speaks symptoms in their language",
  },
  {
    icon: Languages,
    label: "Detect",
    desc: "Model identifies language and extracts clinical meaning",
  },
  {
    icon: Brain,
    label: "Classify",
    desc: "Triage level and department are assigned by the AI",
  },
  {
    icon: ListOrdered,
    label: "Queue",
    desc: "Patient gets a priority queue number in their department",
  },
  {
    icon: ArrowRightToLine,
    label: "Route",
    desc: "System routes patient to the right OPD department",
  },
];

const LANGUAGES = [
  {
    name: "Cebuano",
    color: "var(--info)",
    quote:
      "Palihug adto sa Emergency Room. Ang imong numero mao ang kwarenta y uno.",
  },
  {
    name: "English",
    color: "var(--accent-red)",
    quote:
      "Please proceed to the General OPD. Your queue number is forty-two.",
  },
  {
    name: "Filipino",
    color: "var(--warning)",
    quote:
      "Mangyaring pumunta sa Orthopedics. Ang inyong numero ay apatnapu\u2019t tatlo.",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Transformer NLP",
    desc: "Fine-tuned multilingual transformer models (mBERT, XLM-RoBERTa) understand Philippine symptom descriptions with clinical accuracy.",
  },
  {
    icon: Mic,
    title: "Speech Recognition",
    desc: "Processes spoken input across all three languages, handling code-switching and mixed dialects common in Filipino speech.",
  },
  {
    icon: Volume2,
    title: "Text-to-Speech Output",
    desc: "Announces queue numbers and department instructions aloud, improving accessibility for patients with low literacy.",
  },
  {
    icon: GitBranch,
    title: "Smart Department Routing",
    desc: "Routes patients to the correct department among 8 SPMC OPD specialties based on symptom classification.",
  },
  {
    icon: ListOrdered,
    title: "Real-Time Queue Management",
    desc: "Manages multiple department queues simultaneously with priority ordering based on age, vulnerability, and confidence.",
  },
  {
    icon: Building2,
    title: "OPD Integration",
    desc: "Designed to slot into existing SPMC OPD workflows with minimal disruption to staff and hospital operations.",
  },
];

const HERO_ICONS = [
  { Icon: Stethoscope, alt: true },
  { Icon: Heart, alt: false },
  { Icon: Brain, alt: true },
  { Icon: Activity, alt: false },
  { Icon: Mic, alt: true },
  { Icon: ListOrdered, alt: false },
  { Icon: Languages, alt: true },
  { Icon: ShieldCheck, alt: false },
  { Icon: Building2, alt: true },
];

export default function LandingPage({ onNavigate }) {
  return (
    <div>
      {/* Responsive styles for hero layout */}
      <style>{`
        .hero-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 24px;
          gap: 48px;
        }
        .hero-illustration {
          flex-shrink: 0;
          max-width: 420px;
        }
        @media (max-width: 900px) {
          .hero-row {
            flex-direction: column;
            text-align: center;
            gap: 40px;
          }
          .hero-illustration {
            max-width: 320px;
          }
        }
      `}</style>

      {/* ─── SECTION 1: Hero ─── */}
      <section style={s.heroSection}>
        <div className="hero-row">
          {/* Left column — text content */}
          <div className="animate-fade-in-up" style={{ maxWidth: 520 }}>
            <div
              style={{
                fontFamily:
                  "var(--font-dm-serif), 'DM Serif Display', serif",
                fontSize: 72,
                color: "var(--accent-red)",
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              SAGIP
            </div>
            <div
              style={{
                fontFamily:
                  "var(--font-dm-serif), 'DM Serif Display', serif",
                fontSize: 24,
                color: "var(--text-primary)",
                fontWeight: 400,
                lineHeight: 1.4,
                marginTop: 4,
              }}
            >
              Symptom Analysis and Guidance for
              <br />
              Intelligent Patient-routing
            </div>
            <p
              style={{
                fontSize: 16,
                color: "var(--text-secondary)",
                maxWidth: 560,
                lineHeight: 1.7,
                marginTop: 28,
              }}
            >
              A multilingual transformer model that classifies OPD patient
              symptoms in Cebuano, English, and Filipino — and routes them to
              the right department with intelligent queue management.
            </p>
            <button
              onClick={() => onNavigate("triage")}
              style={s.ctaButton}
            >
              Start Triage →
            </button>
          </div>

          {/* Right column — icon grid illustration */}
          <div className="hero-illustration">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
                transform: "rotate(3deg)",
              }}
              className="stagger-children"
            >
              {HERO_ICONS.map(({ Icon, alt }, i) => (
                <div
                  key={i}
                  className="hover-lift"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 18,
                    background: alt ? "#FFF5F5" : "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <Icon size={32} color="#C8102E" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: How It Works ─── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <h2 style={s.sectionTitle}>How It Works</h2>
          <p style={s.sectionSubtitle}>
            From the moment a patient speaks or types their symptoms, the
            system classifies, queues, and routes — all in seconds.
          </p>

          <div style={s.pipelineRow} className="stagger-children">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} style={s.pipelineItem}>
                  {i > 0 && <div style={s.pipelineLine} />}
                  <div style={s.pipelineContent}>
                    <div style={s.pipelineCircle}>
                      <Icon size={24} color="var(--accent-red)" />
                    </div>
                    <div style={s.pipelineLabel}>{step.label}</div>
                    <div style={s.pipelineDesc}>{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: Languages ─── */}
      <section style={{ ...s.section, background: "var(--bg-cream)" }}>
        <div style={s.sectionInner}>
          <h2 style={s.sectionTitle}>
            Speaks to Patients in Their Own Language
          </h2>
          <p style={s.sectionSubtitle}>
            The system understands and responds in the three most spoken
            languages in the Southern Philippines — so no patient is left
            confused.
          </p>

          <div style={s.langGrid} className="stagger-children">
            {LANGUAGES.map((lang) => (
              <div key={lang.name} className="hover-lift" style={s.langCard}>
                <Globe size={28} color={lang.color} />
                <div style={s.langName}>{lang.name}</div>
                <div style={s.langQuote}>{lang.quote}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: Features ─── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <h2 style={s.sectionTitle}>What the System Does</h2>
          <p style={s.sectionSubtitle}>
            Designed for real hospital conditions — noisy, fast-paced, and
            serving patients with varying levels of health literacy.
          </p>

          <div style={s.featGrid} className="stagger-children">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="hover-lift"
                  style={s.featCard}
                >
                  <Icon size={24} color="var(--accent-red)" />
                  <div style={s.featTitle}>{feat.title}</div>
                  <div style={s.featDesc}>{feat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: Footer ─── */}
      <footer style={s.footer}>
        <Logo size={32} showText={false} />
        <div
          style={{
            fontFamily:
              "var(--font-dm-serif), 'DM Serif Display', serif",
            fontSize: 18,
            color: "#FFFFFF",
            marginTop: 8,
          }}
        >
          SAGIP
        </div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            marginTop: 16,
          }}
        >
          Golosino, Nash T. &amp; Morales, Ma. Nicole B.
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            marginTop: 4,
          }}
        >
          University of the Immaculate Conception — College of Computer
          Studies
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            marginTop: 4,
          }}
        >
          BS Computer Science Thesis — 2025
        </div>
      </footer>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = {
  // Hero
  heroSection: {
    background: "var(--bg-cream)",
  },
  ctaButton: {
    marginTop: 36,
    padding: "14px 32px",
    background: "var(--accent-red)",
    color: "#FFFFFF",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },

  // Shared section
  section: {
    background: "var(--bg-primary)",
  },
  sectionInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "80px 24px",
  },
  sectionTitle: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 36,
    color: "var(--accent-red)",
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "var(--text-secondary)",
    maxWidth: 520,
    marginTop: 8,
    lineHeight: 1.6,
  },

  // Pipeline
  pipelineRow: {
    display: "flex",
    alignItems: "flex-start",
    marginTop: 48,
  },
  pipelineItem: {
    display: "flex",
    alignItems: "flex-start",
    flex: 1,
  },
  pipelineLine: {
    height: 2,
    background: "var(--border)",
    flexShrink: 0,
    width: 24,
    marginTop: 28,
    marginRight: 0,
  },
  pipelineContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    flex: 1,
  },
  pipelineCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "var(--bg-secondary)",
    border: "2px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pipelineLabel: {
    fontWeight: 600,
    fontSize: 14,
    marginTop: 12,
    color: "var(--text-primary)",
  },
  pipelineDesc: {
    fontSize: 12,
    color: "var(--text-muted)",
    maxWidth: 140,
    marginTop: 4,
    lineHeight: 1.5,
  },

  // Languages
  langGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginTop: 48,
  },
  langCard: {
    background: "#FFFFFF",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 28,
    boxShadow: "var(--shadow-card)",
  },
  langName: {
    fontWeight: 700,
    fontSize: 18,
    marginTop: 16,
    color: "var(--text-primary)",
  },
  langQuote: {
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--text-secondary)",
    marginTop: 12,
    borderLeft: "3px solid var(--accent-red)",
    paddingLeft: 12,
    lineHeight: 1.6,
  },

  // Features
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginTop: 48,
  },
  featCard: {
    background: "var(--bg-cream)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 24,
  },
  featTitle: {
    fontWeight: 700,
    fontSize: 16,
    marginTop: 14,
    color: "var(--text-primary)",
  },
  featDesc: {
    fontSize: 13,
    color: "var(--text-secondary)",
    marginTop: 8,
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    background: "#1A1A2E",
    color: "#FFFFFF",
    padding: 40,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
