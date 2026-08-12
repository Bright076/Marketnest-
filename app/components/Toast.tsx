"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "info", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: {
      bg: "#dcfce7",
      border: "#16a34a",
      text: "#166534",
      icon: "✓"
    },
    error: {
      bg: "#fee2e2",
      border: "#dc2626",
      text: "#991b1b",
      icon: "✕"
    },
    warning: {
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
      icon: "⚠"
    },
    info: {
      bg: "#dbeafe",
      border: "#3b82f6",
      text: "#1e40af",
      icon: "ℹ"
    }
  };

  const style = colors[type];

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          minWidth: "300px",
          maxWidth: "500px",
          background: style.bg,
          border: `2px solid ${style.border}`,
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          animation: "slideIn 0.3s ease-out"
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            flexShrink: 0,
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: "50%",
            border: `2px solid ${style.border}`
          }}
        >
          {style.icon}
        </div>
        <div style={{ flex: 1, color: style.text, fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.4 }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: style.text,
            fontSize: "1.25rem",
            cursor: "pointer",
            padding: "0.25rem",
            lineHeight: 1,
            opacity: 0.6,
            transition: "opacity 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @media (max-width: 640px) {
            [style*="position: fixed"][style*="right: 20px"] {
              left: 20px !important;
              right: 20px !important;
              min-width: auto !important;
              max-width: none !important;
            }
          }
        `
      }} />
    </>
  );
}
