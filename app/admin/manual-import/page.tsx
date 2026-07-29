"use client";

import { useState } from "react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

export default function ManualImportPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateSellingPrice = () => {
    const supplier = parseFloat(formData.supplier_price) || 0;
    const profit = parseFloat(formData.profit_amount) || 0;
    return (supplier + profit).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const sellingPrice = calculateSellingPrice();

      // Direct Supabase insert
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error: dbError } = await supabase
        .from("products")
        .insert([
          {
            cj_pid: formData.cj_pid || `MANUAL-${Date.now()}`,
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            supplier_price: parseFloat(formData.supplier_price),
            profit_amount: parseFloat(formData.profit_amount),
            selling_price: parseFloat(sellingPrice),
            category: formData.category,
            stock: parseInt(formData.stock),
            product_type: "cj",
          },
        ])
        .select();

      if (dbError) throw dbError;

      setSuccess("✅ Product added successfully!");
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
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          📝 Manual Product Import
        </h1>
        <p style={{ color: "#6b7280" }}>
          Add CJ products manually - Copy info from CJDropshipping website
        </p>
      </div>

      {/* Instructions */}
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e40af", marginBottom: "1rem" }}>
          📚 How to Use:
        </h3>
        <ol style={{ fontSize: "0.875rem", color: "#1e40af", margin: 0, paddingLeft: "1.5rem", lineHeight: 1.8 }}>
          <li>Go to <a href="https://cjdropshipping.com" target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>CJDropshipping.com</a></li>
          <li>Search for products you want to sell</li>
          <li>Copy product details (title, price, image URL, description)</li>
          <li>Paste them into the form below</li>
          <li>Set your profit amount</li>
          <li>Click "Add Product" - it goes directly to your database!</li>
        </ol>
      </div>

      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* CJ PID */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              CJ Product ID (Optional)
            </label>
            <input
              type="text"
              name="cj_pid"
              value={formData.cj_pid}
              onChange={handleChange}
              placeholder="e.g., 123456789 (leave empty for auto-generated)"
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., iPhone 15 Pro Max Case"
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Product description..."
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem", resize: "vertical" }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Image URL *
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem" }}
            />
            {formData.image_url && (
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <img src={formData.image_url} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
              </div>
            )}
          </div>

          {/* Pricing */}
          <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "12px", border: "2px solid #bbf7d0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#166534", marginBottom: "1rem" }}>
              💰 Pricing
            </h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                  Supplier Price (USD) *
                </label>
                <input
                  type="number"
                  name="supplier_price"
                  value={formData.supplier_price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  style={{ width: "100%", padding: "0.75rem", border: "2px solid #16a34a", borderRadius: "8px", fontSize: "1rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                  Your Profit (USD) *
                </label>
                <input
                  type="number"
                  name="profit_amount"
                  value={formData.profit_amount}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  style={{ width: "100%", padding: "0.75rem", border: "2px solid #16a34a", borderRadius: "8px", fontSize: "1rem" }}
                />
              </div>

              <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "8px", border: "1px solid #16a34a" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                  Selling Price (Auto-Calculated)
                </label>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>
                  ${calculateSellingPrice()}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#166534", margin: "0.5rem 0 0" }}>
                  = ${formData.supplier_price || "0"} + ${formData.profit_amount || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem" }}
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports">Sports</option>
              <option value="Beauty">Beauty</option>
              <option value="Toys">Toys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              style={{ width: "100%", padding: "0.75rem", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
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
              gap: "0.5rem",
            }}
          >
            {loading && <ButtonSpinner />}
            {loading ? "Adding Product..." : "✅ Add Product to Store"}
          </button>
        </div>
      </form>
    </div>
  );
}
