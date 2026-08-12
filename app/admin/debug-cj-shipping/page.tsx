"use client";

import { useState } from "react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

export default function DebugCJShippingPage() {
  const [pid, setPid] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDebug = async () => {
    if (!pid.trim()) {
      setError("Please enter a PID");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/cj/debug-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid: pid.trim(), quantity }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Debug failed");
      }

      setResult(data.data);
      console.log("Debug Results:", data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
        🔍 Debug CJ Shipping Calculation
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
        Investigate why CJ API returns different shipping than CJ website
      </p>

      {/* Input Form */}
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
              Product PID
            </label>
            <input
              type="text"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
              placeholder="e.g., CJYD3046124VM55"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
          </div>
          <div style={{ width: "150px" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>

        <button
          onClick={handleDebug}
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            background: loading ? "#9ca3af" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {loading && <ButtonSpinner />}
          {loading ? "Investigating..." : "🔍 Debug Shipping"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            📊 Debug Results
          </h2>

          {/* Test 1: Basic Freight Calculate */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              📦 Test 1: Basic Freight Calculate
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Request:</strong>
              <pre style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.9rem" }}>
                {JSON.stringify(result.tests.basicFreightCalculate.request, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Response (Status {result.tests.basicFreightCalculate.status}):</strong>
              <pre style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.9rem" }}>
                {JSON.stringify(result.tests.basicFreightCalculate.response, null, 2)}
              </pre>
            </div>
            {result.tests.basicFreightCalculate.response?.data?.freightFee && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0fdf4", borderRadius: "8px" }}>
                <strong style={{ color: "#166534" }}>
                  💰 Shipping Fee Found: ${result.tests.basicFreightCalculate.response.data.freightFee}
                </strong>
              </div>
            )}
          </div>

          {/* Test 2: Product Details */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              📦 Test 2: Product Details Query
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Request:</strong>
              <pre style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.9rem" }}>
                {JSON.stringify(result.tests.productDetails.request, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Response (Status {result.tests.productDetails.status}):</strong>
              <pre style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.9rem", maxHeight: "400px" }}>
                {JSON.stringify(result.tests.productDetails.response, null, 2)}
              </pre>
            </div>
          </div>

          {/* Test 3: With Shipping Method */}
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              📦 Test 3: Freight Calculate with Shipping Method
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Request:</strong>
              <pre style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.9rem" }}>
                {JSON.stringify(result.tests.withShippingMethod.request, null, 2)}
              </pre>
            </div>
            <div>
              <strong>Response (Status {result.tests.withShippingMethod.status}):</strong>
              <pre style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.9rem" }}>
                {JSON.stringify(result.tests.withShippingMethod.response, null, 2)}
              </pre>
            </div>
          </div>

          {/* Analysis */}
          <div style={{ background: "#fffbeb", padding: "1.5rem", borderRadius: "12px", border: "1px solid #fcd34d" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "#92400e" }}>
              🎯 Analysis
            </h3>
            <div style={{ color: "#92400e" }}>
              <p><strong>Current Implementation:</strong> {result.analysis.currentImplementation}</p>
              <p><strong>Issue:</strong> {result.analysis.issue}</p>
              <p><strong>Expected Shipping:</strong> ${result.analysis.expectedShipping}</p>
              <p><strong>Note:</strong> {result.analysis.note}</p>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ background: "#eff6ff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #93c5fd", marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "#1e40af" }}>
              📝 What to Look For
            </h3>
            <ul style={{ color: "#1e40af", lineHeight: 1.8 }}>
              <li>Check if any API returns a shipping fee of <strong>$8.28</strong></li>
              <li>Look for fields like: freightFee, shippingFee, logisticFee, freight, fee</li>
              <li>Check if product details include shipping information</li>
              <li>See if different shipping methods return different prices</li>
              <li>Compare the API response structure with CJ's documentation</li>
              <li>Note any error messages or missing parameters</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
