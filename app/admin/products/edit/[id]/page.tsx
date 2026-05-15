"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/app/components/ImageUpload";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    loadProduct();
  }, [productId]);

  // Auto-calculate selling price
  useEffect(() => {
    const supplierPrice = parseFloat(formData.supplier_price) || 0;
    const markupPercentage = parseFloat(formData.markup_percentage) || 0;
    const profitAmount = parseFloat(formData.profit_amount) || 0;

    let calculatedPrice = 0;

    if (profitAmount > 0) {
      calculatedPrice = supplierPrice + profitAmount;
    } else if (markupPercentage > 0) {
      calculatedPrice = supplierPrice + (supplierPrice * markupPercentage / 100);
    } else {
      calculatedPrice = supplierPrice;
    }

    setFormData(prev => ({
      ...prev,
      selling_price: calculatedPrice > 0 ? calculatedPrice.toFixed(2) : prev.selling_price
    }));
  }, [formData.supplier_price, formData.markup_percentage, formData.profit_amount]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          image_url: data.image_url || "",
          supplier_price: data.supplier_price?.toString() || "",
          markup_percentage: data.markup_percentage?.toString() || "",
          profit_amount: data.profit_amount?.toString() || "",
          selling_price: data.selling_price?.toString() || "",
          category: data.category || "",
          stock: data.stock?.toString() || "",
          product_type: data.product_type || "local"
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          image_url: formData.image_url,
          supplier_price: parseFloat(formData.supplier_price),
          markup_percentage: parseFloat(formData.markup_percentage) || null,
          profit_amount: parseFloat(formData.profit_amount) || null,
          selling_price: parseFloat(formData.selling_price),
          category: formData.category,
          stock: parseInt(formData.stock),
          product_type: formData.product_type
        })
        .eq('id', productId);

      if (error) throw error;

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert('Failed to update product: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: "4px solid #e5e7eb",
          borderTop: "4px solid #16a34a",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 1rem"
        }} />
        <p style={{ color: "#6b7280" }}>Loading product...</p>
      </div>
    );
  }

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
          Edit Product
        </h1>
        <p style={{ color: "#6b7280" }}>
          Update product details
        </p>
      </div>

      {/* Form - Same as Add Product */}
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
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
              resize: "vertical"
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

        {/* Pricing Section */}
        <div style={{
          background: "#f0fdf4",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "2px solid #bbf7d0"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#166534", marginBottom: "1rem" }}>
            💰 Pricing Calculator
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#166534",
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
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #bbf7d0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#166534",
                marginBottom: "0.5rem"
              }}>
                Markup (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.markup_percentage}
                onChange={(e) => setFormData({ ...formData, markup_percentage: e.target.value, profit_amount: "" })}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #bbf7d0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#166534",
                marginBottom: "0.5rem"
              }}>
                OR Fixed Profit ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.profit_amount}
                onChange={(e) => setFormData({ ...formData, profit_amount: e.target.value, markup_percentage: "" })}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #bbf7d0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#166534",
                marginBottom: "0.5rem"
              }}>
                Selling Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #16a34a",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "#ffffff",
                  color: "#16a34a",
                  outline: "none"
                }}
              />
            </div>
          </div>
        </div>

        {/* Category & Stock */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
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
              background: formData.product_type === 'local' ? '#f0fdf4' : '#ffffff'
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
              background: formData.product_type === 'cj' ? '#f0fdf4' : '#ffffff'
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

        {/* Submit Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: "1rem",
              background: saving ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: saving ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {saving && <ButtonSpinner />}
            {saving ? "Saving..." : "Save Changes"}
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
