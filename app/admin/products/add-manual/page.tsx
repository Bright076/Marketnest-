"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

export default function AddManualProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    cj_pid: "",
    title: "",
    description: "",
    image_url: "",
    supplier_price: "",
    profit_amount: "",
    selling_price: "",
    category: "Electronics",
    stock: "100",
  });

  const calculateSellingPrice = (supplierPrice: string, profit: string) => {
    const supplier = parseFloat(supplierPrice) || 0;
    const profitAmount = parseFloat(profit) || 0;
    return (supplier + profitAmount).toFixed(2);
  };

  const handleSupplierPriceChange = (value: string) => {
    setFormData({
      ...formData,
      supplier_price: value,
      selling_price: calculateSellingPrice(value, formData.profit_amount),
    });
  };

  const handleProfitChange = (value: string) => {
    setFormData({
      ...formData,
      profit_amount: value,
      selling_price: calculateSellingPrice(formData.supplier_price, value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validation
      if (!formData.title || !formData.supplier_price || !formData.selling_price) {
        throw new Error("Please fill in all required fields");
      }

      // Insert product directly into Supabase
      const { data, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            cj_pid: formData.cj_pid || `MANUAL-${Date.now()}`,
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url || "https://via.placeholder.com/400",
            supplier_price: parseFloat(formData.supplier_price),
            profit_amount: parseFloat(formData.profit_amount) || 0,
            selling_price: parseFloat(formData.selling_price),
            category: formData.category,
            stock: parseInt(formData.stock) || 0,
            product_type: "cj",
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
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
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          ➕ Add Product Manually
        </h1>
        <p style={{ color: "#6b7280" }}>
          Add CJ products manually by entering product details
        </p>
      </div>

      {/* Instructions */}
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#1e40af",
            marginBottom: "1rem",
          }}
        >
          📝 How to Add CJ Products Manually
        </h3>
        <ol
          style={{
            fontSize: "0.9rem",
            color: "#1e40af",
            paddingLeft: "1.5rem",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          <li>Go to <strong>CJDropshipping.com</strong> and browse products</li>
          <li>Find a product you want to sell</li>
          <li>Copy the product details (name, price, image URL)</li>
          <li>Paste the details in the form below</li>
          <li>Set your profit margin</li>
          <li>Click "Add Product" - product will appear on your store!</li>
        </ol>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Success Message */}
          {success && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              ✅ Product added successfully! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Product Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Product Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Wireless Bluetooth Headphones"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Product description..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Image URL */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.5rem" }}>
              Right-click on CJ product image → Copy image address
            </p>
          </div>

          {/* CJ Product ID */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              CJ Product ID (Optional)
            </label>
            <input
              type="text"
              value={formData.cj_pid}
              onChange={(e) =>
                setFormData({ ...formData, cj_pid: e.target.value })
              }
              placeholder="Leave empty for auto-generated ID"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Pricing Calculator */}
          <div
            style={{
              background: "#f0fdf4",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: "2px solid #bbf7d0",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#166534",
                marginBottom: "1rem",
              }}
            >
              💰 Pricing Calculator
            </h3>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Supplier Price */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#166534",
                    marginBottom: "0.5rem",
                  }}
                >
                  CJ Supplier Price ($) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.supplier_price}
                  onChange={(e) => handleSupplierPriceChange(e.target.value)}
                  placeholder="0.00"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #bbf7d0",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Profit Amount */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#166534",
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Profit ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.profit_amount}
                  onChange={(e) => handleProfitChange(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #16a34a",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Selling Price */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#166534",
                    marginBottom: "0.5rem",
                  }}
                >
                  Customer Pays (Auto-Calculated)
                </label>
                <input
                  type="text"
                  value={`$${formData.selling_price}`}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #16a34a",
                    borderRadius: "8px",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#16a34a",
                    background: "#ffffff",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
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
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Stock Quantity
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "1rem",
                background: loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {loading && <ButtonSpinner />}
              {loading ? "Adding Product..." : "➕ Add Product to Store"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              disabled={loading}
              style={{
                padding: "1rem 2rem",
                background: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
