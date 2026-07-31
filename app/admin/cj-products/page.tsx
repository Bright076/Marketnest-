"use client";

import { useState, useEffect } from "react";
import { ButtonSpinner } from "@/app/components/LoadingSpinner";

interface CJProduct {
  pid: string;
  productName: string;
  productNameEn: string;
  productSku: string;
  productImage: string;
  sellPrice: string | number;
  stock: number;
  categoryName: string;
  description?: string;
}

interface ImportFormData {
  pid: string;
  title: string;
  description: string;
  image_url: string;
  supplier_price: number;
  profit_amount: number;
  selling_price: number;
  category: string;
  stock: number;
  product_sku: string;
}

export default function CJProductImportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [importedPids, setImportedPids] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<CJProduct | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 20;

  const [importForm, setImportForm] = useState<ImportFormData>({
    pid: "",
    title: "",
    description: "",
    image_url: "",
    supplier_price: 0,
    profit_amount: 0,
    selling_price: 0,
    category: "Electronics",
    stock: 100,
    product_sku: "",
  });

  // Load initial products - show latest products by default
  useEffect(() => {
    loadLatestProducts();
  }, []);

  const loadLatestProducts = async () => {
    setLoading(true);
    setError("");
    setSearchTerm(""); // Clear search term to show we're loading latest

    try {
      const url = new URL("/api/cj/products/search-import", window.location.origin);
      // For latest/popular products, use a broad generic term
      url.searchParams.append("keyword", "");  // Empty for all products
      url.searchParams.append("pageNum", "1");
      url.searchParams.append("pageSize", pageSize.toString());

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to load products");
      }

      setProducts(result.data.products || []);
      setTotalProducts(result.data.total || 0);
      setCurrentPage(1);
      
      if (result.data.products.length === 0) {
        setError("No products available at the moment. Try searching for specific products.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (page: number = 1) => {
    const trimmedSearch = searchTerm.trim();
    
    if (!trimmedSearch) {
      // If search is empty, load latest products instead
      loadLatestProducts();
      return;
    }

    setLoading(true);
    setError("");
    if (page === 1) {
      setProducts([]);
    }

    try {
      const url = new URL("/api/cj/products/search-import", window.location.origin);
      url.searchParams.append("keyword", trimmedSearch);
      url.searchParams.append("pageNum", page.toString());
      url.searchParams.append("pageSize", pageSize.toString());

      console.log('Searching for:', trimmedSearch); // Debug log

      const response = await fetch(url.toString());
      const result = await response.json();

      console.log('Search result:', result); // Debug log

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to search products");
      }

      setProducts(result.data.products || []);
      setTotalProducts(result.data.total || 0);
      setCurrentPage(page);
      
      if (result.data.products.length === 0 && page === 1) {
        setError(
          `No products found for "${trimmedSearch}". Try a different search term or browse the latest products below.`
        );
      }
    } catch (error: any) {
      setError(error.message || "Search failed. Please try again.");
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = (product: CJProduct) => {
    setSelectedProduct(product);
    
    const supplierPrice = typeof product.sellPrice === 'string' 
      ? parseFloat(product.sellPrice) 
      : product.sellPrice;

    setImportForm({
      pid: product.pid,
      title: product.productNameEn || product.productName || "",
      description: product.description || "",
      image_url: product.productImage || "",
      supplier_price: supplierPrice,
      profit_amount: 0,
      selling_price: supplierPrice,
      category: product.categoryName || "Electronics",
      stock: product.stock || 100,
      product_sku: product.productSku || "",
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
      setImportedPids(prev => new Set([...prev, importForm.pid]));
      
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

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#111827", marginBottom: "0.5rem" }}>
          🌍 CJ Product Import
        </h1>
        <p style={{ color: "#6b7280" }}>
          {searchTerm 
            ? `Showing results for "${searchTerm}"` 
            : "Search for any product by name, brand, or description"}
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "250px" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Search Products
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(1)}
              placeholder="Search for any product... (e.g., iPhone 13, Samsung TV, wireless earbuds)"
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
            onClick={() => handleSearch(1)}
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
              whiteSpace: "nowrap",
            }}
          >
            {loading && <ButtonSpinner />}
            {loading ? "Searching..." : "🔍 Search"}
          </button>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                loadLatestProducts();
              }}
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#f3f4f6",
                color: "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        {totalProducts > 0 && (
          <div style={{ marginTop: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
            {searchTerm ? `Found ${totalProducts} products matching "${searchTerm}"` : `Showing ${products.length} latest products`}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            {products.map((product) => {
              const isImported = importedPids.has(product.pid);
              
              return (
                <div
                  key={product.pid}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    transition: "all 0.3s",
                    opacity: isImported ? 0.6 : 1,
                  }}
                >
                  <div style={{ background: "#f9fafb", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
                    <img
                      src={product.productImage || "/placeholder.png"}
                      alt={product.productNameEn || product.productName}
                      style={{ maxWidth: "100%", maxHeight: "180px", objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem", minHeight: "3rem", lineHeight: 1.4 }}>
                      {product.productNameEn || product.productName || "Unnamed Product"}
                    </h3>
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                        Supplier Price
                      </div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16a34a" }}>
                        ${typeof product.sellPrice === 'string' ? product.sellPrice : product.sellPrice.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                      <div><strong>Category:</strong> {product.categoryName || "N/A"}</div>
                      <div><strong>Stock:</strong> {product.stock || "N/A"}</div>
                      <div><strong>SKU:</strong> {product.productSku || "N/A"}</div>
                    </div>
                    
                    {isImported ? (
                      <div style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "#f0fdf4",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        textAlign: "center",
                      }}>
                        ✅ Imported
                      </div>
                    ) : (
                      <button
                        onClick={() => handleImportClick(product)}
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
                        ➕ Import to Store
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", alignItems: "center" }}>
              <button
                onClick={() => handleSearch(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                style={{
                  padding: "0.5rem 1rem",
                  background: currentPage === 1 ? "#f3f4f6" : "#ffffff",
                  color: currentPage === 1 ? "#9ca3af" : "#374151",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                ← Previous
              </button>
              
              <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handleSearch(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                style={{
                  padding: "0.5rem 1rem",
                  background: currentPage === totalPages ? "#f3f4f6" : "#ffffff",
                  color: currentPage === totalPages ? "#9ca3af" : "#374151",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
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
                    Profit Amount ($) - Set Your Profit
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
                    = Supplier Price (${importForm.supplier_price.toFixed(2)}) + Profit (${importForm.profit_amount.toFixed(2)})
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
