"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ClearSessionPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"clearing" | "success" | "error">("clearing");

  useEffect(() => {
    clearSession();
  }, []);

  const clearSession = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear all local storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      setStatus("success");
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error('Error clearing session:', error);
      setStatus("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb"
    }}>
      <div style={{
        background: "#ffffff",
        padding: "3rem",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        textAlign: "center",
        maxWidth: "500px"
      }}>
        {status === "clearing" && (
          <>
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1.5rem"
            }} />
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
              Clearing Session...
            </h1>
            <p style={{ color: "#6b7280" }}>
              Removing invalid tokens and clearing storage
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: "80px",
              height: "80px",
              background: "#dcfce7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2.5rem"
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a", marginBottom: "0.5rem" }}>
              Session Cleared!
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              All tokens and storage have been cleared. Redirecting to home...
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Go to Home
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: "80px",
              height: "80px",
              background: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "2.5rem"
            }}>
              ✗
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#dc2626", marginBottom: "0.5rem" }}>
              Error Clearing Session
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
              Please try manually clearing your browser cache and cookies
            </p>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Go to Home
            </button>
          </>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    </div>
  );
}
