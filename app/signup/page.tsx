"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createUserProfile } from "@/lib/createProfile";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ButtonSpinner } from "../components/LoadingSpinner";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Password validation function
  const validatePassword = (pwd: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (pwd.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase || !hasLowerCase) {
      return "Password must contain both uppercase and lowercase letters";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character (!@#$%^&*...)";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Validate password as user types
    if (newPassword.length > 0) {
      const error = validatePassword(newPassword);
      setPasswordError(error);
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final password validation before submission
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      setLoading(false);
      return;
    }

    try {
      // Create auth account with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
          emailRedirectTo: undefined, // Disable email confirmation redirect
        },
      });

      if (authError) throw authError;

      console.log("Signup response:", authData); // Debug log

      if (authData.user) {
        // Create profile in profiles table
        const profileResult = await createUserProfile({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: fullName,
          phone: phone,
        });

        if (profileResult.success) {
          console.log("✅ Profile created successfully!");
        } else {
          console.warn("⚠️ Profile creation failed, but signup succeeded");
        }

        // Check if email confirmation is required
        if (authData.session) {
          // User is logged in immediately (email confirmation disabled)
          console.log("User logged in immediately with metadata:", authData.user.user_metadata);
          router.push("/dashboard");
        } else {
          // Email confirmation required
          setError("Please check your email to confirm your account before logging in.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
          padding: "3rem 2.5rem",
        }}
      >
        {/* Logo/Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}
          >
            MarketNest
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Create your account to start shopping
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.875rem 1rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          {/* Full Name Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="fullName"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Phone Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+234 800 000 0000"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
                minLength={8}
                placeholder="Min 8 characters, letters, numbers & special char"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  paddingRight: "3rem",
                  border: `2px solid ${passwordError ? "#ef4444" : "#e5e7eb"}`,
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  if (!passwordError) {
                    e.target.style.borderColor = "#16a34a";
                    e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
                  }
                }}
                onBlur={(e) => {
                  if (!passwordError) {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.2rem",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
              <div style={{ color: "#6b7280", marginBottom: "0.5rem", fontWeight: 600 }}>
                Password must contain:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ 
                  color: password.length >= 8 ? "#16a34a" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span>{password.length >= 8 ? "✓" : "○"}</span>
                  <span>At least 8 characters</span>
                </div>
                <div style={{ 
                  color: /[A-Z]/.test(password) && /[a-z]/.test(password) ? "#16a34a" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span>{/[A-Z]/.test(password) && /[a-z]/.test(password) ? "✓" : "○"}</span>
                  <span>Uppercase & lowercase letters</span>
                </div>
                <div style={{ 
                  color: /[0-9]/.test(password) ? "#16a34a" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span>{/[0-9]/.test(password) ? "✓" : "○"}</span>
                  <span>At least one number</span>
                </div>
                <div style={{ 
                  color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? "#16a34a" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <span>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "○"}</span>
                  <span>At least one special character (!@#$%...)</span>
                </div>
              </div>
            </div>

            {/* Password Error */}
            {passwordError && (
              <div style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#dc2626",
                fontSize: "0.85rem"
              }}>
                {passwordError}
              </div>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: loading ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(22, 163, 74, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(22, 163, 74, 0.3)";
              }
            }}
          >
            {loading && <ButtonSpinner />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#6b7280",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#16a34a",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </div>

        {/* Back to Home */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
