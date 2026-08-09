"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestTelegramPage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testTelegram = async () => {
    setTesting(true);
    setResult(null);

    try {
      const testPayload = {
        orders: [
          {
            id: "test-order-123",
            product_id: "test-product",
            quantity: 1
          }
        ],
        customerInfo: {
          name: "Test Customer",
          email: "test@example.com",
          phone: "+1234567890"
        },
        deliveryInfo: {
          address: "123 Test Street",
          city: "Test City",
          state: "Test State",
          country: "Test Country",
          postalCode: "12345",
          notes: "This is a test notification"
        },
        totalAmount: 99.99,
        currency: "USD"
      };

      const response = await fetch('/api/telegram-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      const data = await response.json();
      
      setResult({
        success: response.ok,
        status: response.status,
        data: data
      });

    } catch (error: any) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setTesting(false);
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
          🧪 Test Telegram Notifications
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          This will send a test notification to your Telegram bot.
        </p>

        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Environment Check
          </h2>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              ✓ Checklist:
            </p>
            <ul style={{ color: "#6b7280", lineHeight: 1.8 }}>
              <li>TELEGRAM_BOT_TOKEN is set in Vercel environment variables</li>
              <li>TELEGRAM_CHAT_ID is set in Vercel environment variables</li>
              <li>You have sent /start to your bot on Telegram</li>
              <li>Bot token is the NEW token (after revocation)</li>
              <li>Latest code is deployed on Vercel</li>
            </ul>
          </div>

          <button
            onClick={testTelegram}
            disabled={testing}
            style={{
              width: "100%",
              padding: "1rem",
              background: testing ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: testing ? "not-allowed" : "pointer",
              boxShadow: testing ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}
          >
            {testing ? "Sending Test..." : "📱 Send Test Notification"}
          </button>
        </div>

        {result && (
          <div style={{
            background: result.success ? "#f0fdf4" : "#fef2f2",
            padding: "2rem",
            borderRadius: "16px",
            border: `2px solid ${result.success ? "#bbf7d0" : "#fecaca"}`
          }}>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: result.success ? "#16a34a" : "#ef4444",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              {result.success ? "✅ Success!" : "❌ Failed"}
            </h3>

            <div style={{
              background: "#ffffff",
              padding: "1rem",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              overflow: "auto"
            }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            {result.success && (
              <div style={{ marginTop: "1.5rem" }}>
                <p style={{ color: "#166534", fontWeight: 600, marginBottom: "0.5rem" }}>
                  ✅ Check your Telegram app now!
                </p>
                <p style={{ color: "#166534", fontSize: "0.95rem" }}>
                  You should see a test notification with customer details and order information.
                </p>
              </div>
            )}

            {!result.success && (
              <div style={{ marginTop: "1.5rem" }}>
                <p style={{ color: "#991b1b", fontWeight: 600, marginBottom: "0.75rem" }}>
                  ❌ Troubleshooting Steps:
                </p>
                <ul style={{ color: "#991b1b", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  <li>Verify TELEGRAM_BOT_TOKEN in Vercel environment variables</li>
                  <li>Verify TELEGRAM_CHAT_ID in Vercel environment variables</li>
                  <li>Make sure you sent /start to your bot on Telegram</li>
                  <li>Check if bot token was recently rotated - use the NEW token</li>
                  <li>Redeploy your app after updating environment variables</li>
                  <li>Check Vercel function logs for detailed error messages</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Quick Reference */}
        <div style={{
          background: "#fffbeb",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #fde047",
          marginTop: "2rem"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#92400e", marginBottom: "1rem" }}>
            📝 Quick Reference
          </h3>
          <div style={{ color: "#78350f", fontSize: "0.9rem", lineHeight: 1.6 }}>
            <p><strong>Get your Bot Token:</strong></p>
            <p>1. Open Telegram → Search @BotFather</p>
            <p>2. Send: /mybots → Select your bot → API Token</p>
            <p style={{ marginBottom: "1rem" }}>3. Copy the token</p>

            <p><strong>Get your Chat ID:</strong></p>
            <p>1. Open Telegram → Search @userinfobot</p>
            <p style={{ marginBottom: "1rem" }}>2. It will reply with your ID</p>

            <p><strong>Update Vercel:</strong></p>
            <p>1. Go to Vercel Dashboard → Your Project</p>
            <p>2. Settings → Environment Variables</p>
            <p>3. Add/Update TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID</p>
            <p>4. Redeploy your application</p>
          </div>
        </div>
      </div>
    </div>
  );
}
