"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";
import Image from "next/image";

export default function ManualProductAddPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    cj_pid: "",
    title: "",
    description: "",
    image_url: "",
    supplier_price: "",
    profit_amount: "",
    category: "Electronics",
    stock: "100",
  });

  const sellingPrice = formData.supplier_price && formData.profit_amount
    ? (parseFloat(formData.supplier_price) + parseFloat(formData.profit_amount)).toFixed(2)
    : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (!formData.title || !formData.supplier_price) {
        throw new Error("Title and Supplier Price are required");
      }

      const supplierPrice = parseFloat(formData.supplier_price);
      const profitAmount = parseFloat(formData.profit_amount) || 0;
      const finalSellingPrice = supplierPrice + profitAmount;

      // Insert directly into Supabase
      const { data, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            cj_pid: formData.cj_pid || `MANUAL-${Date.now()}`,
            title: formData.title,
            description: formData.description || "",
            image_url: formData.image_url || "",
            supplier_price: supplierPrice,
            profit_amount: profitAmount,
            selling_price: finalSellingPrice,
            category: formData.category,
            stock: parseInt(formData.stock) || 100,
            product_type: "cj",
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess("✅ Product added successfully!");
      
      // Reset form
      setFormData({
        cj_pid: "",
        title: "",
        description: "",
        image_url: "",
        supplier_price: "",
        profit_amount: "",
        category: "Electronics",
        stock: "100",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          ➕ Add Product Manually
        </h1>
        <p style={{ color: "#6b7280" }}>
          Add CJDropshipping products directly to your store
        </p>
      </div>

      {/* Instructions */}
      <div style={{ background: "#eff6ff", border: "2px solid #3b82f6", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e40af", marginBottom: "1rem" }}>
          📝 How to Add Products from CJDropshipping:
        </h3>
        <ol style={{ color: "#1e40af", marginLeft: "1.5rem", lineHeight: 1.8 }}>
          <li>Go to <a href="https://cjdropshipping.com/product-search.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>CJDropshipping Product Search</a></li>
          <li>Find a product you want to sell</li>
          <li>Copy the product details below</li>
          <li>Fill in the form and click "Add Product"</li>
        </ol>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{ background: "#f0fdf4", border: "2px solid #22c55e", color: "#166534", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: 600 }}>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ background: "#fef2f2", border: "2px solid #ef4444", color: "#dc2626", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            
            {/* Product Title */}
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                Product Title <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Wireless Bluetooth Headphones"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Image URL */}
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              {formData.image_url && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  />
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "12px", border: "2px solid #22c55e" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#166534", marginBottom: "1rem" }}>
                💰 Pricing
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                    Supplier Price ($) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.supplier_price}
                    onChange={(e) => setFormData({ ...formData, supplier_price: e.target.value })}
                    placeholder="0.00"
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #22c55e",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                    Your Profit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.profit_amount}
                    onChange={(e) => setFormData({ ...formData, profit_amount: e.target.value })}
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #22c55e",
                      borderRadius: "8px",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "8px", border: "2px solid #22c55e" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                  Selling Price (Auto-Calculated)
                </div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#16a34a" }}>
                  ${sellingPrice}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#166534", marginTop: "0.5rem" }}>
                  = Supplier ${formData.supplier_price || "0.00"} + Profit ${formData.profit_amount || "0.00"}
                </div>
              </div>
            </div>

            {/* Category and Stock */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
                  <option value="Toys">Toys</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            {/* CJ PID (Optional) */}
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                CJ Product ID (Optional)
              </label>
              <input
                type="text"
                value={formData.cj_pid}
                onChange={(e) => setFormData({ ...formData, cj_pid: e.target.value })}
                placeholder="Leave empty to auto-generate"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1.25rem",
                background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
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
                marginTop: "1rem",
              }}
            >
              {loading && <ButtonSpinner />}
              {loading ? "Adding Product..." : "✅ Add Product to Store"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
