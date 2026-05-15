// Reusable Loading Spinner Component
// Use this for buttons, pages, and async operations

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "medium",
  color = "#16a34a",
  text = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: "30px",
    medium: "50px",
    large: "70px",
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `4px solid #e5e7eb`,
          borderTop: `4px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      {text && (
        <p
          style={{
            color: "#6b7280",
            fontSize: size === "small" ? "0.875rem" : "1rem",
            fontWeight: 500,
            margin: 0,
          }}
        >
          {text}
        </p>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.95)",
          zIndex: 9999,
          backdropFilter: "blur(4px)",
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Button Loading Spinner (inline with button text)
export function ButtonSpinner({ color = "#ffffff" }: { color?: string }) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
        marginRight: "0.5rem",
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
