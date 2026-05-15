"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/app/components/ImageUpload";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    supplier_price: "",
    markup_percentage: "",
    profit_amount: "",
    selling_price: "",
    category: "",
    stock: "",
    product_type: "local"
  });

  // Auto-calculate selling price (only for CJ products)
  useEffect(() => {
    // Only calculate for CJ products
    if (formData.product_type !== 'cj') {
      return;
    }

    const supplierPrice = parseFloat(formData.supplier_price) || 0;
    const markupPercentage = parseFloat(formData.markup_percentage) || 0;
    const profitAmount = parseFloat(formData.profit_amount) || 0;

    let calculatedPrice = 0;

    if (profitAmount > 0) {
      // Use fixed profit amount
      calculatedPrice = supplierPrice + profitAmount;
    } else if (markupPercentage > 0) {
      // Use markup percentage
      calculatedPrice = supplierPrice + (supplierPrice * markupPercentage / 100);
    } else {
      calculatedPrice = supplierPrice;
    }

    setFormData(prev => ({
      ...prev,
      selling_price: calculatedPrice > 0 ? calculatedPrice.toFixed(2) : ""
    }));
  }, [formData.supplier_price, formData.markup_percentage, formData.profit_amount, formData.product_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from('products').insert([
        {
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          supplier_price: formData.product_type === 'cj' ? parseFloat(formData.supplier_price) : null,
          markup_percentage: formData.product_type === 'cj' ? (parseFloat(formData.markup_percentage) || null) : null,
          profit_amount: formData.product_type === 'cj' ? (parseFloat(formData.profit_amount) || null) : null,
          selling_price: parseFloat(formData.selling_price),
          category: formData.category,
          stock: parseInt(formData.stock),
          product_type: formData.product_type,
          created_by: user.id
        }
      ]);

      if (error) throw error;

      alert('Product added successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert('Failed to add product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/products" style={{
          color: "#16a34a",
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem"
        }}>
          ← Back to Products
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          Add New Product
        </h1>
        <p style={{ color: "#6b7280" }}>
          Fill in the product details below
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        background: "#ffffff",
        padding: "2rem",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        maxWidth: "800px"
      }}>
        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Product Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., iPhone 15 Pro Max"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.2s"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#16a34a";
              e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description..."
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              transition: "all 0.2s",
              resize: "vertical"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#16a34a";
              e.target.style.boxShadow = "0 0 0 3px rgba(22, 163, 74, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "1.5rem" }}>
          <ImageUpload
            onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
            currentImageUrl={formData.image_url}
          />
        </div>

        {/* Product Type */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Product Type *
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label style={{
              flex: 1,
              padding: "1rem",
              border: `2px solid ${formData.product_type === 'local' ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: "12px",
              cursor: "pointer",
              background: formData.product_type === 'local' ? '#f0fdf4' : '#ffffff',
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="product_type"
                value="local"
                checked={formData.product_type === 'local'}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              <span style={{ fontWeight: 600 }}>🇳🇬 Local Product</span>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.5rem 0 0 1.5rem" }}>
                Manually priced, WhatsApp orders
              </p>
            </label>
            <label style={{
              flex: 1,
              padding: "1rem",
              border: `2px solid ${formData.product_type === 'cj' ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: "12px",
              cursor: "pointer",
              background: formData.product_type === 'cj' ? '#f0fdf4' : '#ffffff',
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="product_type"
                value="cj"
                checked={formData.product_type === 'cj'}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              <span style={{ fontWeight: 600 }}>🌍 CJ Product</span>
              <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "0.5rem 0 0 1.5rem" }}>
                Auto-priced with markup, cart checkout
              </p>
            </label>
          </div>
        </div>

        {/* Pricing Section - Different for Local vs CJ */}
        {formData.product_type === 'local' ? (
          // LOCAL PRODUCT - Simple selling price only
          <div style={{
            background: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "2px solid #bbf7d0"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#166534", marginBottom: "1rem" }}>
              💰 Pricing (Local Product)
            </h3>
            <div>
              <label style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#166534",
                marginBottom: "0.5rem"
              }}>
                Selling Price * ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                placeholder="0.00"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "0.75rem 1rem",
                  border: "2px solid #16a34a",
                  borderRadius: "8px",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  background: "#ffffff",
                  color: "#16a34a",
                  outline: "none"
                }}
              />
              <p style={{ fontSize: "0.85rem", color: "#166534", marginTop: "0.5rem" }}>
                Set your own price for this local product
              </p>
            </div>
          </div>
        ) : (
          // CJ PRODUCT - Full pricing calculator
          <div style={{
            background: "#fff7ed",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "2px solid #fed7aa"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#9a3412", marginBottom: "1rem" }}>
              💰 Pricing Calculator (CJ Product)
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {/* Supplier Price */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#9a3412",
                  marginBottom: "0.5rem"
                }}>
                  Supplier Price * ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.supplier_price}
                  onChange={(e) => setFormData({ ...formData, supplier_price: e.target.value })}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #fed7aa",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Markup Percentage */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#9a3412",
                  marginBottom: "0.5rem"
                }}>
                  Markup (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.markup_percentage}
                  onChange={(e) => setFormData({ ...formData, markup_percentage: e.target.value, profit_amount: "" })}
                  placeholder="0"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #fed7aa",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* OR Profit Amount */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#9a3412",
                  marginBottom: "0.5rem"
                }}>
                  OR Fixed Profit ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.profit_amount}
                  onChange={(e) => setFormData({ ...formData, profit_amount: e.target.value, markup_percentage: "" })}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #fed7aa",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                />
              </div>

              {/* Selling Price (Auto-calculated) */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#9a3412",
                  marginBottom: "0.5rem"
                }}>
                  Selling Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "2px solid #f97316",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    background: "#ffffff",
                    color: "#f97316",
                    outline: "none"
                  }}
                />
                <p style={{ fontSize: "0.75rem", color: "#9a3412", marginTop: "0.25rem" }}>
                  Auto-calculated (can override)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category & Stock */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          {/* Category */}
          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Category *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Phones"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>

          {/* Stock */}
          <div>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "0.5rem"
            }}>
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            />
          </div>
        </div>

        {/* Product Type */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.5rem"
          }}>
            Product Type *
          </label>
          <div style={{ display: "flex", gap: "1rem" }}>
            <label style={{
              flex: 1,
              padding: "1rem",
              border: `2px solid ${formData.product_type === 'local' ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: "12px",
              cursor: "pointer",
              background: formData.product_type === 'local' ? '#f0fdf4' : '#ffffff',
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="product_type"
                value="local"
                checked={formData.product_type === 'local'}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              <span style={{ fontWeight: 600 }}>🇳🇬 Local Product</span>
            </label>
            <label style={{
              flex: 1,
              padding: "1rem",
              border: `2px solid ${formData.product_type === 'cj' ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: "12px",
              cursor: "pointer",
              background: formData.product_type === 'cj' ? '#f0fdf4' : '#ffffff',
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="product_type"
                value="cj"
                checked={formData.product_type === 'cj'}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                style={{ marginRight: "0.5rem" }}
              />
              <span style={{ fontWeight: 600 }}>🌍 CJ Product</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "1rem",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading && <ButtonSpinner />}
            {loading ? "Adding Product..." : "Add Product"}
          </button>
          <Link href="/admin/products" style={{
            flex: 1,
            padding: "1rem",
            background: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 700,
            textDecoration: "none",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
