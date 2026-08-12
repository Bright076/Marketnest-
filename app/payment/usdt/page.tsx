"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function USDTPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('order');
  
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const usdtAddress = process.env.NEXT_PUBLIC_USDT_TRC20_ADDRESS || "TP7h5qLNhXpfJ1PAS3swcobSQQc17E23fr";

  useEffect(() => {
    if (!amount || !orderId) {
      router.push('/');
    }
  }, [amount, orderId, router]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(usdtAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      alert('Failed to copy address');
    }
  };

  const handlePaymentSubmitted = async () => {
    setSubmitting(true);
    // Just redirect to success page - admin will manually confirm payment
    router.push(`/payment/usdt/confirmation?order=${orderId}&amount=${amount}`);
  };

  if (!amount || !orderId) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "100px",
            height: "100px",
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: "0 8px 24px rgba(251, 191, 36, 0.3)"
          }}>
            <span style={{ fontSize: "3rem" }}>🪙</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
            USDT Payment Instructions
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Complete your payment with USDT (TRC20)
          </p>
        </div>

        {/* Critical Warning */}
        <div style={{
          background: "#fef3c7",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "2px solid #fde047",
          marginBottom: "2rem"
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#92400e", marginBottom: "0.75rem" }}>
            ⚠️ IMPORTANT: TRC20 Network Only
          </h3>
          <p style={{ fontSize: "0.95rem", color: "#92400e", margin: 0, lineHeight: 1.6 }}>
            You MUST send USDT using the <strong>Tron (TRC20)</strong> network. Sending through any other network (ERC20, BEP20, etc.) will result in permanent loss of funds!
          </p>
        </div>

        {/* Payment Details Card */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Payment Details
          </h2>

          {/* Amount */}
          <div style={{
            padding: "1.5rem",
            background: "#f0fdf4",
            borderRadius: "12px",
            border: "2px solid #bbf7d0",
            marginBottom: "1.5rem"
          }}>
            <div style={{ fontSize: "0.85rem", color: "#166534", marginBottom: "0.5rem", fontWeight: 600 }}>
              Amount to Send
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#16a34a" }}>
              {amount} USDT
            </div>
            <div style={{ fontSize: "0.85rem", color: "#166534", marginTop: "0.5rem" }}>
              Send exactly this amount
            </div>
          </div>

          {/* Network */}
          <div style={{
            padding: "1.25rem",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem"
          }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>
              Network
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>
              Tron (TRC20)
            </div>
          </div>

          {/* USDT Address */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.75rem", fontWeight: 600 }}>
              USDT Wallet Address (TRC20)
            </div>
            <div style={{
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "2px solid #e5e7eb",
              marginBottom: "1rem",
              wordBreak: "break-all",
              fontFamily: "monospace",
              fontSize: "0.95rem",
              color: "#111827"
            }}>
              {usdtAddress}
            </div>
            <button
              onClick={copyAddress}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: copied ? "#dcfce7" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                color: copied ? "#166534" : "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {copied ? "✓ Address Copied!" : "📋 Copy Address"}
            </button>
          </div>

          {/* Order ID */}
          <div style={{
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>
              Order ID
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827", fontFamily: "monospace" }}>
              {orderId}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem"
        }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
            📝 Payment Instructions
          </h3>
          <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#374151", lineHeight: "1.8" }}>
            <li>Open your crypto wallet that supports USDT (TRC20)</li>
            <li>Select "Send" or "Transfer" USDT</li>
            <li><strong>Important:</strong> Choose "TRC20" or "Tron" network</li>
            <li>Paste the wallet address above or scan QR code if available</li>
            <li>Enter the exact amount: <strong>{amount} USDT</strong></li>
            <li>Double-check the network is TRC20 before sending</li>
            <li>Confirm and send the transaction</li>
            <li>Click "I Have Paid" button below after sending</li>
          </ol>
        </div>

        {/* Important Note */}
        <div style={{
          background: "#fef3c7",
          padding: "1.5rem",
          borderRadius: "12px",
          border: "1px solid #fde047",
          marginBottom: "2rem"
        }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#92400e", lineHeight: 1.6 }}>
            <strong>Note:</strong> After you click "I Have Paid", your order will be marked as pending payment confirmation. Our team will manually verify your payment and update your order status. This usually takes a few minutes to a few hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gap: "1rem" }}>
          <button
            onClick={handlePaymentSubmitted}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "1rem",
              background: submitting ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: submitting ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}
          >
            {submitting ? "Processing..." : "✓ I Have Paid"}
          </button>
          
          <Link
            href="/"
            style={{
              width: "100%",
              padding: "1rem",
              background: "#ffffff",
              color: "#6b7280",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
              display: "block"
            }}
          >
            Cancel and Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function USDTPaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", paddingTop: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #fbbf24",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p style={{ color: "#6b7280" }}>Loading...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    }>
      <USDTPaymentContent />
    </Suspense>
  );
}
