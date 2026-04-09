"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";

export default function NurseLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.push("/nurse");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/nurse");
    } catch (err) {
      const code = err.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Sayop ang email o password. (Wrong email or password.)");
      } else if (code === "auth/too-many-requests") {
        setError("Daghang pagsulay. Palihug hulata. (Too many attempts. Please wait.)");
      } else {
        setError("Adunay sayop sa pag-login. (Login error occurred.)");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && email.trim() && password.trim() && !isLoading) {
      handleLogin();
    }
  };

  const canLogin = email.trim() && password.trim() && !isLoading;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Logo size={48} showText={false} />
        </div>
        <h1 style={s.title}>SAGIP</h1>
        <p style={s.subtitle}>Nurse Station</p>
        <div style={s.divider} />

        <div onKeyDown={handleKeyDown}>
          {/* Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="nurse@spmc.doh.gov.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={s.input}
            />
          </div>

          {/* Password */}
          <div style={s.fieldGroup}>
            <label style={s.label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...s.input, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={s.eyeBtn}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#9CA3AF" />
                ) : (
                  <Eye size={18} color="#9CA3AF" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div style={s.errorBox}>{error}</div>}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!canLogin}
            style={{
              ...s.loginBtn,
              opacity: canLogin ? 1 : 0.5,
              pointerEvents: canLogin ? "auto" : "none",
            }}
          >
            {isLoading ? "Nagproseso... (Processing...)" : "Mag-login (Login)"}
          </button>
        </div>

        <p style={s.note}>
          Para sa authorized medical staff lamang.
          <br />
          (For authorized medical staff only.)
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#FFFFFF",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "1px solid #E5E7EB",
    padding: 40,
  },
  title: {
    fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif",
    fontSize: 28,
    color: "#1A1A2E",
    textAlign: "center",
    margin: "8px 0 0",
  },
  subtitle: {
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    margin: "4px 0 0",
  },
  divider: {
    height: 1,
    background: "#E5E7EB",
    margin: "24px 0",
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#4B5563",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    background: "#F9FAFB",
    color: "#1A1A2E",
    fontSize: 16,
    fontFamily: "inherit",
    outline: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
  },
  errorBox: {
    background: "#FEF2F2",
    color: "#DC2626",
    fontSize: 13,
    borderRadius: 8,
    padding: "10px 14px",
    marginTop: 8,
    marginBottom: 8,
  },
  loginBtn: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    border: "none",
    background: "#C8102E",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 8,
  },
  note: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 1.5,
  },
};
