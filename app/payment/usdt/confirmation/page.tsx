"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function USDTConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const amount = searchParams.get('amount');

  return (
    <div style={{ minHeight: "100vh", paddingTop: "60px", background: "#f9fafb" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Success Icon */}
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
            <span style={{ fontSize: "3rem" }}>⏳</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#111827", marginBottom: "0.5rem" }}>
            Payment Submitted
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            Awaiting payment confirmation
          </p>
        </div>

        {/* Status Card */}
        <div style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", marginBottom: "1.5rem" }}>
            Order Status
          </h2>

          {/* Order Details */}
          <div style={{
            padding: "1.25rem",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem"
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order ID</div>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", fontFamily: "monospace" }}>
                {orderId}
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>USDT Amount</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fbbf24" }}>
                {amount} USDT
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.25rem" }}>Payment Status</div>
              <div style={{
                display: "inline-block",
                padding: "0.375rem 0.75rem",
                background: "#fef3c7",
                color: "#92400e",
                borderRadius: "6px",
                fontSize: "0.875rem",
                fontWeight: 600
              }}>
                Pending Confirmation
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{
            padding: "1.5rem",
            background: "#fef3c7",
            borderRadius: "12px",
            border: "1px solid #fde047"
          }}>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#92400e", lineHeight: 1.6 }}>
              <strong>What happens next?</strong><br />
              Our team will verify your USDT payment. Once confirmed, your order status will be updated to "Paid" and we'll begin processing your order. You'll receive a notification when the payment is confirmed.
            </p>
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
            📌 Important Information
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#374151", lineHeight: "1.8" }}>
            <li>Payment verification usually takes a few minutes to a few hours</li>
            <li>You can check your order status in "My Orders"</li>
            <li>Make sure you sent the payment using TRC20 network</li>
            <li>Contact support if payment is not confirmed within 24 hours</li>
            <li>Keep your transaction ID/hash for reference if needed</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem"
        }}>
          <Link
            href="/my-orders"
            style={{
              padding: "1rem",
              background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}
          >
            View My Orders
          </Link>
          <Link
            href="/products"
            style={{
              padding: "1rem",
              background: "#ffffff",
              color: "#16a34a",
              border: "2px solid #16a34a",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center"
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function USDTConfirmationPage() {
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
      <USDTConfirmationContent />
    </Suspense>
  );
}
