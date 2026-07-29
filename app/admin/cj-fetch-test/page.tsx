"use client";

import { useState } from "react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

export default function CJFetchTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFetchProducts = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/cj/test-fetch-products", {
        method: "GET",
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: {
          message: "Network error",
          details: error.message || "Failed to fetch",
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
          🧪 CJ Product Fetch Test
        </h1>
        <p style={{ color: "#6b7280" }}>
          Test fetching 10 products from CJDropShipping API (raw response)
        </p>
      </div>

      {/* Fetch Button */}
      <div
        style={{
          background: "#ffffff",
          padding: "2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={handleFetchProducts}
          disabled={loading}
          style={{
            width: "100%",
            padding: "1.25rem",
            background: loading
              ? "#9ca3af"
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {loading && <ButtonSpinner />}
          {loading ? "Fetching Products..." : "📦 Fetch 10 Products from CJ"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {result.success ? (
            // Success - Show Products
            <div
              style={{
                background: "#f0fdf4",
                border: "2px solid #22c55e",
                borderRadius: "16px",
                padding: "2rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
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
                    Successfully Fetched Products!
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#166534",
                      margin: "0.25rem 0 0",
                    }}
                  >
                    Found {result.product_count} products
                  </p>
                </div>
              </div>

              {/* Product List */}
              {result.products && result.products.length > 0 && (
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#166534",
                      marginBottom: "1rem",
                    }}
                  >
                    📦 Products Preview:
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gap: "1rem",
                    }}
                  >
                    {result.products.map((product: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          background: "#ffffff",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px solid #bbf7d0",
                          display: "grid",
                          gridTemplateColumns: "100px 1fr",
                          gap: "1rem",
                        }}
                      >
                        {/* Product Image */}
                        <div
                          style={{
                            background: "#f9fafb",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.5rem",
                          }}
                        >
                          {product.productImage ? (
                            <img
                              src={product.productImage}
                              alt={product.productNameEn || "Product"}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "80px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                fontSize: "2rem",
                                color: "#9ca3af",
                              }}
                            >
                              📦
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div>
                          <h5
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 700,
                              color: "#111827",
                              margin: "0 0 0.5rem",
                            }}
                          >
                            {product.productNameEn || product.productName || "Unnamed Product"}
                          </h5>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              gap: "0.5rem",
                              fontSize: "0.85rem",
                              color: "#6b7280",
                            }}
                          >
                            <div>
                              <strong>Price:</strong> $
                              {product.sellPrice || "0.00"}
                            </div>
                            <div>
                              <strong>SKU:</strong>{" "}
                              {product.productSku || "N/A"}
                            </div>
                            <div>
                              <strong>PID:</strong> {product.pid || "N/A"}
                            </div>
                            <div>
                              <strong>Category:</strong>{" "}
                              {product.categoryName || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Error
            <div
              style={{
                background: "#fef2f2",
                border: "2px solid #ef4444",
                borderRadius: "16px",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
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
                    Failed to Fetch Products
                  </h3>
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
                <p style={{ fontSize: "0.9rem", color: "#dc2626", margin: 0 }}>
                  {result.error?.message || "Unknown error"}
                </p>
                {result.error?.details && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#dc2626",
                      marginTop: "0.5rem",
                    }}
                  >
                    {result.error.details}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Raw Response */}
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#374151",
                marginBottom: "1rem",
              }}
            >
              🔍 Raw API Response (for debugging):
            </h4>
            <pre
              style={{
                background: "#ffffff",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "0.75rem",
                overflow: "auto",
                maxHeight: "500px",
                fontFamily: "monospace",
                color: "#111827",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
