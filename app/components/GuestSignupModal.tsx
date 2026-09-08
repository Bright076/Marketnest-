"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface GuestSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerEmail: string;
}

export default function GuestSignupModal({ isOpen, onClose, customerEmail }: GuestSignupModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay to trigger animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease"
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: isVisible 
            ? "translate(-50%, -50%) scale(1)" 
            : "translate(-50%, -50%) scale(0.9)",
          maxWidth: "500px",
          width: "90%",
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          zIndex: 9999,
          opacity: isVisible ? 1 : 0,
          transition: "all 0.3s ease",
          maxHeight: "90vh",
          overflow: "auto"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            fontSize: "1.25rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e5e7eb";
            e.currentTarget.style.color = "#111827";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          ×
        </button>

        {/* Modal Content */}
        <div style={{ padding: "2.5rem 2rem 2rem" }}>
          {/* Icon */}
          <div style={{
            width: "80px",
            height: "80px",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            border: "3px solid #93c5fd"
          }}>
            <span style={{ fontSize: "2.5rem" }}>🎁</span>
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: 900,
            color: "#111827",
            textAlign: "center",
            marginBottom: "0.75rem",
            lineHeight: 1.2
          }}>
            Create an Account to Track Your Order!
          </h2>

          {/* Description */}
          <p style={{
            fontSize: "1rem",
            color: "#6b7280",
            textAlign: "center",
            marginBottom: "2rem",
            lineHeight: 1.6
          }}>
            Sign up now and get access to exclusive benefits
          </p>

          {/* Benefits List */}
          <div style={{
            background: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              {[
                { icon: "📦", text: "Track your order status in real-time" },
                { icon: "📜", text: "View complete order history" },
                { icon: "📍", text: "Save delivery addresses for faster checkout" },
                { icon: "🎯", text: "Get exclusive deals and promotions" },
                { icon: "🔔", text: "Receive order updates via notifications" }
              ].map((benefit, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                    {benefit.icon}
                  </span>
                  <span style={{
                    fontSize: "0.95rem",
                    color: "#374151",
                    fontWeight: 500
                  }}>
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <Link
              href={`/signup?email=${encodeURIComponent(customerEmail)}&orderEmail=${encodeURIComponent(customerEmail)}`}
              onClick={onClose}
              style={{
                padding: "1rem 1.5rem",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.4)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(37, 99, 235, 0.4)";
              }}
            >
              <span>✨</span> Create Free Account
            </Link>

            <Link
              href="/login"
              onClick={onClose}
              style={{
                padding: "0.875rem 1.5rem",
                background: "#ffffff",
                color: "#2563eb",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              Already have an account? Login
            </Link>
          </div>

          {/* Skip Link */}
          <button
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.5rem",
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: "0.875rem",
              cursor: "pointer",
              textAlign: "center",
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#6b7280";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </>
  );
}
