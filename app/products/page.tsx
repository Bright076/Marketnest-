"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  selling_price: number;
  category: string;
  stock: number;
  product_type: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "local" | "cj">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === "all" || product.product_type === filter;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #16a34a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p style={{ color: "#6b7280" }}>Loading products...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <section style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "3rem 1.5rem 5rem",
      position: "relative"
    }}>
      {/* Page Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
          fontWeight: 800,
          color: "#111827",
          margin: "0 0 0.75rem",
          letterSpacing: "-0.02em"
        }}>
          Our Product Collection
        </h1>
        <p style={{
          color: "#6b7280",
          fontSize: "1.05rem",
          maxWidth: "520px",
          margin: "0 auto 1.5rem",
          lineHeight: 1.6
        }}>
          Explore quality products from our store and exclusive deals from trusted partners.
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.75rem 1rem",
            border: "2px solid #e5e7eb",
            borderRadius: "12px",
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

      {/* Filter Buttons */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.8rem",
        marginBottom: "3rem",
        flexWrap: "wrap",
        position: "sticky",
        top: "72px",
        zIndex: 40,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        padding: "1rem 0"
      }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "0.5rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            background: filter === "all" ? "#374151" : "#f3f4f6",
            color: filter === "all" ? "#fff" : "#4b5563",
            border: "none",
            boxShadow: filter === "all" ? "0 4px 10px rgba(0,0,0,0.15)" : "none"
          }}
        >
          🏷️ All Products ({products.length})
        </button>
        <button
          onClick={() => setFilter("local")}
          style={{
            padding: "0.5rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            background: filter === "local" ? "#16a34a" : "#f0fdf4",
            color: filter === "local" ? "#fff" : "#166534",
            border: filter === "local" ? "none" : "1px solid #bbf7d0",
            boxShadow: filter === "local" ? "0 4px 15px rgba(22,163,74,0.3)" : "none"
          }}
        >
          🇳🇬 Local Deals ({products.filter(p => p.product_type === 'local').length})
        </button>
        <button
          onClick={() => setFilter("cj")}
          style={{
            padding: "0.5rem 1.4rem",
            borderRadius: "9999px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            background: filter === "cj" ? "#f97316" : "#fff7ed",
            color: filter === "cj" ? "#fff" : "#9a3412",
            border: filter === "cj" ? "none" : "1px solid #fed7aa",
            boxShadow: filter === "cj" ? "0 4px 15px rgba(249,115,22,0.3)" : "none"
          }}
        >
          🌍 Global Deals ({products.filter(p => p.product_type === 'cj').length})
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          background: "#ffffff",
          padding: "4rem 2rem",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            No products found
          </h3>
          <p style={{ color: "#6b7280" }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "2rem"
        }}>
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
                border: product.product_type === 'local' ? "2px solid rgba(22, 163, 74, 0.1)" : "2px solid rgba(249, 115, 22, 0.1)",
                transition: "all 0.3s",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.06)";
              }}>
                {/* Product Image */}
                <div style={{
                  background: "#f8fafc",
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "220px",
                  position: "relative"
                }}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      style={{
                        objectFit: "contain",
                        maxHeight: "200px",
                        width: "auto",
                        maxWidth: "100%",
                        mixBlendMode: "multiply"
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "4rem" }}>📦</span>
                  )}
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    backgroundImage: product.product_type === 'local' ? "linear-gradient(to right, #16a34a, #15803d)" : "linear-gradient(to right, #f97316, #ea580c)",
                    color: "#ffffff",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
                  }}>
                    {product.product_type === 'local' ? 'Local 🇳🇬' : 'Global 🌍'}
                  </div>
                </div>

                {/* Product Info */}
                <div style={{ padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.4,
                    marginBottom: "0.5rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {product.title}
                  </h3>

                  {product.description && (
                    <p style={{
                      fontSize: "0.85rem",
                      color: "#6b7280",
                      marginBottom: "1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      flexGrow: 1
                    }}>
                      {product.description}
                    </p>
                  )}

                  <div style={{ marginTop: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "1.5rem", fontWeight: 800, color: product.product_type === 'local' ? "#16a34a" : "#f97316" }}>
                        ${Number(product.selling_price).toFixed(2)}
                      </span>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: "#dcfce7",
                        color: "#166534"
                      }}>
                        {product.stock} left
                      </span>
                    </div>

                    <div style={{
                      padding: "0.625rem",
                      background: product.product_type === 'local' ? "#f0fdf4" : "#fff7ed",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: product.product_type === 'local' ? "#166534" : "#9a3412",
                      textAlign: "center"
                    }}>
                      {product.category}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
