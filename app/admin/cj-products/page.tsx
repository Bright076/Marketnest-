"use client";

import { useState } from "react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";
import Image from "next/image";

interface CJProduct {
  pid: string;
  productNameEn: string;
  productImage: string;
  sellPrice: number;
  productWeight: number;
  productSku: string;
  categoryName: string;
  description?: string;
}

interface ImportFormData {
  cj_pid: string;
  title: string;
  description: string;
  image_url: string;
  supplier_price: number;
  profit_amount: number;
  selling_price: number;
  category: string;
  stock: number;
}

export default function CJProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CJProduct | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [importForm, setImportForm] = useState<ImportFormData>({
    cj_pid: "",
    title: "",
    description: "",
    image_url: "",
    supplier_price: 0,
    profit_amount: 0,
    selling_price: 0,
    category: "Electronics",
    stock: 0,
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setProducts([]);

    try {
      const response = await fetch("/api/cj/products/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: searchTerm,
          pageNum: 1,
          pageSize: 20,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to search products");
      }

      setProducts(result.data.list || []);
      
      if (result.data.list.length === 0) {
        setError("No products found. Try a different search term.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToStore = (product: CJProduct) => {
    setSelectedProduct(product);
    setImportForm({
      cj_pid: product.pid,
      title: product.productNameEn,
      description: product.description || "",
      image_url: product.productImage,
      supplier_price: product.sellPrice,
      profit_amount: 0,
      selling_price: product.sellPrice,
      category: product.categoryName || "Electronics",
      stock: 100, // Default stock
    });
    setShowImportModal(true);
    setError("");
    setSuccessMessage("");
  };

  const handleProfitChange = (profit: number) => {
    const newProfit = profit || 0;
    const newSellingPrice = importForm.supplier_price + newProfit;
    setImportForm({
      ...importForm,
      profit_amount: newProfit,
      selling_price: newSellingPrice,
    });
  };

  const handleImport = async () => {
    setImporting(true);
    setError("");

    try {
      const response = await fetch("/api/cj/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(importForm),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to import product");
      }

      setSuccessMessage("Product imported successfully!");
      setTimeout(() => {
        setShowImportModal(false);
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          🌍 CJ Products
        </h1>
        <p style={{ color: "#6b7280" }}>
          Search and import products from CJDropShipping
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g., iPhone, laptop, headphones..."
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "0.75rem 2rem",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {loading && <ButtonSpinner />}
            {loading ? "Searching..." : "🔍 Search"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {products.map((product) => (
            <div
              key={product.pid}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                transition: "all 0.3s",
              }}
            >
              <div style={{ background: "#f9fafb", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
                <img
                  src={product.productImage || "/placeholder.png"}
                  alt={product.productNameEn}
                  style={{ maxWidth: "100%", maxHeight: "180px", objectFit: "contain" }}
                />
              </div>
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem", minHeight: "3rem" }}>
                  {product.productNameEn}
                </h3>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                    Supplier Price
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>
                    ${product.sellPrice.toFixed(2)}
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "1rem" }}>
                  SKU: {product.productSku}
                </div>
                <button
                  onClick={() => handleAddToStore(product)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ➕ Add to My Store
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem",
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "2rem",
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: "1.5rem" }}>
              Import Product to Store
            </h2>

            {successMessage && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                ✅ {successMessage}
              </div>
            )}

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            {/* Product Preview */}
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <img
                src={importForm.image_url}
                alt={importForm.title}
                style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain", marginBottom: "1rem" }}
              />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
                {importForm.title}
              </h3>
            </div>

            {/* Pricing Calculator */}
            <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", border: "2px solid #bbf7d0" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#166534", marginBottom: "1rem" }}>
                💰 Pricing Calculator
              </h3>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                    Supplier Price (Read Only)
                  </label>
                  <input
                    type="number"
                    value={importForm.supplier_price}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #bbf7d0",
                      borderRadius: "8px",
                      background: "#f9fafb",
                      color: "#6b7280",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                    Profit Amount ($) - Editable
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={importForm.profit_amount}
                    onChange={(e) => handleProfitChange(parseFloat(e.target.value))}
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #16a34a",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                    Selling Price (Auto-Calculated)
                  </label>
                  <input
                    type="number"
                    value={importForm.selling_price.toFixed(2)}
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
                  <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: "0.5rem" }}>
                    = Supplier Price (${importForm.supplier_price}) + Profit (${importForm.profit_amount})
                  </p>
                </div>
              </div>
            </div>

            {/* Other Fields */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                Category
              </label>
              <input
                type="text"
                value={importForm.category}
                onChange={(e) => setImportForm({ ...importForm, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                Stock Quantity
              </label>
              <input
                type="number"
                value={importForm.stock}
                onChange={(e) => setImportForm({ ...importForm, stock: parseInt(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleImport}
                disabled={importing}
                style={{
                  flex: 1,
                  padding: "1rem",
                  background: importing ? "#9ca3af" : "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: importing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {importing && <ButtonSpinner />}
                {importing ? "Importing..." : "💾 Import to Store"}
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                disabled={importing}
                style={{
                  flex: 1,
                  padding: "1rem",
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: importing ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
