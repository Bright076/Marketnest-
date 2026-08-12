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
  productWeight: string | number;
  stock: number;
  categoryName: string;
  description?: string;
  isFreeShipping?: boolean;
}

interface ImportFormData {
  pid: string;
  title: string;
  description: string;
  image_url: string;
  product_price: number;        // CJ product price only (for display)
  us_shipping_fee: number;      // US shipping fee (for display)
  supplier_price: number;        // Total US dropshipping price (used for calculations)
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
    product_price: 0,
    us_shipping_fee: 0,
    supplier_price: 0,
    profit_amount: 0,
    selling_price: 0,
    category: "Electronics",
    stock: 100,
    product_sku: "",
  });
  const [calculatingShipping, setCalculatingShipping] = useState(false);

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

      console.log('🔍 Search Response:', {
        success: result.success,
        keyword: trimmedSearch,
        productsFound: result.data?.products?.length || 0,
        totalAvailable: result.data?.total || 0,
        searchInfo: result.searchInfo,
      });

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to search products");
      }

      const foundProducts = result.data.products || [];
      setProducts(foundProducts);
      setTotalProducts(result.data.total || 0);
      setCurrentPage(page);
      
      if (foundProducts.length === 0 && page === 1) {
        setError(`No products found for "${trimmedSearch}". Try different keywords or check spelling.`);
      } else if (foundProducts.length > 0) {
        // Check if exact match was found
        if (result.searchInfo?.exactMatchFound) {
          setSuccessMessage(`✅ Found exact product: "${result.searchInfo.exactMatchName}"`);
          setTimeout(() => setSuccessMessage(""), 5000);
        } else if (page === 1) {
          setError(`⚠️ No exact match for "${trimmedSearch}". Showing ${foundProducts.length} related products with matching keywords. Try copying the exact product name from CJ website.`);
        }
        
        console.log('✅ First 3 products:', foundProducts.slice(0, 3).map((p: CJProduct) => ({
          name: p.productNameEn || p.productName,
          price: p.sellPrice,
          pid: p.pid,
        })));
      }
    } catch (error: any) {
      setError(error.message || "Search failed. Please try again.");
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = async (product: CJProduct) => {
    setSelectedProduct(product);
    setShowImportModal(true);
    setError("");
    setSuccessMessage("");
    setCalculatingShipping(true);

    try {
      // Parse product price (handle range like "31.25 -- 37.85")
      let productPrice = 0;
      if (typeof product.sellPrice === 'string') {
        const priceMatch = product.sellPrice.match(/[\d.]+/);
        productPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
      } else {
        productPrice = product.sellPrice;
      }

      console.log('🔄 Fetching US dropshipping price for:', product.pid);

      // Fetch US dropshipping price (product + US shipping)
      const pricingResponse = await fetch('/api/cj/products/us-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pid: product.pid,
          productSku: product.productSku,
          sellPrice: product.sellPrice,
          productWeight: product.productWeight,
          isFreeShipping: product.isFreeShipping,
        }),
      });

      const pricingResult = await pricingResponse.json();

      if (!pricingResult.success) {
        throw new Error(pricingResult.error?.message || 'Failed to calculate US shipping');
      }

      const { productPrice: fetchedProductPrice, usShippingFee, usDropshippingPrice, shippingEstimated } = pricingResult.data;

      console.log('✅ US Pricing:', {
        productPrice: fetchedProductPrice,
        usShipping: usShippingFee,
        total: usDropshippingPrice,
        estimated: shippingEstimated,
      });

      // Show note if shipping was estimated
      if (shippingEstimated) {
        setSuccessMessage('⚠️ Shipping fee is estimated (CJ API fallback). Verify with CJ website.');
      } else {
        setSuccessMessage('✅ Shipping fee from CJ API (actual freight calculation).');
      }

      // Set form with US dropshipping price
      setImportForm({
        pid: product.pid,
        title: product.productNameEn || product.productName || "",
        description: product.description || "",
        image_url: product.productImage || "",
        product_price: fetchedProductPrice,           // Product price only (display)
        us_shipping_fee: usShippingFee,              // US shipping (display)
        supplier_price: usDropshippingPrice,          // Total US dropshipping price (MAIN)
        profit_amount: 0,
        selling_price: usDropshippingPrice,           // Initially = supplier_price
        category: product.categoryName || "Electronics",
        stock: product.stock || 100,
        product_sku: product.productSku || "",
      });

    } catch (error: any) {
      console.error('❌ Failed to fetch US pricing:', error);
      setError(error.message || 'Failed to calculate US shipping. Please try again.');
      
      // Fallback: use product price only (but show warning)
      const fallbackPrice = typeof product.sellPrice === 'string' 
        ? parseFloat(product.sellPrice.match(/[\d.]+/)?.[0] || '0')
        : product.sellPrice;

      setImportForm({
        pid: product.pid,
        title: product.productNameEn || product.productName || "",
        description: product.description || "",
        image_url: product.productImage || "",
        product_price: fallbackPrice,
        us_shipping_fee: 0,
        supplier_price: fallbackPrice,
        profit_amount: 0,
        selling_price: fallbackPrice,
        category: product.categoryName || "Electronics",
        stock: product.stock || 100,
        product_sku: product.productSku || "",
      });
    } finally {
      setCalculatingShipping(false);
    }
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
        <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
          {searchTerm 
            ? `Showing results for "${searchTerm}"` 
            : "Search for products from CJDropshipping by name, brand, or keywords"}
        </p>
        <div style={{ 
          background: "#f0fdf4", 
          padding: "1rem", 
          borderRadius: "8px", 
          border: "1px solid #bbf7d0",
          marginTop: "0.75rem"
        }}>
          <p style={{ color: "#166534", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            💡 Search Options:
          </p>
          <ul style={{ 
            color: "#166534", 
            fontSize: "0.875rem", 
            margin: 0, 
            paddingLeft: "1.5rem",
            lineHeight: "1.8"
          }}>
            <li><strong>By SKU:</strong> Paste short SKU (e.g., CJYD3046124) → Finds EXACT product</li>
            <li><strong>By PID (Product ID):</strong> Paste long PID (e.g., CJYD3046124VM55) → Finds EXACT product</li>
            <li><strong>By Name/Keywords:</strong> Type product name or keywords → Shows related products</li>
          </ul>
          <p style={{ 
            color: "#166534", 
            fontSize: "0.8rem", 
            margin: "0.5rem 0 0 0",
            fontStyle: "italic"
          }}>
            💡 Tip: SKUs are shorter (11 chars like CJYD3046124), PIDs are longer (15+ chars)
          </p>
        </div>
        <p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Version: 2.5 (Smart Search - PID, SKU, Name) - Fixed Pricing
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
              placeholder="Search by PID, SKU, or product name... (e.g., CJ12345678, ABC-SKU-001, iPhone)"
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
                💰 US Dropshipping Pricing
              </h3>

              {calculatingShipping ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <ButtonSpinner />
                  <p style={{ color: "#166534", marginTop: "1rem" }}>
                    Calculating US shipping fee...
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {/* Product Price (Read Only) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                      CJ Product Price (Read Only)
                    </label>
                    <input
                      type="number"
                      value={importForm.product_price.toFixed(2)}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #bbf7d0",
                        borderRadius: "8px",
                        background: "#f9fafb",
                        color: "#6b7280",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  {/* US Shipping Fee (Read Only) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                      US Shipping Fee (Read Only)
                    </label>
                    <input
                      type="number"
                      value={importForm.us_shipping_fee.toFixed(2)}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #bbf7d0",
                        borderRadius: "8px",
                        background: "#f9fafb",
                        color: "#6b7280",
                        fontSize: "1rem",
                      }}
                    />
                    {importForm.us_shipping_fee === 0 && (
                      <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: "0.5rem", fontWeight: 600 }}>
                        🎉 FREE SHIPPING to US!
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "2px solid #16a34a", margin: "0.5rem 0" }} />

                  {/* US Dropshipping Price (Supplier Price) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#166534", marginBottom: "0.5rem" }}>
                      📦 US Dropshipping Cost (Supplier Price)
                    </label>
                    <input
                      type="number"
                      value={importForm.supplier_price.toFixed(2)}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "3px solid #16a34a",
                        borderRadius: "8px",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#16a34a",
                        background: "#ffffff",
                      }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: "0.5rem" }}>
                      = Product (${importForm.product_price.toFixed(2)}) + US Shipping (${importForm.us_shipping_fee.toFixed(2)})
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#059669", marginTop: "0.25rem", fontStyle: "italic" }}>
                      * This is your base cost. Always based on US shipping regardless of customer location.
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px dashed #bbf7d0", margin: "0.5rem 0" }} />

                  {/* Your Profit */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#166534", marginBottom: "0.5rem" }}>
                      💵 Your Profit Amount ($) - Set Your Markup
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={importForm.profit_amount}
                      onChange={(e) => handleProfitChange(parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #16a34a",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "2px solid #16a34a", margin: "0.5rem 0" }} />

                  {/* Selling Price (Auto-Calculated) */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 700, color: "#166534", marginBottom: "0.5rem" }}>
                      💰 Customer Selling Price (Auto-Calculated)
                    </label>
                    <input
                      type="number"
                      value={importForm.selling_price.toFixed(2)}
                      readOnly
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "3px solid #16a34a",
                        borderRadius: "8px",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#16a34a",
                        background: "#ffffff",
                      }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: "0.5rem" }}>
                      = Supplier Price (${importForm.supplier_price.toFixed(2)}) + Your Profit (${importForm.profit_amount.toFixed(2)})
                    </p>
                  </div>
                </div>
              )}
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
