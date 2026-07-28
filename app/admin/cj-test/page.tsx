"use client";

import { useState } from "react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

interface TestResult {
  success: boolean;
  data?: {
    authenticated: boolean;
    accessToken: string;
    message: string;
    timestamp: string;
    connectionTime: string;
  };
  error?: {
    message: string;
    details: string;
  };
}

export default function CJTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/cj/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: TestResult = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: {
          message: "Network error",
          details: error.message || "Failed to connect to API",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          🔌 CJDropShipping API Test
        </h1>
        <p style={{ color: "#6b7280" }}>
          Test your CJDropShipping API connection and authentication
        </p>
      </div>

      {/* Test Card */}
      <div
        style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          maxWidth: "800px",
        }}
      >
        {/* Info Box */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>💡</span>
            <div>
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#1e40af",
                  margin: "0 0 0.5rem",
                }}
              >
                About This Test
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#1e40af",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                This test verifies that your CJ_API_KEY environment variable is
                correctly configured and that you can authenticate with the
                CJDropShipping API. The test does not expose your full API key.
              </p>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTestConnection}
          disabled={loading}
          style={{
            width: "100%",
            padding: "1.25rem",
            background: loading
              ? "#9ca3af"
              : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "all 0.3s",
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
          {loading ? "Testing Connection..." : "🔌 Test CJ API Connection"}
        </button>

        {/* Results */}
        {result && (
          <div style={{ marginTop: "2rem" }}>
            {result.success ? (
              // Success Result
              <div
                style={{
                  background: "#f0fdf4",
                  border: "2px solid #22c55e",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "#22c55e",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    ✅
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#166534",
                        margin: 0,
                      }}
                    >
                      CJ API Connected Successfully
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#166534",
                        margin: "0.25rem 0 0",
                      }}
                    >
                      {result.data?.message}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#166534",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Authentication Status
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#16a34a",
                      }}
                    >
                      {result.data?.authenticated
                        ? "✓ Authenticated"
                        : "✗ Not Authenticated"}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#ffffff",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#166534",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Access Token (Masked)
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#16a34a",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      {result.data?.accessToken}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#166534",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Connection Time
                      </div>
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#16a34a",
                        }}
                      >
                        {result.data?.connectionTime}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#ffffff",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#166534",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Timestamp
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#16a34a",
                        }}
                      >
                        {result.data?.timestamp
                          ? new Date(result.data.timestamp).toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Error Result
              <div
                style={{
                  background: "#fef2f2",
                  border: "2px solid #ef4444",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "#ef4444",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    ❌
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#991b1b",
                        margin: 0,
                      }}
                    >
                      Connection Failed
                    </h3>
                  </div>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#991b1b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Error Message
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#dc2626",
                    }}
                  >
                    {result.error?.message}
                  </div>
                </div>

                <div
                  style={{
                    background: "#ffffff",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#991b1b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Details
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#dc2626",
                      lineHeight: 1.5,
                    }}
                  >
                    {result.error?.details}
                  </div>
                </div>

                {/* Troubleshooting */}
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    borderRadius: "8px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#9a3412",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    💡 Troubleshooting Tips:
                  </h4>
                  <ul
                    style={{
                      fontSize: "0.85rem",
                      color: "#9a3412",
                      margin: 0,
                      paddingLeft: "1.5rem",
                      lineHeight: 1.6,
                    }}
                  >
                    <li>
                      Verify CJ_API_KEY is set in your .env.local file
                    </li>
                    <li>
                      Check that the API key is in the correct format
                    </li>
                    <li>Restart your development server after changing .env</li>
                    <li>
                      Verify your CJDropShipping account is active
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          maxWidth: "800px",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#374151",
            margin: "0 0 1rem",
          }}
        >
          📚 What This Test Does
        </h3>
        <ul
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            margin: 0,
            paddingLeft: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          <li>Reads CJ_API_KEY from environment variables (server-side only)</li>
          <li>Authenticates with the CJDropShipping API</li>
          <li>Obtains an access token for API requests</li>
          <li>Measures connection time</li>
          <li>
            Returns masked token (for security, only shows first/last characters)
          </li>
          <li>Provides detailed error messages if connection fails</li>
        </ul>

        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            borderRadius: "8px",
            fontSize: "0.875rem",
            color: "#78350f",
          }}
        >
          <strong>🔒 Security Note:</strong> Your API key is never exposed to
          the client. All authentication happens server-side.
        </div>
      </div>
    </div>
  );
}
