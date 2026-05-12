"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      setResult({
        success: !error,
        session: data.session,
        error: error?.message,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const testSignup = async () => {
    setLoading(true);
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "test123456";
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: "Test User",
            phone: "+234 800 000 0000",
          },
        },
      });
      
      setResult({
        success: !error,
        testEmail,
        user: data.user,
        session: data.session,
        metadata: data.user?.user_metadata,
        error: error?.message,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      setResult({
        success: !error,
        user: data.user,
        metadata: data.user?.user_metadata,
        email: data.user?.email,
        error: error?.message,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        Supabase Auth Test Page
      </h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          Test Connection
        </button>

        <button
          onClick={testSignup}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          Test Signup
        </button>

        <button
          onClick={getCurrentUser}
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          Get Current User
        </button>
      </div>

      {loading && (
        <div style={{ padding: "1rem", background: "#f3f4f6", borderRadius: "8px" }}>
          Loading...
        </div>
      )}

      {result && !loading && (
        <div
          style={{
            padding: "1.5rem",
            background: result.success ? "#f0fdf4" : "#fef2f2",
            border: `2px solid ${result.success ? "#16a34a" : "#dc2626"}`,
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: result.success ? "#16a34a" : "#dc2626",
            }}
          >
            {result.success ? "✅ Success" : "❌ Error"}
          </h2>
          <pre
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "0.875rem",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#fef3c7",
          border: "2px solid #f59e0b",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          ⚠️ Important Notes:
        </h3>
        <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
          <li>Check browser console for detailed logs</li>
          <li>Verify your Supabase URL and Anon Key in .env.local</li>
          <li>Make sure email confirmation is disabled in Supabase settings</li>
          <li>The anon key should start with "eyJ" (JWT format)</li>
          <li>After signup, check if user_metadata contains full_name and phone</li>
        </ul>
      </div>
    </div>
  );
}
