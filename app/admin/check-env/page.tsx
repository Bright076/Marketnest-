"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckEnvPage() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkEnv = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/check-telegram-env');
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <Link href="/admin" style={{
          color: "#16a34a",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem"
        }}>
          ← Back to Admin
        </Link>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "1rem" }}>
          🔍 Check Telegram Environment Variables
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          This will show you what environment variables Vercel can see.
        </p>

        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem"
        }}>
          <button
            onClick={checkEnv}
            disabled={checking}
            style={{
              width: "100%",
              padding: "1rem",
              background: checking ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: checking ? "not-allowed" : "pointer",
              boxShadow: checking ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}
          >
            {checking ? "Checking..." : "🔍 Check Environment Variables"}
          </button>
        </div>

        {result && (
          <div style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "2px solid #e5e7eb"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
              Environment Status:
            </h3>

            <div style={{
              background: "#f9fafb",
              padding: "1.5rem",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{ marginBottom: "0.75rem" }}>
                <strong>TELEGRAM_BOT_TOKEN:</strong>
                <br />
                <span style={{ color: result.botTokenExists ? "#16a34a" : "#ef4444" }}>
                  {result.botTokenExists ? "✅ EXISTS" : "❌ NOT FOUND"}
                </span>
                {result.botTokenExists && (
                  <span style={{ color: "#6b7280", marginLeft: "1rem" }}>
                    (Length: {result.botTokenLength} chars)
                  </span>
                )}
              </div>

              <div>
                <strong>TELEGRAM_CHAT_ID:</strong>
                <br />
                <span style={{ color: result.chatIdExists ? "#16a34a" : "#ef4444" }}>
                  {result.chatIdExists ? "✅ EXISTS" : "❌ NOT FOUND"}
                </span>
                {result.chatIdExists && (
                  <span style={{ color: "#6b7280", marginLeft: "1rem" }}>
                    (Value: {result.chatIdValue})
                  </span>
                )}
              </div>
            </div>

            {!result.botTokenExists || !result.chatIdExists ? (
              <div style={{
                background: "#fef2f2",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #fecaca"
              }}>
                <h4 style={{ color: "#991b1b", fontWeight: 700, marginBottom: "0.75rem" }}>
                  ❌ Environment Variables Missing!
                </h4>
                <p style={{ color: "#991b1b", fontSize: "0.95rem", marginBottom: "1rem" }}>
                  You need to add these in Vercel:
                </p>
                <ol style={{ color: "#991b1b", fontSize: "0.9rem", lineHeight: 1.8 }}>
                  <li>Go to Vercel Dashboard</li>
                  <li>Select your Marketnest project</li>
                  <li>Settings → Environment Variables</li>
                  <li>Add TELEGRAM_BOT_TOKEN (from @BotFather)</li>
                  <li>Add TELEGRAM_CHAT_ID (from @userinfobot)</li>
                  <li>Check "Production" environment ✅</li>
                  <li>Save</li>
                  <li><strong>REDEPLOY your application!</strong></li>
                </ol>
              </div>
            ) : (
              <div style={{
                background: "#f0fdf4",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #bbf7d0"
              }}>
                <h4 style={{ color: "#166534", fontWeight: 700, marginBottom: "0.5rem" }}>
                  ✅ Environment Variables Found!
                </h4>
                <p style={{ color: "#166534", fontSize: "0.95rem" }}>
                  Both variables are configured correctly. You can now test Telegram notifications!
                </p>
              </div>
            )}

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f9fafb", borderRadius: "8px" }}>
              <strong>Full Response:</strong>
              <pre style={{ marginTop: "0.5rem", fontSize: "0.85rem", overflow: "auto" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
